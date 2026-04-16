import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;
  return (
    <View className="bg-red-950 border border-red-800 rounded-xl p-4 mx-4 my-2">
      <Text className="text-red-300 text-sm">{message}</Text>
      {onRetry && (
        <TouchableOpacity onPress={onRetry} className="mt-2">
          <Text className="text-primary-400 text-sm font-medium">Reintentar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
