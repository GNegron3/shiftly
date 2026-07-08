import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/auth';
import { getFollowing } from '../../services/followService';
import { getSchedule } from '../../services/scheduleService';
import { ProfessionalProfile } from '../../types/Profile';
import { DaySchedule } from '../../types/Schedule';

const DAY_INDEX = new Date().getDay();
// JS getDay(): 0=Sun,1=Mon,...,6=Sat → app convention: 0=Mon,...,6=Sun
const TODAY_INDEX = DAY_INDEX === 0 ? 6 : DAY_INDEX - 1;
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

interface ProWithSchedule {
  profile: ProfessionalProfile;
  todayShift: DaySchedule | null;
}

export default function GuestFeed() {
  const { session, signOut } = useAuth();
  const [following, setFollowing] = useState<ProWithSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [signOutLoading, setSignOutLoading] = useState(false);

  const guestId = session?.user.id ?? null;

  useEffect(() => {
    if (!guestId) { setLoading(false); return; }

    let cancelled = false;

    const load = async () => {
      try {
        const profiles = await getFollowing(guestId);
        const withSchedules = await Promise.all(
          profiles.map(async (profile) => {
            const schedule = await getSchedule(profile.id);
            const todayShift = schedule.find((s) => s.day_of_week === TODAY_INDEX) ?? null;
            return { profile, todayShift };
          }),
        );
        if (!cancelled) setFollowing(withSchedules);
      } catch {
        // non-fatal — empty state shown
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [guestId]);

  const handleSignOut = async () => {
    setSignOutLoading(true);
    await signOut();
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.headerRow}>
          <Text style={styles.screenTitle}>Following</Text>
          <TouchableOpacity
            onPress={handleSignOut}
            disabled={signOutLoading}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {signOutLoading
              ? <ActivityIndicator color="#9CA3AF" />
              : <Text style={styles.signOutText}>Log Out</Text>
            }
          </TouchableOpacity>
        </View>

        <Text style={styles.todayLabel}>{DAY_SHORT[TODAY_INDEX]} — Today</Text>

        {following.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No one followed yet</Text>
            <Text style={styles.emptyBody}>
              Use a link from a professional to view their profile and follow them.
            </Text>
          </View>
        ) : (
          <View style={styles.feedList}>
            {following.map(({ profile, todayShift }) => (
              <TouchableOpacity
                key={profile.id}
                style={styles.proCard}
                activeOpacity={0.85}
                onPress={() => router.push(`/pro/${profile.id}` as any)}
              >
                <View style={styles.proCardLeft}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarInitials}>
                      {getInitials(profile.full_name)}
                    </Text>
                  </View>
                  <View style={styles.proInfo}>
                    <Text style={styles.proName}>{profile.full_name}</Text>
                    <Text style={styles.proMeta}>
                      {profile.trade} · {profile.workplace_name}
                    </Text>
                  </View>
                </View>
                <View style={styles.shiftBadge}>
                  {todayShift ? (
                    <Text
                      style={[
                        styles.shiftText,
                        todayShift.shift_type === 'off' && styles.shiftTextOff,
                      ]}
                    >
                      {shiftLabel(todayShift.shift_type, todayShift.custom_note)}
                    </Text>
                  ) : (
                    <Text style={styles.shiftTextOff}>—</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

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
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F9FAFB',
    letterSpacing: -0.5,
  },
  signOutText: {
    fontSize: 14,
    color: '#6B7280',
  },
  todayLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F9FAFB',
    textAlign: 'center',
  },
  emptyBody: {
    fontSize: 15,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  feedList: {
    gap: 12,
  },
  proCard: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  proCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  proInfo: {
    flex: 1,
    gap: 2,
  },
  proName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F9FAFB',
  },
  proMeta: {
    fontSize: 13,
    color: '#6B7280',
  },
  shiftBadge: {
    marginLeft: 12,
  },
  shiftText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D1D5DB',
  },
  shiftTextOff: {
    fontSize: 13,
    color: '#4B5563',
  },
});
