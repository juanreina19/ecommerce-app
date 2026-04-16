import React from "react";
import { View, ActivityIndicator, Text } from "react-native";

export default function LoadingSpinner({ message = "Cargando..." }) {
  return (
    <View className="flex-1 items-center justify-center bg-surface">
      <ActivityIndicator size="large" color="#6366F1" />
      {message ? (
        <Text className="text-gray-400 text-sm mt-3">{message}</Text>
      ) : null}
    </View>
  );
}
