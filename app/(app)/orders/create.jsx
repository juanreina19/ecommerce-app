import React, { useEffect, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { createOrder } from "../../../src/orders/services/orderService";
import { getMyAddresses } from "../../../src/users/services/addressService";
import Input from "../../../src/shared/components/Input";
import Button from "../../../src/shared/components/Button";

export default function CreateOrderScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Parámetros recibidos desde el detalle del producto
  const productId   = Number(params.productId);
  const productName = params.productName || "Producto";
  const productPrice = params.price ? Number(params.price) : null;

  const [addresses,    setAddresses]    = useState([]);
  const [selectedAddr, setSelectedAddr] = useState(null);
  const [quantity,     setQuantity]     = useState("1");
  const [loadingAddr,  setLoadingAddr]  = useState(true);
  const [loading,      setLoading]      = useState(false);
  const [errors,       setErrors]       = useState({});

  // Cargar direcciones del usuario
  useEffect(() => {
    (async () => {
      try {
        const data = await getMyAddresses();
        const list = Array.isArray(data) ? data : [];
        setAddresses(list);
        // Seleccionar la predeterminada automáticamente
        const def = list.find((a) => a.isDefault) || list[0] || null;
        setSelectedAddr(def);
      } catch (e) {
        Alert.alert("Error", "No se pudieron cargar tus direcciones: " + e.message);
      } finally {
        setLoadingAddr(false);
      }
    })();
  }, []);

  const qty = parseInt(quantity) || 1;
  const subtotal = productPrice ? productPrice * qty : null;

  const validate = () => {
    const e = {};
    if (!selectedAddr)         e.address  = "Selecciona una dirección de envío";
    if (!quantity || qty < 1)  e.quantity = "La cantidad debe ser al menos 1";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleOrder = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const order = await createOrder({
        shippingAddressId: selectedAddr.id,
        items: [{ productId, quantity: qty }],
      });
      Alert.alert(
        "¡Pedido realizado! 🎉",
        `Tu pedido #${order.id} fue creado exitosamente.`,
        [
          {
            text: "Ver mis pedidos",
            onPress: () => router.replace("/(app)/orders"),
          },
        ]
      );
    } catch (e) {
      Alert.alert("Error al crear pedido", e.message);
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

            <Text className="text-white text-2xl font-bold mb-1">Confirmar pedido</Text>
            <Text className="text-gray-400 text-sm mb-8">Revisa los detalles antes de comprar</Text>

            {/* Producto */}
            <View className="bg-surface-card border border-surface-border rounded-2xl p-4 mb-5">
              <Text className="text-gray-500 text-xs font-medium mb-2 uppercase tracking-wider">Producto</Text>
              <Text className="text-white font-semibold text-base">{productName}</Text>
              {productPrice != null && (
                <Text className="text-primary-400 text-sm mt-1">
                  ${productPrice.toLocaleString("es-CO")} por unidad
                </Text>
              )}
            </View>

            {/* Cantidad */}
            <View className="mb-5">
              <Text className="text-gray-400 text-sm font-medium mb-2">Cantidad</Text>
              <View className="flex-row items-center gap-3">
                <TouchableOpacity
                  onPress={() => setQuantity(String(Math.max(1, qty - 1)))}
                  className="w-10 h-10 bg-surface-card border border-surface-border rounded-xl items-center justify-center"
                >
                  <Text className="text-white text-xl font-bold">−</Text>
                </TouchableOpacity>
                <View className="flex-1">
                  <Input
                    value={quantity}
                    onChangeText={(v) => setQuantity(v.replace(/[^0-9]/g, ""))}
                    keyboardType="number-pad"
                    error={errors.quantity}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => setQuantity(String(qty + 1))}
                  className="w-10 h-10 bg-surface-card border border-surface-border rounded-xl items-center justify-center"
                >
                  <Text className="text-white text-xl font-bold">+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Subtotal */}
            {subtotal != null && (
              <View className="bg-primary-900 border border-primary-700 rounded-xl px-4 py-3 mb-5 flex-row justify-between items-center">
                <Text className="text-primary-300 text-sm font-medium">Total estimado</Text>
                <Text className="text-white text-lg font-bold">
                  ${subtotal.toLocaleString("es-CO")}
                </Text>
              </View>
            )}

            {/* Dirección de envío */}
            <View className="mb-5">
              <Text className="text-gray-400 text-sm font-medium mb-2">Dirección de envío</Text>

              {loadingAddr ? (
                <ActivityIndicator color="#6366F1" />
              ) : addresses.length === 0 ? (
                <View className="bg-yellow-950 border border-yellow-700 rounded-xl p-4">
                  <Text className="text-yellow-400 text-sm font-medium mb-1">
                    Sin direcciones registradas
                  </Text>
                  <Text className="text-yellow-600 text-xs mb-3">
                    Debes agregar una dirección de envío antes de hacer un pedido.
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push("/(app)/profile/addresses/create")}
                    className="bg-yellow-900 border border-yellow-700 rounded-lg py-2 items-center"
                  >
                    <Text className="text-yellow-400 text-xs font-medium">+ Agregar dirección</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                addresses.map((addr) => (
                  <TouchableOpacity
                    key={addr.id}
                    onPress={() => setSelectedAddr(addr)}
                    className={`border rounded-xl p-4 mb-2 ${
                      selectedAddr?.id === addr.id
                        ? "bg-primary-900 border-primary-600"
                        : "bg-surface-card border-surface-border"
                    }`}
                  >
                    <View className="flex-row items-start">
                      <View className={`w-4 h-4 rounded-full border-2 mt-0.5 mr-3 items-center justify-center ${
                        selectedAddr?.id === addr.id ? "border-primary-500" : "border-gray-600"
                      }`}>
                        {selectedAddr?.id === addr.id && (
                          <View className="w-2 h-2 rounded-full bg-primary-500" />
                        )}
                      </View>
                      <View className="flex-1">
                        <Text className="text-white text-sm font-medium">{addr.street}</Text>
                        <Text className="text-gray-400 text-xs mt-0.5">
                          {[addr.city, addr.state, addr.country].filter(Boolean).join(", ")}
                        </Text>
                        {addr.isDefault && (
                          <Text className="text-primary-400 text-xs mt-1">Predeterminada</Text>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}

              {errors.address && (
                <Text className="text-red-400 text-xs mt-1">{errors.address}</Text>
              )}
            </View>

            <Button
              label="Confirmar pedido"
              onPress={handleOrder}
              loading={loading}
              disabled={addresses.length === 0}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
