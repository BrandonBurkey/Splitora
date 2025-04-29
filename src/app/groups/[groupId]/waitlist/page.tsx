'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { createClient } from '@/lib/supabase';

const WaitlistPage = ({ params }: { params: Promise<{ groupId: string }> }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [group, setGroup] = useState<any>(null);
  const [waitlistStatus, setWaitlistStatus] = useState<'pending' | 'notified' | 'joined' | null>(null);
  const { groupId } = use(params);

  useEffect(() => {
    if (!user) {
      router.push('/signin');
      return;
    }

    const fetchGroupAndWaitlist = async () => {
      try {
        const supabase = createClient();
        
        // Fetch group details
        const { data: groupData, error: groupError } = await supabase
          .from('subscription_groups')
          .select('*')
          .eq('id', groupId)
          .single();

        if (groupError) throw groupError;
        setGroup(groupData);

        // Fetch waitlist status
        const { data: waitlistData, error: waitlistError } = await supabase
          .from('subscription_waitlist')
          .select('status')
          .eq('group_id', groupId)
          .eq('user_id', user.id)
          .single();

        if (waitlistError && waitlistError.code !== 'PGRST116') {
          throw waitlistError;
        }

        setWaitlistStatus(waitlistData?.status || null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load group information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupAndWaitlist();
  }, [user, router, groupId]);

  const handleJoinWaitlist = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('subscription_waitlist')
        .insert({
          group_id: groupId,
          user_id: user?.id,
          status: 'pending'
        });

      if (error) throw error;
      setWaitlistStatus('pending');
    } catch (err) {
      console.error('Error joining waitlist:', err);
      alert('Failed to join waitlist. Please try again.');
    }
  };

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

  if (error || !group) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error || 'Group not found'}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => router.push('/explore')}
          >
            Back to Explore
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Join Waitlist</h1>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{group.name}</h2>
              <p className="text-gray-600">Get notified when a spot becomes available</p>
            </div>

            {waitlistStatus === 'pending' && (
              <div className="mb-6 p-4 bg-emerald-50 rounded-lg">
                <p className="text-emerald-600">You're on the waitlist! We'll notify you when a spot becomes available.</p>
              </div>
            )}

            {waitlistStatus === 'notified' && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-600">A spot is available! Click below to join the group.</p>
                <Button 
                  className="mt-4 w-full"
                  onClick={() => router.push(`/groups/${groupId}/join`)}
                >
                  Join Group Now
                </Button>
              </div>
            )}

            {waitlistStatus === 'joined' && (
              <div className="mb-6 p-4 bg-emerald-50 rounded-lg">
                <p className="text-emerald-600">You've successfully joined the group!</p>
                <Button 
                  className="mt-4 w-full"
                  onClick={() => router.push(`/groups/${groupId}`)}
                >
                  View Group
                </Button>
              </div>
            )}

            {!waitlistStatus && (
              <Button 
                className="w-full"
                onClick={handleJoinWaitlist}
              >
                Join Waitlist
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitlistPage; 