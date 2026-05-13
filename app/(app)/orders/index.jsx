import React, { useEffect, useState, useCallback } from "react";
import {
  View, Text, FlatList, TouchableOpacity,
  RefreshControl, Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOrders } from "../../../src/orders/hooks/useOrders";
import LoadingSpinner from "../../../src/shared/components/LoadingSpinner";
import ErrorMessage   from "../../../src/shared/components/ErrorMessage";

// ─── Colores y etiquetas por estado ──────────────────────────────────────────
const STATUS_CONFIG = {
  PENDING:   { label: "Pendiente",  bg: "bg-yellow-950", border: "border-yellow-700", text: "text-yellow-400" },
  CONFIRMED: { label: "Confirmado", bg: "bg-blue-950",   border: "border-blue-700",   text: "text-blue-400"   },
  DELIVERED: { label: "Entregado",  bg: "bg-green-950",  border: "border-green-700",  text: "text-green-400"  },
  CANCELLED: { label: "Cancelado",  bg: "bg-red-950",    border: "border-red-800",    text: "text-red-400"    },
  SHIPPED:   { label: "Enviado",    bg: "bg-purple-950", border: "border-purple-700", text: "text-purple-400" },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? {
    label: status, bg: "bg-surface-muted", border: "border-surface-border", text: "text-gray-400"
  };
  return (
    <View className={`${cfg.bg} border ${cfg.border} rounded-full px-3 py-0.5`}>
      <Text className={`${cfg.text} text-xs font-medium`}>{cfg.label}</Text>
    </View>
  );
}

function OrderCard({ order, onPress }) {
  const date = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("es-CO", {
        day: "2-digit", month: "short", year: "numeric",
      })
    : "—";

  const total = typeof order.totalAmount === "number"
    ? `$${order.totalAmount.toLocaleString("es-CO")}`
    : "—";

  return (
    <TouchableOpacity
      onPress={() => onPress(order.id)}
      className="bg-surface-card border border-surface-border rounded-2xl p-4 mb-3 active:opacity-80"
      activeOpacity={0.85}
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-white font-semibold text-sm">Pedido #{order.id}</Text>
        <StatusBadge status={order.status} />
      </View>

      <View className="flex-row items-center justify-between mt-2">
        <Text className="text-gray-500 text-xs">{date}</Text>
        <Text className="text-white text-base font-bold">{total}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function OrdersScreen() {
  const router = useRouter();
  const { orders, loading, error, fetchMyOrders } = useOrders();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchMyOrders(); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchMyOrders();
    setRefreshing(false);
  }, [fetchMyOrders]);

  if (loading && orders.length === 0) return <LoadingSpinner message="Cargando pedidos..." />;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="px-5 pt-4 pb-3">
        <Text className="text-white text-2xl font-bold">Mis Pedidos</Text>
        <Text className="text-gray-500 text-sm mt-1">Historial de compras</Text>
      </View>

      <ErrorMessage message={error} onRetry={fetchMyOrders} />

      <FlatList
        data={orders}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onPress={(id) => router.push(`/(app)/orders/${id}`)}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366F1" />
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Text className="text-5xl mb-4">🛍️</Text>
            <Text className="text-gray-400 text-base mb-2">No tienes pedidos aún</Text>
            <Text className="text-gray-600 text-sm text-center mb-6">
              Explora los productos y haz tu primera compra
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(app)/products")}
              className="bg-primary-600 rounded-xl px-6 py-3"
            >
              <Text className="text-white font-medium">Ver productos</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}
