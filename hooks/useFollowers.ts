import { useCallback, useEffect, useState } from 'react';
import { getFollowers } from '../services/followService';
import { Follower } from '../types/Follower';

interface UseFollowersResult {
  followers: Follower[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useFollowers(professionalId: string | null): UseFollowersResult {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!professionalId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getFollowers(professionalId);
      setFollowers(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load followers.');
    } finally {
      setLoading(false);
    }
  }, [professionalId]);

  useEffect(() => {
    load();
  }, [load]);

  return { followers, loading, error, refresh: load };
}
