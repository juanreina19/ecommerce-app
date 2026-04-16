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
import { changePassword } from "../../../src/auth/services/authService";
import Input  from "../../../src/shared/components/Input";
import Button from "../../../src/shared/components/Button";

export default function ChangePasswordScreen() {
  const router = useRouter();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword:     "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.currentPassword) e.currentPassword = "Ingresa tu contraseña actual";
    if (!form.newPassword)     e.newPassword     = "Ingresa la nueva contraseña";
    if (form.newPassword.length < 6) e.newPassword = "Mínimo 6 caracteres";
    if (form.newPassword !== form.confirmPassword)
      e.confirmPassword = "Las contraseñas no coinciden";
    if (form.currentPassword === form.newPassword)
      e.newPassword = "La nueva contraseña debe ser diferente";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await changePassword(form.currentPassword, form.newPassword);
      Alert.alert("Éxito", "Contraseña cambiada correctamente.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert("Error", e.message);
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
          <View className="px-5 pt-5 pb-10">

            <TouchableOpacity onPress={() => router.back()} className="mb-6">
              <Text className="text-primary-400 text-sm">← Volver</Text>
            </TouchableOpacity>

            <Text className="text-white text-2xl font-bold mb-1">Cambiar contraseña</Text>
            <Text className="text-gray-400 text-sm mb-8">
              Tu nueva contraseña se cifrará de forma segura
            </Text>

            <Input
              label="Contraseña actual *"
              value={form.currentPassword}
              onChangeText={set("currentPassword")}
              placeholder="••••••••"
              secureTextEntry
              error={errors.currentPassword}
            />

            <Input
              label="Nueva contraseña *"
              value={form.newPassword}
              onChangeText={set("newPassword")}
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
              error={errors.newPassword}
            />

            <Input
              label="Confirmar nueva contraseña *"
              value={form.confirmPassword}
              onChangeText={set("confirmPassword")}
              placeholder="Repite la nueva contraseña"
              secureTextEntry
              error={errors.confirmPassword}
            />

            {/* Indicador de seguridad */}
            {form.newPassword.length > 0 && (
              <View className="mb-4">
                <Text className="text-gray-400 text-xs mb-1">Seguridad de la contraseña</Text>
                <View className="flex-row gap-1">
                  {[1, 2, 3, 4].map((level) => {
                    const strength =
                      form.newPassword.length >= 12 &&
                      /[A-Z]/.test(form.newPassword) &&
                      /[0-9]/.test(form.newPassword) &&
                      /[^a-zA-Z0-9]/.test(form.newPassword)
                        ? 4
                        : form.newPassword.length >= 8 && /[A-Z]/.test(form.newPassword)
                        ? 3
                        : form.newPassword.length >= 6
                        ? 2
                        : 1;
                    return (
                      <View
                        key={level}
                        className={`flex-1 h-1 rounded-full ${
                          level <= strength
                            ? strength === 1
                              ? "bg-red-500"
                              : strength === 2
                              ? "bg-yellow-500"
                              : strength === 3
                              ? "bg-blue-500"
                              : "bg-green-500"
                            : "bg-surface-border"
                        }`}
                      />
                    );
                  })}
                </View>
              </View>
            )}

            <Button
              label="Cambiar contraseña"
              onPress={handleChange}
              loading={loading}
              className="mt-2"
            />

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
