'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import { createClient } from '@/lib/supabase';
import { serviceProviders } from '@/lib/servicePresets';
import Image from 'next/image';

const WaitlistRegistrationPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPremiumOffer, setShowPremiumOffer] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+1',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const providerId = searchParams.get('provider');
  const planId = searchParams.get('plan');

  const provider = serviceProviders.find(p => p.id === providerId);
  const plan = provider?.plans.find(p => p.id === planId);

  useEffect(() => {
    if (!providerId || !planId || !provider || !plan) {
      router.push('/explore');
    }
  }, [providerId, planId, provider, plan, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      // Generate a unique guest ID
      const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Insert waitlist entry
      const { error: waitlistError } = await supabase
        .from('subscription_waitlist')
        .insert({
          provider_id: providerId,
          plan_id: planId,
          guest_id: guestId,
          name: formData.name,
          email: formData.email,
          phone: `${formData.countryCode}${formData.phone}`,
          status: 'pending'
        });

      if (waitlistError) throw waitlistError;

      // Show premium offer
      setShowPremiumOffer(true);
    } catch (err) {
      console.error('Error joining waitlist:', err);
      setError('Failed to join waitlist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!provider || !plan) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Join Waitlist</h1>
            
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 relative">
                  <Image
                    src={provider.logo}
                    alt={provider.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{provider.name}</h2>
                  <p className="text-gray-600">{plan.name}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.countryCode}
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                    className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+61">+61</option>
                    <option value="+81">+81</option>
                    <option value="+86">+86</option>
                    <option value="+91">+91</option>
                  </select>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Joining Waitlist...' : 'Join Waitlist'}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Premium Offer Modal */}
      {showPremiumOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setShowPremiumOffer(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🎉 Special Offer!</h2>
              <p className="text-gray-600 mb-6">
                Get 3 days of Premium access for FREE! This is a limited-time offer that won't be shown again.
              </p>
              
              <div className="space-y-4">
                <Button
                  className="w-full"
                  onClick={() => {
                    setShowPremiumOffer(false);
                    router.push('/premium?trial=true');
                  }}
                >
                  Claim Your Free Trial
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowPremiumOffer(false)}
                >
                  Maybe Later
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaitlistRegistrationPage; 