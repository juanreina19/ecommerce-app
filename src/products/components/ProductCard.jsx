import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function ProductCard({ product, onDelete }) {
  const router = useRouter();

  const imageUri = product?.imageUrl || null;
  const price = typeof product.price === "number"
    ? `$${product.price.toLocaleString("es-CO")}`
    : `$${product.price}`;

  return (
    <TouchableOpacity
      onPress={() => router.push(`/(app)/products/${product.id}`)}
      className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden mb-4 active:opacity-80"
      activeOpacity={0.85}
    >
      {imageUri ? (
        <Image source={{ uri: imageUri }} className="w-full h-44 bg-surface-muted" resizeMode="cover" />
      ) : (
        <View className="w-full h-44 bg-surface-muted items-center justify-center">
          <Text className="text-gray-600 text-3xl">📦</Text>
        </View>
      )}

      <View className="p-4">
        <Text className="text-white font-medium text-base" numberOfLines={1}>{product.name}</Text>

        {product.brand ? (
          <Text className="text-primary-400 text-xs mt-0.5">{product.brand}{product.model ? ` — ${product.model}` : ""}</Text>
        ) : null}

        <Text className="text-gray-400 text-sm mt-1" numberOfLines={2}>{product.description}</Text>

        <View className="flex-row items-center justify-between mt-3">
          <Text className="text-white text-lg font-bold">{price}</Text>

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => router.push(`/(app)/products/edit/${product.id}`)}
              className="bg-surface-muted border border-surface-border rounded-lg px-3 py-1.5"
            >
              <Text className="text-gray-300 text-xs font-medium">Editar</Text>
            </TouchableOpacity>

            {onDelete && (
              <TouchableOpacity
                onPress={() => onDelete(product.id)}
                className="bg-red-950 border border-red-800 rounded-lg px-3 py-1.5"
              >
                <Text className="text-red-400 text-xs font-medium">Eliminar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {typeof product.stock === "number" && (
          <Text className={`text-xs mt-2 ${product.stock > 0 ? "text-green-400" : "text-red-400"}`}>
            {product.stock > 0 ? `${product.stock} en stock` : "Sin stock"}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
