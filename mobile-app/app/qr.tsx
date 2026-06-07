import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../src/theme/colors';

export default function QRScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.qrBox}>
        <Text style={styles.qrPattern}>▓░▓░▓{'\n'}░▓░▓░{'\n'}▓░▓░▓</Text>
      </View>
      <Text style={styles.title}>QR Payment</Text>
      <Text style={styles.sub}>Scan to pay — UI simulation</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: 24 },
  qrBox: { width: 200, height: 200, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.primary },
  qrPattern: { fontSize: 24, lineHeight: 32, color: colors.primary },
  title: { fontSize: 22, fontWeight: 'bold', marginTop: 24, color: colors.primary },
  sub: { color: colors.muted, marginTop: 8 },
});
