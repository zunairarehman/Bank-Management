import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { deleteItemAsync } from '../../src/services/storage';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../src/redux/authSlice';
import { RootState } from '../../src/redux/store';
import { colors } from '../../src/theme/colors';

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((s: RootState) => s.auth.user);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = async () => {
    await deleteItemAsync('userToken');
    dispatch(logout());
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{user?.fullName?.[0] || 'U'}</Text>
      </View>
      <Text style={styles.name}>{user?.fullName || 'User'}</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <View style={styles.menu}>
        <View style={styles.menuRow}>
          <Text>Dark Mode</Text>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>
        <View style={styles.menuRow}>
          <Text>Language</Text>
          <Text style={styles.menuValue}>English / Urdu</Text>
        </View>
        <TouchableOpacity style={styles.menuRow} onPress={() => Alert.alert('Security', 'Change password in settings')}>
          <Text>Security Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuRow} onPress={() => Alert.alert('Notifications', 'Preferences saved')}>
          <Text>Notifications</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 24, paddingTop: 56 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  name: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginTop: 16, color: colors.text },
  email: { textAlign: 'center', color: colors.muted, marginBottom: 24 },
  menu: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' },
  menuRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  menuValue: { color: colors.muted },
  logoutBtn: { marginTop: 32, backgroundColor: '#fee2e2', padding: 16, borderRadius: 12, alignItems: 'center' },
  logoutText: { color: '#dc2626', fontWeight: '700' },
});
