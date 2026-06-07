import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { api } from '../../src/services/api';

interface Card {
  _id: string;
  cardNumber: string;
  cardHolderName: string;
  status: string;
  spendingLimit: number;
  color: string;
}

export default function CardsScreen() {
  const [cards, setCards] = useState<Card[]>([]);

  const load = () => {
    api<{ data: Card[] }>('/user/cards').then((r) => setCards(r.data)).catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const toggleFreeze = async (id: string, current: string) => {
    const status = current === 'active' ? 'frozen' : 'active';
    await api(`/user/cards/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
    load();
    Alert.alert('Card Updated', status === 'frozen' ? 'Card frozen' : 'Card activated');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Card Management</Text>
      {cards.map((c) => (
        <LinearGradient
          key={c._id}
          colors={[c.color || '#1a365d', '#0369a1']}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.chip}>DEBIT</Text>
          <Text style={styles.number}>{c.cardNumber}</Text>
          <Text style={styles.holder}>{c.cardHolderName}</Text>
          <Text style={styles.limit}>Limit: PKR {c.spendingLimit.toLocaleString()}</Text>
          <Text style={styles.statusBadge}>{c.status.toUpperCase()}</Text>
          <TouchableOpacity style={styles.freezeBtn} onPress={() => toggleFreeze(c._id, c.status)}>
            <Text style={styles.freezeText}>
              {c.status === 'active' ? 'Freeze Card' : 'Unfreeze Card'}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      ))}
      {!cards.length && <Text style={styles.empty}>No cards linked</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16, paddingTop: 56 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0c4a6e', marginBottom: 20 },
  card: { borderRadius: 20, padding: 24, marginBottom: 20, minHeight: 200 },
  chip: { color: '#f59e0b', fontWeight: '700', fontSize: 12 },
  number: { color: '#fff', fontSize: 22, letterSpacing: 2, marginTop: 24 },
  holder: { color: '#e0f2fe', marginTop: 16, fontSize: 14 },
  limit: { color: '#bae6fd', fontSize: 12, marginTop: 8 },
  statusBadge: { color: '#fff', position: 'absolute', top: 20, right: 20, fontSize: 11 },
  freezeBtn: { marginTop: 20, backgroundColor: 'rgba(255,255,255,0.2)', padding: 12, borderRadius: 10, alignItems: 'center' },
  freezeText: { color: '#fff', fontWeight: '600' },
  empty: { textAlign: 'center', color: '#64748b' },
});
