import { StyleSheet, Pressable, Text, Image, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';

export default function HomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <LinearGradient colors={['#171b31', '#0d0f1f']} style={styles.container}>
      
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        <Image 
          source={require('@/images/logo.png')} 
          style={{ width: 500, height: 400, marginBottom: -40, marginTop: -100 }} 
          resizeMode="contain"
        />

        <ThemedText type="title" style={styles.title}>Bienvenido</ThemedText>
        <ThemedText style={styles.subtitle}>Tu biblioteca de canciones personalizada</ThemedText>
      
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && { opacity: 0.7 }
          ]}
          onPress={() => router.push('/CancionScreen')}
        >
          <Text style={styles.buttonText}>Ir a la lista de canciones</Text>
        </Pressable>

      </Animated.View>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#171b31ff',
  },
  title:{
    fontSize: 42,
    marginBottom: 20,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle:{
    fontSize: 20,
    marginBottom: 60,
    color: '#bbb',
    textAlign: 'center',
  },
  button: {
    marginTop: 30,
    alignItems: 'center',
    backgroundColor: '#1DB954',
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
    alignSelf: 'stretch',
  },
  buttonText: {
    color: '#000000ff',
    fontSize: 20,
    fontWeight: '600',
    paddingHorizontal: 20,
  },
});

