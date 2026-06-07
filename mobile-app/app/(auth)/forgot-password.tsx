import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { api } from '../../src/services/api';
import { colors } from '../../src/theme/colors';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);

  const sendOtp = async () => {
    try {
      const res = await api<{ data: { userId: string; otp: string } }>('/auth/user/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setUserId(res.data.userId);
      setOtp(res.data.otp);
      setStep(2);
      Alert.alert('OTP', `Demo OTP: ${res.data.otp}`);
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed');
    }
  };

  const reset = async () => {
    try {
      await api('/auth/user/reset-password', {
        method: 'POST',
        body: JSON.stringify({ userId, otp, newPassword }),
      });
      Alert.alert('Success', 'Password reset. Please login.');
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      {step === 1 ? (
        <>
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
          <TouchableOpacity style={styles.btn} onPress={sendOtp}>
            <Text style={styles.btnText}>Send OTP</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput style={styles.input} placeholder="OTP" value={otp} onChangeText={setOtp} />
          <TextInput style={styles.input} placeholder="New Password" secureTextEntry value={newPassword} onChangeText={setNewPassword} />
          <TouchableOpacity style={styles.btn} onPress={reset}>
            <Text style={styles.btnText}>Reset Password</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 80, backgroundColor: '#f8fafc' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, color: colors.primary },
  input: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 14, marginBottom: 12, backgroundColor: '#fff' },
  btn: { backgroundColor: colors.primary, borderRadius: 12, padding: 16, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
});
