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
import { useAuth } from "../../../src/auth/context/AuthContext";
import { updatePersonalInfo } from "../../../src/auth/services/authService";
import Input  from "../../../src/shared/components/Input";
import Button from "../../../src/shared/components/Button";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    firstName:   user?.firstName   || "",
    lastName:    user?.lastName    || "",
    phoneNumber: user?.phoneNumber || "",
    dateOfBirth: user?.dateOfBirth || "",
  });
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Nombre requerido";
    if (!form.lastName.trim())  e.lastName  = "Apellido requerido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const updated = await updatePersonalInfo({
        firstName:   form.firstName.trim(),
        lastName:    form.lastName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        dateOfBirth: form.dateOfBirth.trim() || undefined,
      });
      await updateUser(updated || form);
      Alert.alert("Guardado", "Perfil actualizado correctamente.", [
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

            <Text className="text-white text-2xl font-bold mb-1">Editar perfil</Text>
            <Text className="text-gray-400 text-sm mb-8">
              Actualiza tu información personal
            </Text>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Input
                  label="Nombre *"
                  value={form.firstName}
                  onChangeText={set("firstName")}
                  placeholder="Juan"
                  autoCapitalize="words"
                  error={errors.firstName}
                />
              </View>
              <View className="flex-1">
                <Input
                  label="Apellido *"
                  value={form.lastName}
                  onChangeText={set("lastName")}
                  placeholder="Pérez"
                  autoCapitalize="words"
                  error={errors.lastName}
                />
              </View>
            </View>

            <Input
              label="Teléfono"
              value={form.phoneNumber}
              onChangeText={set("phoneNumber")}
              placeholder="+57 300 000 0000"
              keyboardType="phone-pad"
            />

            <Input
              label="Fecha de nacimiento"
              value={form.dateOfBirth}
              onChangeText={set("dateOfBirth")}
              placeholder="YYYY-MM-DD"
              keyboardType="numbers-and-punctuation"
            />

            <Button
              label="Guardar cambios"
              onPress={handleSave}
              loading={loading}
              className="mt-4"
            />

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
