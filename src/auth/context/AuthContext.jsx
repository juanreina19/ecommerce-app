import React, { createContext, useContext, useReducer, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { TOKEN_KEY } from "../../shared/services/axiosClient";

// ─── ESTADO INICIAL ──────────────────────────────────────────────────────────
const initialState = {
  user:        null,
  token:       null,
  isLoading:   true,   // mientras se verifica el token almacenado
  isLoggedIn:  false,
};

// ─── REDUCER ─────────────────────────────────────────────────────────────────
function authReducer(state, action) {
  switch (action.type) {
    case "RESTORE_TOKEN":
      return {
        ...state,
        token:      action.token,
        user:       action.user,
        isLoggedIn: !!action.token,
        isLoading:  false,
      };
    case "LOGIN":
      return {
        ...state,
        token:      action.token,
        user:       action.user,
        isLoggedIn: true,
        isLoading:  false,
      };
    case "LOGOUT":
      return {
        ...state,
        token:      null,
        user:       null,
        isLoggedIn: false,
        isLoading:  false,
      };
    case "UPDATE_USER":
      return { ...state, user: { ...state.user, ...action.user } };
    default:
      return state;
  }
}

// ─── CONTEXT ─────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Al arrancar la app, verificar si hay token guardado
  useEffect(() => {
    (async () => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        const userJson = await SecureStore.getItemAsync("user_data");
        const user = userJson ? JSON.parse(userJson) : null;
        dispatch({ type: "RESTORE_TOKEN", token, user });
      } catch {
        dispatch({ type: "RESTORE_TOKEN", token: null, user: null });
      }
    })();
  }, []);

  // ─── ACCIONES ────────────────────────────────────────────────────────────
  const signIn = async (token, user) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync("user_data", JSON.stringify(user));
    dispatch({ type: "LOGIN", token, user });
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {});
    await SecureStore.deleteItemAsync("user_data").catch(() => {});
    dispatch({ type: "LOGOUT" });
  };

  const updateUser = async (updatedUser) => {
    const merged = { ...state.user, ...updatedUser };
    await SecureStore.setItemAsync("user_data", JSON.stringify(merged));
    dispatch({ type: "UPDATE_USER", user: updatedUser });
  };

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── HOOK ─────────────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
