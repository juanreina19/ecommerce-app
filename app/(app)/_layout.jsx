import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#16161E",
          borderTopColor:  "#2A2A38",
          borderTopWidth:  0.5,
          paddingBottom:   6,
          paddingTop:      6,
          height:          60,
        },
        tabBarActiveTintColor:   "#6366F1",
        tabBarInactiveTintColor: "#6B7280",
        tabBarLabelStyle: {
          fontSize:   11,
          fontFamily: "SpaceGrotesk-Medium",
        },
      }}
    >
      <Tabs.Screen
        name="products"
        options={{
          title: "Productos",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>📦</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Pedidos",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>🛍️</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favoritos",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>❤️</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>👤</Text>
          ),
        }}
      />
    </Tabs>
  );
}
