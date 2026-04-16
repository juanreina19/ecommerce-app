import axiosClient from "../../shared/services/axiosClient";

// ─── PRODUCTOS ────────────────────────────────────────────────────────────────

export async function getProducts(params = {}) {
  const response = await axiosClient.get("/api/products", { params });
  return response.data.data;
}

export async function getProductById(id) {
  const response = await axiosClient.get(`/api/products/${id}`);
  return response.data.data;
}

export async function searchProducts(name) {
  const response = await axiosClient.get("/api/products/search", { params: { name } });
  return response.data.data;
}

export async function getProductsByCategory(categoryId) {
  const response = await axiosClient.get(`/api/products/category/${categoryId}`);
  return response.data.data;
}

/**
 * Crear producto.
 * Campos reales de la API según Postman:
 * categoryId, name, price, stock, imageUrl, description, brand, model, weight, color
 */
export async function createProduct(data) {
  const payload = {
    categoryId: data.categoryId || null,
    name: data.name,
    price: data.price,
    stock: data.stock || 0,
    imageUrl: data.imageUrl || "",
    description: data.description || "",
    brand: data.brand || "",
    model: data.model || "",
    weight: data.weight || null,
    color: data.color || "",
  };
  console.log("=== CREATE PRODUCT ===");
  console.log("payload:", JSON.stringify(payload));

  try {
    const response = await axiosClient.post("/api/products", payload);
    console.log("RESPUESTA OK:", JSON.stringify(response.data));
    return response.data.data;
  } catch (error) {
    console.log("ERROR STATUS:", error?.response?.status);
    console.log("ERROR DATA:", JSON.stringify(error?.response?.data));
    console.log("ERROR MSG:", error?.message);
    throw error;
  }
}

/**
 * Editar producto — mismos campos que crear.
 */
export async function updateProduct(id, data) {
  const response = await axiosClient.put(`/api/products/${id}`, {
    categoryId: data.categoryId || null,
    name: data.name,
    price: data.price,
    stock: data.stock || 0,
    imageUrl: data.imageUrl || "",
    description: data.description || "",
    brand: data.brand || "",
    model: data.model || "",
    weight: data.weight || null,
    color: data.color || "",
  });
  return response.data.data;
}

export async function deleteProduct(id) {
  const response = await axiosClient.delete(`/api/products/${id}`);
  return response.data;
}

// ─── CATEGORÍAS ───────────────────────────────────────────────────────────────

export async function getCategories() {
  const response = await axiosClient.get("/api/categories");
  return response.data.data;
}

export async function createCategory({ name, description }) {
  const response = await axiosClient.post("/api/categories", { name, description });
  return response.data.data;
}
