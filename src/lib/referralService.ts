import { createClient } from './supabase';

// Initialize the supabase client
const supabase = createClient();

const REFERRAL_REWARD_AMOUNT = 5.00; // $5 reward for each successful referral
const REFERRAL_TIER_THRESHOLDS = {
  TIER_1: 3,  // 3 referrals = $10 bonus
  TIER_2: 5,  // 5 referrals = $25 bonus
  TIER_3: 10, // 10 referrals = $50 bonus
};

export const referralService = {
  async generateReferralCode(userId: string): Promise<string> {
    // Get the user's referral code from profiles
    const { data, error } = await supabase
      .from('profiles')
      .select('referral_code')
      .eq('id', userId)
      .single();

    if (error) {
      throw new Error('Failed to get referral code');
    }

    return data.referral_code;
  },

  async createReferral(referrerId: string, referredId: string): Promise<any> {
    // Check if user was already referred
    const { data: existingReferral } = await supabase
      .from('referrals')
      .select('*')
      .eq('referred_id', referredId)
      .single();

    if (existingReferral) {
      throw new Error('User already has a referral');
    }

    // Create new referral
    const { data, error } = await supabase
      .from('referrals')
      .insert({
        referrer_id: referrerId,
        referred_id: referredId,
        reward_amount: REFERRAL_REWARD_AMOUNT,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      throw new Error('Failed to create referral');
    }

    return data;
  },

  async completeReferral(referralId: string): Promise<void> {
    const { data: referral, error: fetchError } = await supabase
      .from('referrals')
      .select('*')
      .eq('id', referralId)
      .single();

    if (fetchError || !referral) {
      throw new Error('Referral not found');
    }

    if (referral.status === 'completed') {
      throw new Error('Referral already completed');
    }

    // Update referral status
    const { error: updateError } = await supabase
      .from('referrals')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', referralId);

    if (updateError) {
      throw new Error('Failed to update referral');
    }

    // Create reward for referrer
    const { error: rewardError } = await supabase
      .from('referralRewards')
      .insert({
        user_id: referral.referrer_id,
        referrer_id: referral.referrer_id,
        amount: referral.reward_amount,
        type: 'SIGNUP',
        status: 'PENDING'
      });

    if (rewardError) {
      throw new Error('Failed to create reward');
    }

    // Check for tier rewards
    await this.checkAndAwardTierRewards(referral.referrer_id);
  },

  async checkAndAwardTierRewards(userId: string): Promise<void> {
    const { data: completedReferrals, error: countError } = await supabase
      .from('referrals')
      .select('id', { count: 'exact' })
      .eq('referrer_id', userId)
      .eq('status', 'completed');

    if (countError) {
      throw new Error('Failed to get completed referrals count');
    }

    const count = completedReferrals?.length || 0;
    
    // Check each tier threshold
    if (count >= REFERRAL_TIER_THRESHOLDS.TIER_3) {
      await this.awardTierReward(userId, 'TIER_3', 50.00);
    } else if (count >= REFERRAL_TIER_THRESHOLDS.TIER_2) {
      await this.awardTierReward(userId, 'TIER_2', 25.00);
    } else if (count >= REFERRAL_TIER_THRESHOLDS.TIER_1) {
      await this.awardTierReward(userId, 'TIER_1', 10.00);
    }
  },

  async awardTierReward(userId: string, tier: string, amount: number): Promise<any> {
    // Check if tier reward was already awarded
    const { data: existingReward } = await supabase
      .from('referralRewards')
      .select('*')
      .eq('user_id', userId)
      .eq('type', tier)
      .single();

    if (existingReward) {
      throw new Error(`Tier ${tier} reward already awarded`);
    }

    // Create tier reward
    const { data, error } = await supabase
      .from('referralRewards')
      .insert({
        user_id: userId,
        referrer_id: userId,
        amount: amount,
        type: tier,
        status: 'PENDING'
      })
      .select()
      .single();

    if (error) {
      throw new Error('Failed to create tier reward');
    }

    return data;
  },

  async getReferralStats(userId: string) {
    const [
      { data: totalReferrals, count: totalCount },
      { data: completedReferrals, count: completedCount },
      { data: rewards }
    ] = await Promise.all([
      supabase
        .from('referrals')
        .select('*', { count: 'exact' })
        .eq('referrer_id', userId),
      supabase
        .from('referrals')
        .select('*', { count: 'exact' })
        .eq('referrer_id', userId)
        .eq('status', 'completed'),
      supabase
        .from('referralRewards')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
    ]);

    const totalRewards = rewards?.reduce((sum, reward) => sum + Number(reward.amount), 0) || 0;

    return {
      totalReferrals: totalCount || 0,
      completedReferrals: completedCount || 0,
      pendingReferrals: (totalCount || 0) - (completedCount || 0),
      totalRewards,
      nextTier: this.getNextTier(completedCount || 0),
      rewards: rewards || []
    };
  },

  getNextTier(completedReferrals: number): { tier: string; displayName: string; referralsNeeded: number } | null {
    if (completedReferrals >= REFERRAL_TIER_THRESHOLDS.TIER_3) {
      return null; // Max tier reached
    }

    if (completedReferrals >= REFERRAL_TIER_THRESHOLDS.TIER_2) {
      return {
        tier: 'TIER_3',
        displayName: 'Tier 3',
        referralsNeeded: REFERRAL_TIER_THRESHOLDS.TIER_3 - completedReferrals,
      };
    }

    if (completedReferrals >= REFERRAL_TIER_THRESHOLDS.TIER_1) {
      return {
        tier: 'TIER_2',
        displayName: 'Tier 2',
        referralsNeeded: REFERRAL_TIER_THRESHOLDS.TIER_2 - completedReferrals,
      };
    }

    return {
      tier: 'TIER_1',
      displayName: 'Tier 1',
      referralsNeeded: REFERRAL_TIER_THRESHOLDS.TIER_1 - completedReferrals,
    };
  },

  async createReferralFromCode(referralCode: string, referredUserId: string): Promise<any> {
    // Look up the referrer by the referral code
    const { data: referrer, error: referrerError } = await supabase
      .from('profiles')
      .select('id')
      .eq('referral_code', referralCode)
      .single();

    if (referrerError || !referrer) {
      throw new Error('Invalid referral code');
    }

    // Create a record in the referrals table
    const { data, error } = await supabase
      .from('referrals')
      .insert({
        referrer_id: referrer.id,
        referred_id: referredUserId,
        status: 'pending',
        reward_amount: REFERRAL_REWARD_AMOUNT
      })
      .select()
      .single();

    if (error) {
      throw new Error('Failed to create referral');
    }

    return data;
  },
}; 