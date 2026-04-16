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
import { register } from "../../src/auth/services/authService";
import { useAuth } from "../../src/auth/context/AuthContext";
import Input  from "../../src/shared/components/Input";
import Button from "../../src/shared/components/Button";

export default function RegisterScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [form, setForm] = useState({
    firstName:            "",
    lastName:             "",
    email:                "",
    phoneNumber:          "",
    identificationNumber: "",
    password:             "",
    confirmPassword:      "",
  });
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.firstName.trim())            e.firstName            = "Nombre requerido";
    if (!form.lastName.trim())             e.lastName             = "Apellido requerido";
    if (!form.email.trim())                e.email                = "Correo requerido";
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email                = "Correo inválido";
    if (!form.identificationNumber.trim()) e.identificationNumber = "Número de identificación requerido";
    if (!form.password)                    e.password             = "Contraseña requerida";
    if (form.password.length < 6)          e.password             = "Mínimo 6 caracteres";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Las contraseñas no coinciden";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await register({
        firstName:            form.firstName.trim(),
        lastName:             form.lastName.trim(),
        email:                form.email.trim().toLowerCase(),
        password:             form.password,
        identificationNumber: form.identificationNumber.trim(),
        role:                 "BUYER",
      });
      const token = data?.token;
      const user  = { email: data?.email, role: data?.role, userId: data?.userId };
      if (token) {
        await signIn(token, user);
      } else {
        Alert.alert("Registro exitoso", "Ahora puedes iniciar sesión.");
        router.replace("/(auth)/login");
      }
    } catch (e) {
      Alert.alert("Error al registrarse", e.message);
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
          <View className="px-6 pt-12 pb-8">

            <TouchableOpacity onPress={() => router.back()} className="mb-8">
              <Text className="text-primary-400 text-sm">← Volver</Text>
            </TouchableOpacity>

            <Text className="text-white text-3xl font-bold mb-2">Crear cuenta</Text>
            <Text className="text-gray-400 text-base mb-10">
              Completa tus datos para registrarte
            </Text>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Input
                  label="Nombre"
                  value={form.firstName}
                  onChangeText={set("firstName")}
                  placeholder="Juan"
                  autoCapitalize="words"
                  error={errors.firstName}
                />
              </View>
              <View className="flex-1">
                <Input
                  label="Apellido"
                  value={form.lastName}
                  onChangeText={set("lastName")}
                  placeholder="Pérez"
                  autoCapitalize="words"
                  error={errors.lastName}
                />
              </View>
            </View>

            <Input
              label="Correo electrónico"
              value={form.email}
              onChangeText={set("email")}
              placeholder="tu@correo.com"
              keyboardType="email-address"
              error={errors.email}
            />

            <Input
              label="Número de identificación"
              value={form.identificationNumber}
              onChangeText={set("identificationNumber")}
              placeholder="Ej: 1023456789"
              keyboardType="number-pad"
              error={errors.identificationNumber}
            />

            <Input
              label="Teléfono (opcional)"
              value={form.phoneNumber}
              onChangeText={set("phoneNumber")}
              placeholder="+57 300 000 0000"
              keyboardType="phone-pad"
            />

            <Input
              label="Contraseña"
              value={form.password}
              onChangeText={set("password")}
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
              error={errors.password}
            />

            <Input
              label="Confirmar contraseña"
              value={form.confirmPassword}
              onChangeText={set("confirmPassword")}
              placeholder="Repite tu contraseña"
              secureTextEntry
              error={errors.confirmPassword}
            />

            <Button
              label="Crear cuenta"
              onPress={handleRegister}
              loading={loading}
              className="mt-2"
            />

            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-400 text-sm">¿Ya tienes cuenta? </Text>
              <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
                <Text className="text-primary-400 text-sm font-medium">
                  Inicia sesión
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
