import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { api } from "../../src/services/api";
import { colors } from "../../src/theme/colors";

export default function RepaymentScheduleScreen() {
  const [repayments, setRepayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRepayments = async () => {
    try {
      const res: any = await api("/loans/repayment-schedule");
      setRepayments(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRepayments();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  const markAsPaid = async (id: string) => {
    try {
      await api(`/loans/repayments/${id}/pay`, {
        method: "PUT",
      });

      loadRepayments();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Repayment Schedule</Text>

      {repayments.length === 0 ? (
        <Text style={styles.empty}>No repayments found</Text>
      ) : (
        repayments.map((item) => (
          <View key={item._id} style={styles.card}>
            <Text style={styles.installment}>
              Installment #{item.installmentNo}
            </Text>

            <Text style={styles.purpose}>
              Loan Purpose:{" "}
              {item.loanId?.applicationId?.purpose || "General Loan"}
            </Text>

            <Text style={styles.text}>
              Amount: PKR {item.amount.toLocaleString()}
            </Text>

            <Text style={styles.text}>
              Due Date: {new Date(item.dueDate).toLocaleDateString()}
            </Text>

            <Text
              style={[
                styles.status,
                {
                  color:
                    (item.status || "pending") === "paid"
                      ? colors.success
                      : colors.accent,
                },
              ]}
            >
              {(item.status || "pending").toUpperCase()}
            </Text>
            {item.status !== "paid" && (
              <TouchableOpacity
                style={styles.payButton}
                onPress={() => markAsPaid(item._id)}
              >
                <Text style={styles.payButtonText}>Mark as Paid</Text>
              </TouchableOpacity>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  purpose: {
    marginBottom: 8,
    color: colors.primary,
    fontWeight: "600",
  },

  payButton: {
    backgroundColor: colors.success,
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },

  payButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
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
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
  },

  installment: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 8,
  },

  text: {
    marginBottom: 5,
    color: colors.text,
  },

  status: {
    marginTop: 10,
    fontWeight: "bold",
  },

  empty: {
    textAlign: "center",
    marginTop: 50,
    color: colors.muted,
  },
});
