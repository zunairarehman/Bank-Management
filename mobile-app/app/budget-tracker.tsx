import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";

import { colors } from "../src/theme/colors";
import { budgetApi } from "../src/services/budgetApi";
import { getUserId } from "../src/services/auth";

export default function BudgetTrackerScreen() {
  const [userId, setUserId] = useState("");

  const [budget, setBudget] = useState(100000);
  const [spent, setSpent] = useState(0);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [note, setNote] = useState("");

  const [history, setHistory] = useState<any[]>([]);

  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);

  const [newBudget, setNewBudget] = useState("");

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const id = await getUserId();

    if (!id) return;

    setUserId(id);
    loadSummary(id);
  };

  const loadSummary = async (id: string) => {
    try {
      const res: any = await budgetApi.getSummary(id);

      setBudget(res.monthlyLimit || 100000);
      setSpent(res.spent || 0);
    } catch (err) {
      console.log(err);
    }
  };

  const handleExpense = async () => {
    try {
      await budgetApi.addExpense({
        userId,
        amount: Number(amount),
        category,
        note,
      });

      Alert.alert("Success", "Expense Added");

      setAmount("");
      setNote("");

      setShowExpenseModal(false);

      loadSummary(userId);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const handleBudget = async () => {
    try {
      await budgetApi.updateBudget({
        userId,
        monthlyLimit: Number(newBudget),
      });

      setBudget(Number(newBudget));

      setShowBudgetModal(false);

      Alert.alert("Success", "Budget Updated");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const loadHistory = async () => {
    try {
      const res: any = await budgetApi.getHistory(userId);

      setHistory(res);
      setShowHistoryModal(true);
    } catch (err) {}
  };
}
