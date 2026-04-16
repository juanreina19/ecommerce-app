import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../src/auth/context/AuthContext";
import { getMyProfile, getPersonalInfo } from "../../../src/auth/services/authService";
import LoadingSpinner from "../../../src/shared/components/LoadingSpinner";

function InfoRow({ label, value }) {
  return (
    <View className="flex-row justify-between items-center py-3.5 border-b border-surface-border">
      <Text className="text-gray-400 text-sm">{label}</Text>
      <Text className="text-white text-sm font-medium flex-1 text-right ml-4" numberOfLines={1}>
        {value || "—"}
      </Text>
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut, updateUser } = useAuth();

  const [profile, setProfile] = useState(user);
  const [profileInfo, setProfileInfo] = useState(user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [res, res1] = await Promise.all([
          getMyProfile(),
          getPersonalInfo()
        ]);
        setProfile(res);
        setProfileInfo(res1);
        updateUser(res);
        console.log(res);
        console.log(res1);
      } catch (_) { }
      finally { setLoading(false); }
    })();
  }, []);

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro de que quieres salir?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Salir", style: "destructive", onPress: signOut },
    ]);
  };

  const initials = [profile?.firstName, profile?.lastName]
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .join("") || "U";

  if (loading && !profile) return <LoadingSpinner />;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-6 pb-10">

          {/* Avatar + nombre */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 rounded-full bg-primary-600 items-center justify-center mb-4">
              <Text className="text-white text-2xl font-bold">{initials}</Text>
            </View>
            <Text className="text-white text-xl font-bold">
              {[profileInfo?.firstName, profileInfo?.lastName].filter(Boolean).join(" ") || "Usuario"}
            </Text>
            <Text className="text-gray-400 text-sm mt-1">{profile?.email || ""}</Text>
          </View>

          {/* Información */}
          <View className="bg-surface-card border border-surface-border rounded-2xl px-5 mb-6">
            <Text className="text-gray-500 text-xs font-medium pt-4 pb-2 uppercase tracking-wider">
              Información personal
            </Text>
            <InfoRow label="Nombre" value={profileInfo?.firstName} />
            <InfoRow label="Apellido" value={profileInfo?.lastName} />
            <InfoRow label="Correo" value={profile?.email} />
            <InfoRow label="Teléfono" value={profileInfo?.phoneNumber} />
            <InfoRow label="Fecha nac." value={profileInfo?.dateOfBirth} />
          </View>

          {/* Acciones */}
          <View className="gap-3">
            <TouchableOpacity
              onPress={() => router.push("/(app)/profile/edit")}
              className="bg-surface-card border border-surface-border rounded-xl flex-row items-center px-5 py-4"
            >
              <Text className="text-lg mr-3">✏️</Text>
              <Text className="text-white font-medium flex-1">Editar perfil</Text>
              <Text className="text-gray-500">›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(app)/profile/change-password")}
              className="bg-surface-card border border-surface-border rounded-xl flex-row items-center px-5 py-4"
            >
              <Text className="text-lg mr-3">🔒</Text>
              <Text className="text-white font-medium flex-1">Cambiar contraseña</Text>
              <Text className="text-gray-500">›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogout}
              className="bg-red-950 border border-red-800 rounded-xl flex-row items-center px-5 py-4 mt-2"
            >
              <Text className="text-lg mr-3">🚪</Text>
              <Text className="text-red-400 font-medium">Cerrar sesión</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
