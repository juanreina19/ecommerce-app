import React, { useEffect, useState, useCallback } from "react";
import {
  View, Text, FlatList, TouchableOpacity,
  RefreshControl, Alert, Image,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getMyFavorites,
  removeFavorite,
} from "../../../src/favorites/services/favoriteService";
import LoadingSpinner from "../../../src/shared/components/LoadingSpinner";

function FavoriteCard({ item, onRemove }) {
  const router  = useRouter();
  const product = item.product ?? item; // la API puede anidar el producto o devolver el objeto directo

  const price = typeof product.price === "number"
    ? `$${product.price.toLocaleString("es-CO")}`
    : product.price ? `$${product.price}` : null;

  return (
    <TouchableOpacity
      onPress={() => router.push(`/(app)/products/${product.id ?? item.productId}`)}
      className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden mb-4 active:opacity-80"
      activeOpacity={0.85}
    >
      {product.imageUrl ? (
        <Image
          source={{ uri: product.imageUrl }}
          className="w-full h-40 bg-surface-muted"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-40 bg-surface-muted items-center justify-center">
          <Text className="text-gray-600 text-3xl">📦</Text>
        </View>
      )}

      <View className="p-4">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 mr-3">
            <Text className="text-white font-medium text-base" numberOfLines={1}>
              {product.name || `Producto #${item.productId}`}
            </Text>
            {product.brand ? (
              <Text className="text-primary-400 text-xs mt-0.5">{product.brand}</Text>
            ) : null}
          </View>
          <TouchableOpacity
            onPress={() => onRemove(item.productId ?? product.id)}
            className="bg-red-950 border border-red-800 rounded-lg px-2 py-1"
          >
            <Text className="text-red-400 text-xs">♥ Quitar</Text>
          </TouchableOpacity>
        </View>

        {price && (
          <Text className="text-white text-lg font-bold mt-2">{price}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function FavoritesScreen() {
  const [favorites,  setFavorites]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const load = useCallback(async () => {
    try {
      const data = await getMyFavorites();
      setFavorites(Array.isArray(data) ? data : []);
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, []);

  const onRefresh = () => { setRefreshing(true); load(); };

  const handleRemove = (productId) => {
    Alert.alert(
      "Quitar de favoritos",
      "¿Quieres quitar este producto de tus favoritos?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Quitar",
          style: "destructive",
          onPress: async () => {
            try {
              await removeFavorite(productId);
              setFavorites((prev) =>
                prev.filter((f) => (f.productId ?? f.product?.id) !== productId)
              );
            } catch (e) {
              Alert.alert("Error", e.message);
            }
          },
        },
      ]
    );
  };

  if (loading) return <LoadingSpinner message="Cargando favoritos..." />;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="px-5 pt-4 pb-3">
        <Text className="text-white text-2xl font-bold">Favoritos</Text>
        <Text className="text-gray-500 text-sm mt-1">
          {favorites.length > 0 ? `${favorites.length} producto${favorites.length !== 1 ? "s" : ""}` : ""}
        </Text>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item, idx) => String(item.id ?? item.productId ?? idx)}
        renderItem={({ item }) => (
          <FavoriteCard item={item} onRemove={handleRemove} />
        )}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366F1" />
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Text className="text-5xl mb-4">🤍</Text>
            <Text className="text-gray-400 text-base mb-2">No tienes favoritos aún</Text>
            <Text className="text-gray-600 text-sm text-center mb-6">
              Guarda productos que te interesen tocando el ♥
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(app)/products")}
              className="bg-primary-600 rounded-xl px-6 py-3"
            >
              <Text className="text-white font-medium">Explorar productos</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}
