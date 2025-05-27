'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Navigation from '@/components/Navigation';

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
      <Navigation />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-emerald max-w-none">
          <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing or using Splitora ("the Platform"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Service Description</h2>
            <p className="text-gray-600 mb-4">
              Splitora is a platform that facilitates the sharing of subscription services among users. We do not provide the subscription services ourselves but act as an intermediary to help users share existing subscriptions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>You must comply with all applicable laws and regulations</li>
              <li>You must be at least 18 years old to use the Platform</li>
              <li>You must provide accurate and complete information</li>
              <li>You must comply with the terms of service of the subscription services you share</li>
              <li>You must not share accounts with unauthorized users</li>
              <li>You must maintain the security of your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Subscription Sharing</h2>
            <p className="text-gray-600 mb-4">
              When sharing subscriptions through Splitora:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>You must ensure all members are authorized to use the shared subscription</li>
              <li>You must comply with the sharing policies of the subscription service</li>
              <li>You are responsible for managing payments and disputes within your group</li>
              <li>We are not responsible for any violations of third-party terms of service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Payments and Fees</h2>
            <p className="text-gray-600 mb-4">
              Splitora may charge fees for using the Platform. All payments are processed through secure third-party payment processors. You are responsible for all charges associated with your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Dispute Resolution</h2>
            <p className="text-gray-600 mb-4">
              In case of disputes between group members:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>We encourage members to resolve disputes amicably</li>
              <li>We may assist in mediation but are not obligated to do so</li>
              <li>We reserve the right to suspend or terminate accounts involved in disputes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-600 mb-4">
              Splitora is not liable for:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Any damages resulting from the use or inability to use the Platform</li>
              <li>Any unauthorized access to or use of your account</li>
              <li>Any actions taken by third-party subscription services</li>
              <li>Any disputes between group members</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Changes to Terms</h2>
            <p className="text-gray-600 mb-4">
              We reserve the right to modify these terms at any time. We will notify users of any material changes. Continued use of the Platform after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Information</h2>
            <p className="text-gray-600 mb-4">
              For questions about these Terms of Service, please contact us at:
              <br />
              Email: legal@splitora.com
            </p>
          </section>
        </div>
      </main>
    </div>
  );
} 