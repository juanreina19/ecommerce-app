import React, { useEffect, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getOrderById, cancelOrder } from "../../../src/orders/services/orderService";
import ErrorMessage from "../../../src/shared/components/ErrorMessage";

const STATUS_CONFIG = {
  PENDING:   { label: "Pendiente",  bg: "bg-yellow-950", border: "border-yellow-700", text: "text-yellow-400", emoji: "⏳" },
  CONFIRMED: { label: "Confirmado", bg: "bg-blue-950",   border: "border-blue-700",   text: "text-blue-400",   emoji: "✅" },
  DELIVERED: { label: "Entregado",  bg: "bg-green-950",  border: "border-green-700",  text: "text-green-400",  emoji: "📦" },
  CANCELLED: { label: "Cancelado",  bg: "bg-red-950",    border: "border-red-800",    text: "text-red-400",    emoji: "❌" },
  SHIPPED:   { label: "Enviado",    bg: "bg-purple-950", border: "border-purple-700", text: "text-purple-400", emoji: "🚚" },
};

function Row({ label, value }) {
  return (
    <View className="flex-row justify-between items-center py-3 border-b border-surface-border">
      <Text className="text-gray-400 text-sm">{label}</Text>
      <Text className="text-white text-sm font-medium">{value || "—"}</Text>
    </View>
  );
}

export default function OrderDetailScreen() {
  const { id }  = useLocalSearchParams();
  const router  = useRouter();

  const [order,    setOrder]    = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const data = await getOrderById(id);
      setOrder(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const handleCancel = () => {
    Alert.alert(
      "Cancelar pedido",
      "¿Estás seguro de que quieres cancelar este pedido?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí, cancelar",
          style: "destructive",
          onPress: async () => {
            setCancelling(true);
            try {
              await cancelOrder(id);
              setOrder((prev) => ({ ...prev, status: "CANCELLED" }));
            } catch (e) {
              Alert.alert("Error", e.message);
            } finally {
              setCancelling(false);
            }
          },
        },
      ]
    );
  };

  if (loading) return (
    <SafeAreaView className="flex-1 bg-surface items-center justify-center">
      <ActivityIndicator color="#6366F1" size="large" />
    </SafeAreaView>
  );

  if (error) return (
    <SafeAreaView className="flex-1 bg-surface">
      <TouchableOpacity onPress={() => router.back()} className="p-5">
        <Text className="text-primary-400">← Volver</Text>
      </TouchableOpacity>
      <ErrorMessage message={error} onRetry={load} />
    </SafeAreaView>
  );

  if (!order) return null;

  const cfg = STATUS_CONFIG[order.status] ?? {
    label: order.status, bg: "bg-surface-muted", border: "border-surface-border",
    text: "text-gray-400", emoji: "📋",
  };

  const total = typeof order.totalAmount === "number"
    ? `$${order.totalAmount.toLocaleString("es-CO")}`
    : "—";

  const createdAt = order.createdAt
    ? new Date(order.createdAt).toLocaleString("es-CO", {
        dateStyle: "long", timeStyle: "short",
      })
    : "—";

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-5 pb-10">

          {/* Back */}
          <TouchableOpacity onPress={() => router.back()} className="mb-6">
            <Text className="text-primary-400 text-sm">← Volver</Text>
          </TouchableOpacity>

          {/* Estado grande */}
          <View className={`${cfg.bg} border ${cfg.border} rounded-2xl p-5 mb-6 items-center`}>
            <Text className="text-4xl mb-2">{cfg.emoji}</Text>
            <Text className={`${cfg.text} text-lg font-bold`}>{cfg.label}</Text>
            <Text className="text-gray-500 text-sm mt-1">Pedido #{order.id}</Text>
          </View>

          {/* Resumen */}
          <View className="bg-surface-card border border-surface-border rounded-2xl px-5 mb-5">
            <Text className="text-gray-500 text-xs font-medium pt-4 pb-2 uppercase tracking-wider">
              Resumen del pedido
            </Text>
            <Row label="Total" value={total} />
            <Row label="Fecha"  value={createdAt} />
            <Row label="Dirección de envío ID" value={`#${order.shippingAddressId}`} />
          </View>

          {/* Productos */}
          {order.items && order.items.length > 0 && (
            <View className="bg-surface-card border border-surface-border rounded-2xl px-5 mb-5">
              <Text className="text-gray-500 text-xs font-medium pt-4 pb-2 uppercase tracking-wider">
                Productos ({order.items.length})
              </Text>
              {order.items.map((item) => (
                <View key={item.id} className="flex-row justify-between items-center py-3 border-b border-surface-border">
                  <View className="flex-1">
                    <Text className="text-white text-sm font-medium">Producto #{item.productId}</Text>
                    <Text className="text-gray-500 text-xs mt-0.5">
                      x{item.quantity} · ${typeof item.unitPrice === "number" ? item.unitPrice.toLocaleString("es-CO") : item.unitPrice} c/u
                    </Text>
                  </View>
                  <Text className="text-white text-sm font-bold ml-4">
                    ${typeof item.subtotal === "number" ? item.subtotal.toLocaleString("es-CO") : item.subtotal}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Cancelar (solo PENDING) */}
          {order.status === "PENDING" && (
            <TouchableOpacity
              onPress={handleCancel}
              disabled={cancelling}
              className="bg-red-950 border border-red-800 rounded-xl py-4 items-center mt-2"
            >
              {cancelling ? (
                <ActivityIndicator color="#F87171" />
              ) : (
                <Text className="text-red-400 font-medium">Cancelar pedido</Text>
              )}
            </TouchableOpacity>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
