'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { createClient } from '@/lib/supabase';
import { serviceProviders, type ServiceProvider } from '@/lib/servicePresets';
import Image from 'next/image';
import { use } from 'react';
import Navigation from '@/components/Navigation';

const ProviderPage = ({ params }: { params: Promise<{ providerId: string }> }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const { providerId } = use(params);
  const provider = serviceProviders.find(p => p.id === providerId) as ServiceProvider | undefined;
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/signin');
      return;
    }

    if (!provider) {
      setError('Provider not found');
      setIsLoading(false);
      return;
    }

    const fetchGroups = async () => {
      try {
        const supabase = createClient();
        console.log('Fetching groups for provider:', provider.name);
        
        const { data: groups, error } = await supabase
          .from('subscription_groups')
          .select('*')
          .eq('status', 'active')
          .ilike('name', `${provider.name}%`)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        console.log('Fetched groups:', groups);
        setGroups(groups || []);
      } catch (err) {
        console.error('Error fetching groups:', err);
        setError('Failed to fetch groups');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, [user, router, provider]);

  // Get unique available plans based on existing groups
  const availablePlans = provider?.plans.filter(plan => {
    return groups.some(group => {
      const groupPlanName = group.name.split(' - ')[1] || group.name;
      return plan.name.toLowerCase().includes(groupPlanName.toLowerCase()) ||
             groupPlanName.toLowerCase().includes(plan.name.toLowerCase());
    });
  }) || [];

  // Get groups for selected plan
  const planGroups = selectedPlan ? groups.filter(group => {
    const groupPlanName = group.name.split(' - ')[1] || group.name;
    const plan = provider?.plans.find(p => p.name === selectedPlan);
    return plan && (
      groupPlanName.toLowerCase().includes(plan.name.toLowerCase()) ||
      plan.name.toLowerCase().includes(groupPlanName.toLowerCase())
    );
  }) : [];

  const handleJoinWaitlist = async (groupId: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('subscription_waitlist')
        .insert({
          group_id: groupId,
          user_id: user?.id,
          status: 'pending'
        });

      if (error) throw error;

      // Refresh groups to update waitlist count
      const { data } = await supabase
        .from('subscription_groups')
        .select('*')
        .eq('id', groupId)
        .single();

      if (data) {
        setGroups(prevGroups => 
          prevGroups.map(group => 
            group.id === groupId ? { ...group, waitlist_count: (group.waitlist_count || 0) + 1 } : group
          )
        );
      }
    } catch (err) {
      console.error('Error joining waitlist:', err);
      alert('Failed to join waitlist. Please try again.');
    }
  };

  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error || 'Provider not found'}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => router.push('/explore')}
          >
            Back to Explore
          </Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
      <Navigation />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Provider Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 relative">
            <Image
              src={provider.logo}
              alt={provider.name}
              fill
              className="object-contain"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-gray-900">{provider.name}</h1>
              {provider.terms_url && (
                <a 
                  href={provider.terms_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                  </svg>
                  Terms of Service
                </a>
              )}
            </div>
            <p className="text-gray-600">Share your subscription and save money</p>
          </div>
        </div>

        {/* Available Plans Section */}
        {!selectedPlan && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Available Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availablePlans.map((plan) => {
                const share = plan.price / plan.max_members;
                const savings = plan.price - share;
                const savingsPercentage = Math.round((savings / plan.price) * 100);
                const groupCount = groups.filter(group => {
                  const groupPlanName = group.name.split(' - ')[1] || group.name;
                  return groupPlanName.toLowerCase().includes(plan.name.toLowerCase()) ||
                         plan.name.toLowerCase().includes(groupPlanName.toLowerCase());
                }).length;

                return (
                  <div key={plan.id} className="bg-white rounded-lg p-6 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-2">{plan.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{plan.description}</p>
                    <div className="space-y-2">
                      <p className="text-emerald-600 font-medium">
                        Save ${formatPrice(savings)}/month ({savingsPercentage}% off)
                      </p>
                      <p className="text-sm text-gray-500">
                        Your share: ${formatPrice(share)}/month
                      </p>
                      <p className="text-sm text-gray-500">
                        {groupCount} group{groupCount !== 1 ? 's' : ''} available
                      </p>
                    </div>
                    <div className="mt-4">
                      <Button
                        className="w-full"
                        onClick={() => setSelectedPlan(plan.name)}
                      >
                        View Groups ({groupCount})
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Groups for Selected Plan */}
        {selectedPlan && (
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPlan(null)}
              >
                ← Back to Plans
              </Button>
              <h2 className="text-2xl font-semibold text-gray-900">Available Groups</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {planGroups.map((group) => {
                const plan = provider.plans.find(p => p.name === selectedPlan);
                if (!plan) return null;
                
                const share = plan.price / plan.max_members;
                const savings = plan.price - share;
                const savingsPercentage = Math.round((savings / plan.price) * 100);

                return (
                  <div key={group.id} className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                        <p className="text-sm text-gray-600">{plan.description}</p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {(group.current_members || 0) + 1}/{plan.max_members} members
                      </span>
                    </div>
                    <p className="text-emerald-600 font-medium">
                      Save ${formatPrice(savings)}/month ({savingsPercentage}% off)
                    </p>
                    <p className="text-sm text-gray-500">
                      Your share: ${formatPrice(share)}/month
                    </p>
                    <Button
                      className="w-full mt-4"
                      onClick={() => router.push(`/groups/${group.id}`)}
                    >
                      Join Group
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Host Your Plan Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Host Your Plan</h2>
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span className="text-gray-700">Get refunded for unused spots</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span className="text-gray-700">Control who joins your group</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span className="text-gray-700">Set your own rules and guidelines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span className="text-gray-700">Earn from waitlist interest</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Potential Earnings</h3>
                <div className="space-y-4">
                  {provider.plans.map((plan) => {
                    const share = plan.price / plan.max_members;
                    const potentialEarnings = (plan.max_members - 1) * share;
                    return (
                      <div key={plan.id} className="bg-emerald-50 p-4 rounded-lg">
                        <p className="font-medium text-gray-900">{plan.name}</p>
                        <p className="text-emerald-600">
                          Potential earnings: ${formatPrice(potentialEarnings)}/month
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          (${formatPrice(share)} per member × {plan.max_members - 1} members)
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button 
                size="lg"
                onClick={() => router.push(`/create?provider=${provider.id}`)}
              >
                Create New Group
              </Button>
            </div>
          </div>
        </div>

        {/* Waitlist Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Don't feel like hosting?</h2>
          <div className="bg-emerald-50 rounded-xl p-8">
            <p className="text-gray-600 mb-6">
              Join the waitlist for priority access when a slot becomes available. 
              We'll notify you as soon as someone creates a group you can join.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {provider.plans.map((plan) => {
                const share = plan.price / plan.max_members;
                const savings = plan.price - share;
                const savingsPercentage = Math.round((savings / plan.price) * 100);

                return (
                  <div key={plan.id} className="bg-white rounded-lg p-6 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-2">{plan.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{plan.description}</p>
                    <div className="space-y-2">
                      <p className="text-emerald-600 font-medium">
                        Save ${formatPrice(savings)}/month ({savingsPercentage}% off)
                      </p>
                      <p className="text-sm text-gray-500">
                        Your share: ${formatPrice(share)}/month
                      </p>
                    </div>
                    <div className="mt-4">
                      <Button
                        className="w-full"
                        onClick={() => router.push(`/waitlist/register?provider=${provider.id}&plan=${plan.id}`)}
                      >
                        Join Waitlist
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProviderPage; 