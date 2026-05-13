import { useState, useCallback } from "react";
import {
  getMyOrders,
  getOrderById,
  createOrder,
  cancelOrder,
} from "../services/orderService";

export function useOrders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const fetchMyOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const placeOrder = useCallback(async ({ shippingAddressId, items }) => {
    setLoading(true);
    setError(null);
    try {
      const created = await createOrder({ shippingAddressId, items });
      setOrders((prev) => [created, ...prev]);
      return created;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancel = useCallback(async (id) => {
    try {
      await cancelOrder(id);
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: "CANCELLED" } : o))
      );
    } catch (e) {
      throw e;
    }
  }, []);

  return {
    orders,
    loading,
    error,
    fetchMyOrders,
    placeOrder,
    cancel,
    getOrderById,
  };
}
