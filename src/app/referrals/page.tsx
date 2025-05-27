'use client';

import ReferralDashboard from '@/components/ReferralDashboard';
import Navigation from '@/components/Navigation';

export default function ReferralsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">Referral Program</h1>
          <div className="prose max-w-none mb-8">
            <p className="text-lg text-gray-700">
              Invite your friends to join Splitora and earn rewards! For each friend who signs up and completes their profile, you'll earn <span className='text-emerald-700 font-semibold'>$5</span>. Plus, reach referral milestones to unlock bonus rewards:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li className="text-emerald-700 font-semibold">3 referrals = $10 bonus</li>
              <li className="text-emerald-700 font-semibold">5 referrals = $25 bonus</li>
              <li className="text-emerald-700 font-semibold">10 referrals = $50 bonus</li>
            </ul>
          </div>
          <ReferralDashboard />
        </div>
      </div>
    </div>
  );
} 