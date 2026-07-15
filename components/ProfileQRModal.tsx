import {
  Modal,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
import { getProfileUrl, getProfileShareContent } from '../lib/profileUrl';
import { Colors } from '../constants/theme';

interface Props {
  proId: string;
  visible: boolean;
  onClose: () => void;
}

export function ProfileQRModal({ proId, visible, onClose }: Props) {
  const [copySuccess, setCopySuccess] = useState(false);
  const profileUrl = getProfileUrl(proId);

  const handleCopyLink = async () => {
    if (!profileUrl) return;
    await Clipboard.setStringAsync(profileUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleMoreOptions = async () => {
    const content = getProfileShareContent(proId);
    if (!content) return;
    try {
      await Share.share({
        message: content.message,
        url: content.url,
        title: 'Share My Enpour Profile',
      });
    } catch {
      // share sheet dismissed or unavailable
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.sheet}>
              <View style={styles.handle} />

              <View style={styles.header}>
                <Text style={styles.title}>Your Enpour Profile</Text>
                <TouchableOpacity
                  onPress={onClose}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.subtitle}>
                Guests can scan this with their camera to follow your schedule.
              </Text>

              <View style={styles.qrWrapper}>
                {!!profileUrl && (
                  <QRCode
                    value={profileUrl}
                    size={240}
                    backgroundColor={Colors.surface}
                    color={Colors.textPrimary}
                  />
                )}
              </View>

              <TouchableOpacity
                style={[styles.button, copySuccess && styles.buttonSuccess]}
                activeOpacity={0.85}
                onPress={handleCopyLink}
                disabled={!profileUrl}
              >
                <Text style={[styles.buttonText, copySuccess && styles.buttonTextSuccess]}>
                  {copySuccess ? 'Link Copied!' : 'Copy Link'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonSecondary}
                activeOpacity={0.85}
                onPress={handleMoreOptions}
                disabled={!profileUrl}
              >
                <Text style={styles.buttonSecondaryText}>More Sharing Options</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(28, 25, 23, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 12,
    gap: 16,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 16,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  closeText: {
    fontSize: 18,
    color: Colors.textMuted,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  qrWrapper: {
    alignSelf: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonSuccess: {
    backgroundColor: Colors.gold,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.surface,
  },
  buttonTextSuccess: {
    color: Colors.surface,
  },
  buttonSecondary: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  buttonSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});
