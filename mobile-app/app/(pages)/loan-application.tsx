import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { api } from "../../src/services/api";
import { colors } from "../../src/theme/colors";
import { useRouter } from "expo-router";

export default function LoanApplicationScreen() {
  const [amount, setAmount] = useState("");
  const [tenureMonths, setTenureMonths] = useState("");
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const calculateEMI = () => {
    const principal = Number(amount);

    if (!principal || !tenureMonths) {
      return 0;
    }

    const annualRate = 12;
    const monthlyRate = annualRate / 12 / 100;
    const months = Number(tenureMonths);

    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    return emi.toFixed(2);
  };

  const submitLoan = async () => {
    try {
      setLoading(true);

      const res = await api("/loans/apply", {
        method: "POST",
        body: JSON.stringify({
          amount: Number(amount),
          tenureMonths: Number(tenureMonths),
          purpose,
        }),
      });

      setSuccessMessage(
        "Loan application submitted successfully and sent for admin review.",
      );
      console.log(res);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Apply for Loan</Text>

      <Text style={styles.label}>Loan Amount (PKR)</Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        placeholder="500000"
      />

      <Text style={styles.label}>Tenure (Months)</Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={tenureMonths}
        onChangeText={setTenureMonths}
        placeholder="24"
      />

      <Text style={styles.label}>Purpose</Text>

      <TextInput
        style={styles.input}
        value={purpose}
        onChangeText={setPurpose}
        placeholder="Car Purchase"
      />

      <View style={styles.emiBox}>
        <Text style={styles.emiTitle}>Estimated EMI</Text>

        <Text style={styles.emiAmount}>PKR {calculateEMI()}</Text>
      </View>
      {successMessage ? (
        <View
          style={{
            backgroundColor: "#dcfce7",
            padding: 15,
            borderRadius: 10,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: "#16a34a",
          }}
        >
          <Text
            style={{
              color: "#166534",
              fontWeight: "bold",
            }}
          >
            ✓ {successMessage}
          </Text>
        </View>
      ) : null}
      <TouchableOpacity
        style={styles.button}
        onPress={submitLoan}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Submitting..." : "Submit Application"}
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
    color: colors.primary,
    marginBottom: 24,
  },

  label: {
    marginBottom: 8,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },

  emiBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginVertical: 20,
  },

  emiTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  emiAmount: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    marginTop: 8,
  },

  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
