import React, { useEffect, useState } from "react";
import {
  View, Text, ScrollView, Image,
  TouchableOpacity, Alert, Dimensions, TextInput, ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProductById, deleteProduct } from "../../../src/products/services/productService";
import { addFavorite, removeFavorite, getMyFavorites } from "../../../src/favorites/services/favoriteService";
import { getProductReviews, createReview } from "../../../src/reviews/services/reviewService";
import ReviewCard    from "../../../src/reviews/components/ReviewCard";
import LoadingSpinner from "../../../src/shared/components/LoadingSpinner";
import ErrorMessage   from "../../../src/shared/components/ErrorMessage";

const { width } = Dimensions.get("window");

// ─── Estrellas seleccionables ─────────────────────────────────────────────────
function StarPicker({ value, onChange }) {
  return (
    <View className="flex-row gap-1 my-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <TouchableOpacity key={i} onPress={() => onChange(i)}>
          <Text style={{ fontSize: 28, color: i <= value ? "#FBBF24" : "#374151" }}>★</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router  = useRouter();

  const [product,   setProduct]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  // Favoritos
  const [isFav,      setIsFav]      = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // Reseñas
  const [reviews,       setReviews]       = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showForm,      setShowForm]      = useState(false);
  const [rating,        setRating]        = useState(5);
  const [comment,       setComment]       = useState("");
  const [submitting,    setSubmitting]    = useState(false);

  useEffect(() => { loadProduct(); loadReviews(); checkFavorite(); }, [id]);

  const loadProduct = async () => {
    setLoading(true); setError(null);
    try {
      const data = await getProductById(id);
      setProduct(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    setReviewsLoading(true);
    try {
      const data = await getProductReviews(id);
      setReviews(Array.isArray(data) ? data : []);
    } catch (_) {
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const checkFavorite = async () => {
    try {
      const favs = await getMyFavorites();
      const list = Array.isArray(favs) ? favs : [];
      const found = list.some(
        (f) => (f.productId ?? f.product?.id) === Number(id)
      );
      setIsFav(found);
    } catch (_) {}
  };

  const toggleFavorite = async () => {
    setFavLoading(true);
    try {
      if (isFav) {
        await removeFavorite(Number(id));
        setIsFav(false);
      } else {
        await addFavorite(Number(id));
        setIsFav(true);
      }
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setFavLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Eliminar producto", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar", style: "destructive",
        onPress: async () => {
          try {
            await deleteProduct(id);
            router.replace("/(app)/products");
          } catch (e) {
            Alert.alert("Error", e.message);
          }
        },
      },
    ]);
  };

  const handleSubmitReview = async () => {
    if (rating < 1 || rating > 5) {
      Alert.alert("Error", "Selecciona una calificación entre 1 y 5 estrellas");
      return;
    }
    setSubmitting(true);
    try {
      const newReview = await createReview({
        productId: Number(id),
        rating,
        comment: comment.trim(),
      });
      setReviews((prev) => [newReview, ...prev]);
      setShowForm(false);
      setRating(5);
      setComment("");
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Cargando producto..." />;
  if (error)   return (
    <SafeAreaView className="flex-1 bg-surface">
      <TouchableOpacity onPress={() => router.back()} className="p-5">
        <Text className="text-primary-400">← Volver</Text>
      </TouchableOpacity>
      <ErrorMessage message={error} onRetry={loadProduct} />
    </SafeAreaView>
  );
  if (!product) return null;

  const price = typeof product.price === "number"
    ? `$${product.price.toLocaleString("es-CO")}`
    : `$${product.price}`;

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : null;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Imagen */}
        {product.imageUrl ? (
          <Image source={{ uri: product.imageUrl }} style={{ width, height: 300 }} resizeMode="cover" />
        ) : (
          <View style={{ width, height: 300 }} className="bg-surface-muted items-center justify-center">
            <Text className="text-6xl">📦</Text>
          </View>
        )}

        {/* Botón volver */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-12 left-4 bg-black/50 rounded-full w-10 h-10 items-center justify-center"
        >
          <Text className="text-white text-base">←</Text>
        </TouchableOpacity>

        {/* Botón Favorito */}
        <TouchableOpacity
          onPress={toggleFavorite}
          disabled={favLoading}
          className="absolute top-12 right-4 bg-black/50 rounded-full w-10 h-10 items-center justify-center"
        >
          {favLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={{ fontSize: 20 }}>{isFav ? "❤️" : "🤍"}</Text>
          )}
        </TouchableOpacity>

        <View className="px-5 pt-5 pb-10">
          {/* Marca y modelo */}
          {product.brand ? (
            <Text className="text-primary-400 text-xs font-medium mb-1">
              {product.brand}{product.model ? ` · ${product.model}` : ""}
            </Text>
          ) : null}

          {/* Nombre y calificación */}
          <View className="flex-row items-start justify-between mb-2">
            <Text className="text-white text-2xl font-bold flex-1 mr-2">{product.name}</Text>
            {avgRating && (
              <View className="flex-row items-center gap-1 mt-1">
                <Text style={{ color: "#FBBF24", fontSize: 14 }}>★</Text>
                <Text className="text-white text-sm font-bold">{avgRating}</Text>
                <Text className="text-gray-500 text-xs">({reviews.length})</Text>
              </View>
            )}
          </View>

          <Text className="text-white text-3xl font-bold mb-4">{price}</Text>

          {/* Badges */}
          <View className="flex-row gap-3 mb-4 flex-wrap">
            {product.color ? (
              <View className="bg-surface-muted border border-surface-border rounded-full px-3 py-1">
                <Text className="text-gray-300 text-xs">🎨 {product.color}</Text>
              </View>
            ) : null}
            {product.weight != null ? (
              <View className="bg-surface-muted border border-surface-border rounded-full px-3 py-1">
                <Text className="text-gray-300 text-xs">⚖️ {product.weight} kg</Text>
              </View>
            ) : null}
            {typeof product.stock === "number" && (
              <View className={`rounded-full px-3 py-1 ${product.stock > 0 ? "bg-green-950 border border-green-800" : "bg-red-950 border border-red-800"}`}>
                <Text className={`text-xs font-medium ${product.stock > 0 ? "text-green-400" : "text-red-400"}`}>
                  {product.stock > 0 ? `${product.stock} disponibles` : "Sin stock"}
                </Text>
              </View>
            )}
          </View>

          <Text className="text-gray-400 text-sm leading-6 mb-6">
            {product.description || "Sin descripción."}
          </Text>

          {/* ── Botones de acción ─────────────────────────────────────────── */}
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/(app)/orders/create",
                params: {
                  productId:   id,
                  productName: product.name,
                  price:       product.price,
                },
              })
            }
            className="bg-green-700 rounded-xl py-4 items-center mb-3"
          >
            <Text className="text-white font-bold text-base">🛒 Comprar ahora</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push(`/(app)/products/edit/${id}`)}
            className="bg-primary-600 rounded-xl py-4 items-center mb-3"
          >
            <Text className="text-white font-medium text-base">Editar producto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDelete}
            className="bg-surface-card border border-red-800 rounded-xl py-4 items-center mb-8"
          >
            <Text className="text-red-400 font-medium text-base">Eliminar producto</Text>
          </TouchableOpacity>

          {/* ── Sección de Reseñas ────────────────────────────────────────── */}
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-white text-lg font-bold">
              Reseñas {reviews.length > 0 ? `(${reviews.length})` : ""}
            </Text>
            <TouchableOpacity
              onPress={() => setShowForm((v) => !v)}
              className="bg-primary-600 rounded-lg px-3 py-1.5"
            >
              <Text className="text-white text-xs font-medium">
                {showForm ? "Cancelar" : "+ Escribir reseña"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Formulario de reseña */}
          {showForm && (
            <View className="bg-surface-card border border-surface-border rounded-2xl p-4 mb-4">
              <Text className="text-gray-400 text-sm mb-1">Calificación</Text>
              <StarPicker value={rating} onChange={setRating} />

              <Text className="text-gray-400 text-sm mb-2 mt-2">Comentario</Text>
              <TextInput
                value={comment}
                onChangeText={setComment}
                placeholder="Escribe tu opinión sobre el producto..."
                placeholderTextColor="#4B5563"
                multiline
                numberOfLines={3}
                className="bg-surface-muted border border-surface-border rounded-xl px-4 py-3 text-white text-sm"
                style={{ textAlignVertical: "top" }}
              />

              <TouchableOpacity
                onPress={handleSubmitReview}
                disabled={submitting}
                className="bg-primary-600 rounded-xl py-3 items-center mt-3"
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-medium">Publicar reseña</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Lista de reseñas */}
          {reviewsLoading ? (
            <ActivityIndicator color="#6366F1" />
          ) : reviews.length === 0 ? (
            <View className="bg-surface-card border border-surface-border rounded-xl p-4 items-center">
              <Text className="text-gray-500 text-sm">Aún no hay reseñas. ¡Sé el primero!</Text>
            </View>
          ) : (
            reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onDeleted={(rid) => setReviews((prev) => prev.filter((r) => r.id !== rid))}
              />
            ))
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
