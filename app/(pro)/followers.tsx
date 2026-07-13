import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/auth';
import { useFollowers } from '../../hooks/useFollowers';
import { Follower } from '../../types/Follower';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function FollowerRow({ item }: { item: Follower }) {
  return (
    <View style={styles.row}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.full_name.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.rowBody}>
        <Text style={styles.rowName}>{item.full_name}</Text>
        <Text style={styles.rowDate}>Followed {formatDate(item.followed_at)}</Text>
      </View>
    </View>
  );
}

export default function FollowersScreen() {
  const { session } = useAuth();
  const { followers, loading, error, refresh } = useFollowers(session?.user.id ?? null);

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator color="#F9FAFB" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refresh} activeOpacity={0.85}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (followers.length === 0) {
      return (
        <View style={styles.centered}>
          <Text style={styles.emptyHeading}>No followers yet</Text>
          <Text style={styles.emptyBody}>
            Share your profile with guests so they can follow you and see your schedule.
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={followers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FollowerRow item={item} />}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.75}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Followers</Text>
          <View style={styles.headerSpacer} />
        </View>

        {renderContent()}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  backText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#F9FAFB',
  },
  headerSpacer: {
    width: 48,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F9FAFB',
  },
  emptyHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F9FAFB',
  },
  emptyBody: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 24,
  },
  list: {
    paddingBottom: 32,
  },
  separator: {
    height: 1,
    backgroundColor: '#1F2937',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  rowBody: {
    flex: 1,
    gap: 2,
  },
  rowName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F9FAFB',
  },
  rowDate: {
    fontSize: 13,
    color: '#6B7280',
  },
});
