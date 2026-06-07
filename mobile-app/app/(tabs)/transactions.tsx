import { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet } from 'react-native';
import { api } from '../../src/services/api';
import { colors } from '../../src/theme/colors';

interface Transaction {
  _id: string;
  amount: number;
  type: string;
  status: string;
  description: string;
  reference: string;
  createdAt: string;
}

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const q = search ? `?search=${search}` : '';
    api<{ data: { transactions: Transaction[] } }>(`/user/transactions${q}`)
      .then((r) => setTransactions(r.data.transactions))
      .catch(() => {});
  }, [search]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction History</Text>
      <TextInput
        style={styles.search}
        placeholder="Search by reference..."
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={transactions}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.desc}>{item.description || item.type}</Text>
              <Text style={styles.ref}>{item.reference}</Text>
              <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.amount}>PKR {item.amount.toLocaleString()}</Text>
              <Text style={[styles.status, item.status === 'completed' && styles.completed]}>
                {item.status}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No transactions found</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingTop: 56 },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.primary, paddingHorizontal: 16 },
  search: { margin: 16, backgroundColor: '#fff', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#e2e8f0' },
  row: { flexDirection: 'row', backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 8, padding: 16, borderRadius: 12 },
  desc: { fontWeight: '600' },
  ref: { fontSize: 11, color: colors.muted, fontFamily: 'monospace' },
  date: { fontSize: 11, color: colors.muted, marginTop: 4 },
  amount: { fontWeight: '700', color: colors.primary },
  status: { fontSize: 11, color: colors.muted, marginTop: 4, textTransform: 'capitalize' },
  completed: { color: colors.success },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 40 },
});
