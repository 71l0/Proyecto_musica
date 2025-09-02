import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { API_URL } from '../constants/api';
import { LinearGradient } from 'expo-linear-gradient';

interface Banda {
  id: number;
  nombre: string;
  fecha_debut: string;
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

  const [busquedaBanda, setBusquedaBanda] = useState('');

  const [expandBanda, setExpandBanda] = useState<number[]>([]);

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

  // Cargar bandas
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

  // Agregar banda
  const agregarBanda = async () => {
    if (!nombre || !fecha_debut || !descripcion) {
      showModal({ title: 'Error', message: 'Completa todos los campos' });
      return;
    }

    const anio = parseInt(fecha_debut, 10);
    if (isNaN(anio)){
      showModal({ title: 'Error', message: 'El año de fundación debe ser un número válido' });
      return;
    }
    const fechaDebut = `${anio}-01-01`; 
    console.log(fechaDebut);

    try {
      const res = await fetch(`${API_URL}/banda`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre,
          fecha_debut: parseInt(fechaDebut, 10),
          descripcion,
        }),
      });

      if (res.ok) {
        const nuevabanda = await res.json();
        setBanda([...banda, nuevabanda]);
        setNombre('');
        setFechaDebut('');
        setDescripcion('');
        setModalAgregarVisible(false);
      } else {
        showModal({ title: 'Error', message: 'No se pudo agregar la banda' });
      }
    } catch (error) {
      console.error(error);
      showModal({ title: 'Error', message: 'Error al conectar con el servidor' });
    }
  };

  // Iniciar edición
  const iniciarEdicion = (banda: Banda) => {
    setEditingId(banda.id);
    setEditNombre(banda.nombre);
    setEditFechaDebut(String(banda.fecha_debut));
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

    const anio = parseInt(editFechaDebut, 10);
    if (isNaN(anio)) {
      showModal({ title: 'Error', message: 'El año de fundación debe ser un número válido' });
      return;
    }
    const fechaDebut = `${anio}-01-01`;

    try {
      const res = await fetch(`${API_URL}/banda/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: editNombre,
          fecha_debut: parseInt(fechaDebut, 10),
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

  //Filtrar bandas segun entrada de busqueda
  const bandasFiltradas = banda.filter(banda => {
    const query = busquedaBanda.toLowerCase();
    return (
      banda.nombre.toLowerCase().includes(query) ||
      banda.fecha_debut.toString().includes(query) ||
      banda.descripcion.toLowerCase().includes(query)
    );
  });

  //Expandir y contraer descripcion de banda
  const toggleExpand = (id: number) => {
    if (expandBanda.includes(id)) {
      setExpandBanda(expandBanda.filter(bandaId => bandaId !== id));
    } else {
      setExpandBanda([...expandBanda, id]);
    }
  }

  return (
    <LinearGradient colors={['#212747ff', '#0d0f1f']} style={styles.container}>
      <Text style={styles.title}>Lista de Bandas</Text>
      
      <TextInput
        placeholder="Buscar banda..."
        value={busquedaBanda}
        onChangeText={setBusquedaBanda}
        style={[styles.input, {borderRadius: 18, marginBottom: 20, backgroundColor: '#d6fff1ff', borderWidth: 2, borderColor: '#000000ff'}]}
      />
      
      <TouchableOpacity style={styles.btnAgregar} 
        onPress={() => {
          setNombre('');
          setFechaDebut('');
          setDescripcion('');
          setModalAgregarVisible(true)
        }}
      >
        <Text style={styles.btnText}>Agregar nueva banda</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={bandasFiltradas}
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
                    style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                    value={editDescripcion}
                    onChangeText={setEditDescripcion}
                    multiline
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
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Año de fundación: </Text> <Text style={{ fontSize: 16 }}>{item.fecha_debut}</Text>
                  </Text>
                  <Text style={{ marginBottom: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16}}>
                      {expandBanda.includes(item.id)
                        ? item.descripcion // Mostrar descripción completa
                        : item.descripcion.length > 120
                          ? item.descripcion.substring(0, 120) + '... ' // Mostrar resumen cortado con "..."
                          : item.descripcion // Mostrar descripción completa si es corta
                        }
                    </Text>
                  </Text>
                          
                  {item.descripcion.length > 120 && (
                    <TouchableOpacity onPress={() => toggleExpand(item.id)}>
                      <Text style={{ color: '#001933ff', fontWeight: 'bold', marginBottom: 15 }}>
                        {expandBanda.includes(item.id) ? 'Mostrar menos' : 'Mostrar más'}
                      </Text>
                    </TouchableOpacity>
                  )}

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
                style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                placeholder="Descripción"
                value={descripcion}
                onChangeText={setDescripcion}
                multiline
            />
            <View style={styles.modalButtons}>
                <TouchableOpacity
                style={styles.btnCancel}
                onPress={() => {
                  setNombre('');
                  setFechaDebut('');
                  setDescripcion('');
                  setModalAgregarVisible(false)
                }}
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, marginTop: 30, backgroundColor: '#212747ff' },
  title: { fontSize: 30, fontWeight: 'bold', marginBottom: 30, color: '#dff5f5ff', textAlign: 'center' },
  subtitle: { fontSize: 18, marginTop: 20, marginBottom: 20 },

  //Entrada
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 8, borderRadius: 4, backgroundColor: '#eee' },

  //lista de bandas
  banda: { marginBottom: 15, marginRight: 10, backgroundColor: '#c8f0f0ff', padding: 10, borderRadius: 9, borderWidth: 1, borderColor: '#000000ff' },
  bandaTitulo: { fontWeight: 'bold', marginBottom: 5, fontSize: 20 },

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
