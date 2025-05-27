'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

export default function Navigation() {
  const router = useRouter();
  const { user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Explore', href: '/explore' },
    { name: 'Referrals', href: '/referrals' },
    { name: 'Settings', href: '/settings' },
  ];

  return (
    <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-emerald-600">Splitora</span>
      </div>
      <div className="flex gap-4">
        {user ? (
          <>
            {navigation.map((item) => (
              <Button
                key={item.name}
                variant="outline"
                size="sm"
                onClick={() => router.push(item.href)}
              >
                {item.name}
              </Button>
            ))}
          </>
        ) : (
          <>
            <Button variant="outline" size="sm" onClick={() => router.push('/signin')}>
              Sign In
            </Button>
            <Button size="sm" onClick={() => router.push('/signup')}>
              Get Started
            </Button>
          </>
        )}
      </div>
    </nav>
  );
} 