import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { api } from "../../src/services/api";
import { colors } from "../../src/theme/colors";

interface Dashboard {
  balance: number;
  accountNumber: string;
  recentTransactions: {
    amount: number;
    type: string;
    description: string;
    createdAt: string;
  }[];
  spendingAnalytics: { _id: string; total: number }[];
}

export default function HomeScreen() {
  const router = useRouter();
  const [data, setData] = useState<Dashboard | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const res = await api<{ data: Dashboard }>("/user/dashboard");
      setData(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <LinearGradient colors={[...colors.gradient]} style={styles.header}>
        <Text style={styles.greeting}>Welcome back</Text>
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <Text style={styles.balance}>
          PKR {data?.balance?.toLocaleString("en-PK") ?? "---"}
        </Text>
        <Text style={styles.account}>{data?.accountNumber}</Text>
      </LinearGradient>

      <View style={styles.quickActions}>
        {[
          { label: "Transfer", route: "/(tabs)/transfer" },
          { label: "Pay Bills", route: "/bills" },
          { label: "QR Pay", route: "/qr" },
          { label: "Statements", route: "/statements" },
        ].map((a) => (
          <TouchableOpacity
            key={a.label}
            style={styles.actionBtn}
            onPress={() => router.push(a.route as never)}
          >
            <Text style={styles.actionText}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Loan Management</Text>

        <TouchableOpacity
          style={styles.loanCard}
          onPress={() => router.push("/loan-management" as never)}
        >
          <Text style={styles.loanTitle}>🏦 Apply for a Loan</Text>
          <Text style={styles.loanText}>
            Apply for personal loans, track applications and monitor repayments.
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Savings Overview</Text>
        <View style={styles.savingsCard}>
          <Text style={styles.savingsAmount}>
            PKR {data?.balance?.toLocaleString() ?? 0}
          </Text>
          <Text style={styles.savingsSub}>Monthly goal: PKR 100,000</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {data?.recentTransactions?.length ? (
          data.recentTransactions.slice(0, 5).map((t, i) => (
            <View key={i} style={styles.txnRow}>
              <View>
                <Text style={styles.txnDesc}>{t.description || t.type}</Text>
                <Text style={styles.txnDate}>
                  {new Date(t.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <Text style={styles.txnAmount}>
                PKR {t.amount?.toLocaleString()}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.empty}>No transactions yet</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loanCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  loanTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
  },

  loanText: {
    marginTop: 8,
    color: colors.muted,
  },
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    padding: 24,
    paddingTop: 56,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  greeting: { color: "#bae6fd", fontSize: 14 },
  balanceLabel: { color: "#e0f2fe", marginTop: 8 },
  balance: { color: "#fff", fontSize: 36, fontWeight: "bold", marginTop: 4 },
  account: { color: "#7dd3fc", fontSize: 12, marginTop: 8 },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 10,
    marginTop: -20,
  },
  actionBtn: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  actionText: { color: colors.primary, fontWeight: "600" },
  section: { padding: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 12,
  },
  savingsCard: { backgroundColor: "#fff", padding: 20, borderRadius: 16 },
  savingsAmount: { fontSize: 22, fontWeight: "bold", color: colors.primary },
  savingsSub: { color: colors.muted, marginTop: 4 },
  txnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  txnDesc: { fontWeight: "600", color: colors.text },
  txnDate: { color: colors.muted, fontSize: 12, marginTop: 2 },
  txnAmount: { fontWeight: "700", color: colors.primary },
  empty: { color: colors.muted, textAlign: "center", padding: 24 },
});
