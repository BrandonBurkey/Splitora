'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/db';
import Button from '@/components/ui/Button';
import { serviceProviders, type ServiceProvider, type ServicePlan } from '@/lib/servicePresets';
import Image from 'next/image';

const CreateGroupPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<ServicePlan | null>(null);
  const [remainingSpaces, setRemainingSpaces] = useState<number>(0);
  const [location, setLocation] = useState<string>('US');

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'JP', name: 'Japan' },
    { code: 'IN', name: 'India' },
    { code: 'BR', name: 'Brazil' },
    { code: 'MX', name: 'Mexico' },
    { code: 'ES', name: 'Spain' },
    { code: 'IT', name: 'Italy' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'SE', name: 'Sweden' },
    { code: 'SG', name: 'Singapore' }
  ];

  const handleCreateGroup = async () => {
    if (!user || !selectedPlan) return;

    try {
      setIsLoading(true);
      setError(null);

      // Validate remaining spaces
      if (remainingSpaces <= 0 || remainingSpaces > selectedPlan.max_members - 1) {
        setError(`Please enter a valid number of remaining spaces (1-${selectedPlan.max_members - 1})`);
        return;
      }

      // Validate location
      if (!location.trim()) {
        setError('Please enter a location');
        return;
      }

      // Create the group
      const group = await db.createGroup({
        name: `${selectedProvider?.name} ${selectedPlan.name}`,
        description: `${selectedPlan.description} (Location: ${location})`,
        max_members: selectedPlan.max_members,
        price: selectedPlan.price,
        host_id: user.id,
        status: 'active',
        remaining_spaces: remainingSpaces,
        location: location
      });

      // Create an activity for the group creation
      await db.createActivity({
        type: 'join',
        description: `Created ${selectedProvider?.name} ${selectedPlan.name} group in ${location}`,
        user_id: user.id,
        group_id: group.id,
      });

      // Redirect to the explore page instead of a non-existent group page
      router.push('/explore');
    } catch (err) {
      setError('Failed to create group. Please try again.');
      console.error('Error creating group:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProvider = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    setSelectedPlan(null);
    setRemainingSpaces(0);
    setLocation('US');
  };

  const handleSelectPlan = (plan: ServicePlan) => {
    setSelectedPlan(plan);
    setRemainingSpaces(plan.max_members - 1); // Default to max available spaces
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
            Back to Dashboard
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Group</h1>

          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          {!selectedProvider ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {serviceProviders.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => handleSelectProvider(provider)}
                  className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-16 h-16 relative mb-4">
                    <Image
                      src={provider.logo}
                      alt={provider.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="font-medium text-gray-900">{provider.name}</span>
                </button>
              ))}
            </div>
          ) : !selectedPlan ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setSelectedProvider(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ← Back to Services
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 relative">
                    <Image
                      src={selectedProvider.logo}
                      alt={selectedProvider.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="font-medium text-gray-900">{selectedProvider.name}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedProvider.plans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => handleSelectPlan(plan)}
                    className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-left"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-2xl font-bold text-emerald-600 mb-2">
                      ${plan.price}/month
                    </p>
                    <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                    <div className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ← Back to Plans
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 relative">
                    <Image
                      src={selectedProvider.logo}
                      alt={selectedProvider.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="font-medium text-gray-900">
                    {selectedProvider.name} {selectedPlan.name}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Group Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Monthly Cost</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      ${selectedPlan.price}/month
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Maximum Members</p>
                    <p className="text-lg font-medium text-gray-900">
                      {selectedPlan.max_members} members
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Your Share</p>
                    <p className="text-lg font-medium text-gray-900">
                      ${(selectedPlan.price / selectedPlan.max_members).toFixed(2)}/month
                    </p>
                  </div>
                  <div>
                    <label htmlFor="remainingSpaces" className="block text-sm font-medium text-gray-700 mb-1">
                      Remaining Spaces
                    </label>
                    <input
                      id="remainingSpaces"
                      type="number"
                      min="1"
                      max={selectedPlan.max_members - 1}
                      value={remainingSpaces}
                      onChange={(e) => setRemainingSpaces(parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder={`Enter number of spaces (1-${selectedPlan.max_members - 1})`}
                    />
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <select
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                    >
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name} ({country.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    onClick={handleCreateGroup}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? 'Creating...' : 'Create Group'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateGroupPage; 