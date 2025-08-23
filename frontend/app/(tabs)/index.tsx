import { StyleSheet, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Bienvenido a nuestra App</ThemedText>
      <ThemedText style={styles.subtitle}>Tu biblioteca de música personalizada</ThemedText>

      <Pressable style={styles.button} onPress={() => router.push('../CancionScreen')}>
        <Text style={styles.buttonText}>Ir a la lista de música</Text>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#171b31ff',
  },
  title:{
    fontSize: 40,
    marginVertical: 20,
  },
  subtitle:{
    fontSize: 20,
    marginVertical: 20,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#1DB954',
    paddingVertical: 25,
    paddingHorizontal: 25,
    borderRadius: 18,
  },
  buttonText: {
    color: '#000000ff',
    fontSize: 20,
    fontWeight: '600',
    paddingHorizontal: 20,
  },
});

