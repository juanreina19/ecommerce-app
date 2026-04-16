import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProducts } from "../../../src/products/hooks/useProducts";
import ProductCard   from "../../../src/products/components/ProductCard";
import LoadingSpinner from "../../../src/shared/components/LoadingSpinner";
import ErrorMessage   from "../../../src/shared/components/ErrorMessage";

export default function ProductsScreen() {
  const router = useRouter();
  const { products, loading, error, fetchProducts, removeProduct } = useProducts();
  const [search,    setSearch]    = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  }, [fetchProducts]);

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    Alert.alert(
      "Eliminar producto",
      "¿Estás seguro? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await removeProduct(id);
            } catch (e) {
              Alert.alert("Error", e.message);
            }
          },
        },
      ]
    );
  };

  if (loading && products.length === 0) return <LoadingSpinner message="Cargando productos..." />;

  return (
    <SafeAreaView className="flex-1 bg-surface">

      {/* Header */}
      <View className="px-5 pt-4 pb-3">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-white text-2xl font-bold">Productos</Text>
          <TouchableOpacity
            onPress={() => router.push("/(app)/products/create")}
            className="bg-primary-600 rounded-xl px-4 py-2"
          >
            <Text className="text-white text-sm font-medium">+ Nuevo</Text>
          </TouchableOpacity>
        </View>

        {/* Buscador */}
        <View className="bg-surface-card border border-surface-border rounded-xl flex-row items-center px-4 py-2">
          <Text className="text-gray-500 mr-2">🔍</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar productos..."
            placeholderTextColor="#4B5563"
            className="flex-1 text-white text-sm"
            style={{ fontFamily: "SpaceGrotesk-Regular" }}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Text className="text-gray-500 text-lg">×</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <ErrorMessage message={error} onRetry={fetchProducts} />

      {/* Lista */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ProductCard product={item} onDelete={handleDelete} />
        )}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6366F1"
          />
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Text className="text-5xl mb-4">📦</Text>
            <Text className="text-gray-400 text-base">
              {search ? "Sin resultados" : "No hay productos aún"}
            </Text>
            {!search && (
              <TouchableOpacity
                onPress={() => router.push("/(app)/products/create")}
                className="mt-4"
              >
                <Text className="text-primary-400 text-sm font-medium">
                  Crear el primero →
                </Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}
