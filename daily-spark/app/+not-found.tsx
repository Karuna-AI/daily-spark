import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../src/constants/colors';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.icon}>⚡</Text>
        <Text style={styles.title}>This page doesn't exist.</Text>
        <Link href="/(app)" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    gap: 16,
  },
  icon: { fontSize: 64 },
  title: { color: Colors.textPrimary, fontSize: 20, fontWeight: '700' },
  link: { marginTop: 8 },
  linkText: { color: Colors.spark, fontSize: 16, fontWeight: '600' },
});
