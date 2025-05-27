'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { serviceProviders } from '@/lib/servicePresets';
import Image from 'next/image';
import { Search } from 'lucide-react';

const ExplorePage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'music', name: 'Music' },
    { id: 'gaming', name: 'Gaming' },
    { id: 'productivity', name: 'Productivity' },
    { id: 'education', name: 'Education' }
  ];

  const getCategory = (provider: typeof serviceProviders[0]) => {
    const name = provider.name.toLowerCase();
    
    // Entertainment/Streaming
    if (name.includes('netflix') || 
        name.includes('hbo') || 
        name.includes('disney') ||
        name.includes('hulu') ||
        name.includes('paramount') ||
        name.includes('peacock') ||
        name.includes('showtime') ||
        name.includes('youtube')) {
      return 'entertainment';
    }
    
    // Music
    if (name.includes('spotify') ||
        name.includes('tidal') ||
        name.includes('apple music')) {
      return 'music';
    }
    
    // Gaming
    if (name.includes('xbox') ||
        name.includes('nintendo') ||
        name.includes('playstation')) {
      return 'gaming';
    }
    
    // Productivity/Cloud
    if (name.includes('microsoft') ||
        name.includes('google one') ||
        name.includes('dropbox') ||
        name.includes('evernote')) {
      return 'productivity';
    }
    
    // Education/Learning
    if (name.includes('duolingo') ||
        name.includes('masterclass') ||
        name.includes('skillshare') ||
        name.includes('rosetta stone')) {
      return 'education';
    }
    
    return 'other';
  };

  // Sort providers by popularity
  const sortByPopularity = (providers: typeof serviceProviders) => {
    const popularityScores: { [key: string]: number } = {
      'netflix': 100,
      'spotify': 95,
      'disney': 90,
      'hbo': 85,
      'youtube': 80,
      'apple': 75,
      'hulu': 70,
      'paramount': 65,
      'peacock': 60,
      'showtime': 55,
      'crunchyroll': 50,
      'duolingo': 45,
      'microsoft365': 40,
      'googleone': 35,
      'dropbox': 30,
      'evernote': 25,
      'masterclass': 20,
      'skillshare': 15,
      'rosettastone': 10,
      'tidal': 5,
      'xbox': 5,
      'nintendo': 5
    };

    return [...providers].sort((a, b) => {
      const scoreA = popularityScores[a.id] || 0;
      const scoreB = popularityScores[b.id] || 0;
      return scoreB - scoreA;
    });
  };

  useEffect(() => {
    if (!user) {
      router.push('/signin');
    } else {
      setIsLoading(false);
    }
  }, [user, router]);

  useEffect(() => {
    if (searchQuery) return; // Don't scroll when searching

    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    const scrollSpeed = 1; // pixels per frame

    const scroll = () => {
      scrollAmount += scrollSpeed;
      if (scrollAmount >= scrollContainer.scrollWidth) {
        scrollAmount = 0;
      }
      scrollContainer.scrollLeft = scrollAmount;
    };

    const interval = setInterval(scroll, 30);
    return () => clearInterval(interval);
  }, [searchQuery]);

  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  const filteredProviders = sortByPopularity(serviceProviders.filter(provider => {
    const matchesCategory = selectedCategory === 'all' || getCategory(provider) === selectedCategory;
    const matchesSearch = searchQuery ? provider.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    return matchesCategory && matchesSearch;
  }));

  const SubscriptionCard = ({ provider }: { provider: typeof serviceProviders[0] }) => {
    const defaultPlan = provider.plans[0];
    const share = defaultPlan.price / defaultPlan.max_members;
    const savings = defaultPlan.price - share;
    const savingsPercentage = Math.round((savings / defaultPlan.price) * 100);

    return (
      <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 relative">
            <Image
              src={provider.logo}
              alt={provider.name}
              fill
              sizes="(max-width: 768px) 40px, 40px"
              className="object-contain"
              priority={true}
              loading="eager"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/logos/placeholder.png'; // Add a placeholder image
              }}
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">{provider.name}</h3>
        </div>

        <div className="mb-4">
          <p className="text-emerald-600 font-medium">
            Save up to ${formatPrice(savings)}/month ({savingsPercentage}% off)
          </p>
          {defaultPlan.requires_same_household && (
            <p className="text-sm text-gray-500 mt-1">
              * Members must be part of the same household
            </p>
          )}
        </div>

        <Button 
          size="sm" 
          className="w-full"
          onClick={() => router.push(`/explore/${provider.id}`)}
        >
          View Available Plans
        </Button>

        {provider.terms_url && (
          <a 
            href={provider.terms_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-gray-700 mt-2 block text-center"
          >
            View Terms of Service
          </a>
        )}
      </div>
    );
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

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {/* Search */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search subscriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        {/* Categories */}
        <div className="flex gap-4 mb-1 overflow-x-auto pb-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-emerald-50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Service Providers */}
        {searchQuery || selectedCategory !== 'all' ? (
          // Static grid layout for search results and specific categories
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <SubscriptionCard key={provider.id} provider={provider} />
            ))}
          </div>
        ) : null}
      </main>

      {/* Full-width scrolling container */}
      {!searchQuery && selectedCategory === 'all' && (
        <div className="w-full overflow-hidden py-8">
          <div className="relative">
            <div 
              ref={scrollContainerRef}
              className="flex gap-8 animate-scroll whitespace-nowrap"
              style={{
                width: 'fit-content',
                willChange: 'transform'
              }}
            >
              {/* First set of items */}
              {filteredProviders.map((provider) => (
                <div key={provider.id} className="inline-block w-72 flex-shrink-0">
                  <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 relative bg-gray-100 rounded-lg">
                        <Image
                          src={provider.logo}
                          alt={provider.name}
                          fill
                          sizes="(max-width: 768px) 40px, 40px"
                          className="object-contain p-1"
                          priority={true}
                          loading="eager"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/logos/placeholder.png';
                            target.onerror = null; // Prevent infinite loop
                          }}
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
                    </div>

                    <div className="mb-3">
                      <p className="text-emerald-600 font-medium text-sm">
                        Save up to ${formatPrice(provider.plans[0].price - (provider.plans[0].price / provider.plans[0].max_members))}/month ({Math.round(((provider.plans[0].price - (provider.plans[0].price / provider.plans[0].max_members)) / provider.plans[0].price) * 100)}% off)
                      </p>
                    </div>

                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => router.push(`/explore/${provider.id}`)}
                    >
                      View Available Plans
                    </Button>
                  </div>
                </div>
              ))}
              {/* Duplicate set of items for seamless loop */}
              {filteredProviders.map((provider) => (
                <div key={`${provider.id}-duplicate`} className="inline-block w-72 flex-shrink-0">
                  <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 relative bg-gray-100 rounded-lg">
                        <Image
                          src={provider.logo}
                          alt={provider.name}
                          fill
                          sizes="(max-width: 768px) 40px, 40px"
                          className="object-contain p-1"
                          priority={true}
                          loading="eager"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/logos/placeholder.png';
                            target.onerror = null; // Prevent infinite loop
                          }}
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
                    </div>

                    <div className="mb-3">
                      <p className="text-emerald-600 font-medium text-sm">
                        Save up to ${formatPrice(provider.plans[0].price - (provider.plans[0].price / provider.plans[0].max_members))}/month ({Math.round(((provider.plans[0].price - (provider.plans[0].price / provider.plans[0].max_members)) / provider.plans[0].price) * 100)}% off)
                      </p>
                    </div>

                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => router.push(`/explore/${provider.id}`)}
                    >
                      View Available Plans
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
          display: flex;
          gap: 2rem;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default ExplorePage; 