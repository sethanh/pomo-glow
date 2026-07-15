import { StyleSheet, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AnimatedIcon } from '@/components/animated-icon';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { BREAK_KEY, FOCUS_KEY } from '@/constants';
import { useFocusEffect } from 'expo-router';
import {TextInputField } from '@/components';
import { AppButton } from '@/components/buttons';
import { FormBase } from 'react-hook-form-base'

interface SettingValue {
  focusTime: number;
  breakTime: number;
}


export default function SettingScreen() {
  const [settings, setSettings] = useState<SettingValue>({
    breakTime: 0,
    focusTime: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadSettings = async () => {
        setIsLoading(true);
        try {
          const savedFocus = await AsyncStorage.getItem(FOCUS_KEY);
          const savedBreak = await AsyncStorage.getItem(BREAK_KEY);

          setSettings({
            focusTime: parseInt(savedFocus || '25'),
            breakTime: parseInt(savedBreak || '5')
          });
        } catch (e) {
          console.log('Load settings failed', e);
        }
        finally {
          setIsLoading(false);
        }
      };

      loadSettings();

      return () => {
      };
    }, [])
  );


  const saveSettings = async ( value : SettingValue ) => {
    try {
      await AsyncStorage.setItem(FOCUS_KEY, value.focusTime.toString());
      await AsyncStorage.setItem(BREAK_KEY, value.breakTime.toString());

      Alert.alert('✅ Successfully', 'Save Successfully!');
    } catch (e) {
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

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={[{
            flex: 1,
            width: '100%',
            alignItems: 'center'
          }]}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          <ThemedView style={styles.tomatoContainer}>
            {/* <AnimatedIcon /> */}
          </ThemedView>

          <ThemedView style={styles.stepContainer}>
            <ThemedText type="code" style={styles.title}>
              POMODORO
            </ThemedText>
            <FormBase
              onSubmit={(value)=>{console.log(value)}}
              defaultValues={{...settings}}
            >
              {(_, onHandleSubmit) => {
                return (<ThemedView style={styles.settingContainer} type="backgroundElement">
                  <TextInputField
                    name='focusTime'
                    labelTranslateCode='Focus time'
                    placeholder='Focus time'
                    rules={{
                      required: 'Field is required'
                    }}
                  />
                  <TextInputField
                    labelTranslateCode='Break time'
                    placeholder='Break time'
                    name='breakTime'
                    rules={{
                      required: 'Field is required'
                    }}
                  />
                  <AppButton
                    onClick={onHandleSubmit}
                    labelTranslateCode={'Save'}
                    type='primary'
                    style={{backgroundColor: '#E23E28', borderColor: '#E23E28'}}
                  />
                </ThemedView>);
              }}
            </FormBase>
          </ThemedView>
        </KeyboardAvoidingView>

      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: { flex: 1 },
  safeArea: { flex: 1, alignItems: 'center', paddingTop: 40, paddingBottom: 40 },
  tomatoContainer: { marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30 },
  timerContainer: { flexDirection: 'row', gap: 40, marginBottom: 40 },
  timeSection: { alignItems: 'center' },
  timeLabel: { fontSize: 16, color: '#666', marginBottom: 10 },
  bigBox: {
    width: 130,
    height: 150,
    backgroundColor: '#1f1f1f',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 6,
    borderColor: '#333',
  },
  activeBox: { backgroundColor: '#E23E28', borderColor: '#E23E28' },
  bigNumber: { color: 'white', fontSize: 58, fontWeight: '700' },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 60,
    backgroundColor: '#E23E28',
    borderRadius: 50,
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  settingButton: {
    color: '#666',
    fontSize: 16,
    marginTop: 20,
    borderRadius: Spacing.four,
  },
  stepContainer: {
    alignSelf: 'stretch',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1
  },
  settingContainer: {
    width: '100%',
    gap: 24,
    padding: 24,
    borderRadius: Spacing.four,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 15,
  },
  labelInput: {
    textAlign: 'left'
  }
});