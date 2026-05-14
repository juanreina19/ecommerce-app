import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { deleteReview } from "../services/reviewService";

function Stars({ rating }) {
  return (
    <View className="flex-row">
      {[1, 2, 3, 4, 5].map((i) => (
        <Text key={i} style={{ fontSize: 13, color: i <= rating ? "#FBBF24" : "#374151" }}>
          ★
        </Text>
      ))}
    </View>
  );
}

export default function ReviewCard({ review, isOwn = false, onDeleted }) {
  const date = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("es-CO", {
        day: "2-digit", month: "short", year: "numeric",
      })
    : null;

  const handleDelete = () => {
    Alert.alert(
      "Eliminar reseña",
      "¿Seguro que quieres eliminar tu reseña?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteReview(review.id);
              onDeleted?.(review.id);
            } catch (e) {
              Alert.alert("Error", e.message);
            }
          },
        },
      ]
    );
  };

  return (
    <View className="bg-surface-card border border-surface-border rounded-xl p-4 mb-3">
      <View className="flex-row items-start justify-between mb-2">
        <View>
          <Stars rating={review.rating} />
          {date && <Text className="text-gray-600 text-xs mt-1">{date}</Text>}
        </View>
        {isOwn && (
          <TouchableOpacity onPress={handleDelete}>
            <Text className="text-red-400 text-xs font-medium">Eliminar</Text>
          </TouchableOpacity>
        )}
      </View>
      {review.comment ? (
        <Text className="text-gray-300 text-sm leading-5 mt-1">{review.comment}</Text>
      ) : (
        <Text className="text-gray-600 text-sm italic">Sin comentario</Text>
      )}
    </View>
  );
}
