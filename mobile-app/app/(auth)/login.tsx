import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, Link } from 'expo-router';
import { setItemAsync } from '../../src/services/storage';
import { useDispatch } from 'react-redux';
import { api } from '../../src/services/api';
import { API_BASE_URL } from '../../src/services/apiConfig';
import { setUser } from '../../src/redux/authSlice';
import { colors } from '../../src/theme/colors';

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('shayan@email.com');
  const [password, setPassword] = useState('user123');
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    try {
      const res = await api<{
        data: { token: string; user: { id: string; fullName: string; email: string } };
      }>('/auth/user/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      await setItemAsync('userToken', res.data.token);
      dispatch(setUser(res.data.user));
      router.replace('/(tabs)/home');
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[...colors.gradient]} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.inner}>
        <Text style={styles.logo}>Bank AL Habib</Text>
        <Text style={styles.subtitle}>Mobile Banking</Text>
        {__DEV__ && Platform.OS !== 'web' && (
          <Text style={styles.apiHint} numberOfLines={2}>
            API: {API_BASE_URL}
          </Text>
        )}
        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
          <Text style={styles.label}>Password</Text>
          <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
          <TouchableOpacity style={styles.btn} onPress={login} disabled={loading}>
            <Text style={styles.btnText}>{loading ? 'Signing in...' : 'Login'}</Text>
          </TouchableOpacity>
          <Link href="/(auth)/signup" asChild>
            <TouchableOpacity style={styles.linkBtn}>
              <Text style={styles.link}>Create Account</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/(auth)/forgot-password" asChild>
            <TouchableOpacity>
              <Text style={styles.forgot}>Forgot Password?</Text>
            </TouchableOpacity>
          </Link>
          <TouchableOpacity style={styles.bioBtn}>
            <Text style={styles.bioText}>🔐 Biometric Login (Simulated)</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, ...(Platform.OS === 'web' ? { minHeight: '100%' as const } : {}) },
  inner: { flex: 1, justifyContent: 'center', padding: 24, width: '100%', maxWidth: 480, alignSelf: 'center' },
  logo: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  subtitle: { color: '#bae6fd', textAlign: 'center', marginBottom: 8 },
  apiHint: { color: '#7dd3fc', textAlign: 'center', fontSize: 10, marginBottom: 16, paddingHorizontal: 8 },
  card: { backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 24, padding: 24 },
  label: { fontSize: 13, color: colors.muted, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 14, marginBottom: 16 },
  btn: { backgroundColor: colors.primary, borderRadius: 12, padding: 16, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  linkBtn: { marginTop: 16, alignItems: 'center' },
  link: { color: colors.secondary, fontWeight: '600' },
  forgot: { color: colors.muted, textAlign: 'center', marginTop: 12 },
  bioBtn: { marginTop: 20, padding: 12, backgroundColor: '#f1f5f9', borderRadius: 12, alignItems: 'center' },
  bioText: { color: colors.primary, fontWeight: '600' },
});
