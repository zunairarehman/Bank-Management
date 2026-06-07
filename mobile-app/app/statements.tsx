import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { colors } from '../src/theme/colors';

export default function StatementsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Statement</Text>
      <Text style={styles.sub}>Download PDF statement — UI simulation</Text>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => Alert.alert('PDF Generated', 'Statement PDF ready for download (demo)')}
      >
        <Text style={styles.btnText}>Download PDF Statement</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 24, paddingTop: 80 },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.primary },
  sub: { color: colors.muted, marginTop: 8, marginBottom: 24 },
  btn: { backgroundColor: colors.primary, borderRadius: 12, padding: 16, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
});
