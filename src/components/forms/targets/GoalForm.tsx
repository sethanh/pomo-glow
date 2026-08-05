import { TextInputField } from '@/components';
import { AppButton } from '@/components/buttons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { getDailyProgress, UpdateTargetGoal } from '@/hooks';
import { getWeeklyGoal, UpdateWeeklyTarget } from '@/hooks/week-storage';
import { Image } from 'expo-image';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FormBase } from 'react-hook-form-base';
import { ActivityIndicator, Alert, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface GoalValue {
  goal: number;
  weekGoal: number;
}


export function GoalForm() {
  const [defaultValue, setDefaultValue] = useState<GoalValue>({
    weekGoal: 40,
    goal: 5
  });
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const loadSettings = async () => {
        setIsLoading(true);
        try {
          const [progress, weeklyGoal] = await Promise.all([
            getDailyProgress(),
            getWeeklyGoal()
          ]);
          setDefaultValue({
            goal: progress.goal,
            weekGoal: weeklyGoal.goal
          })
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


  const saveSettings = async (value: GoalValue) => {
    try {
      await UpdateTargetGoal(value.goal);
      await UpdateWeeklyTarget(value.weekGoal);

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
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          accessible={false}
        >
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

            </ThemedView>

            <ThemedView style={styles.stepContainer}>
              <Image style={styles.image} source={require('@/assets/images/pomo.png')} />
              <ThemedText type="code" style={styles.title}>
                Setting Target
              </ThemedText>
              <FormBase
                onSubmit={saveSettings}
                defaultValues={defaultValue}
              >
                {(_, onHandleSubmit) => {
                  return (<ThemedView style={styles.settingContainer} type="backgroundElement">
                    <TextInputField
                      name='goal'
                      labelTranslateCode='Target Goal for day'
                      placeholder='number'
                      rules={{
                        required: 'Field is required'
                      }}
                    />
                    <TextInputField
                      labelTranslateCode='Target Goal for week'
                      placeholder='number'
                      name='weekGoal'
                      rules={{
                        required: 'Field is required'
                      }}
                    />
                    <AppButton
                      onClick={onHandleSubmit}
                      labelTranslateCode={'Save'}
                      type='primary'
                      style={{ backgroundColor: '#E23E28', borderColor: '#E23E28' }}
                    />
                  </ThemedView>);
                }}
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
  },
  image: {
    width: 76,
    height: 71,
  },
});