import axiosClient from "../../shared/services/axiosClient";

/** Obtener mis productos favoritos */
export async function getMyFavorites() {
  const response = await axiosClient.get("/api/users/me/favorites");
  return response.data.data;
}

/**
 * Agregar un producto a favoritos
 * @param {number} productId
 */
export async function addFavorite(productId) {
  const response = await axiosClient.post("/api/users/me/favorites", { productId });
  return response.data.data;
}

/**
 * Eliminar un producto de favoritos
 * @param {number} productId
 */
export async function removeFavorite(productId) {
  const response = await axiosClient.delete(`/api/users/me/favorites/${productId}`);
  return response.data;
}
