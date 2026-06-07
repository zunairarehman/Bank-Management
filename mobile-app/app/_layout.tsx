import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from '../src/redux/store';
import { StatusBar } from 'expo-status-bar';

if (Platform.OS !== 'web') {
  require('react-native-gesture-handler');
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }} />
      </Provider>
    </SafeAreaProvider>
  );
}
