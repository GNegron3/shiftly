import { useEffect, useState } from 'react';
import { GuestProfile } from '../types/GuestProfile';
import { getGuestProfile } from '../services/guestProfileService';

export function useGuestProfile(userId: string | null) {
  const [profile, setProfile] = useState<GuestProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    getGuestProfile(userId)
      .then((data) => {
        if (!cancelled) setProfile(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [userId]);

  return { profile, loading, error };
}
