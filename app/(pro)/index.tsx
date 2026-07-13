import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/auth';
import { useFollowers } from '../../hooks/useFollowers';

type Profile = {
  full_name: string;
  trade: string;
  workplace_name: string;
  workplace_location: string | null;
  bio: string;
};

type ScheduleRow = {
  day_of_week: number;
  shift_type: string;
  custom_note: string | null;
};

const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const shiftLabel = (type: string, note: string | null): string => {
  if (type === 'custom') return note?.trim() || 'Custom';
  return type.charAt(0).toUpperCase() + type.slice(1);
};

export default function ProDashboard() {
  const { session, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [schedule, setSchedule] = useState<ScheduleRow[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const { followers, refresh: refreshFollowers } = useFollowers(session?.user.id ?? null);

  useFocusEffect(
    useCallback(() => {
      if (!session) return;

      const loadData = async () => {
        setLoadingData(true);
        refreshFollowers();

        const [profileResult, scheduleResult] = await Promise.all([
          supabase
            .from('profiles')
            .select('full_name, trade, workplace_name, workplace_location, bio')
            .eq('id', session.user.id)
            .single(),
          supabase
            .from('schedules')
            .select('day_of_week, shift_type, custom_note')
            .eq('pro_id', session.user.id)
            .order('day_of_week'),
        ]);

        setProfile(profileResult.data ?? null);
        setSchedule(scheduleResult.data ?? []);
        setLoadingData(false);
      };

      loadData();
    }, [session, refreshFollowers])
  );

  const isProfileComplete = !!(
    profile?.full_name &&
    profile?.trade &&
    profile?.workplace_name &&
    profile?.bio
  );

  // All 7 days must be stored for the schedule to be considered set.
  const hasSchedule = schedule.length === 7;

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
  };

  const handleShareProfile = async () => {
    if (!session) return;
    await Share.share({
      message: `Check out my Shiftly profile!\n\nProfile ID: ${session.user.id}`,
      title: 'Share My Shiftly Profile',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Header row */}
        <View style={styles.headerRow}>
          <Text style={styles.eyebrow}>PRO DASHBOARD</Text>
          <TouchableOpacity onPress={handleSignOut} disabled={signingOut}>
            {signingOut
              ? <ActivityIndicator color="#6B7280" size="small" />
              : <Text style={styles.logoutText}>Log Out</Text>
            }
          </TouchableOpacity>
        </View>

        {loadingData ? (
          <View style={styles.centered}>
            <ActivityIndicator color="#F9FAFB" />
          </View>
        ) : (
          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            showsVerticalScrollIndicator={false}
          >

            {/* Welcome */}
            <View style={styles.welcomeBlock}>
              <Text style={styles.welcomeText}>
                {isProfileComplete
                  ? `Welcome back, ${profile!.full_name.split(' ')[0]}.`
                  : 'Welcome to Shiftly.'}
              </Text>
              {isProfileComplete && (
                <Text style={styles.welcomeSub}>
                  {profile!.trade} · {profile!.workplace_name}
                  {profile!.workplace_location ? ` · ${profile!.workplace_location}` : ''}
                </Text>
              )}
            </View>

            {/* Profile card */}
            <View style={[
              styles.card,
              isProfileComplete ? styles.cardComplete : styles.cardIncomplete,
            ]}>
              {isProfileComplete ? (
                <>
                  <Text style={styles.cardTitle}>Profile complete</Text>
                  <Text style={styles.cardBody}>
                    {"You're all set! Your profile is ready for guests once you start sharing your schedule."}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.cardTitle}>Complete your profile</Text>
                  <Text style={styles.cardBody}>
                    Add your workplace and bio so regulars know where to find you.
                  </Text>
                </>
              )}
              <TouchableOpacity
                style={styles.cardButton}
                activeOpacity={0.85}
                onPress={() => router.push('/(pro)/profile')}
              >
                <Text style={styles.cardButtonText}>
                  {isProfileComplete ? 'Edit Profile' : 'Complete Profile'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Share profile card — visible once profile + schedule are complete */}
            {isProfileComplete && hasSchedule && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Share Your Profile</Text>
                <Text style={styles.cardBody}>
                  Your profile and schedule are ready. Share your link with guests so they can follow you.
                </Text>
                <TouchableOpacity
                  style={styles.cardButton}
                  activeOpacity={0.85}
                  onPress={handleShareProfile}
                >
                  <Text style={styles.cardButtonText}>Share Profile</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Followers card */}
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => router.push('/(pro)/followers')}
            >
              <Text style={styles.cardTitle}>Followers</Text>
              <Text style={styles.followerCount}>{followers.length}</Text>
              <Text style={styles.cardBody}>
                {followers.length === 1
                  ? '1 guest is following you.'
                  : `${followers.length} guests are following you.`}
              </Text>
              <Text style={styles.cardLink}>View all →</Text>
            </TouchableOpacity>

            {/* Schedule card */}
            <View style={[styles.card, hasSchedule && styles.cardComplete]}>
              {hasSchedule ? (
                <>
                  <Text style={styles.cardTitle}>This Week</Text>
                  <View style={styles.scheduleGrid}>
                    {schedule.map(row => (
                      <View key={row.day_of_week} style={styles.scheduleRow}>
                        <Text style={styles.scheduleDay}>
                          {DAY_SHORT[row.day_of_week]}
                        </Text>
                        <Text style={[
                          styles.scheduleShift,
                          row.shift_type === 'off' && styles.scheduleShiftOff,
                        ]}>
                          {shiftLabel(row.shift_type, row.custom_note)}
                        </Text>
                      </View>
                    ))}
                  </View>
                  <TouchableOpacity
                    style={styles.cardButton}
                    activeOpacity={0.85}
                    onPress={() => router.push('/(pro)/schedule')}
                  >
                    <Text style={styles.cardButtonText}>Edit Schedule</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.cardTitle}>Next Step</Text>
                  <Text style={styles.cardBody}>
                    Create your weekly schedule so your guests know when they can catch you.
                  </Text>
                  <TouchableOpacity
                    style={styles.cardButton}
                    activeOpacity={0.85}
                    onPress={() => router.push('/(pro)/schedule')}
                  >
                    <Text style={styles.cardButtonText}>Set My Schedule</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#111827',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1.5,
  },
  logoutText: {
    fontSize: 14,
    color: '#6B7280',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    gap: 16,
    paddingBottom: 32,
  },
  welcomeBlock: {
    marginBottom: 8,
    gap: 4,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F9FAFB',
    letterSpacing: -0.5,
  },
  welcomeSub: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  card: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 16,
    padding: 20,
    gap: 8,
  },
  cardIncomplete: {
    borderColor: '#92400E',
    backgroundColor: '#1C1409',
  },
  cardComplete: {
    borderColor: '#065F46',
    backgroundColor: '#071C15',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F9FAFB',
  },
  cardBody: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  cardButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#F9FAFB',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  cardButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  scheduleGrid: {
    gap: 5,
    marginTop: 4,
    marginBottom: 4,
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
    fontSize: 13,
    color: '#F9FAFB',
    fontWeight: '500',
  },
  scheduleShiftOff: {
    color: '#4B5563',
    fontWeight: '400',
  },
  followerCount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#F9FAFB',
    letterSpacing: -1,
  },
  cardLink: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
});
