import React, { useEffect, useState } from "react";
import {
  View, Text, ScrollView, Image,
  TouchableOpacity, Alert, Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProductById, deleteProduct } from "../../../src/products/services/productService";
import LoadingSpinner from "../../../src/shared/components/LoadingSpinner";
import ErrorMessage   from "../../../src/shared/components/ErrorMessage";

const { width } = Dimensions.get("window");

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router  = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => { loadProduct(); }, [id]);

  const loadProduct = async () => {
    setLoading(true); setError(null);
    try {
      const data = await getProductById(id);
      setProduct(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Eliminar producto", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar", style: "destructive",
        onPress: async () => {
          try {
            await deleteProduct(id);
            router.replace("/(app)/products");
          } catch (e) {
            Alert.alert("Error", e.message);
          }
        },
      },
    ]);
  };

  if (loading) return <LoadingSpinner message="Cargando producto..." />;
  if (error)   return (
    <SafeAreaView className="flex-1 bg-surface">
      <TouchableOpacity onPress={() => router.back()} className="p-5">
        <Text className="text-primary-400">← Volver</Text>
      </TouchableOpacity>
      <ErrorMessage message={error} onRetry={loadProduct} />
    </SafeAreaView>
  );
  if (!product) return null;

  const price = typeof product.price === "number"
    ? `$${product.price.toLocaleString("es-CO")}`
    : `$${product.price}`;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView showsVerticalScrollIndicator={false}>

        {product.imageUrl ? (
          <Image source={{ uri: product.imageUrl }} style={{ width, height: 300 }} resizeMode="cover" />
        ) : (
          <View style={{ width, height: 300 }} className="bg-surface-muted items-center justify-center">
            <Text className="text-6xl">📦</Text>
          </View>
        )}

        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-12 left-4 bg-black/50 rounded-full w-10 h-10 items-center justify-center"
        >
          <Text className="text-white">←</Text>
        </TouchableOpacity>

        <View className="px-5 pt-5 pb-10">
          {product.brand ? (
            <Text className="text-primary-400 text-xs font-medium mb-1">
              {product.brand}{product.model ? ` · ${product.model}` : ""}
            </Text>
          ) : null}

          <Text className="text-white text-2xl font-bold mb-2">{product.name}</Text>
          <Text className="text-white text-3xl font-bold mb-4">{price}</Text>

          <View className="flex-row gap-3 mb-4 flex-wrap">
            {product.color ? (
              <View className="bg-surface-muted border border-surface-border rounded-full px-3 py-1">
                <Text className="text-gray-300 text-xs">🎨 {product.color}</Text>
              </View>
            ) : null}
            {product.weight != null ? (
              <View className="bg-surface-muted border border-surface-border rounded-full px-3 py-1">
                <Text className="text-gray-300 text-xs">⚖️ {product.weight} kg</Text>
              </View>
            ) : null}
            {typeof product.stock === "number" && (
              <View className={`rounded-full px-3 py-1 ${product.stock > 0 ? "bg-green-950 border border-green-800" : "bg-red-950 border border-red-800"}`}>
                <Text className={`text-xs font-medium ${product.stock > 0 ? "text-green-400" : "text-red-400"}`}>
                  {product.stock > 0 ? `${product.stock} disponibles` : "Sin stock"}
                </Text>
              </View>
            )}
          </View>

          <Text className="text-gray-400 text-sm leading-6 mb-6">
            {product.description || "Sin descripción."}
          </Text>

          <TouchableOpacity
            onPress={() => router.push(`/(app)/products/edit/${id}`)}
            className="bg-primary-600 rounded-xl py-4 items-center mb-3"
          >
            <Text className="text-white font-medium text-base">Editar producto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDelete}
            className="bg-surface-card border border-red-800 rounded-xl py-4 items-center"
          >
            <Text className="text-red-400 font-medium text-base">Eliminar producto</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
