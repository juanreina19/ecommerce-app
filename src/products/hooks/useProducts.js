import { useState, useCallback } from "react";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";

export function useProducts() {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [pagination, setPagination] = useState({ page: 0, totalPages: 0 });

  const fetchProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts({ page: 0, size: 20, ...params });
      // La API puede retornar un array o un objeto paginado
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts(data?.content ?? []);
        setPagination({
          page:       data?.number ?? 0,
          totalPages: data?.totalPages ?? 1,
        });
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = useCallback(async (productData) => {
    setLoading(true);
    setError(null);
    try {
      const created = await createProduct(productData);
      setProducts((prev) => [created, ...prev]);
      return created;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const editProduct = useCallback(async (id, productData) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateProduct(id, productData);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
      );
      return updated;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeProduct = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    addProduct,
    editProduct,
    removeProduct,
    getProductById,
  };
}
