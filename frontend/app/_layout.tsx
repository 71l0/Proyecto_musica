import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="CancionScreen"
        options={{
          headerShown: true,
          title: 'Canciones',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: '#212747',
          },
          headerTintColor: '#fff',
          contentStyle: { backgroundColor: '#212747' },
        }}
      />
      <Stack.Screen
        name="BandasScreen"
        options={{
          headerShown: true,
          title: 'Bandas',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: '#212747',
          },
          headerTintColor: '#fff',
          contentStyle: { backgroundColor: '#212747' },
        }}
      />
    </Stack>
  );
}