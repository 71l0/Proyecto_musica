import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ThemedView } from '@/components/ThemedView';

const API_URL = 'http://192.168.0.47:4000/canciones'; 

interface Cancion {
  id: number;
  titulo: string;
  id_idioma: number;
  id_banda: number;
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

export default function CancionesApp() {
  const [canciones, setCanciones] = useState<Cancion[]>([]);
  const [idiomas, setIdiomas] = useState<{ id: number, nombre: string }[]>([]);
  const [bandas, setBandas] = useState<{ id: number, nombre: string }[]>([]);

  const [loading, setLoading] = useState(false);

  const [titulo, setTitulo] = useState('');
  const [idIdioma, setIdIdioma] = useState('');
  const [idBanda, setIdBanda] = useState('');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editIdIdioma, setEditIdIdioma] = useState('');
  const [editIdBanda, setEditIdBanda] = useState('');

  const [modal, setModal] = useState<ModalConfig>({
    visible: false,
    title: '',
    message: ''
  });
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);

  useEffect(() => {
    fetch('http://192.168.0.47:4000/idiomas')
      .then(res => res.json())
      .then(data => setIdiomas(data))
      .catch(() => {
        showModal({ title: 'Error', message: 'No se pudieron cargar los idiomas' });
      });
  }, []);

  useEffect(() => {
    fetch('http://192.168.0.47:4000/bandas')
      .then(res => res.json())
      .then(data => setBandas(data))
      .catch(() => {
        showModal({ title: 'Error', message: 'No se pudieron cargar las bandas' });
      });
  }, []);

  // Función para mostrar modal
  const showModal = (config: Partial<ModalConfig>) => {
    setModal({ visible: true, title: '', message: '', ...config });
  };

  const hideModal = () => setModal({ ...modal, visible: false });

  // Cargar canciones
  const cargarCanciones = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setCanciones(data);
    } catch {
      showModal({ title: 'Error', message: 'No se pudieron cargar las canciones' });
    } finally {
      setLoading(false);
    }
    console.log(canciones);
  };

  useEffect(() => {
    cargarCanciones();
  }, []);

  // Agregar canción
  const agregarCancion = async () => {
    if (!titulo || !idIdioma || !idBanda) {
      showModal({ title: 'Error', message: 'Completa todos los campos' });
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo,
          id_idioma: Number(idIdioma),
          id_banda: Number(idBanda),
        }),
      });

      if (res.ok) {
        const nuevaCancion = await res.json();
        setCanciones([...canciones, nuevaCancion]);
        setTitulo('');
        setIdIdioma('');
        setIdBanda('');
      } else {
        showModal({ title: 'Error', message: 'No se pudo agregar la canción' });
      }
    } catch {
      showModal({ title: 'Error', message: 'Error al conectar con el servidor' });
    }
  };

  // Iniciar edición
  const iniciarEdicion = (cancion: Cancion) => {
    setEditingId(cancion.id);
    setEditTitulo(cancion.titulo);
    setEditIdIdioma(String(cancion.id_idioma));
    setEditIdBanda(String(cancion.id_banda));
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setEditingId(null);
    setEditTitulo('');
    setEditIdIdioma('');
    setEditIdBanda('');
  };

  // Guardar edición
  const guardarEdicion = async () => {
    if (!editTitulo || !editIdIdioma || !editIdBanda) {
      showModal({ title: 'Error', message: 'Completa todos los campos' });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: editTitulo,
          id_idioma: Number(editIdIdioma),
          id_banda: Number(editIdBanda),
        }),
      });

      if (res.ok) {
        const cancionEditada = await res.json();
        setCanciones(canciones.map(c =>
          c.id === editingId ? cancionEditada : c
        ));
        cancelarEdicion();
      } else {
        showModal({ title: 'Error', message: 'No se pudo editar la canción' });
      }
    } catch {
      showModal({ title: 'Error', message: 'Error al conectar con el servidor' });
    }
  };

  // Eliminar canción
  const eliminarCancion = (id: number) => {
    showModal({
      title: 'Confirmar eliminación',
      message: '¿Seguro que quieres eliminar esta canción?',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
          if (res.ok || res.status === 204) {
            setCanciones(canciones.filter(c => c.id !== id));
          } else {
            showModal({ title: 'Error', message: 'No se pudo eliminar la canción' });
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
      <Text style={styles.title}>Lista de Canciones</Text>
      
      <TouchableOpacity style={styles.btnAgregar} 
        onPress={() => {setModalAgregarVisible(true)}}
      >
        <Text style={styles.btnText}>Agregar nueva cancion</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={canciones}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.cancion}>
              {editingId === item.id ? (
                <>
                  <TextInput
                    style={styles.input}
                    value={editTitulo}
                    onChangeText={setEditTitulo}
                  />
                  <Picker
                    selectedValue={editIdIdioma}
                    onValueChange={(itemValue) => setEditIdIdioma(itemValue)}
                    style={styles.input}
                  >
                    <Picker.Item label="Selecciona un idioma" value="" />
                    {idiomas.map(idioma => (
                      <Picker.Item key={idioma.id} label={idioma.nombre} value={String(idioma.id)} />
                    ))}
                  </Picker>
                  <Picker
                    selectedValue={editIdBanda}
                    onValueChange={(itemValue) => setEditIdBanda(itemValue)}
                    style={styles.input}
                  >
                    <Picker.Item label="Selecciona una banda" value="" />
                    {bandas.map(banda => (
                      <Picker.Item key={banda.id} label={banda.nombre} value={String(banda.id)} />
                    ))}
                  </Picker>
                  <TouchableOpacity
                    style={styles.btnConfirm}
                    onPress={() => {
                      guardarEdicion();
                    }}
                  >
                    <Text style={styles.btnText}>Agregar</Text>
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
                  <Text style={styles.cancionTitulo}>{item.titulo}</Text>
                  <Text style={{ marginBottom: 5 }}>
                    <strong>Idioma:</strong> {idiomas.find(i => i.id === item.id_idioma)?.nombre || item.id_idioma}
                  </Text>
                  <Text style={{ marginBottom: 5 }}>
                    <strong>Banda:</strong> {bandas.find(b => b.id === item.id_banda)?.nombre || item.id_banda}
                  </Text>
                  <TouchableOpacity
                    style={styles.btnEditar}
                    onPress={() => iniciarEdicion(item)}
                  >
                    <Text style={styles.btnText}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnEliminar}
                    onPress={() => eliminarCancion(item.id)}
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
            <Text style={styles.modalTitle}>{modal.title}</Text>
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
            <Text style={styles.modalTitle}>Agregar Canción</Text>

            <TextInput
              placeholder="Título"
              value={titulo}
              onChangeText={setTitulo}
              style={styles.input}
            />
            <Picker
              selectedValue={idIdioma}
              onValueChange={(itemValue) => setIdIdioma(itemValue)}
              style={styles.input}
            >
              <Picker.Item label="Selecciona un idioma" value="" />
              {idiomas.map(idioma => (
                <Picker.Item key={idioma.id} label={idioma.nombre} value={String(idioma.id)} />
              ))}
            </Picker>

            <Picker
              selectedValue={idBanda}
              onValueChange={(itemValue) => setIdBanda(itemValue)}
              style={styles.input}
            >
              <Picker.Item label="Selecciona una banda" value="" />
              {bandas.map(banda => (
                <Picker.Item key={banda.id} label={banda.nombre} value={String(banda.id)} />
              ))}
            </Picker>

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
                agregarCancion();
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

  //lista de canciones
  cancion: { marginBottom: 15, marginRight: 10, backgroundColor: '#d3f7f7ff', padding: 10, borderRadius: 9 },
  cancionTitulo: { fontWeight: 'bold', marginBottom: 5, fontSize: 18 },

  // Modal
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  modalMessage: { fontSize: 16, marginBottom: 20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  btnEditar: { backgroundColor: '#007AFF', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8, marginBottom: 5, alignItems: 'center',},
  btnCancel: {backgroundColor: '#FF3B30', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, marginBottom: 5, marginRight: 5, alignItems: 'center',},
  btnEliminar: { backgroundColor: '#FF3B30', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8, marginBottom: 5, alignItems: 'center',},
  btnConfirm: { backgroundColor: '#34C759', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, flex: 1, alignItems: 'center', marginBottom: 5},
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16},
  btnAgregar: { backgroundColor: '#006effff', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 20, alignItems: 'center', alignSelf: 'center', marginHorizontal: 5, marginBottom: 30},
});

