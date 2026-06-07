import { getItemAsync } from './storage';
import { API_BASE_URL } from './apiConfig';

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getItemAsync('userToken');
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      `Network request failed. API: ${API_BASE_URL}. On Expo Go, set EXPO_PUBLIC_API_URL in mobile-app/.env to http://YOUR_PC_IP:5000/api and restart Expo.`
    );
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}
