import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Web: localhost works (same machine as backend).
 * Expo Go / physical device: must use your PC's LAN IP, not localhost.
 * Android emulator: 10.0.2.2 maps to host machine.
 */
export function getApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, '');

  if (Platform.OS === 'web') {
    return 'http://localhost:5000/api';
  }

  // Expo Go: hostUri is like "192.168.1.10:8081" — same IP as your dev PC
  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants.expoGoConfig as { debuggerHost?: string } | undefined)?.debuggerHost;

  if (hostUri) {
    const host = hostUri.split(':')[0];
    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      return `http://${host}:5000/api`;
    }
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }

  return 'http://localhost:5000/api';
}

export const API_BASE_URL = getApiBaseUrl();
