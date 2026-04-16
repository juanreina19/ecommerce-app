import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";

/**
 * Botón reutilizable.
 * @param {{ label, onPress, variant?, loading?, disabled?, icon?, className? }} props
 * variant: "primary" | "secondary" | "danger" | "ghost"
 */
export default function Button({
  label,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  icon = null,
  className = "",
}) {
  const base = "flex-row items-center justify-center rounded-xl px-5 py-3.5 active:opacity-80";

  const variants = {
    primary:   "bg-primary-600",
    secondary: "bg-surface-card border border-surface-border",
    danger:    "bg-red-600",
    ghost:     "bg-transparent",
  };

  const textVariants = {
    primary:   "text-white font-medium text-base",
    secondary: "text-gray-200 font-medium text-base",
    danger:    "text-white font-medium text-base",
    ghost:     "text-primary-400 font-medium text-base",
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={`${base} ${variants[variant]} ${isDisabled ? "opacity-50" : ""} ${className}`}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <>
          {icon && <View className="mr-2">{icon}</View>}
          <Text className={textVariants[variant]}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
