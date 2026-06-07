import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { api } from "../../src/services/api";
import { getUserId } from "../../src/services/auth";

export default function CreditScreen() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const id = await getUserId();

      if (!id) {
        console.log("No userId found in storage");
        return;
      }

      try {
        const res = await api(`/credit/${id}`);
        setData(res);
      } catch (e) {
        console.log("credit error", e);
      }
    };

    load();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Credit Dashboard</Text>

      <View style={styles.cardMain}>
        <Text style={styles.score}>{data?.score ?? 0}</Text>
        <Text style={styles.rating}>{data?.rating ?? "N/A"}</Text>
        <Text style={styles.status}>
          {data?.eligible ? "Loan Eligible ✅" : "Not Eligible ❌"}
        </Text>
      </View>

      <View style={styles.card}>
        <Text>Balance</Text>
        <Text>PKR {data?.balance ?? 0}</Text>
      </View>

      <View style={styles.card}>
        <Text>Total Spent</Text>
        <Text>PKR {data?.totalSpent ?? 0}</Text>
      </View>

      <View style={styles.card}>
        <Text>Transactions</Text>
        <Text>{data?.transactions?.length ?? 0}</Text>
      </View>

      <View style={styles.card}>
        <Text>Loans</Text>
        {data?.loans?.length ? (
          data.loans.map((l: any, i: number) => (
            <Text key={i}>{l.amount} - {l.status}</Text>
          ))
        ) : (
          <Text>No loan found</Text>
        )}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f8fafc" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 15 },

  cardMain: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 10,
  },

  score: { fontSize: 40, fontWeight: "bold", color: "#2563eb" },
  rating: { fontSize: 16 },
  status: { marginTop: 5 },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
});