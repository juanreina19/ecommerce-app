import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

/**
 * Campo de texto reutilizable.
 */
export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  keyboardType = "default",
  autoCapitalize = "none",
  multiline = false,
  numberOfLines = 1,
  editable = true,
  className = "",
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = secureTextEntry;

  return (
    <View className={`mb-4 ${className}`}>
      {label ? (
        <Text className="text-gray-400 text-sm font-medium mb-1.5">{label}</Text>
      ) : null}

      <View
        className={`flex-row items-center bg-surface-card border rounded-xl px-4 
          ${error ? "border-red-500" : "border-surface-border"}
          ${!editable ? "opacity-60" : ""}
        `}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#4B5563"
          secureTextEntry={isPassword && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          className={`flex-1 text-white text-base py-3.5 ${multiline ? "min-h-[80px] pt-3" : ""}`}
          style={{ fontFamily: "SpaceGrotesk-Regular" }}
        />

        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword((v) => !v)} className="ml-2 p-1">
            <Text className="text-gray-500 text-xs">
              {showPassword ? "OCULTAR" : "VER"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {error ? (
        <Text className="text-red-400 text-xs mt-1">{error}</Text>
      ) : null}
    </View>
  );
}
