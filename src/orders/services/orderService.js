import axiosClient from "../../shared/services/axiosClient";

/**
 * Crear una nueva orden.
 * @param {number} shippingAddressId
 * @param {Array<{productId: number, quantity: number}>} items
 */
export async function createOrder({ shippingAddressId, items }) {
  const response = await axiosClient.post("/api/orders", {
    shippingAddressId,
    items,
  });
  return response.data.data;
}

/** Obtener todas mis órdenes */
export async function getMyOrders() {
  const response = await axiosClient.get("/api/orders/my");
  return response.data.data;
}

/** Obtener una orden por ID (incluye items) */
export async function getOrderById(id) {
  const response = await axiosClient.get(`/api/orders/${id}`);
  return response.data.data;
}

/** Cancelar una orden (solo si está en PENDING) */
export async function cancelOrder(id) {
  const response = await axiosClient.post(`/api/orders/${id}/cancel`);
  return response.data;
}
