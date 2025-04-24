'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

// Mock data - we'll replace this with real data later
const mockUserSubscriptions = [
  {
    id: 1,
    name: 'Netflix Premium',
    personalPrice: 19.99,
    price: 19.99,
    yourShare: 4.99,
    nextPayment: '2024-03-15',
    members: 4,
    status: 'active',
  },
  {
    id: 2,
    name: 'Spotify Family',
    personalPrice: 9.99,
    price: 14.99,
    yourShare: 2.49,
    nextPayment: '2024-03-20',
    members: 6,
    status: 'active',
  },
];

const mockActivity = [
  {
    id: 1,
    type: 'payment',
    description: 'Payment received from John Doe',
    amount: 4.99,
    date: '2024-03-01',
  },
  {
    id: 2,
    type: 'invite',
    description: 'Invited Sarah to Netflix Premium',
    date: '2024-02-28',
  },
];

const DashboardPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'savings' | 'subscriptions' | 'activity'>('savings');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/signin');
    } else {
      setIsLoading(false);
    }
  }, [user, router]);

  if (!user || isLoading) {
    return null;
  }

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  // Calculate savings statistics
  const totalMonthlySavings = mockUserSubscriptions.reduce(
    (total, sub) => total + (sub.personalPrice - sub.yourShare),
    0
  );
  const totalAnnualSavings = totalMonthlySavings * 12;
  const savingsPercentage = Math.round(
    (totalMonthlySavings / mockUserSubscriptions.reduce((total, sub) => total + sub.personalPrice, 0)) * 100
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-emerald-600">Splitora</span>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push('/explore')}>
            Explore
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Button onClick={() => router.push('/create')}>Create New Group</Button>
        </div>

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
                <p className="text-sm text-gray-500 mt-2">You save {savingsPercentage}% each month</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Annual Savings</h3>
                <p className="text-3xl font-bold text-emerald-600">${formatPrice(totalAnnualSavings)}</p>
                <p className="text-sm text-gray-500 mt-2">Projected yearly savings</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Active Groups</h3>
                <p className="text-3xl font-bold text-emerald-600">{mockUserSubscriptions.length}</p>
                <p className="text-sm text-gray-500 mt-2">Subscription groups you're in</p>
              </div>
            </div>

            {/* Savings Breakdown */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Savings Breakdown</h3>
              <div className="space-y-4">
                {mockUserSubscriptions.map((subscription) => {
                  const savings = subscription.personalPrice - subscription.yourShare;
                  const savingsPercentage = Math.round((savings / subscription.personalPrice) * 100);
                  
                  return (
                    <div key={subscription.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{subscription.name}</p>
                        <p className="text-sm text-gray-500">
                          {subscription.members} members • Next payment: {new Date(subscription.nextPayment).toLocaleDateString()}
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
            {mockUserSubscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{subscription.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-emerald-600 font-bold text-lg">${formatPrice(subscription.yourShare)}/month</span>
                      <span className="text-gray-400 text-sm line-through">${formatPrice(subscription.personalPrice)}/month</span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {subscription.members} members
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Next payment: {new Date(subscription.nextPayment).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Total group cost: ${formatPrice(subscription.price)}/month
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline">View Details</Button>
                  <Button size="sm">Manage Group</Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {mockActivity.map((activity) => (
              <div
                key={activity.id}
                className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{activity.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(activity.date).toLocaleDateString()}
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