import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { getProfile } from '../../services/profileService';
import { getSchedule } from '../../services/scheduleService';
import { ProfessionalProfile } from '../../types/Profile';
import { DaySchedule } from '../../types/Schedule';
import { useAuth } from '../../context/auth';
import { useFollow } from '../../hooks/useFollow';

const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function shiftLabel(type: string, note: string | null): string {
  if (type === 'custom') return note?.trim() || 'Custom';
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function PublicProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();

  const [profile, setProfile] = useState<ProfessionalProfile | null>(null);
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const userRole = session?.user.user_metadata?.role as 'pro' | 'guest' | undefined;
  const isGuest = userRole === 'guest';
  const guestId = isGuest ? (session?.user.id ?? null) : null;
  const professionalId = id ?? null;

  const { following, loading: followLoading, toggling, toggle } = useFollow(
    guestId,
    professionalId,
  );

  useEffect(() => {
    if (!id) { setNotFound(true); setLoading(false); return; }

    const load = async () => {
      try {
        const [profileData, scheduleData] = await Promise.all([
          getProfile(id),
          getSchedule(id),
        ]);
        if (!profileData) {
          setNotFound(true);
        } else {
          setProfile(profileData);
          setSchedule(scheduleData);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator color="#F9FAFB" />
        </View>
      </SafeAreaView>
    );
  }

  if (notFound || !profile) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.notFoundTitle}>Profile not found</Text>
          <Text style={styles.notFoundBody}>
            This profile may have been removed or the link is incorrect.
          </Text>
          <TouchableOpacity style={styles.backLinkButton} onPress={handleBack}>
            <Text style={styles.backLinkText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const hasSchedule = schedule.length > 0;

  const renderFollowButton = () => {
    if (userRole === 'pro') return null;

    if (!session) {
      return (
        <TouchableOpacity
          style={styles.followButton}
          activeOpacity={0.85}
          onPress={() => router.push({ pathname: '/signup-guest', params: { returnTo: `/pro/${id}` } } as any)}
        >
          <Text style={styles.followButtonText}>Sign up to Follow</Text>
        </TouchableOpacity>
      );
    }

    if (followLoading) {
      return (
        <View style={[styles.followButton, styles.followButtonDisabled]}>
          <ActivityIndicator color="#9CA3AF" />
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={[styles.followButton, following && styles.followButtonActive]}
        activeOpacity={0.85}
        onPress={toggle}
        disabled={toggling}
      >
        {toggling
          ? <ActivityIndicator color={following ? '#111827' : '#F9FAFB'} />
          : (
            <Text style={[styles.followButtonText, following && styles.followButtonTextActive]}>
              {following ? 'Following' : 'Follow'}
            </Text>
          )
        }
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {/* Profile header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>{getInitials(profile.full_name)}</Text>
          </View>

          <Text style={styles.name}>{profile.full_name}</Text>
          <Text style={styles.trade}>{profile.trade}</Text>

          <View style={styles.venuePill}>
            <Text style={styles.venueText}>
              {profile.workplace_name}
              {profile.workplace_location ? ` · ${profile.workplace_location}` : ''}
            </Text>
          </View>
        </View>

        {/* Bio */}
        {profile.bio ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>About</Text>
            <Text style={styles.bioText}>{profile.bio}</Text>
          </View>
        ) : null}

        {/* Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>This Week</Text>

          {hasSchedule ? (
            <View style={styles.scheduleCard}>
              {schedule.map(row => (
                <View key={row.day_of_week} style={styles.scheduleRow}>
                  <Text style={styles.scheduleDay}>
                    {DAY_SHORT[row.day_of_week]}
                  </Text>
                  <Text
                    style={[
                      styles.scheduleShift,
                      row.shift_type === 'off' && styles.scheduleShiftOff,
                    ]}
                  >
                    {shiftLabel(row.shift_type, row.custom_note)}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.scheduleCard}>
              <Text style={styles.emptyScheduleText}>
                No schedule published yet.
              </Text>
            </View>
          )}
        </View>

        {renderFollowButton()}

        <Text style={styles.footerText}>Powered by Shiftly</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#111827',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 12,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 32,
  },
  backText: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  profileHeader: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 36,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarInitials: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F9FAFB',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  trade: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  venuePill: {
    marginTop: 4,
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  venueText: {
    fontSize: 13,
    color: '#D1D5DB',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
    gap: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  bioText: {
    fontSize: 15,
    color: '#D1D5DB',
    lineHeight: 22,
  },
  scheduleCard: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scheduleDay: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    width: 32,
  },
  scheduleShift: {
    fontSize: 14,
    color: '#F9FAFB',
    fontWeight: '500',
  },
  scheduleShiftOff: {
    color: '#4B5563',
    fontWeight: '400',
  },
  emptyScheduleText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingVertical: 8,
  },
  followButton: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
  },
  followButtonActive: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
  },
  followButtonDisabled: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    opacity: 0.6,
  },
  followButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  followButtonTextActive: {
    color: '#9CA3AF',
  },
  footerText: {
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
    marginTop: 32,
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F9FAFB',
    textAlign: 'center',
  },
  notFoundBody: {
    fontSize: 15,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
  },
  backLinkButton: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  backLinkText: {
    fontSize: 15,
    color: '#F9FAFB',
    fontWeight: '500',
  },
});
