import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

type Tarea = {
  id: string;
  titulo: string;
  descripcion: string;
  fechaLimite: Date | null;
  completada: boolean;
  notificacionId: string | null;
};

type TareasContextType = {
  tareas: Tarea[];
  añadirTarea: (titulo: string, descripcion: string, fechaLimite: Date | null) => Promise<void>;
  toggleCompletada: (id: string) => Promise<void>;
  eliminarTarea: (id: string) => Promise<void>;
  editarTarea: (id: string, titulo: string, descripcion: string, fechaLimite: Date | null) => Promise<void>;
};

const TareasContext = createContext<TareasContextType | null>(null);
const STORAGE_KEY = "todoflow_tareas";

export function TareasProvider({ children }: { children: React.ReactNode }) {
  const [tareas, setTareas] = useState<Tarea[]>([]);

  // Al arrancar la app: leer tareas guardadas
  useEffect(() => {
    const cargar = async () => {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) {
        const datos = JSON.parse(json).map((t: any) => ({
          ...t,
          fechaLimite: t.fechaLimite ? new Date(t.fechaLimite) : null,
        }));
        setTareas(datos);
      }
    };
    cargar();
  }, []);

  // Cada vez que tareas cambia: guardar
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tareas));
  }, [tareas]);

  const añadirTarea = async (titulo: string, descripcion: string, fechaLimite: Date | null) => {
    const notificacionId = fechaLimite ? await programarNotificacion(titulo, fechaLimite) : null;
    const nueva: Tarea = {
      id: Date.now().toString(),
      titulo,
      descripcion,
      fechaLimite,
      completada: false,
      notificacionId,
    };
    setTareas(prev => [...prev, nueva]);
  };

  const toggleCompletada = async (id: string) => {
    const tarea = tareas.find(t => t.id === id);
    if (tarea && !tarea.completada) await cancelarNotificacion(tarea.notificacionId);
    setTareas(prev => prev.map(t =>
      t.id === id ? { ...t, completada: !t.completada, notificacionId: null } : t
    ));
  };

  const eliminarTarea = async (id: string) => {
    const tarea = tareas.find(t => t.id === id);
    if (tarea) await cancelarNotificacion(tarea.notificacionId);
    setTareas(prev => prev.filter(t => t.id !== id));
  };

  const editarTarea = async (id: string, titulo: string, descripcion: string, fechaLimite: Date | null) => {
    const tarea = tareas.find(t => t.id === id);
    if (tarea) await cancelarNotificacion(tarea.notificacionId);
    const notificacionId = fechaLimite ? await programarNotificacion(titulo, fechaLimite) : null;
    setTareas(prev => prev.map(t =>
      t.id === id ? { ...t, titulo, descripcion, fechaLimite, notificacionId } : t
    ));
  };

  const pedirPermisos = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
      });
    }
    return status === "granted";
  }

  const programarNotificacion = async (titulo: string, fecha: Date): Promise<string | null> => {
    const permiso = await pedirPermisos();

    const fechaNotificacion = new Date(fecha);
    fechaNotificacion.setHours(9, 0, 0, 0);

    if (!permiso || fechaNotificacion <= new Date()) return null;

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "📋 Tarea pendiente",
        body: titulo,
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: fechaNotificacion },
    });
    return id;
  };

  const cancelarNotificacion = async (notificionId: string | null) => {
    if (notificionId) {
      await Notifications.cancelScheduledNotificationAsync(notificionId);
    }
  };

  return (
    <TareasContext.Provider value={{ tareas, añadirTarea, toggleCompletada, eliminarTarea, editarTarea }}>
      {children}
    </TareasContext.Provider>
  );
}

export function useTareas() {
  const context = useContext(TareasContext);
  if (!context) throw new Error("useTareas debe usarse dentro de TareasProvider");
  return context;
}