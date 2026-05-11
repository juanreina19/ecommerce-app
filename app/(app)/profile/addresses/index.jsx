import React, { useEffect, useState, useCallback } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  Alert, RefreshControl, ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getMyAddresses,
  deleteAddress,
} from "../../../../src/users/services/addressService";

function AddressCard({ address, onEdit, onDelete }) {
  return (
    <View className="bg-surface-card border border-surface-border rounded-2xl p-4 mb-3">
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1">
          <Text className="text-white font-semibold text-sm" numberOfLines={2}>
            {address.street}
          </Text>
          <Text className="text-gray-400 text-xs mt-1">
            {[address.city, address.state, address.country].filter(Boolean).join(", ")}
          </Text>
          {address.zipCode ? (
            <Text className="text-gray-500 text-xs mt-0.5">CP: {address.zipCode}</Text>
          ) : null}
        </View>
        {address.isDefault && (
          <View className="bg-primary-900 border border-primary-700 rounded-full px-2 py-0.5 ml-2">
            <Text className="text-primary-400 text-xs font-medium">Predeterminada</Text>
          </View>
        )}
      </View>

      <View className="flex-row gap-2 mt-3 pt-3 border-t border-surface-border">
        <TouchableOpacity
          onPress={() => onEdit(address)}
          className="flex-1 bg-surface-muted border border-surface-border rounded-xl py-2 items-center"
        >
          <Text className="text-gray-300 text-xs font-medium">Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDelete(address.id)}
          className="flex-1 bg-red-950 border border-red-800 rounded-xl py-2 items-center"
        >
          <Text className="text-red-400 text-xs font-medium">Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function AddressesScreen() {
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getMyAddresses();
      setAddresses(Array.isArray(data) ? data : []);
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, []);

  const onRefresh = () => { setRefreshing(true); load(); };

  const handleDelete = (id) => {
    Alert.alert(
      "Eliminar dirección",
      "¿Estás seguro de que quieres eliminar esta dirección?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAddress(id);
              setAddresses((prev) => prev.filter((a) => a.id !== id));
            } catch (e) {
              Alert.alert("Error", e.message);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-primary-400 text-sm">← Volver</Text>
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">Mis Direcciones</Text>
        <TouchableOpacity
          onPress={() => router.push("/(app)/profile/addresses/create")}
          className="bg-primary-600 rounded-xl px-3 py-1.5"
        >
          <Text className="text-white text-xs font-medium">+ Nueva</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#6366F1" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366F1" />
          }
        >
          {addresses.length === 0 ? (
            <View className="items-center justify-center py-20">
              <Text className="text-4xl mb-4">📍</Text>
              <Text className="text-gray-400 text-base mb-2">No tienes direcciones</Text>
              <Text className="text-gray-600 text-sm text-center mb-6">
                Agrega una dirección para poder hacer pedidos
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(app)/profile/addresses/create")}
                className="bg-primary-600 rounded-xl px-6 py-3"
              >
                <Text className="text-white font-medium">Agregar dirección</Text>
              </TouchableOpacity>
            </View>
          ) : (
            addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={(a) =>
                  router.push({
                    pathname: "/(app)/profile/addresses/edit/[id]",
                    params: { id: a.id, data: JSON.stringify(a) },
                  })
                }
                onDelete={handleDelete}
              />
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
