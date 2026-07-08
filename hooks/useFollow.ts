import { useEffect, useState } from 'react';
import {
  getFollowStatus,
  followProfessional,
  unfollowProfessional,
} from '../services/followService';

export function useFollow(guestId: string | null, professionalId: string | null) {
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!guestId || !professionalId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    getFollowStatus(guestId, professionalId)
      .then((status) => {
        if (!cancelled) setFollowing(status);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [guestId, professionalId]);

  const toggle = async () => {
    if (!guestId || !professionalId || toggling) return;

    setToggling(true);
    setError(null);

    const wasFollowing = following;
    setFollowing(!wasFollowing);

    try {
      if (wasFollowing) {
        await unfollowProfessional(guestId, professionalId);
      } else {
        await followProfessional(guestId, professionalId);
      }
    } catch (err: unknown) {
      setFollowing(wasFollowing);
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setToggling(false);
    }
  };

  return { following, loading, toggling, error, toggle };
}
