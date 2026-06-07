import { useRouter } from "expo-router";
import { colors } from "../../src/theme/colors";import { StyleSheet } from "react-native";
import { api } from "../../src/services/api";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
} from "react-native";

import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function BudgetScreen() {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<any>(null);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");

  const [showModal, setShowModal] = useState(false);

  const userId = "USER_ID"; // replace with auth later

  // ================= LOAD =================
  const loadBudgets = async () => {
    try {
      const res = await api("/budget");

      console.log("BUDGET API RESPONSE:", res);

      const list = Array.isArray(res) ? res : res?.data || [];
      setBudgets(list);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  // ================= CREATE =================
  const createBudget = async () => {
    try {
      await api("/budget/create", {
        method: "POST",
        body: JSON.stringify({
          userId,
          category,
          limit: Number(limit),
        }),
      });

      setCategory("");
      setLimit("");
      loadBudgets();

      Alert.alert("Success", "Budget Created");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  // ================= ADD EXPENSE =================
  const addExpense = async () => {
    try {
      await api("/budget/expense", {
        method: "POST",
        body: JSON.stringify({
          userId,
          budgetId: selectedBudget?._id,
          amount: Number(amount),
        }),
      });

      setAmount("");
      setShowModal(false);
      loadBudgets();

      Alert.alert("Success", "Expense Added");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  // ================= CALCULATIONS =================
  const totalBudget = budgets.reduce((s, b) => s + (b.limit || 0), 0);
  const totalSpent = budgets.reduce((s, b) => s + (b.spent || 0), 0);
  const remaining = totalBudget - totalSpent;

  // ================= PIE DATA =================
  const pieData = budgets.map((b, i) => ({
    name: b.category,
    population: b.spent || 0,
    color: ["#0c4a6e", "#0369a1", "#f59e0b", "#10b981"][i % 4],
    legendFontColor: "#333",
    legendFontSize: 12,
  }));

  const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.primary,
    marginTop: 40,
  },

  subTitle: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 20,
  },

  section: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 15,
    elevation: 1,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    color: colors.text,
  },

  primaryBtn: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 12,
    marginTop: 5,
  },

  secondaryBtn: {
    backgroundColor: colors.secondary,
    padding: 14,
    borderRadius: 12,
    marginTop: 5,
  },

  primaryBtnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },

  card: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 15,
    elevation: 2,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  value: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },

  budgetCard: {
    backgroundColor: colors.card,
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
  },

  cat: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },

  bar: {
    height: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 10,
  },

  fill: {
    height: "100%",
    backgroundColor: colors.primary,
  },

  expenseBtn: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 10,
    marginTop: 8,
  },

  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  box: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  btn: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 12,
    marginTop: 5,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});

  return (
    <ScrollView style={styles.container}>

      {/* HEADER */}
      <Text style={styles.title}>📊 Budget Analytics</Text>

      {/* CARDS */}
      <View style={styles.row}>
        <View style={styles.card}>
          <Text>Total</Text>
          <Text style={styles.value}>{totalBudget}</Text>
        </View>

        <View style={styles.card}>
          <Text>Spent</Text>
          <Text style={[styles.value, { color: "red" }]}>{totalSpent}</Text>
        </View>

        <View style={styles.card}>
          <Text>Left</Text>
          <Text style={[styles.value, { color: "green" }]}>{remaining}</Text>
        </View>
      </View>

      {/* PIE CHART */}
      <Text style={styles.subTitle}>Spending Breakdown</Text>

      <PieChart
        data={pieData}
        width={screenWidth - 30}
        height={200}
        chartConfig={{
          color: () => `#000`,
        }}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"10"}
      />

      {/* CREATE BUDGET */}
<View style={styles.box}>
  <Text style={styles.subTitle}>Create Budget</Text>

  <TextInput
    placeholder="Category"
    value={category}
    onChangeText={setCategory}
    style={styles.input}
  />

  <TextInput
    placeholder="Limit"
    value={limit}
    onChangeText={setLimit}
    keyboardType="numeric"
    style={styles.input}
  />

  <TouchableOpacity style={styles.btn} onPress={createBudget}>
    <Text style={styles.btnText}>Create Budget</Text>
  </TouchableOpacity>
</View>

      {/* BUDGET LIST */}
      {budgets.map((b) => {
        const percent = ((b.spent || 0) / (b.limit || 1)) * 100;

        return (
          <View key={b._id} style={styles.budgetCard}>
            <Text style={styles.cat}>{b.category}</Text>

            <Text>
              {b.spent || 0} / {b.limit} ({percent.toFixed(0)}%)
            </Text>

            <View style={styles.bar}>
              <View style={[styles.fill, { width: `${percent}%` }]} />
            </View>

            <TouchableOpacity
              style={styles.expenseBtn}
              onPress={() => {
                setSelectedBudget(b);
                setShowModal(true);
              }}
            >
              <Text style={{ color: "#fff" }}>Add Expense</Text>
            </TouchableOpacity>
          </View>
        );
      })}

      {/* MODAL */}
      <Modal visible={showModal} transparent>
        <View style={styles.modal}>
          <View style={styles.modalBox}>
            <Text style={{ fontSize: 18, fontWeight: "700" }}>
              Add Expense
            </Text>

            <TextInput
              placeholder="Amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              style={styles.input}
            />

            <TouchableOpacity style={styles.btn} onPress={addExpense}>
              <Text style={styles.btnText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={{ textAlign: "center", marginTop: 10 }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}
