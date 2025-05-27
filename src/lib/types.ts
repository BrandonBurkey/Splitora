export type User = {
  id: string
  email: string
  name?: string
  created_at: string
  updated_at: string
}

export type Profile = {
  id: string
  full_name: string | null
  avatar_url: string | null
  currency: string
  created_at: string
  updated_at: string
}

export type SubscriptionGroup = {
  id: string
  name: string
  description: string | null
  max_members: number
  price: number
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
  host_id: string
  remaining_spaces: number
  location: string
}

export type SubscriptionMember = {
  id: string
  user_id: string
  group_id: string
  share: number
  status: 'active' | 'inactive'
  joined_at: string
}

export type Payment = {
  id: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
  created_at: string
  updated_at: string
  user_id: string
  group_id: string
}

export type Activity = {
  id: string
  type: 'payment' | 'invite' | 'join' | 'leave'
  description: string
  created_at: string
  user_id: string
  group_id: string | null
  amount?: number
}

export type Referral = {
  id: string;
  referrerId: string;
  referredId: string;
  status: 'pending' | 'completed';
  rewardAmount: number;
  createdAt: string;
  completedAt: string | null;
}

export type ReferralReward = {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'paid';
  type: 'referral' | 'tier';
  createdAt: string;
  paidAt: string | null;
} 