import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { api } from "../../src/services/api";
import { colors } from "../../src/theme/colors";

export default function ActiveLoansScreen() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLoans = async () => {
    try {
      const res: any = await api("/loans/active-loans");
      setLoans(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLoans();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Active Loans</Text>

      {loans.length === 0 ? (
        <Text style={styles.empty}>No active loans found</Text>
      ) : (
        loans.map((loan) => (
          <View key={loan._id} style={styles.card}>
            <Text style={styles.amount}>
              PKR {loan.amount.toLocaleString()}
            </Text>

            <Text style={styles.text}>
              EMI: PKR {loan.emi.toLocaleString()}
            </Text>

            <Text style={styles.text}>Interest Rate: {loan.interestRate}%</Text>

            <Text style={styles.text}>
              Remaining Balance: PKR {loan.remainingBalance.toLocaleString()}
            </Text>

            <Text style={styles.status}>ACTIVE</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 16,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
  },

  amount: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
  },

  text: {
    marginBottom: 6,
    color: colors.text,
  },

  status: {
    marginTop: 10,
    color: colors.success,
    fontWeight: "bold",
  },

  empty: {
    textAlign: "center",
    marginTop: 50,
    color: colors.muted,
  },
});
