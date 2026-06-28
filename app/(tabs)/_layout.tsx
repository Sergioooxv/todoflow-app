import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TareasProvider } from "../../context/TareasContext";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <TareasProvider>
      <Tabs
        screenOptions={{
          //Estilos del header 
          headerShown: false,
          tabBarActiveTintColor: "#4f8ef7",
          tabBarInactiveTintColor: "#4a5568",
          headerStyle: { backgroundColor: "#0F1115" },
          headerTintColor: "#fff",
          //Estilos del menú del telefono
          tabBarStyle: {
            backgroundColor: "#15171C",
            height: 55 + insets.bottom,
            borderTopWidth: 0,
            elevation: 1,
            shadowColor: "#8c7fee",
            shadowOffset: { width: 0, height: -1 },
            shadowOpacity: 0.15,
            shadowRadius: 6,
          },
          tabBarIconStyle: {
            marginTop: 8,
          },
          tabBarItemStyle: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          },
          tabBarActiveTintColor: "#6C5CE7",
          tabBarInactiveTintColor: "#818897",
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
            marginTop: 4,
            marginBottom: 4,
          },
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Tareas",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "list" : "list-outline"}
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="completadas"
          options={{
            title: "Completadas",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "checkmark-circle" : "checkmark-circle-outline"}
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tabs>
    </TareasProvider>
  );
}