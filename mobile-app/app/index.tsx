import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect, type Href } from 'expo-router';
import { getItemAsync } from '../src/services/storage';

export default function Index() {
  const [href, setHref] = useState<Href | null>(null);

  useEffect(() => {
    getItemAsync('userToken')
      .then((token) => setHref(token ? '/(tabs)/home' : '/(auth)/login'))
      .catch(() => setHref('/(auth)/login'));
  }, []);

  if (!href) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#f59e0b" />
      </View>
    );
  }

  return <Redirect href={href} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0c4a6e',
  },
});
