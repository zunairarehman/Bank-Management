import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { api } from "../../src/services/api";
import { colors } from "../../src/theme/colors";

interface Beneficiary {
  _id: string;
  nickname: string;
  accountNumber: string;
  accountHolderName: string;
}

export default function TransferScreen() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  useEffect(() => {
    api<{ data: Beneficiary[] }>("/user/beneficiaries")
      .then((r) => setBeneficiaries(r.data))
      .catch(() => {});
  }, []);

  const transfer = async () => {
    console.log("TRANSFER FUNCTION STARTED");

    try {
      const res = await api<{
        data: {
          newBalance: number;
          receipt: any;
        };
      }>("/user/transfer", {
        method: "POST",
        body: JSON.stringify({
          toAccountNumber: toAccount,
          amount: Number(amount),
          description,
        }),
      });

      console.log("TRANSFER RESPONSE:", res);

      setSuccessMessage(
        `PKR ${Number(amount).toLocaleString()} transferred successfully. Remaining balance: PKR ${res.data.newBalance.toLocaleString()}`,
      );

      setAmount("");
      setDescription("");
      setToAccount("");
    } catch (e) {
      console.log("TRANSFER ERROR:", e);

      setSuccessMessage("");
      Alert.alert(
        "Transfer Failed",
        e instanceof Error ? e.message : "Transfer failed",
      );
    }
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Transfer Money</Text>
      <View style={styles.card}>
        <Text style={styles.label}>To Account Number</Text>
        <TextInput
          style={styles.input}
          value={toAccount}
          onChangeText={setToAccount}
          placeholder="BAH..."
        />
        <Text style={styles.label}>Amount (PKR)</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
        />
        {successMessage ? (
          <View
            style={{
              backgroundColor: "#dcfce7",
              borderColor: "#22c55e",
              borderWidth: 1,
              borderRadius: 12,
              padding: 14,
              marginBottom: 15,
            }}
          >
            <Text
              style={{
                color: "#166534",
                fontWeight: "600",
              }}
            >
              ✓ {successMessage}
            </Text>
          </View>
        ) : null}
        <TouchableOpacity style={styles.btn} onPress={transfer}>
          <Text style={styles.btnText}>Confirm Transfer</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Beneficiaries</Text>
      {beneficiaries.map((b) => (
        <TouchableOpacity
          key={b._id}
          style={styles.benRow}
          onPress={() => setToAccount(b.accountNumber)}
        >
          <Text style={styles.benName}>{b.nickname}</Text>
          <Text style={styles.benAcc}>{b.accountNumber}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 16,
    paddingTop: 56,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  label: { fontSize: 13, color: colors.muted, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "700" },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  benRow: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  benName: { fontWeight: "600" },
  benAcc: { color: colors.muted, fontSize: 12, marginTop: 4 },
});
