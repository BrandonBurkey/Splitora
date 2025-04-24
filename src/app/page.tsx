import Image from "next/image";
import Button from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-emerald-600">Splitora</span>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" size="sm">Sign In</Button>
          <Button size="sm">Get Started</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Split subscriptions, <span className="text-emerald-600">save money</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Manage and split shared subscription costs with friends, roommates, or coworkers. 
            Save money while keeping everything organized in one place.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">Start Saving Now</Button>
            <Button variant="outline" size="lg">Learn More</Button>
          </div>
        </div>

        {/* Feature Preview */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy Splitting</h3>
            <p className="text-gray-600">Automatically calculate and track who owes what</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Reminders</h3>
            <p className="text-gray-600">Never miss a payment with automated reminders</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Save Together</h3>
            <p className="text-gray-600">Track your group savings and celebrate milestones</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">© 2024 Splitora. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="text-gray-600 hover:text-emerald-600">Privacy</a>
            <a href="#" className="text-gray-600 hover:text-emerald-600">Terms</a>
            <a href="#" className="text-gray-600 hover:text-emerald-600">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
