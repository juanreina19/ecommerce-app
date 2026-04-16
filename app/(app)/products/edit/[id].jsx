import React, { useState, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getProductById, updateProduct, getCategories,
} from "../../../../src/products/services/productService";
import { selectAndUploadImage } from "../../../../src/shared/services/cloudinaryService";
import Input          from "../../../../src/shared/components/Input";
import Button         from "../../../../src/shared/components/Button";
import LoadingSpinner from "../../../../src/shared/components/LoadingSpinner";

export default function EditProductScreen() {
  const { id } = useLocalSearchParams();
  const router  = useRouter();

  const [form, setForm] = useState({
    name: "", description: "", price: "", stock: "",
    brand: "", model: "", color: "", weight: "",
    categoryId: "", imageUrl: "",
  });
  const [categories,   setCategories]   = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [errors,       setErrors]       = useState({});

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  useEffect(() => {
    Promise.all([getProductById(id), getCategories()])
      .then(([product, cats]) => {
        setForm({
          name:        product.name        || "",
          description: product.description || "",
          price:       String(product.price   ?? ""),
          stock:       String(product.stock   ?? ""),
          brand:       product.brand       || "",
          model:       product.model       || "",
          color:       product.color       || "",
          weight:      product.weight != null ? String(product.weight) : "",
          categoryId:  String(product.categoryId ?? product.category?.id ?? ""),
          imageUrl:    product.imageUrl    || "",
        });
        setCategories(cats || []);
      })
      .catch((e) => Alert.alert("Error", e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePickImage = async () => {
    setUploadingImg(true);
    try {
      const url = await selectAndUploadImage("library");
      if (url) set("imageUrl")(url);
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setUploadingImg(false);
    }
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = "El nombre es requerido";
    if (!form.price.trim()) e.price = "El precio es requerido";
    if (isNaN(parseFloat(form.price))) e.price = "Precio inválido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await updateProduct(id, {
        name:        form.name.trim(),
        description: form.description.trim(),
        price:       parseFloat(form.price),
        stock:       form.stock   ? parseInt(form.stock)    : 0,
        brand:       form.brand.trim(),
        model:       form.model.trim(),
        color:       form.color.trim(),
        weight:      form.weight  ? parseFloat(form.weight) : null,
        categoryId:  form.categoryId ? parseInt(form.categoryId) : null,
        imageUrl:    form.imageUrl,
      });
      Alert.alert("Guardado", "Producto actualizado correctamente.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Cargando producto..." />;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View className="px-5 pt-5 pb-10">

            <TouchableOpacity onPress={() => router.back()} className="mb-6">
              <Text className="text-primary-400 text-sm">← Volver</Text>
            </TouchableOpacity>

            <Text className="text-white text-2xl font-bold mb-1">Editar producto</Text>
            <Text className="text-gray-400 text-sm mb-8">Modifica los datos del producto</Text>

            {/* Imagen */}
            <View className="mb-4">
              <Text className="text-gray-400 text-sm font-medium mb-2">Imagen del producto</Text>
              <TouchableOpacity
                onPress={handlePickImage}
                disabled={uploadingImg}
                className="bg-surface-card border border-dashed border-surface-border rounded-xl h-32 items-center justify-center"
              >
                {uploadingImg ? (
                  <Text className="text-gray-400 text-sm">Subiendo...</Text>
                ) : form.imageUrl ? (
                  <Text className="text-green-400 text-sm">✓ Imagen cargada — tocar para cambiar</Text>
                ) : (
                  <>
                    <Text className="text-primary-400 text-2xl">+</Text>
                    <Text className="text-gray-500 text-xs mt-1">Seleccionar imagen</Text>
                  </>
                )}
              </TouchableOpacity>
              {form.imageUrl ? (
                <Text className="text-gray-500 text-xs mt-1" numberOfLines={1}>{form.imageUrl}</Text>
              ) : null}
            </View>

            <Input label="Nombre *"      value={form.name}        onChangeText={set("name")}        placeholder="Nombre del producto"   autoCapitalize="sentences" error={errors.name} />
            <Input label="Descripción"   value={form.description} onChangeText={set("description")} placeholder="Descripción"           autoCapitalize="sentences" multiline numberOfLines={3} />
            <Input label="Marca"         value={form.brand}       onChangeText={set("brand")}       placeholder="Ej: Samsung"           autoCapitalize="words" />
            <Input label="Modelo"        value={form.model}       onChangeText={set("model")}       placeholder="Ej: Galaxy A13"        />
            <Input label="Color"         value={form.color}       onChangeText={set("color")}       placeholder="Ej: Negro"             autoCapitalize="words" />

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Input label="Precio *" value={form.price}  onChangeText={set("price")}  placeholder="0.00" keyboardType="decimal-pad" error={errors.price} />
              </View>
              <View className="flex-1">
                <Input label="Stock"    value={form.stock}  onChangeText={set("stock")}  placeholder="0"    keyboardType="number-pad" />
              </View>
            </View>

            <Input label="Peso (kg)" value={form.weight} onChangeText={set("weight")} placeholder="Ej: 0.192" keyboardType="decimal-pad" />

            {categories.length > 0 && (
              <View className="mb-4">
                <Text className="text-gray-400 text-sm font-medium mb-2">Categoría</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-2">
                    {categories.map((cat) => (
                      <TouchableOpacity
                        key={cat.id}
                        onPress={() => set("categoryId")(String(cat.id))}
                        className={`px-4 py-2 rounded-full border ${
                          form.categoryId === String(cat.id)
                            ? "bg-primary-600 border-primary-600"
                            : "bg-surface-card border-surface-border"
                        }`}
                      >
                        <Text className={`text-sm ${form.categoryId === String(cat.id) ? "text-white" : "text-gray-300"}`}>
                          {cat.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}

            <Button label="Guardar cambios" onPress={handleSave} loading={saving} className="mt-4" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
