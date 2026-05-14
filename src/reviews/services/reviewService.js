import axiosClient from "../../shared/services/axiosClient";

/**
 * Obtener reseñas de un producto
 * @param {number} productId
 */
export async function getProductReviews(productId) {
  const response = await axiosClient.get(`/api/reviews/product/${productId}`);
  return response.data.data;
}

/** Obtener mis reseñas */
export async function getMyReviews() {
  const response = await axiosClient.get("/api/reviews/my");
  return response.data.data;
}

/**
 * Crear una reseña (rating: 1-5, comment: string)
 * @param {{ productId: number, rating: number, comment: string }} data
 */
export async function createReview({ productId, rating, comment }) {
  const response = await axiosClient.post("/api/reviews", {
    productId,
    rating,
    comment,
  });
  return response.data.data;
}

/**
 * Eliminar una reseña propia
 * @param {number} reviewId
 */
export async function deleteReview(reviewId) {
  const response = await axiosClient.delete(`/api/reviews/${reviewId}`);
  return response.data;
}
