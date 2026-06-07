import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from "react-native";

import { useState, useEffect } from "react";
import { colors } from "../../src/theme/colors";
import { atmApi } from "../../src/services/atmApi";
import { getUser } from "../../src/services/auth";

export default function ATMPage() {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");

  const [tempPin, setTempPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [oldPin, setOldPin] = useState("");

  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinMode, setPinMode] = useState<"create" | "change">("create");

  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [accountId, setAccountId] = useState<string>("");
  const [cardId, setCardId] = useState<string>("");

  // ================= LOAD USER =================
useEffect(() => {
  const loadUser = async () => {
    const u = await getUser();
    console.log("USER FROM STORAGE:", u);
  };

  loadUser();
}, []);

  // ================= WITHDRAW =================
  const handleWithdraw = async () => {
    try {
      setLoading(true);

      await atmApi.withdraw({
        accountId,
        amount: Number(withdrawAmount),
      });
      

      setWithdrawAmount("");
      setShowWithdrawConfirm(false);
console.log("Withdraw clicked", accountId, withdrawAmount);
      Alert.alert("Success", "Withdrawal completed");
    } catch (err) {
      Alert.alert("Error", "Withdraw failed");
    } finally {
      setLoading(false);
    }
    
  };

  // ================= DEPOSIT =================
  const handleDeposit = async () => {
    try {
      setLoading(true);

      await atmApi.deposit({
        accountId,
        amount: Number(depositAmount),
      });
console.log("Deposit clicked", accountId, depositAmount);
      setDepositAmount("");
      Alert.alert("Success", "Deposit completed");
    } catch (err) {
      Alert.alert("Error", "Deposit failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= BLOCK CARD =================
  const handleBlock = async () => {
    try {
      await atmApi.blockCard({ cardId });
      Alert.alert("Card Blocked", "Contact bank to unblock");
    } catch (err) {
      Alert.alert("Error", "Failed to block card");
    }
  };

  // ================= PIN ACTION =================
  const handleSavePin = async () => {
    try {
      if (tempPin !== confirmPin) {
        Alert.alert("Error", "PIN does not match");
        return;
      }

      if (pinMode === "create") {
        await atmApi.generatePin({
          cardId,
          pin: tempPin,
        });
      } else {
        await atmApi.changePin({
          cardId,
          oldPin,
          newPin: tempPin,
        });
      }

      setShowPinModal(false);
      setTempPin("");
      setConfirmPin("");
      setOldPin("");

      Alert.alert("Success", "PIN updated");
    } catch (err) {
      Alert.alert("Error", "PIN operation failed");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <Text style={styles.title}>ATM Operations</Text>
      <Text style={styles.subtitle}>Secure banking control panel</Text>

      {/* CARD */}
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Debit Card</Text>
        <Text style={styles.cardNumber}>**** **** **** 4589</Text>
        <Text style={styles.activeStatus}>● ACTIVE</Text>
      </View>

      {/* PIN */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PIN Management</Text>

        <View style={styles.row}>
          <TouchableOpacity
            style={styles.smallBtn}
            onPress={() => {
              setPinMode("create");
              setShowPinModal(true);
            }}
          >
            <Text style={styles.smallBtnText}>Generate PIN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.smallBtnOutline}
            onPress={() => {
              setPinMode("change");
              setShowPinModal(true);
            }}
          >
            <Text style={styles.smallBtnTextOutline}>Change PIN</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* WITHDRAW */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Withdraw Cash</Text>

        <TextInput
          placeholder="Enter amount"
          value={withdrawAmount}
          onChangeText={setWithdrawAmount}
          keyboardType="numeric"
          style={styles.input}
        />

        <TouchableOpacity          style={styles.primaryBtn}
          onPress={() => setShowWithdrawConfirm(true)}
        >
          <Text style={styles.primaryBtnText}>Withdraw</Text>
        </TouchableOpacity>
      </View> 

      {/* DEPOSIT */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Deposit Cash</Text>

        <TextInput
          placeholder="Enter amount"
          value={depositAmount}
          onChangeText={setDepositAmount}
          keyboardType="numeric"
          style={styles.input}
        />

        <TouchableOpacity style={styles.secondaryBtn} onPress={handleDeposit}>
          <Text style={styles.primaryBtnText}>Deposit</Text>
        </TouchableOpacity>
      </View>

      {/* SECURITY */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>

        <TouchableOpacity style={styles.dangerBtn} onPress={handleBlock}>
          <Text style={styles.primaryBtnText}>Block Card</Text>
        </TouchableOpacity>
      </View>

      {/* ================= WITHDRAW MODAL ================= */}
      <Modal visible={showWithdrawConfirm} transparent animationType="fade">
        <View style={styles.modal}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Confirm Withdrawal</Text>

            <Text>Amount: {withdrawAmount}</Text>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleWithdraw}
            >
              <Text style={styles.primaryBtnText}>
                {loading ? "Processing..." : "Confirm"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowWithdrawConfirm(false)}>
              <Text style={{ textAlign: "center", marginTop: 10 }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================= PIN MODAL ================= */}
      <Modal visible={showPinModal} transparent animationType="fade">
        <View style={styles.modal}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {pinMode === "create" ? "Create PIN" : "Change PIN"}
            </Text>

            {pinMode === "change" && (
              <TextInput
                placeholder="Old PIN"
                secureTextEntry
                value={oldPin}
                onChangeText={setOldPin}
                style={styles.input}
              />
            )}

            <TextInput
              placeholder="New PIN"
              secureTextEntry
              value={tempPin}
              onChangeText={setTempPin}
              style={styles.input}
            />

            <TextInput
              placeholder="Confirm PIN"
              secureTextEntry
              value={confirmPin}
              onChangeText={setConfirmPin}
              style={styles.input}
            />

            <TouchableOpacity style={styles.primaryBtn} onPress={handleSavePin}>
              <Text style={styles.primaryBtnText}>Save PIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

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

  subtitle: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 20,
  },

  cardHeader: {
    backgroundColor: colors.card,
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },

  cardNumber: {
    marginTop: 6,
    fontSize: 18,
    letterSpacing: 2,
    color: colors.muted,
  },

  activeStatus: {
    marginTop: 8,
    color: colors.success,
    fontWeight: "600",
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

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  smallBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 10,
    marginRight: 8,
  },

  smallBtnOutline: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 12,
    borderRadius: 10,
    marginLeft: 8,
  },

  smallBtnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },

  smallBtnTextOutline: {
    color: colors.primary,
    textAlign: "center",
    fontWeight: "600",
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

  dangerBtn: {
    backgroundColor: colors.danger,
    padding: 14,
    borderRadius: 12,
  },

  primaryBtnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
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
});