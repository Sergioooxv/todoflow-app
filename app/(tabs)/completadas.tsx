import { Ionicons } from "@expo/vector-icons";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useTareas } from "../../context/TareasContext";


export default function Completadas() {
  const { tareas, toggleCompletada, eliminarTarea } = useTareas();
  const tareasCompletadas = tareas.filter(t => t.completada);

  const renderBorrar = (id: string) => (
    <TouchableOpacity style={styles.botonBorrar} onPress={() => eliminarTarea(id)}>
      <Ionicons name="trash-outline" size={22} color="#fff" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.contenedor}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Completadas</Text>
        <Text style={styles.contador}>{tareasCompletadas.length} tareas</Text>
      </View>

      {tareasCompletadas.length === 0 ? (
        <View style={styles.vacio}>
          <Ionicons name="checkmark-done-outline" size={48} color="#818897" />
          <Text style={styles.vacioTexto}>Aún no has completado ninguna tarea</Text>
        </View>
      ) : (
        <FlatList
          data={tareasCompletadas}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Swipeable renderRightActions={() => renderBorrar(item.id)}>
              <TouchableOpacity
                style={styles.tarea}
                onPress={() => toggleCompletada(item.id)}
              >
                <View style={styles.tareaHeader}>
                  <Ionicons name="checkmark-circle" size={22} color="#6C5CE7" />
                  <Text style={styles.tareaTitulo}>{item.titulo}</Text>
                </View>
                {item.descripcion ? (
                  <Text style={styles.tareaDescripcion}>{item.descripcion}</Text>
                ) : null}
                {item.fechaLimite ? (
                  <View style={styles.tareaFecha}>
                    <Ionicons name="calendar-outline" size={12} color="#818897" />
                    <Text style={styles.tareaFechaTexto}>
                      {item.fechaLimite.toLocaleDateString("es-ES")}
                    </Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            </Swipeable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, paddingTop: 56, paddingHorizontal: 20, backgroundColor: "#0F1115" },
  header: { marginBottom: 20 },
  titulo: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 4 },
  contador: { fontSize: 14, color: "#818897" },
  vacio: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  vacioTexto: { color: "#818897", fontSize: 15, textAlign: "center" },
  tarea: { padding: 15, backgroundColor: "#1A1D23", borderRadius: 12, marginBottom: 10, borderLeftWidth: 3, borderLeftColor: "#818897", opacity: 0.7 },
  tareaHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 4 },
  tareaTitulo: { fontSize: 16, fontWeight: "600", color: "#818897", textDecorationLine: "line-through" },
  tareaDescripcion: { fontSize: 13, color: "#818897", marginBottom: 8 },
  tareaFecha: { flexDirection: "row", alignItems: "center", gap: 4 },
  tareaFechaTexto: { fontSize: 12, color: "#818897" },
  botonBorrar: {
  backgroundColor: "#E74C3C",
  justifyContent: "center",
  alignItems: "center",
  width: 70,
  borderRadius: 12,
  marginBottom: 10,
},
});