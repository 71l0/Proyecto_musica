import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { API_URL } from '../constants/api';

interface Banda {
  id: number;
  nombre: string;
  fecha_debut: number;
  descripcion: string;
}

interface ModalConfig {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export default function BandasApp() {
  const [banda, setBanda] = useState<Banda[]>([]);

  const [loading, setLoading] = useState(false);

  const [nombre, setNombre] = useState('');
  const [fecha_debut, setFechaDebut] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const [editFechaDebut, setEditFechaDebut]= useState('');
  const [editDescripcion, setEditDescripcion] = useState('');

  const [modal, setModal] = useState<ModalConfig>({
    visible: false,
    title: '',
    message: ''
  });
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/banda`)
      .then(res => res.json())
      .then(data => setBanda(data))
      .catch(() => {
        showModal({ title: 'Error', message: 'No se pudieron cargar las bandas' });
      });
  }, []);

  // Función para mostrar modal
  const showModal = (config: Partial<ModalConfig>) => {
    setModal({ visible: true, title: '', message: '', ...config });
  };

  const hideModal = () => setModal({ ...modal, visible: false });

  // Cargar bandaes
  const cargarBandas = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/banda`);
      const data = await res.json();
      setBanda(data);
    } catch {
      showModal({ title: 'Error', message: 'No se pudieron cargar las bandas' });
    } finally {
      setLoading(false);
    }
    console.log(banda);
  };

  useEffect(() => {
    cargarBandas();
  }, []);

  // Agregar canción
  const agregarBanda = async () => {
    if (!nombre || !fecha_debut || !descripcion) {
      showModal({ title: 'Error', message: 'Completa todos los campos' });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/banda`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          fecha_debut: parseInt(fecha_debut, 10),
          descripcion,
        }),
      });

      if (res.ok) {
        const nuevabanda = await res.json();
        setBanda([...banda, nuevabanda]);
        setNombre('');
        setFechaDebut('');
        setDescripcion('');
      } else {
        showModal({ title: 'Error', message: 'No se pudo agregar la banda' });
      }
    } catch {
      showModal({ title: 'Error', message: 'Error al conectar con el servidor' });
    }
  };

  // Iniciar edición
  const iniciarEdicion = (banda: Banda) => {
    setEditingId(banda.id);
    setEditNombre(banda.nombre);
    setFechaDebut(String(banda.fecha_debut));
    setEditDescripcion(String(banda.descripcion));
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setEditingId(null);
    setEditNombre('');
    setEditFechaDebut('');
    setEditDescripcion('');
  };

  // Guardar edición
  const guardarEdicion = async () => {
    if (!editNombre || !editFechaDebut || !editDescripcion) {
      showModal({ title: 'Error', message: 'Completa todos los campos' });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/banda/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: editNombre,
          fecha_debut: parseInt(editFechaDebut, 10),
          descripcion: editDescripcion,
        }),
      });

      if (res.ok) {
        const bandaEditada = await res.json();
        setBanda(banda.map(b =>
          b.id === editingId ? bandaEditada : b
        ));
        cancelarEdicion();
      } else {
        showModal({ title: 'Error', message: 'No se pudo editar la banda' });
      }
    } catch {
      showModal({ title: 'Error', message: 'Error al conectar con el servidor' });
    }
  };

  // Eliminar canción
  const eliminarBanda = (id: number) => {
    showModal({
      title: 'Confirmar eliminación',
      message: '¿Seguro que quieres eliminar esta banda?',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_URL}/banda/${id}`, { method: 'DELETE' });
          if (res.ok || res.status === 204) {
            setBanda(banda.filter(b => b.id !== id));
          } else {
            showModal({ title: 'Error', message: 'No se pudo eliminar la banda' });
          }
        } catch {
          showModal({ title: 'Error', message: 'Error al conectar con el servidor' });
        } finally {
          hideModal();
        }
      },
      onCancel: hideModal
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Bandas</Text>
      
      <TouchableOpacity style={styles.btnAgregar} 
        onPress={() => {setModalAgregarVisible(true)}}
      >
        <Text style={styles.btnText}>Agregar nueva banda</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={banda}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.banda}>
              {editingId === item.id ? (
                <>
                  <TextInput
                    style={styles.input}
                    value={editNombre}
                    onChangeText={setEditNombre}
                  />
                  <TextInput
                    style={styles.input}
                    value={editFechaDebut}
                    onChangeText={setEditFechaDebut}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={styles.input}
                    value={editDescripcion}
                    onChangeText={setEditDescripcion}
                  />
                  <TouchableOpacity
                    style={styles.btnConfirm}
                    onPress={() => {
                      guardarEdicion();
                    }}
                  >
                    <Text style={styles.btnText}>Guardar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnCancel}
                    onPress={() => cancelarEdicion()}
                  >
                    <Text style={styles.btnText}>Cancelar</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.bandaTitulo}>{item.nombre}</Text>
                  <Text style={{ marginBottom: 5 }}>
                    <Text style={{ fontWeight: 'bold' }}>Año de fundación: </Text> <Text>{item.fecha_debut}</Text>
                  </Text>
                  <Text style={{ marginBottom: 5 }}>
                    <Text style={{ fontWeight: 'bold' }}>{item.descripcion}</Text>
                  </Text>
                  <TouchableOpacity
                    style={styles.btnEditar}
                    onPress={() => iniciarEdicion(item)}
                  >
                    <Text style={styles.btnText}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnEliminar}
                    onPress={() => eliminarBanda(item.id)}
                  >
                    <Text style={styles.btnText}>Eliminar</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        />
      )}

      {/* Modal genérico */}
      <Modal
        transparent
        animationType="fade"
        visible={modal.visible}
        onRequestClose={hideModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalNombre}>{modal.title}</Text>
            <Text style={styles.modalMessage}>{modal.message}</Text>

            <View style={styles.modalButtons}>
              {modal.cancelText && (
                <TouchableOpacity style={[styles.btnEditar, { marginRight: 5 }]}  onPress={modal.onCancel}>
                  <Text style={styles.btnText}>{modal.cancelText}</Text>
                </TouchableOpacity>
              )}
              {modal.confirmText ? (
                <TouchableOpacity style={styles.btnEliminar} onPress={modal.onConfirm}>
                  <Text style={styles.btnText}>{modal.confirmText}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.btnConfirm} onPress={hideModal}>
                  <Text style={styles.btnText}>Aceptar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="slide"
        visible={modalAgregarVisible}
        onRequestClose={() => setModalAgregarVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalNombre}>Agregar Banda</Text>

            <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={nombre}
                onChangeText={setNombre}
            />
            <TextInput
                style={styles.input}
                placeholder="Año de fundación"
                value={fecha_debut}
                onChangeText={setFechaDebut}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Descripción"
                value={descripcion}
                onChangeText={setDescripcion}
            />
            <View style={styles.modalButtons}>
                <TouchableOpacity
                style={styles.btnCancel}
                onPress={() => setModalAgregarVisible(false)}
                >
                <Text style={styles.btnText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                style={styles.btnConfirm}
                onPress={() => {
                    agregarBanda();
                    setModalAgregarVisible(false);
                }}
                >
                <Text style={styles.btnText}>Agregar</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
    </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, marginTop: 30, backgroundColor: '#212747ff' },
  title: { fontSize: 30, fontWeight: 'bold', marginBottom: 30, color: '#dff5f5ff', textAlign: 'center' },
  subtitle: { fontSize: 18, marginTop: 20, marginBottom: 10 },

  //Entrada
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 8, borderRadius: 4, backgroundColor: '#eee' },

  //lista de bandas
  banda: { marginBottom: 15, marginRight: 10, backgroundColor: '#d3f7f7ff', padding: 10, borderRadius: 9 },
  bandaTitulo: { fontWeight: 'bold', marginBottom: 5, fontSize: 18 },

  // Modal
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
  modalNombre: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  modalMessage: { fontSize: 16, marginBottom: 20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  btnEditar: { backgroundColor: '#007AFF', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8, marginBottom: 5, alignItems: 'center',},
  btnCancel: {backgroundColor: '#FF3B30', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, marginBottom: 5, marginRight: 5, alignItems: 'center',},
  btnEliminar: { backgroundColor: '#FF3B30', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8, marginBottom: 5, alignItems: 'center',},
  btnConfirm: { backgroundColor: '#34C759', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, flex: 1, alignItems: 'center', marginBottom: 5},
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16},
  btnAgregar: { backgroundColor: '#006effff', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 20, alignItems: 'center', alignSelf: 'center', marginHorizontal: 5, marginBottom: 30},
});
