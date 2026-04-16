# E-Commerce App — React Native + Expo

Aplicación móvil de e-commerce desarrollada con React Native, Expo, NativeWind y la API REST de E-Commerce.

---

## 🚀 Instalación rápida

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar y configurar variables de entorno
cp .env.example .env
# → Editar .env con tus credenciales reales

# 3. Iniciar el proyecto
npx expo start
```

---

## 📦 Dependencias principales

```bash
npm install \
  expo@~51.0.0 \
  expo-router@~3.5.0 \
  expo-status-bar@~1.12.1 \
  expo-image-picker@~15.0.7 \
  expo-secure-store@~13.0.2 \
  expo-font@~12.0.10 \
  expo-splash-screen@~0.27.5 \
  react@18.2.0 \
  react-native@0.74.5 \
  react-native-safe-area-context@4.10.5 \
  react-native-screens@3.31.1 \
  react-native-gesture-handler@~2.16.1 \
  react-native-reanimated@~3.10.1 \
  axios@^1.7.2 \
  crypto-js@^4.2.0 \
  nativewind@^4.0.1 \
  tailwindcss@^3.4.0 \
  @react-native-async-storage/async-storage@1.23.1
```

---

## 🗂 Estructura del proyecto

```
ecommerce-app/
├── app/
│   ├── _layout.jsx              # Root layout + AuthProvider + NavigationGuard
│   ├── (auth)/
│   │   ├── _layout.jsx
│   │   ├── login.jsx            # Pantalla de login
│   │   └── register.jsx         # Pantalla de registro
│   └── (app)/
│       ├── _layout.jsx          # Tab Navigator
│       ├── products/
│       │   ├── _layout.jsx
│       │   ├── index.jsx         # Lista de productos
│       │   ├── [id].jsx          # Detalle de producto
│       │   ├── create.jsx        # Crear producto
│       │   └── edit/[id].jsx     # Editar producto
│       └── profile/
│           ├── _layout.jsx
│           ├── index.jsx         # Ver perfil
│           ├── edit.jsx          # Editar perfil
│           └── change-password.jsx
└── src/
    ├── auth/
    │   ├── context/AuthContext.jsx   # Estado global + JWT
    │   └── services/authService.js  # API de auth y usuarios
    ├── products/
    │   ├── services/productService.js
    │   ├── hooks/useProducts.js
    │   └── components/ProductCard.jsx
    └── shared/
        ├── services/
        │   ├── axiosClient.js        # Axios + interceptor JWT
        │   └── cloudinaryService.js  # Subida de imágenes
        ├── components/
        │   ├── Button.jsx
        │   ├── Input.jsx
        │   ├── LoadingSpinner.jsx
        │   ├── ErrorMessage.jsx
        │   └── ImagePickerField.jsx
        └── utils/
            └── crypto.js            # AES-256-CBC
```

---

## 🔐 Configuración de Cloudinary

1. Crear cuenta en [cloudinary.com](https://cloudinary.com) (gratuita)
2. Ir a **Settings → Upload → Upload Presets**
3. Crear un preset con **Signing Mode: Unsigned**
4. Copiar **Cloud Name** y el nombre del preset al `.env`

---

## 🛠 División de trabajo (3 integrantes)

| Integrante | Módulo | Archivos principales |
|---|---|---|
| **I1** | Auth & Usuarios | `AuthContext`, `authService`, pantallas login/register/perfil |
| **I2** | Productos & CRUD | `productService`, `useProducts`, pantallas productos |
| **I3** | Imágenes & Shared | `cloudinaryService`, `axiosClient`, `ImagePickerField`, navegación |

---

## ⚠ Notas importantes

- Las contraseñas se envían cifradas con **AES-256-CBC**. La clave y el IV deben coincidir con el backend.
- El JWT se almacena en **SecureStore** (no AsyncStorage) para mayor seguridad.
- Las imágenes se suben a **Cloudinary** antes de crear/editar el producto; solo se guarda la URL en la base de datos.
- La API base: `https://ecommerce-api.wittysky-ae597b7e.westus2.azurecontainerapps.io`
