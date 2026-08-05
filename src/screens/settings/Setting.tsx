import { TextInputField } from '@/components';
import { AppButton } from '@/components/buttons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BREAK_KEY, FOCUS_KEY } from '@/constants';
import { Spacing } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import * as Notifications from 'expo-notifications';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FormBase } from 'react-hook-form-base';
import {
  ActivityIndicator,
  Alert,
  AppState,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  StyleSheet,
  Switch,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SettingValue {
  focusTime: number;
  breakTime: number;
}

export function SettingScreen() {
  const [settings, setSettings] = useState<SettingValue>({
    breakTime: 0,
    focusTime: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [notificationStatus, setNotificationStatus] = useState<'granted' | 'denied' | 'undetermined'>('undetermined');
  const [isCheckingPermission, setIsCheckingPermission] = useState(false);

  // Kiểm tra quyền thông báo
  const checkNotificationPermission = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setNotificationStatus(status);
    } catch (error) {
      console.log('Check permission error:', error);
    }
  };

  // Yêu cầu quyền thông báo
  const requestNotificationPermission = async () => {
    setIsCheckingPermission(true);
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();

      if (existingStatus === 'granted') {
        setNotificationStatus('granted');
        return;
      }

      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });

      setNotificationStatus(status);

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'To receive notifications when focus or break ends, please enable notifications in Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings(),
            },
          ]
        );
      }
    } catch (error) {
      console.log('Request notification permission error:', error);
    } finally {
      setIsCheckingPermission(false);
    }
  };

  // Load settings + check permission khi vào màn hình
  useFocusEffect(
    useCallback(() => {
      const loadSettings = async () => {
        setIsLoading(true);
        try {
          const savedFocus = await AsyncStorage.getItem(FOCUS_KEY);
          const savedBreak = await AsyncStorage.getItem(BREAK_KEY);

          setSettings({
            focusTime: parseInt(savedFocus || '25'),
            breakTime: parseInt(savedBreak || '5'),
          });

          await checkNotificationPermission();
        } catch (e) {
          console.log('Load settings failed', e);
        } finally {
          setIsLoading(false);
        }
      };

      loadSettings();
    }, [])
  );

  // Lắng nghe khi app quay lại từ Settings → reload quyền
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        checkNotificationPermission();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const saveSettings = async (value: SettingValue) => {
    try {
      await AsyncStorage.setItem(FOCUS_KEY, value.focusTime.toString());
      await AsyncStorage.setItem(BREAK_KEY, value.breakTime.toString());
      Alert.alert('✅ Successfully', 'Settings saved successfully!');
    } catch (e) {
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" color="#E23E28" />
        <ThemedText style={{ marginTop: 12 }}>Loading...</ThemedText>
      </ThemedView>
    );
  }

  const isNotificationEnabled = notificationStatus === 'granted';

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          accessible={false}
        >
          <KeyboardAvoidingView
            style={styles.keyboardView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}
          >
            <ThemedView style={styles.stepContainer}>
              <Image style={styles.image} source={require('@/assets/images/pomo.png')} />
              <ThemedText type="code" style={styles.title}>
                POMODORO
              </ThemedText>

              <FormBase onSubmit={saveSettings} defaultValues={{ ...settings }}>
                {(_, onHandleSubmit) => (
                  <ThemedView style={styles.settingContainer} type="backgroundElement">
                    {/* ===== Notification Permission ===== */}
                    <View>
                      <View style={styles.permissionRow}>
                        <View style={styles.permissionInfo}>
                          <ThemedText style={styles.permissionLabel}>
                            Focus & Break Alerts
                          </ThemedText>
                        </View>
                        <Switch
                          value={isNotificationEnabled}
                          onValueChange={(value) => {
                            if (value) {
                              requestNotificationPermission();
                            } else {
                              Alert.alert(
                                'Disable Notifications',
                                'To turn off notifications, please go to your device Settings.',
                                [
                                  { text: 'Cancel', style: 'cancel' },
                                  {
                                    text: 'Open Settings',
                                    onPress: () => Linking.openSettings(),
                                  },
                                ]
                              );
                            }
                          }}
                          trackColor={{ false: '#767577', true: '#E23E28' }}
                          thumbColor={isNotificationEnabled ? '#fff' : '#f4f3f4'}
                          disabled={isCheckingPermission}
                        />
                      </View>
                      <ThemedText style={styles.permissionDesc}>
                        Get notified when your focus or break time ends.
                      </ThemedText>
                    </View>

                    {/* ===== Timer Settings ===== */}
                    <TextInputField
                      name="focusTime"
                      labelTranslateCode="Focus time (minutes)"
                      placeholder="25"
                      rules={{ required: 'Field is required' }}
                      keyboardType="numeric"

                    />
                    <TextInputField
                      name="breakTime"
                      labelTranslateCode="Break time (minutes)"
                      placeholder="5"
                      rules={{ required: 'Field is required' }}
                      keyboardType="numeric"
                    />

                    <AppButton
                      onClick={onHandleSubmit}
                      labelTranslateCode="Save"
                      type="primary"
                      style={styles.saveButton}
                    />
                  </ThemedView>
                )}
              </FormBase>
            </ThemedView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
  },
  keyboardView: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  stepContainer: {
    alignSelf: 'stretch',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  settingContainer: {
    width: '100%',
    gap: 20,
    padding: 24,
    borderRadius: Spacing.four,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  image: {
    width: 76,
    height: 71,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#E23E28',
    borderColor: '#E23E28',
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  permissionInfo: {
    flex: 1,
  },
  permissionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  permissionDesc: {
    fontSize: 13,
    opacity: 0.7,
    lineHeight: 18,
    marginTop: 4,
  },
});