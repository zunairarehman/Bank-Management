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

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const res: any = await api("/notifications");
      setNotifications(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api(`/notifications/${id}/read`, {
        method: "PUT",
      });

      loadNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Notifications</Text>

      {notifications.length === 0 ? (
        <Text style={styles.empty}>No notifications found</Text>
      ) : (
        notifications.map((item) => (
          <TouchableOpacity
            key={item._id}
            style={[styles.card, !item.isRead && styles.unreadCard]}
            onPress={() => markAsRead(item._id)}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>

            <Text style={styles.message}>{item.message}</Text>

            <Text style={styles.type}>{item.type.toUpperCase()}</Text>

            <Text style={styles.date}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </TouchableOpacity>
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

  unreadCard: {
    borderLeftWidth: 5,
    borderLeftColor: "#2563eb",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },

  message: {
    marginBottom: 8,
  },

  type: {
    fontWeight: "bold",
    color: colors.primary,
  },

  date: {
    marginTop: 8,
    fontSize: 12,
    color: colors.muted,
  },

  empty: {
    textAlign: "center",
    marginTop: 50,
    color: colors.muted,
  },
});
