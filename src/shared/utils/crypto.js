import CryptoJS from "crypto-js";

const AES_SECRET_KEY = process.env.EXPO_PUBLIC_AES_SECRET_KEY || "0123456789ABCDEF0123456789ABCDEF";

/**
 * Cifra una contraseña con AES-256-CBC.
 * Coincide con el backend AES256Util.java:
 * - Key: clave como UTF-8
 * - IV: primeros 16 bytes de la clave
 * - Output: Base64
 */
export function encryptAES(password) {
  if (!AES_SECRET_KEY) throw new Error("AES_SECRET_KEY no configurada");

  const key = CryptoJS.enc.Utf8.parse(AES_SECRET_KEY);
  const iv = CryptoJS.enc.Utf8.parse(AES_SECRET_KEY.substring(0, 16));

  const encrypted = CryptoJS.AES.encrypt(password, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString(); // Base64
}
