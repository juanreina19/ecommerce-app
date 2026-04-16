import * as ImagePicker from "expo-image-picker";

const CLOUD_NAME    = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || "your_cloud_name";
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_PRESET     || "your_upload_preset";
const UPLOAD_URL    = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/**
 * Abre el selector de imágenes del dispositivo.
 * @returns {Promise<ImagePicker.ImagePickerAsset | null>}
 */
export async function pickImage() {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    throw new Error("Se necesita permiso para acceder a la galería.");
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });

  if (result.canceled) return null;
  return result.assets[0];
}

/**
 * Abre la cámara para tomar una foto.
 * @returns {Promise<ImagePicker.ImagePickerAsset | null>}
 */
export async function takePhoto() {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== "granted") {
    throw new Error("Se necesita permiso para acceder a la cámara.");
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });

  if (result.canceled) return null;
  return result.assets[0];
}

/**
 * Sube una imagen a Cloudinary y retorna la URL segura.
 * @param {ImagePicker.ImagePickerAsset} asset
 * @returns {Promise<string>} secure_url de Cloudinary
 */
export async function uploadToCloudinary(asset) {
  const formData = new FormData();

  // Extraer extensión y tipo MIME
  const uriParts = asset.uri.split(".");
  const fileType = uriParts[uriParts.length - 1];

  formData.append("file", {
    uri:  asset.uri,
    name: `upload.${fileType}`,
    type: `image/${fileType}`,
  });
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "ecommerce_products");

  const response = await fetch(UPLOAD_URL, {
    method: "POST",
    body:   formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || "Error al subir la imagen");
  }

  const data = await response.json();
  return data.secure_url;
}

/**
 * Flujo completo: seleccionar + subir imagen.
 * @param {"library"|"camera"} source
 * @returns {Promise<string | null>} URL de Cloudinary o null si se canceló
 */
export async function selectAndUploadImage(source = "library") {
  const asset =
    source === "camera" ? await takePhoto() : await pickImage();

  if (!asset) return null;

  const url = await uploadToCloudinary(asset);
  return url;
}
