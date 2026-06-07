import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../src/services/api';
import { colors } from '../src/theme/colors';

export default function BillsScreen() {
  const router = useRouter();
  const [billType, setBillType] = useState<'electricity' | 'gas' | 'internet' | 'mobile'>('electricity');
  const [consumerNumber, setConsumerNumber] = useState('');
  const [provider, setProvider] = useState('');
  const [amount, setAmount] = useState('');

  const pay = async () => {
    try {
      const res = await api<{ data: { newBalance: number } }>('/user/bills/pay', {
        method: 'POST',
        body: JSON.stringify({ billType, consumerNumber, provider, amount: Number(amount) }),
      });
      Alert.alert('Bill Paid', `New balance: PKR ${res.data.newBalance.toLocaleString()}`);
      router.back();
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Payment failed');
    }
  };

  const types = ['electricity', 'gas', 'internet', 'mobile'] as const;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Bill Payments</Text>
      <View style={styles.types}>
        {types.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.typeBtn, billType === t && styles.typeActive]}
            onPress={() => setBillType(t)}
          >
            <Text style={billType === t ? styles.typeTextActive : styles.typeText}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput style={styles.input} placeholder="Consumer Number" value={consumerNumber} onChangeText={setConsumerNumber} />
      <TextInput style={styles.input} placeholder="Provider" value={provider} onChangeText={setProvider} />
      <TextInput style={styles.input} placeholder="Amount" value={amount} onChangeText={setAmount} keyboardType="numeric" />
      <TouchableOpacity style={styles.btn} onPress={pay}>
        <Text style={styles.btnText}>Pay Bill</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16, paddingTop: 56 },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.primary, marginBottom: 16 },
  types: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  typeBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#e2e8f0' },
  typeActive: { backgroundColor: colors.primary },
  typeText: { color: colors.muted, textTransform: 'capitalize' },
  typeTextActive: { color: '#fff', textTransform: 'capitalize' },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  btn: { backgroundColor: colors.primary, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontWeight: '700' },
});
