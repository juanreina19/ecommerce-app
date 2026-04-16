import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { selectAndUploadImage } from "../services/cloudinaryService";

/**
 * Campo para seleccionar y subir múltiples imágenes a Cloudinary.
 * Retorna un array de URLs mediante onImagesChange.
 *
 * @param {{ images: string[], onImagesChange: (urls: string[]) => void, maxImages?: number }} props
 */
export default function ImagePickerField({
  images = [],
  onImagesChange,
  maxImages = 5,
}) {
  const [uploading, setUploading] = useState(false);

  const handlePickImage = async (source) => {
    if (images.length >= maxImages) {
      Alert.alert("Límite alcanzado", `Máximo ${maxImages} imágenes.`);
      return;
    }
    setUploading(true);
    try {
      const url = await selectAndUploadImage(source);
      if (url) {
        onImagesChange([...images, url]);
      }
    } catch (e) {
      Alert.alert("Error", e.message || "No se pudo subir la imagen.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (index) => {
    const updated = images.filter((_, i) => i !== index);
    onImagesChange(updated);
  };

  const showSourcePicker = () => {
    Alert.alert("Seleccionar imagen", "¿Desde dónde?", [
      { text: "Cámara",  onPress: () => handlePickImage("camera") },
      { text: "Galería", onPress: () => handlePickImage("library") },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  return (
    <View className="mb-4">
      <Text className="text-gray-400 text-sm font-medium mb-2">
        Imágenes ({images.length}/{maxImages})
      </Text>

      <FlatList
        horizontal
        data={[...images, "ADD"]}
        keyExtractor={(item, i) => `${item}-${i}`}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => {
          if (item === "ADD") {
            if (images.length >= maxImages) return null;
            return (
              <TouchableOpacity
                onPress={showSourcePicker}
                disabled={uploading}
                className="w-24 h-24 rounded-xl bg-surface-card border border-dashed border-surface-border items-center justify-center mr-3"
              >
                {uploading ? (
                  <ActivityIndicator color="#6366F1" />
                ) : (
                  <>
                    <Text className="text-primary-400 text-2xl">+</Text>
                    <Text className="text-gray-500 text-xs mt-1">Agregar</Text>
                  </>
                )}
              </TouchableOpacity>
            );
          }

          return (
            <View className="mr-3 relative">
              <Image
                source={{ uri: item }}
                className="w-24 h-24 rounded-xl bg-surface-muted"
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => handleRemove(index)}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 items-center justify-center"
              >
                <Text className="text-white text-xs font-bold">×</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}
