import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/auth';

type Profile = {
  full_name: string;
  trade: string;
  workplace_name: string;
  workplace_location: string | null;
  bio: string;
};

export default function ProDashboard() {
  const { session, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  // useFocusEffect re-runs every time this screen comes back into focus,
  // so the dashboard updates immediately after the user saves their profile.
  useFocusEffect(
    useCallback(() => {
      if (!session) return;

      const loadProfile = async () => {
        setLoadingProfile(true);
        const { data } = await supabase
          .from('profiles')
          .select('full_name, trade, workplace_name, workplace_location, bio')
          .eq('id', session.user.id)
          .single();

        setProfile(data ?? null);
        setLoadingProfile(false);
      };

      loadProfile();
    }, [session])
  );

  const isProfileComplete = !!(
    profile?.full_name &&
    profile?.trade &&
    profile?.workplace_name &&
    profile?.bio
  );

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
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

        {/* Main content */}
        {loadingProfile ? (
          <View style={styles.centered}>
            <ActivityIndicator color="#F9FAFB" />
          </View>
        ) : (
          <View style={styles.body}>

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
                    You're all set! Your profile is ready for guests once you start sharing your schedule.
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

            {/* Schedule placeholder */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Next Step</Text>
              <Text style={styles.cardBody}>
                Create your weekly schedule so your guests know when they can catch you.
              </Text>
            </View>

          </View>
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
    gap: 16,
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
});
