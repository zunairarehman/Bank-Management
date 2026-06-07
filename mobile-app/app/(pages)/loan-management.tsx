import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { colors } from "../../src/theme/colors";
import { useRouter } from "expo-router";

export default function LoanManagement() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Loan Management</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/loan-application")}
      >
        <Text style={styles.cardTitle}>Apply for Loan</Text>
        <Text style={styles.cardText}>Submit a new loan application</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/my-applications")}
      >
        <Text style={styles.cardTitle}>My Applications</Text>
        <Text style={styles.cardText}>
          View pending, approved or rejected applications
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/active-loans")}
      >
        <Text style={styles.cardTitle}>Active Loans</Text>

        <Text style={styles.cardText}>View approved loans and EMI details</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/repayment-schedule")}
      >
        <Text style={styles.cardTitle}>Repayment Schedule</Text>
        <Text style={styles.cardText}>
          Track installments and remaining balance
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/notifications")}
      >
        <Text style={styles.cardTitle}>Notifications</Text>

        <Text style={styles.cardText}>
          View transaction alerts and reminders
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.primary,
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
  },

  cardText: {
    marginTop: 6,
    color: colors.muted,
  },
});
