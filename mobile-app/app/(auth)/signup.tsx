import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { api } from '../../src/services/api';
import { colors } from '../../src/theme/colors';

export default function SignupScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    cnic: '',
  });
  const [userId, setUserId] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'signup' | 'otp'>('signup');

  const signup = async () => {
    try {
      const res = await api<{ data: { userId: string; otp: string } }>('/auth/user/signup', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setUserId(res.data.userId);
      setOtp(res.data.otp);
      setStep('otp');
      Alert.alert('OTP Sent', `Demo OTP: ${res.data.otp}`);
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Signup failed');
    }
  };

  const verify = async () => {
    try {
      const res = await api<{ data: { token: string } }>('/auth/user/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ userId, otp, purpose: 'signup' }),
      });
      const { setItemAsync } = await import('../../src/services/storage');
      await setItemAsync('userToken', res.data.token);
      router.replace('/(tabs)/home');
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Verification failed');
    }
  };

  return (
    <LinearGradient colors={[...colors.gradient]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{step === 'signup' ? 'Create Account' : 'Verify OTP'}</Text>
        <View style={styles.card}>
          {step === 'signup' ? (
            <>
              {(['fullName', 'email', 'phone', 'cnic', 'password'] as const).map((k) => (
                <TextInput
                  key={k}
                  placeholder={k}
                  style={styles.input}
                  secureTextEntry={k === 'password'}
                  value={form[k]}
                  onChangeText={(v) => setForm({ ...form, [k]: v })}
                />
              ))}
              <TouchableOpacity style={styles.btn} onPress={signup}>
                <Text style={styles.btnText}>Sign Up</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput placeholder="Enter OTP" style={styles.input} value={otp} onChangeText={setOtp} />
              <TouchableOpacity style={styles.btn} onPress={verify}>
                <Text style={styles.btnText}>Verify & Activate</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 24, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 24 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 20 },
  input: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 14, marginBottom: 12 },
  btn: { backgroundColor: colors.primary, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontWeight: '700' },
});
