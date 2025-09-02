import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { API_URL } from '../constants/api';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

interface Cancion {
  id: number;
  titulo: string;
  idioma_id: number;
  banda_id: number;
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
  const router = useRouter();

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

  const listaIdiomas = Array.isArray(idiomas) ? idiomas : [];
  const listaBandas = Array.isArray(bandas) ? bandas : [];

  const [busquedaCancion, setBusquedaCancion] = useState('');

  const [busquedaBanda, setBusquedaBanda] = useState('');
  const [busquedaEditBanda, setBusquedaEditBanda] = useState('');

  const [modal, setModal] = useState<ModalConfig>({
    visible: false,
    title: '',
    message: ''
  });
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/idioma`)
      .then(res => res.json())
      .then(data => setIdiomas(data))
      .catch(() => {
        showModal({ title: 'Error', message: 'No se pudieron cargar los idiomas' });
      });
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/banda`)
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
      const res = await fetch(`${API_URL}/cancion`);
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
      const res = await fetch(`${API_URL}/cancion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo,
          idioma_id: Number(idIdioma),
          banda_id: Number(idBanda),
        }),
      });

      if (res.ok) {
        const nuevaCancion = await res.json();
        setCanciones([...canciones, nuevaCancion]);
        setTitulo('');
        setIdIdioma('');
        setIdBanda('');
        setBusquedaBanda('');
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
    setEditIdIdioma(String(cancion.idioma_id));
    setEditIdBanda(String(cancion.banda_id));
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
      const res = await fetch(`${API_URL}/cancion/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: editTitulo,
          idioma_id: Number(editIdIdioma),
          banda_id: Number(editIdBanda),
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
          const res = await fetch(`${API_URL}/cancion/${id}`, { method: 'DELETE' });
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

  //Buscador de canciones
  const cancionesFiltradas = canciones.filter(cancion => {
    const nombreBanda = bandas.find(b => b.id === cancion.banda_id)?.nombre.toLowerCase() || '';
    const nombreIdioma = idiomas.find(i => i.id === cancion.idioma_id)?.nombre.toLowerCase() || '';
    const query = busquedaCancion.toLowerCase();

    return (
      cancion.titulo.toLowerCase().includes(query) ||
      nombreBanda.includes(query) ||
      nombreIdioma.includes(query)
    );
  });


  //Filtramos las bandas segun lo que se escriba para crear
  const bandasFiltradas = listaBandas.filter(banda =>
    banda.nombre.toLowerCase().includes(busquedaBanda.toLowerCase())
  );

  //Filtramos las bandas segun lo que se escriba para editar
  const bandasEditFiltradas = listaBandas.filter(banda =>
    banda.nombre.toLowerCase().includes(busquedaEditBanda.toLowerCase())
  );

  return (
    <LinearGradient colors={['#212747ff', '#0d0f1f']} style={styles.container}>
      <Text style={styles.title}>Lista de Canciones</Text>

      <TextInput
        placeholder="Buscar canción..."
        value={busquedaCancion}
        onChangeText={setBusquedaCancion}
        style={[styles.input, {borderRadius: 18, marginBottom: 20, backgroundColor: '#d6fff1ff', borderWidth: 2, borderColor: '#000000ff'}]}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
        <TouchableOpacity style={[styles.btnAgregar, { flex: 1, marginRight: 5 }]} 
          onPress={() => {setModalAgregarVisible(true)}}
        >
          <Text style={styles.btnText}>Agregar nueva cancion</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.btnBanda, { flex: 1, marginLeft: 5 }]} 
          onPress={() => router.push('../BandasScreen')}
        >
          <Text style={styles.btnText}>Ver lista de Bandas</Text>
        </TouchableOpacity>
      </View>


      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={cancionesFiltradas}
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
                    {listaIdiomas.map(idioma => (
                      <Picker.Item key={idioma.id} label={idioma.nombre} value={String(idioma.id)} />
                    ))}
                  </Picker>
                  
                  <TextInput 
                    placeholder='Buscar banda...'
                    value={busquedaEditBanda}
                    onChangeText={setBusquedaEditBanda}
                    style={styles.input}
                  />

                  <FlatList 
                    data={bandasEditFiltradas}
                    keyExtractor={(item) => item.id.toString()}
                    style={{ maxHeight: 150, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={{
                          padding: 10,
                          backgroundColor: idBanda === String(item.id) ? '#444' : '#222'
                        }}
                        onPress={() => {
                          setEditIdBanda(String(item.id));
                          setBusquedaEditBanda(item.nombre); // Mostramos la banda elegida en el input
                        }}
                      >
                        <Text style={{ color: 'white' }}>{item.nombre}</Text>
                      </TouchableOpacity>
                    )}
                  />

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
                    <Text style={{ fontWeight: 'bold' }}>Idioma: </Text> <Text>{idiomas.find(i => i.id === item.idioma_id)?.nombre || item.idioma_id}</Text>
                  </Text>
                  <Text style={{ marginBottom: 5 }}>
                    <Text style={{ fontWeight: 'bold' }}>Banda:</Text> <Text>{bandas.find(b => b.id === item.banda_id)?.nombre || item.banda_id}</Text>
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
              {listaIdiomas.map(idioma => (
                <Picker.Item key={idioma.id} label={idioma.nombre} value={String(idioma.id)} />
              ))}
            </Picker>

            <TextInput 
              placeholder='Buscar banda...'
              value={busquedaBanda}
              onChangeText={setBusquedaBanda}
              style={styles.input}
            />
            <FlatList 
              data={bandasFiltradas}
              keyExtractor={(item) => item.id.toString()}
              style={{ maxHeight: 150, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }}
                renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    padding: 10,
                    backgroundColor: idBanda === String(item.id) ? '#444' : '#222'
                  }}
                  onPress={() => {
                    setIdBanda(String(item.id));
                    setBusquedaBanda(item.nombre); // Mostramos la banda elegida en el input
                  }}
                >
                  <Text style={{ color: 'white' }}>{item.nombre}</Text>
                </TouchableOpacity>
              )}
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
    </LinearGradient>
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
  btnBanda: { backgroundColor: '#058c81ff', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 20, alignItems: 'center', alignSelf: 'center', marginHorizontal: 5, marginBottom: 30},
});

