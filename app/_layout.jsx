import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "../src/auth/context/AuthContext";
import LoadingSpinner from "../src/shared/components/LoadingSpinner";
import "../global.css";

function NavigationGuard({ children }) {
  const { isLoggedIn, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inAppGroup  = segments[0] === "(app)";

    if (!isLoggedIn && !inAuthGroup) {
      // No autenticado y no está en auth → ir a login
      router.replace("/(auth)/login");
    } else if (isLoggedIn && inAuthGroup) {
      // Autenticado y está en auth → ir a productos
      router.replace("/(app)/products");
    }
  }, [isLoggedIn, isLoading, segments]);

  if (isLoading) return <LoadingSpinner />;

  return children;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <NavigationGuard>
        <Stack
          screenOptions={{
            headerShown:  false,
            contentStyle: { backgroundColor: "#0F0F14" },
            animation:    "slide_from_right",
          }}
        >
          <Stack.Screen name="index"      options={{ headerShown: false }} />
          <Stack.Screen name="(auth)"     options={{ headerShown: false }} />
          <Stack.Screen name="(app)"      options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        </Stack>
      </NavigationGuard>
    </AuthProvider>
  );
}
