'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Navigation from '@/components/Navigation';

export default function CookiePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
      <Navigation />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
        
        <div className="prose prose-emerald max-w-none">
          <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. What Are Cookies</h2>
            <p className="text-gray-600 mb-4">
              Cookies are small text files that are placed on your computer or mobile device when you visit our website. They help us provide you with a better experience and allow certain features to work properly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Types of Cookies We Use</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Essential Cookies</h3>
                <p className="text-gray-600 mb-2">These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.</p>
                <ul className="list-disc pl-6 text-gray-600 space-y-1">
                  <li>Session management</li>
                  <li>Authentication</li>
                  <li>Security features</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Functional Cookies</h3>
                <p className="text-gray-600 mb-2">These cookies enable the website to provide enhanced functionality and personalization.</p>
                <ul className="list-disc pl-6 text-gray-600 space-y-1">
                  <li>Language preferences</li>
                  <li>Theme settings</li>
                  <li>Remembering your login status</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Cookies</h3>
                <p className="text-gray-600 mb-2">These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
                <ul className="list-disc pl-6 text-gray-600 space-y-1">
                  <li>Page views</li>
                  <li>Time spent on site</li>
                  <li>Error tracking</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How to Control Cookies</h2>
            <p className="text-gray-600 mb-4">
              You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. However, if you do this, you may have to manually adjust some preferences every time you visit our site and some services and functionalities may not work.
            </p>
            <p className="text-gray-600 mb-4">
              To learn more about cookies and how to manage them, visit <a href="https://www.aboutcookies.org" className="text-emerald-600 hover:underline">AboutCookies.org</a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Third-Party Cookies</h2>
            <p className="text-gray-600 mb-4">
              Some cookies are placed by third-party services that appear on our pages. We use the following third-party services:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Google Analytics - for website analytics</li>
              <li>Stripe - for payment processing</li>
              <li>Cloudflare - for security and performance</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Changes to This Policy</h2>
            <p className="text-gray-600 mb-4">
              We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about our use of cookies, please contact us at:
              <br />
              Email: privacy@splitora.com
            </p>
          </section>
        </div>
      </main>
    </div>
  );
} 