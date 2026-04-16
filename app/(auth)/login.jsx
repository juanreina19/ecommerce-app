import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/auth/context/AuthContext";
import { login } from "../../src/auth/services/authService";
import Input  from "../../src/shared/components/Input";
import Button from "../../src/shared/components/Button";

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState({});

  const validate = () => {
    const e = {};
    if (!email.trim())                     e.email    = "El correo es requerido";
    if (!/\S+@\S+\.\S+/.test(email))       e.email    = "Correo inválido";
    if (!password.trim())                  e.password = "La contraseña es requerida";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const data  = await login(email.trim().toLowerCase(), password);
      const token = data?.token;
      const user  = { email: data?.email, role: data?.role, userId: data?.userId };
      await signIn(token, user);
    } catch (e) {
      Alert.alert("Error al iniciar sesión", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 pt-16 pb-8">

            <View className="mb-12">
              <View className="w-14 h-14 rounded-2xl bg-primary-600 items-center justify-center mb-6">
                <Text className="text-white text-2xl">🛒</Text>
              </View>
              <Text className="text-white text-3xl font-bold mb-2">Bienvenido</Text>
              <Text className="text-gray-400 text-base">Inicia sesión para continuar</Text>
            </View>

            <View className="flex-1">
              <Input
                label="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                placeholder="tu@correo.com"
                keyboardType="email-address"
                error={errors.email}
              />
              <Input
                label="Contraseña"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry
                error={errors.password}
              />

              <Button
                label="Iniciar sesión"
                onPress={handleLogin}
                loading={loading}
                className="mt-2"
              />

              <View className="flex-row justify-center mt-8">
                <Text className="text-gray-400 text-sm">¿No tienes cuenta? </Text>
                <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
                  <Text className="text-primary-400 text-sm font-medium">Regístrate</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
