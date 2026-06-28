import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { FlatList, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import Animated, { FadeOutDown, LinearTransition, SlideInRight } from "react-native-reanimated";
import { useTareas } from "../../context/TareasContext";


export default function Index() {
  const { tareas, añadirTarea, toggleCompletada, eliminarTarea, editarTarea } = useTareas();
  const [modalVisible, setModalVisible] = useState(false);
  const [textoNuevo, setTextoNuevo] = useState("");
  const [descripcionNueva, setDescripcionNueva] = useState("");
  const [fechaNueva, setFechaNueva] = useState<Date | null>(null);
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const [tareaEditando, setTareaEditando] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  const handleAñadir = () => {
    if (tareaEditando) {
      editarTarea(tareaEditando, textoNuevo, descripcionNueva, fechaNueva);
      setTareaEditando(null);
    } else {
      añadirTarea(textoNuevo, descripcionNueva, fechaNueva);
    }
    setTextoNuevo("");
    setDescripcionNueva("");
    setFechaNueva(null);
    setModalVisible(false);
  };

  const handleEditar = (item: { id: string; titulo: string; descripcion: string; fechaLimite: Date | null }) => {
    setTareaEditando(item.id);
    setTextoNuevo(item.titulo);
    setDescripcionNueva(item.descripcion);
    setFechaNueva(item.fechaLimite);
    setModalVisible(true);
  };

  const renderBorrar = (id: string) => (
    <TouchableOpacity style={styles.botonBorrar} onPress={() => eliminarTarea(id)}>
      <Ionicons name="trash-outline" size={22} color="#fff" />
    </TouchableOpacity>
  )

  const renderEditar = (item: { id: string; titulo: string; descripcion: string; fechaLimite: Date | null }) => (
    <TouchableOpacity style={styles.botonEditar} onPress={() => handleEditar(item)}>
      <Ionicons name="pencil-outline" size={22} color="#fff" />
    </TouchableOpacity>
  );
  return (
    <View style={styles.contenedor}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.titulo}>TodoFlow</Text>
        <TouchableOpacity style={styles.botonAdd} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.contenedorBusqueda}>
        <Ionicons name="search-outline" size={18} color="#818897" />
        <TextInput
          style={styles.inputBusqueda}
          placeholder="Buscar tareas..."
          placeholderTextColor="#818897"
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      <Text style={styles.contador}>{tareas.filter(t => !t.completada).length} tareas pendientes</Text>

      <FlatList
        data={tareas
          .filter(t => !t.completada)
          .filter(t => t.titulo.toLowerCase().includes(busqueda.toLowerCase()))
        }
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Animated.View
            entering={SlideInRight}
            exiting={FadeOutDown}
            layout={LinearTransition}
          >
            <Swipeable
              renderRightActions={() => renderBorrar(item.id)}
              renderLeftActions={() => renderEditar(item)}
            >
              <TouchableOpacity
                style={[styles.tarea, item.completada && styles.tareaCompletada]}
                onPress={() => toggleCompletada(item.id)}
              >
                <View style={styles.tareaHeader}>
                  <Ionicons
                    name={item.completada ? "checkmark-circle" : "ellipse-outline"}
                    size={22}
                    color={item.completada ? "#6C5CE7" : "#818897"}
                  />
                  <Text style={[styles.tareaTitulo, item.completada && styles.textoCompletado]}>
                    {item.titulo}
                  </Text>
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
          </Animated.View>
        )}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalFondo}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={styles.modalCaja}>
              <Text style={styles.modalTitulo}>{tareaEditando ? "Editar Tarea" : "Nueva Tarea"}</Text>
              <TextInput
                style={styles.input}
                placeholder="Título de la tarea"
                placeholderTextColor="#818897"
                value={textoNuevo}
                onChangeText={setTextoNuevo}
              />
              <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="Descripción (opcional)"
                placeholderTextColor="#818897"
                value={descripcionNueva}
                onChangeText={setDescripcionNueva}
                multiline
              />
              <TouchableOpacity style={styles.botonFecha} onPress={() => setMostrarDatePicker(true)}>
                <Ionicons name="calendar-outline" size={18} color="#818897" />
                <Text style={styles.botonFechaTexto}>
                  {fechaNueva ? fechaNueva.toLocaleDateString("es-ES") : "Añadir fecha límite"}
                </Text>
              </TouchableOpacity>
              {mostrarDatePicker && (
                <DateTimePicker
                  value={fechaNueva || new Date()}
                  mode="date"
                  onChange={(event, date) => {
                    setMostrarDatePicker(false);
                    if (date) setFechaNueva(date);
                  }}
                />
              )}
              <TouchableOpacity style={styles.botonConfirmar} onPress={handleAñadir}>
                <Text style={styles.botonTexto}>Añadir</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.botonCancelar}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, paddingTop: 56, paddingHorizontal: 20, backgroundColor: "#0F1115" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  botonAdd: { backgroundColor: "#6C5CE7", width: 44, height: 44, borderRadius: 22, justifyContent: "center", alignItems: "center" },
  contador: { fontSize: 14, color: "#818897", marginBottom: 20 },
  titulo: { fontSize: 28, fontWeight: "bold", color: "#fff" },
  tarea: { padding: 15, backgroundColor: "#1A1D23", borderRadius: 12, marginBottom: 10, borderLeftWidth: 3, borderLeftColor: "#6C5CE7" },
  tareaTitulo: { fontSize: 16, fontWeight: "600", color: "#fff", marginBottom: 4 },
  tareaDescripcion: { fontSize: 13, color: "#818897", marginBottom: 8 },
  tareaFecha: { flexDirection: "row", alignItems: "center", gap: 4 },
  tareaFechaTexto: { fontSize: 12, color: "#818897" },
  modalFondo: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "flex-end" },
  modalCaja: { backgroundColor: "#1A1D23", borderRadius: 20, padding: 24, marginHorizontal: 10, marginBottom: 40 },
  modalTitulo: { fontSize: 18, fontWeight: "bold", color: "#fff", marginBottom: 16 },
  input: { backgroundColor: "#0F1115", borderRadius: 10, padding: 14, color: "#fff", fontSize: 16, marginBottom: 12 },
  botonConfirmar: { backgroundColor: "#6C5CE7", padding: 14, borderRadius: 10, alignItems: "center", marginBottom: 8 },
  botonTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  botonCancelar: { color: "#818897", textAlign: "center", padding: 8 },
  botonFecha: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#0F1115", padding: 14, borderRadius: 10, marginBottom: 12 },
  botonFechaTexto: { color: "#818897", fontSize: 15 },
  tareaCompletada: { opacity: 0.5, borderLeftColor: "#818897" },
  tareaHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 4 },
  textoCompletado: { textDecorationLine: "line-through", color: "#818897" },
  botonBorrar: {
    backgroundColor: "#E74C3C",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    borderRadius: 12,
    marginBottom: 10,
  },
  botonEditar: {
    backgroundColor: "#4f8ef7",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    borderRadius: 12,
    marginBottom: 10,
  },
  contenedorBusqueda: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1D23",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    gap: 8,
  },
  inputBusqueda: {
    flex: 1,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 15,
  },
});