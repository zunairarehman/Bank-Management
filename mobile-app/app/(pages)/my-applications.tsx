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

interface LoanApplication {
  _id: string;
  amount: number;
  tenureMonths: number;
  purpose: string;
  emi: number;
  status: string;
  createdAt: string;
}

export default function MyApplicationsScreen() {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const loadApplications = async () => {
    try {
      const res: any = await api("/loans/my-applications");
      setApplications(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return colors.success;
      case "rejected":
        return colors.danger;
      default:
        return colors.accent;
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Loan Applications</Text>

      {applications.length === 0 ? (
        <Text style={styles.empty}>No loan applications found</Text>
      ) : (
        applications.map((app) => (
          <View key={app._id} style={styles.card}>
            <Text style={styles.amount}>PKR {app.amount.toLocaleString()}</Text>

            <Text style={styles.text}>Purpose: {app.purpose}</Text>

            <Text style={styles.text}>Tenure: {app.tenureMonths} Months</Text>

            <Text style={styles.text}>EMI: PKR {app.emi.toLocaleString()}</Text>

            <Text
              style={[styles.status, { color: getStatusColor(app.status) }]}
            >
              {app.status.toUpperCase()}
            </Text>

            <Text style={styles.date}>
              {new Date(app.createdAt).toLocaleDateString()}
            </Text>
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
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
  },

  amount: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 8,
  },

  text: {
    marginBottom: 4,
    color: colors.text,
  },

  status: {
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 15,
  },

  date: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 12,
  },

  empty: {
    textAlign: "center",
    color: colors.muted,
    marginTop: 50,
  },
});
