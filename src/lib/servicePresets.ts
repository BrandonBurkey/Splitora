export type ServicePlan = {
  id: string;
  name: string;
  price: number;
  max_members: number;
  description: string;
  features: string[];
  requires_same_household?: boolean;
};

export type ServiceProvider = {
  id: string;
  name: string;
  logo: string;
  plans: ServicePlan[];
  terms_url?: string;
};

export const serviceProviders: ServiceProvider[] = [
  {
    id: 'netflix',
    name: 'Netflix',
    logo: '/logos/netflix.png',
    plans: [
      {
        id: 'netflix-standard-hd',
        name: 'Standard',
        price: 15.49,
        max_members: 2,
        description: 'Watch in Full HD on 2 supported devices at a time',
        features: ['Full HD', '2 devices', 'Ad-free']
      },
      {
        id: 'netflix-premium',
        name: 'Premium',
        price: 22.99,
        max_members: 4,
        description: 'Watch in Ultra HD on 4 supported devices at a time',
        features: ['Ultra HD', '4 devices', 'Ad-free', 'Spatial audio']
      }
    ]
  },
  {
    id: 'spotify',
    name: 'Spotify',
    logo: '/logos/spotify.png',
    plans: [
      {
        id: 'spotify-duo',
        name: 'Duo',
        price: 14.99,
        max_members: 2,
        description: '2 Premium accounts for couples under one roof',
        features: ['2 Premium accounts', 'Duo Mix playlist', 'Ad-free music']
      },
      {
        id: 'spotify-family',
        name: 'Family',
        price: 16.99,
        max_members: 6,
        description: '6 Premium accounts for family members living under one roof',
        features: ['6 Premium accounts', 'Family Mix playlist', 'Ad-free music', 'Kids content']
      }
    ]
  },
  {
    id: 'disney',
    name: 'Disney+',
    logo: '/logos/disney.png',
    plans: [
      {
        id: 'disney-standard',
        name: 'Standard',
        price: 7.99,
        max_members: 4,
        description: 'Watch in Full HD on 4 supported devices at a time',
        features: ['Full HD', '4 devices', 'Ad-free']
      },
      {
        id: 'disney-premium',
        name: 'Premium',
        price: 10.99,
        max_members: 4,
        description: 'Watch in 4K UHD on 4 supported devices at a time',
        features: ['4K UHD', '4 devices', 'Ad-free', 'IMAX Enhanced']
      }
    ]
  },
  {
    id: 'hbo',
    name: 'Max',
    logo: '/logos/hbo.png',
    plans: [
      {
        id: 'hbo-with-ads',
        name: 'With Ads',
        price: 9.99,
        max_members: 3,
        description: 'Watch with limited ads on 3 supported devices at a time',
        features: ['HD', '3 devices', 'Limited ads']
      },
      {
        id: 'hbo-ad-free',
        name: 'Ad-Free',
        price: 15.99,
        max_members: 3,
        description: 'Watch without ads on 3 supported devices at a time',
        features: ['HD', '3 devices', 'Ad-free']
      },
      {
        id: 'hbo-ultimate',
        name: 'Ultimate',
        price: 19.99,
        max_members: 3,
        description: 'Watch in 4K UHD without ads on 3 supported devices at a time',
        features: ['4K UHD', '3 devices', 'Ad-free', 'Dolby Atmos']
      }
    ]
  },
  {
    id: 'crunchyroll',
    name: 'Crunchyroll',
    logo: '/logos/crunchyroll.png',
    plans: [
      {
        id: 'crunchyroll-mega-fan',
        name: 'Mega Fan',
        price: 9.99,
        max_members: 4,
        description: 'Watch ad-free on 4 devices at a time',
        features: ['HD', '4 devices', 'Ad-free', 'Offline viewing']
      }
    ]
  },
  {
    id: 'duolingo',
    name: 'Duolingo',
    logo: '/logos/duolingo.png',
    plans: [
      {
        id: 'duolingo-family',
        name: 'Family',
        price: 9.99,
        max_members: 6,
        description: 'Ad-free learning experience for the whole family',
        features: ['Ad-free', 'Unlimited hearts', 'Progress quizzes', 'Family sharing']
      }
    ]
  },
  {
    id: 'youtube',
    name: 'YouTube Premium',
    logo: '/logos/youtube.png',
    plans: [
      {
        id: 'youtube-family',
        name: 'Family',
        price: 22.99,
        max_members: 6,
        description: 'Ad-free videos and music for the whole family',
        features: ['Ad-free videos', 'Background play', 'Downloads', 'Family sharing']
      }
    ]
  },
  {
    id: 'apple',
    name: 'Apple One',
    logo: '/logos/apple.png',
    plans: [
      {
        id: 'apple-family',
        name: 'Family',
        price: 22.95,
        max_members: 6,
        description: 'Apple Music, TV+, Arcade, and iCloud+ for the whole family',
        features: ['Apple Music', 'Apple TV+', 'Apple Arcade', '200GB iCloud+', 'Family sharing']
      }
    ]
  },
  {
    id: 'hulu',
    name: 'Hulu',
    logo: '/logos/hulu.png',
    plans: [
      {
        id: 'hulu-basic',
        name: 'Basic',
        price: 7.99,
        max_members: 2,
        description: 'Watch with limited ads on 2 supported devices at a time',
        features: ['HD', '2 devices', 'Limited ads']
      },
      {
        id: 'hulu-no-ads',
        name: 'No Ads',
        price: 17.99,
        max_members: 2,
        description: 'Watch without ads on 2 supported devices at a time',
        features: ['HD', '2 devices', 'Ad-free']
      },
      {
        id: 'hulu-disney-espn',
        name: 'Hulu + Disney+ + ESPN+',
        price: 14.99,
        max_members: 4,
        description: 'Bundle of Hulu, Disney+, and ESPN+ with limited ads',
        features: ['HD', '4 devices', 'Limited ads', '3 services in one']
      }
    ]
  },
  {
    id: 'paramount',
    name: 'Paramount+',
    logo: '/logos/paramount.png',
    plans: [
      {
        id: 'paramount-essential',
        name: 'Essential',
        price: 5.99,
        max_members: 3,
        description: 'Watch with limited ads on 3 supported devices at a time',
        features: ['HD', '3 devices', 'Limited ads']
      },
      {
        id: 'paramount-premium',
        name: 'Premium',
        price: 11.99,
        max_members: 3,
        description: 'Watch without ads on 3 supported devices at a time',
        features: ['HD', '3 devices', 'Ad-free', 'Download content']
      }
    ]
  },
  {
    id: 'peacock',
    name: 'Peacock Premium',
    logo: '/logos/peacock.png',
    plans: [
      {
        id: 'peacock-premium',
        name: 'Premium',
        price: 5.99,
        max_members: 3,
        description: 'Watch with limited ads on 3 supported devices at a time',
        features: ['HD', '3 devices', 'Limited ads']
      },
      {
        id: 'peacock-premium-plus',
        name: 'Premium Plus',
        price: 11.99,
        max_members: 3,
        description: 'Watch without ads on 3 supported devices at a time',
        features: ['HD', '3 devices', 'Ad-free', 'Download content']
      }
    ]
  },
  {
    id: 'showtime',
    name: 'Showtime',
    logo: '/logos/showtime.png',
    plans: [
      {
        id: 'showtime-standalone',
        name: 'Standalone',
        price: 10.99,
        max_members: 3,
        description: 'Watch Showtime content on 3 supported devices at a time',
        features: ['HD', '3 devices', 'Ad-free', 'Download content']
      },
      {
        id: 'showtime-paramount-bundle',
        name: 'Paramount+ Bundle',
        price: 11.99,
        max_members: 3,
        description: 'Bundle of Paramount+ Premium and Showtime',
        features: ['HD', '3 devices', 'Ad-free', 'Download content', 'Two services in one']
      }
    ]
  },
  {
    id: 'tidal',
    name: 'Tidal',
    logo: '/logos/tidal.png',
    plans: [
      {
        id: 'tidal-family',
        name: 'Family',
        price: 29.99,
        max_members: 6,
        description: 'High-fidelity music streaming for the whole family',
        features: ['HiFi audio', '6 accounts', 'Ad-free', 'Offline listening']
      }
    ]
  },
  {
    id: 'xbox',
    name: 'Xbox Game Pass Ultimate',
    logo: '/logos/xbox.png',
    plans: [
      {
        id: 'xbox-family',
        name: 'Family',
        price: 24.99,
        max_members: 5,
        description: 'Share Game Pass Ultimate with up to 4 family members',
        features: ['5 accounts', 'Access to 100+ games', 'Xbox Live Gold', 'EA Play']
      }
    ]
  },
  {
    id: 'nintendo',
    name: 'Nintendo Switch Online',
    logo: '/logos/nintendo.png',
    terms_url: 'https://www.nintendo.com/switch/online-service/terms/',
    plans: [
      {
        id: 'nintendo-family',
        name: 'Family Membership',
        price: 34.99,
        max_members: 8,
        requires_same_household: true,
        description: 'Online play and classic games for up to 8 Nintendo accounts',
        features: ['8 accounts', 'Online play', 'Classic NES/SNES games', 'Cloud saves']
      }
    ]
  },
  {
    id: 'microsoft365',
    name: 'Microsoft 365 Family',
    logo: '/logos/microsoft.png',
    terms_url: 'https://www.microsoft.com/en-us/servicesagreement/',
    plans: [
      {
        id: 'microsoft365-family',
        name: 'Family',
        price: 99.99,
        max_members: 6,
        requires_same_household: true,
        description: 'Office apps and cloud storage for up to 6 people',
        features: ['6 accounts', '1TB OneDrive each', 'Office apps', 'Family safety']
      }
    ]
  },
  {
    id: 'googleone',
    name: 'Google One',
    logo: '/logos/google.png',
    plans: [
      {
        id: 'googleone-family',
        name: 'Family',
        price: 9.99,
        max_members: 6,
        description: 'Shared cloud storage and benefits for the family',
        features: ['2TB storage', '6 accounts', 'VPN access', 'Family sharing']
      }
    ]
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    logo: '/logos/dropbox.png',
    plans: [
      {
        id: 'dropbox-family',
        name: 'Family',
        price: 16.99,
        max_members: 6,
        description: 'Shared cloud storage for the whole family',
        features: ['2TB storage', '6 accounts', 'Family sharing', 'Priority support']
      }
    ]
  },
  {
    id: 'evernote',
    name: 'Evernote',
    logo: '/logos/evernote.png',
    plans: [
      {
        id: 'evernote-teams',
        name: 'Teams',
        price: 14.99,
        max_members: 5,
        description: 'Note-taking and collaboration for teams',
        features: ['5 accounts', '10GB monthly uploads', 'Team collaboration', 'Admin controls']
      }
    ]
  },
  {
    id: 'masterclass',
    name: 'MasterClass',
    logo: '/logos/masterclass.png',
    plans: [
      {
        id: 'masterclass-duo',
        name: 'Duo',
        price: 180,
        max_members: 2,
        description: 'Access to all classes for two people',
        features: ['2 accounts', 'All classes', 'Download lessons', 'Offline viewing']
      }
    ]
  },
  {
    id: 'skillshare',
    name: 'Skillshare',
    logo: '/logos/skillshare.png',
    plans: [
      {
        id: 'skillshare-teams',
        name: 'Teams',
        price: 159,
        max_members: 5,
        description: 'Creative learning for teams',
        features: ['5 accounts', 'All classes', 'Team analytics', 'Admin controls']
      }
    ]
  },
  {
    id: 'rosettastone',
    name: 'Rosetta Stone',
    logo: '/logos/rosettastone.png',
    plans: [
      {
        id: 'rosettastone-family',
        name: 'Family',
        price: 179,
        max_members: 5,
        description: 'Language learning for the whole family',
        features: ['5 accounts', '24 languages', 'Offline access', 'Progress tracking']
      }
    ]
  }
]; 