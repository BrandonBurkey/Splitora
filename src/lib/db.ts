import { createClient } from './supabase'
import type { Profile, SubscriptionGroup, SubscriptionMember, Payment, Activity } from './types'

const supabase = createClient()

type SupabaseResponse<T> = {
  data: T | null
  error: any
}

type SubscriptionMemberWithGroup = {
  group_id: string
  subscription_groups: SubscriptionGroup
}

export const db = {
  // Profile operations
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Subscription Group operations
  async createGroup(group: Omit<SubscriptionGroup, 'id' | 'created_at' | 'updated_at'>): Promise<SubscriptionGroup> {
    const { data, error } = await supabase
      .from('subscription_groups')
      .insert(group)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getGroup(groupId: string): Promise<SubscriptionGroup | null> {
    const { data, error } = await supabase
      .from('subscription_groups')
      .select('*')
      .eq('id', groupId)
      .single()
    
    if (error) throw error
    return data
  },

  async getUserGroups(userId: string): Promise<SubscriptionGroup[]> {
    const { data, error } = await supabase
      .from('subscription_members')
      .select(`
        group_id,
        subscription_groups:subscription_groups(*)
      `)
      .eq('user_id', userId)
    
    if (error) throw error
    if (!data) return []
    
    return data.map((item: any) => ({
      id: item.subscription_groups.id,
      name: item.subscription_groups.name,
      description: item.subscription_groups.description,
      max_members: item.subscription_groups.max_members,
      price: item.subscription_groups.price,
      status: item.subscription_groups.status,
      created_at: item.subscription_groups.created_at,
      updated_at: item.subscription_groups.updated_at,
      host_id: item.subscription_groups.host_id
    }))
  },

  // Member operations
  async joinGroup(userId: string, groupId: string, share: number): Promise<SubscriptionMember> {
    const { data, error } = await supabase
      .from('subscription_members')
      .insert({
        user_id: userId,
        group_id: groupId,
        share,
        status: 'active'
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async leaveGroup(userId: string, groupId: string): Promise<void> {
    const { error } = await supabase
      .from('subscription_members')
      .update({ status: 'inactive' })
      .eq('user_id', userId)
      .eq('group_id', groupId)
    
    if (error) throw error
  },

  // Payment operations
  async createPayment(payment: Omit<Payment, 'id' | 'created_at' | 'updated_at'>): Promise<Payment> {
    const { data, error } = await supabase
      .from('payments')
      .insert(payment)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getGroupPayments(groupId: string): Promise<Payment[]> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('group_id', groupId)
    
    if (error) throw error
    return data
  },

  // Activity operations
  async createActivity(activity: Omit<Activity, 'id' | 'created_at'>): Promise<Activity> {
    const { data, error } = await supabase
      .from('activities')
      .insert(activity)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getUserActivities(userId: string): Promise<Activity[]> {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
} 