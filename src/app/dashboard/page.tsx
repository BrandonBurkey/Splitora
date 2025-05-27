'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/db';
import type { SubscriptionGroup, Activity } from '@/lib/types';
import Navigation from '@/components/Navigation';

const DashboardPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'savings' | 'subscriptions' | 'activity'>('savings');
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<SubscriptionGroup[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/signin');
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch user's subscriptions
        const userSubscriptions = await db.getUserGroups(user.id);
        setSubscriptions(userSubscriptions);

        // Fetch user's activities
        const userActivities = await db.getUserActivities(user.id);
        setActivities(userActivities);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  // Calculate savings statistics
  const totalMonthlySavings = subscriptions.reduce(
    (total, sub) => {
      // For now, we'll use a simple calculation
      // Later, we'll need to get the actual share from subscription_members table
      const personalPrice = sub.price;
      const share = sub.price / sub.max_members;
      return total + (personalPrice - share);
    },
    0
  );
  const totalAnnualSavings = totalMonthlySavings * 12;
  const totalPrice = subscriptions.reduce((total, sub) => total + sub.price, 0);
  const savingsPercentage = totalPrice > 0 
    ? Math.round((totalMonthlySavings / totalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
      <Navigation />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Button onClick={() => router.push('/create')}>Create New Group</Button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('savings')}
            className={`pb-4 px-4 font-medium ${
              activeTab === 'savings'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Savings
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`pb-4 px-4 font-medium ${
              activeTab === 'subscriptions'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Subscriptions
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`pb-4 px-4 font-medium ${
              activeTab === 'activity'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Recent Activity
          </button>
        </div>

        {/* Content */}
        {activeTab === 'savings' ? (
          <div className="space-y-8">
            {/* Savings Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Monthly Savings</h3>
                <p className="text-3xl font-bold text-emerald-600">${formatPrice(totalMonthlySavings)}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {totalPrice > 0 ? `You save ${savingsPercentage}% each month` : 'Join a group to start saving!'}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Annual Savings</h3>
                <p className="text-3xl font-bold text-emerald-600">${formatPrice(totalAnnualSavings)}</p>
                <p className="text-sm text-gray-500 mt-2">Projected yearly savings</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Active Groups</h3>
                <p className="text-3xl font-bold text-emerald-600">{subscriptions.length}</p>
                <p className="text-sm text-gray-500 mt-2">Subscription groups you're in</p>
              </div>
            </div>

            {/* Savings Breakdown */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Savings Breakdown</h3>
              <div className="space-y-4">
                {subscriptions.map((subscription) => {
                  const share = subscription.price / subscription.max_members;
                  const savings = subscription.price - share;
                  const savingsPercentage = Math.round((savings / subscription.price) * 100);
                  
                  return (
                    <div key={subscription.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{subscription.name}</p>
                        <p className="text-sm text-gray-500">
                          {subscription.max_members} members
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-600 font-medium">Save ${formatPrice(savings)}/month</p>
                        <p className="text-sm text-gray-500">{savingsPercentage}% off</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : activeTab === 'subscriptions' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map((subscription) => {
              const share = subscription.price / subscription.max_members;
              
              return (
                <div
                  key={subscription.id}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{subscription.name}</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-emerald-600 font-bold text-lg">${formatPrice(share)}/month</span>
                        <span className="text-gray-400 text-sm line-through">${formatPrice(subscription.price)}/month</span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {subscription.max_members} members
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Total group cost: ${formatPrice(subscription.price)}/month
                    </p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline">View Details</Button>
                    <Button size="sm">Manage Group</Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{activity.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {activity.type === 'payment' && (
                    <span className="text-emerald-600 font-medium">
                      +${formatPrice(activity.amount as number)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage; 