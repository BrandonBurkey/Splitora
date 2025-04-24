'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

// Mock data for subscription groups - we'll replace this with real data later
const mockSubscriptions = [
  {
    id: 1,
    name: 'Netflix Premium',
    personalPrice: 19.99,
    price: 19.99,
    yourShare: 4.99,
    members: 3,
    maxMembers: 4,
    description: 'Share Netflix Premium with friends and save up to 75%',
    category: 'Entertainment',
  },
  {
    id: 2,
    name: 'Spotify Family',
    personalPrice: 9.99,
    price: 14.99,
    yourShare: 2.49,
    members: 4,
    maxMembers: 6,
    description: 'Join our Spotify Family plan and enjoy ad-free music',
    category: 'Music',
  },
  {
    id: 3,
    name: 'Adobe Creative Cloud',
    personalPrice: 54.99,
    price: 54.99,
    yourShare: 18.33,
    members: 2,
    maxMembers: 3,
    description: 'Share Adobe CC with creative professionals',
    category: 'Creative',
  },
];

const ExplorePage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
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

  const categories = ['all', 'Entertainment', 'Music', 'Creative', 'Gaming', 'Productivity'];

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-emerald-600">Splitora</span>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')}>
            Dashboard
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Explore Subscriptions</h1>
          <Button onClick={() => router.push('/create')}>Create New Group</Button>
        </div>

        {/* Categories */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-emerald-50'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Subscription Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockSubscriptions
            .filter((sub) => selectedCategory === 'all' || sub.category === selectedCategory)
            .map((subscription) => {
              const savings = subscription.personalPrice - subscription.yourShare;
              const savingsPercentage = Math.round((savings / subscription.personalPrice) * 100);
              
              return (
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
                      {subscription.members}/{subscription.maxMembers} members
                    </span>
                  </div>
                  <div className="mb-4">
                    <p className="text-gray-600">{subscription.description}</p>
                    <p className="text-emerald-600 font-medium mt-2">
                      Save ${formatPrice(savings)}/month ({savingsPercentage}% off)
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{subscription.category}</span>
                    <Button size="sm">Join Group</Button>
                  </div>
                </div>
              );
            })}
        </div>
      </main>
    </div>
  );
};

export default ExplorePage; 