import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert, Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { addAddress } from "../../../../src/users/services/addressService";
import Input  from "../../../../src/shared/components/Input";
import Button from "../../../../src/shared/components/Button";

export default function CreateAddressScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    street:    "",
    city:      "",
    state:     "",
    country:   "Colombia",
    zipCode:   "",
    isDefault: false,
  });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.street.trim())  e.street  = "La calle / dirección es requerida";
    if (!form.city.trim())    e.city    = "La ciudad es requerida";
    if (!form.country.trim()) e.country = "El país es requerido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await addAddress({
        street:    form.street.trim(),
        city:      form.city.trim(),
        state:     form.state.trim(),
        country:   form.country.trim(),
        zipCode:   form.zipCode.trim(),
        isDefault: form.isDefault,
      });
      Alert.alert("Éxito", "Dirección agregada correctamente.", [
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
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="px-5 pt-5 pb-10">
            <TouchableOpacity onPress={() => router.back()} className="mb-6">
              <Text className="text-primary-400 text-sm">← Volver</Text>
            </TouchableOpacity>

            <Text className="text-white text-2xl font-bold mb-1">Nueva dirección</Text>
            <Text className="text-gray-400 text-sm mb-8">
              Completa los datos de tu dirección de envío
            </Text>

            <Input
              label="Calle / Dirección *"
              value={form.street}
              onChangeText={set("street")}
              placeholder="Ej: Carrera 7 #45-89, Apartamento 602"
              autoCapitalize="sentences"
              error={errors.street}
            />
            <Input
              label="Ciudad *"
              value={form.city}
              onChangeText={set("city")}
              placeholder="Ej: Bogotá"
              autoCapitalize="words"
              error={errors.city}
            />
            <Input
              label="Departamento / Estado"
              value={form.state}
              onChangeText={set("state")}
              placeholder="Ej: Cundinamarca"
              autoCapitalize="words"
            />
            <Input
              label="País *"
              value={form.country}
              onChangeText={set("country")}
              placeholder="Ej: Colombia"
              autoCapitalize="words"
              error={errors.country}
            />
            <Input
              label="Código postal"
              value={form.zipCode}
              onChangeText={set("zipCode")}
              placeholder="Ej: 110111"
              keyboardType="number-pad"
            />

            {/* Toggle predeterminada */}
            <View className="flex-row items-center justify-between bg-surface-card border border-surface-border rounded-xl px-4 py-3 mb-6">
              <View>
                <Text className="text-white text-sm font-medium">Dirección predeterminada</Text>
                <Text className="text-gray-500 text-xs mt-0.5">
                  Se usará automáticamente al crear pedidos
                </Text>
              </View>
              <Switch
                value={form.isDefault}
                onValueChange={set("isDefault")}
                trackColor={{ false: "#2A2A38", true: "#4F46E5" }}
                thumbColor={form.isDefault ? "#6366F1" : "#6B7280"}
              />
            </View>

            <Button label="Guardar dirección" onPress={handleSave} loading={loading} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
