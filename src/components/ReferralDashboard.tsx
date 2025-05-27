'use client';

import { useEffect, useState } from 'react';
import { referralService } from '@/lib/referralService';
import { useAuth } from '@/contexts/AuthContext';
import { ReferralReward } from '@/lib/types';
import { createClient } from '@/lib/supabase';

// Initialize the supabase client
const supabase = createClient();

export default function ReferralDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadReferralData();
    }
  }, [user]);

  useEffect(() => {
    const fetchReferralCode = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('id', user?.id)
        .single();
      setReferralCode(data?.referral_code);
    };
    fetchReferralCode();
  }, [user]);

  const loadReferralData = async () => {
    try {
      const [statsData, code] = await Promise.all([
        referralService.getReferralStats(user!.id),
        referralService.generateReferralCode(user!.id),
      ]);
      setStats(statsData);
      setReferralCode(code);
    } catch (error) {
      console.error('Error loading referral data:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
      console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
      console.error('Error keys:', error && typeof error === 'object' ? Object.keys(error) : 'Not an object');
      console.error('Error message:', error instanceof Error ? error.message : 'No message available');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Referral Code Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Referral Code</h2>
        <div className="flex items-center space-x-4">
          <code className="bg-gray-100 px-4 py-2 rounded-lg text-lg font-mono text-emerald-600">
            {referralCode || 'Loading...'}
          </code>
          <button
            onClick={() => referralCode && navigator.clipboard.writeText(referralCode)}
            className="text-emerald-600 hover:text-emerald-700"
          >
            Copy Code
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900">Total Referrals</h3>
          <p className="text-3xl font-bold mt-2 text-emerald-600">{stats?.totalReferrals || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900">Completed Referrals</h3>
          <p className="text-3xl font-bold mt-2 text-emerald-600">{stats?.completedReferrals || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900">Total Rewards</h3>
          <p className="text-3xl font-bold mt-2 text-emerald-600">${stats?.totalRewards?.toFixed(2) || '0.00'}</p>
        </div>
      </div>

      {/* Next Tier Section */}
      {stats?.nextTier && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Next Tier Reward</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">
                {stats.nextTier.referralsNeeded} more {stats.nextTier.referralsNeeded === 1 ? 'referral' : 'referrals'} needed
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-emerald-600">
                ${stats.nextTier.tier === 'TIER_1' ? '10.00' : stats.nextTier.tier === 'TIER_2' ? '25.00' : '50.00'}
              </p>
              <p className="text-sm text-gray-500">Bonus Reward</p>
            </div>
          </div>
        </div>
      )}

      {/* Rewards History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Rewards History</h2>
        <div className="space-y-4">
          {stats?.rewards?.map((reward: ReferralReward) => (
            <div key={reward.id} className="flex items-center justify-between border-b pb-4 last:border-0">
              <div>
                <p className="font-medium capitalize text-gray-900">{reward.type.replace('_', ' ')}</p>
                <p className="text-sm text-gray-500">
                  {new Date(reward.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-emerald-600">${reward.amount.toFixed(2)}</p>
                <p className="text-sm text-gray-500 capitalize">{reward.status}</p>
              </div>
            </div>
          ))}
          {(!stats?.rewards || stats.rewards.length === 0) && (
            <p className="text-gray-500 text-center py-4">No rewards yet</p>
          )}
        </div>
      </div>
    </div>
  );
} 