import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';

const API_URL = 'http://localhost:4000/canciones'; 

interface Cancion {
  id: number;
  titulo: string;
  id_idioma: number;
  id_banda: number;
}

export default function CancionesApp() {
  const [canciones, setCanciones] = useState<Cancion[]>([]);
  const [loading, setLoading] = useState(false);

  const [titulo, setTitulo] = useState('');
  const [idIdioma, setIdIdioma] = useState('');
  const [idBanda, setIdBanda] = useState('');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editIdIdioma, setEditIdIdioma] = useState('');
  const [editIdBanda, setEditIdBanda] = useState('');

  // Cargar canciones
  const cargarCanciones = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setCanciones(data);
    } catch {
      Alert.alert('Error', 'No se pudieron cargar las canciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCanciones();
  }, []);

  // Agregar canción
  const agregarCancion = async () => {
    if (!titulo || !idIdioma || !idBanda) {
      Alert.alert('Error', 'Completa todos los campos');
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
        Alert.alert('Error', 'No se pudo agregar la canción');
      }
    } catch {
      Alert.alert('Error', 'Error al conectar con el servidor');
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
      Alert.alert('Error', 'Completa todos los campos');
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
        Alert.alert('Error', 'No se pudo editar la canción');
      }
    } catch {
      Alert.alert('Error', 'Error al conectar con el servidor');
    }
  };

  // Eliminar canción
  const eliminarCancion = async (id: number) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Seguro que quieres eliminar esta canción?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: async () => {
          try {
            const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (res.ok || res.status === 204) {
              setCanciones(canciones.filter(c => c.id !== id));
            } else {
              Alert.alert('Error', 'No se pudo eliminar la canción');
            }
          } catch {
            Alert.alert('Error', 'Error al conectar con el servidor');
          }
        }}
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Canciones</Text>

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
                  <TextInput
                    style={styles.input}
                    value={editIdIdioma}
                    onChangeText={setEditIdIdioma}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={styles.input}
                    value={editIdBanda}
                    onChangeText={setEditIdBanda}
                    keyboardType="numeric"
                  />
                  <Button title="Guardar" onPress={guardarEdicion} />
                  <Button title="Cancelar" onPress={cancelarEdicion} />
                </>
              ) : (
                <>
                  <Text style={styles.cancionTitulo}>{item.titulo}</Text>
                  <Text>Idioma ID: {item.id_idioma}</Text>
                  <Text>Banda ID: {item.id_banda}</Text>
                  <Button title="Editar" onPress={() => iniciarEdicion(item)} />
                  <Button
                    title="Eliminar"
                    color="red"
                    onPress={() => eliminarCancion(item.id)}
                  />
                </>
              )}
            </View>
          )}
        />
      )}

      <Text style={styles.subtitle}>Agregar Canción</Text>
      <TextInput
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
        style={styles.input}
      />
      <TextInput
        placeholder="ID Idioma (número)"
        value={idIdioma}
        onChangeText={setIdIdioma}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="ID Banda (número)"
        value={idBanda}
        onChangeText={setIdBanda}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Agregar" onPress={agregarCancion} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, marginTop: 30 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 18, marginTop: 20, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 8, borderRadius: 4 },
  cancion: { marginBottom: 15, backgroundColor: '#eee', padding: 10, borderRadius: 5 },
  cancionTitulo: { fontWeight: 'bold' },
});
