import { useCallback, useEffect, useState } from 'react';
import { getProfile, updateProfile as saveProfile } from '../services/profileService';
import { ProfessionalProfile, UpdateProfilePayload } from '../types/Profile';

interface UseProfileResult {
  profile: ProfessionalProfile | null;
  loading: boolean;
  error: string | null;
  saving: boolean;
  saveError: string | null;
  updateProfile: (data: UpdateProfilePayload) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useProfile(userId: string | undefined): UseProfileResult {
  const [profile, setProfile] = useState<ProfessionalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getProfile(userId);
      setProfile(data);
    } catch {
      setError('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const updateProfile = useCallback(
    async (data: UpdateProfilePayload) => {
      if (!userId) return;
      setSaving(true);
      setSaveError(null);
      try {
        await saveProfile(userId, data);
        setProfile(prev =>
          prev ? { ...prev, ...data, updated_at: new Date().toISOString() } : null,
        );
      } catch {
        setSaveError('Failed to save profile. Please try again.');
        throw new Error('save_failed');
      } finally {
        setSaving(false);
      }
    },
    [userId],
  );

  return { profile, loading, error, saving, saveError, updateProfile, refresh: fetch };
}
