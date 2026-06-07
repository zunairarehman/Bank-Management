import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "userId";

export const saveUserId = async (id: string) => {
  await AsyncStorage.setItem(USER_KEY, id);
};

export const getUserId = async () => {
  return await AsyncStorage.getItem(USER_KEY);
};

export const clearUserId = async () => {
  await AsyncStorage.removeItem(USER_KEY);
};