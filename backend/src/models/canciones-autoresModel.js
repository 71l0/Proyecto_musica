const db = require('../db');

// Asignar un autor a una canción
const agregarAutorACancion = async (id_cancion, id_autor) => {
  const result = await db.query(
    `INSERT INTO canciones_autores (id_cancion, id_autor)
     VALUES ($1, $2) RETURNING *`,
    [id_cancion, id_autor]
  );
  return result.rows[0];
};

// Eliminar una relación canción-autor
const eliminarAutorDeCancion = async (id_cancion, id_autor) => {
  await db.query(
    `DELETE FROM canciones_autores
     WHERE id_cancion = $1 AND id_autor = $2`,
    [id_cancion, id_autor]
  );
};

// Obtener todos los autores de una canción
const obtenerAutoresPorCancion = async (id_cancion) => {
  const result = await db.query(
    `SELECT a.*
     FROM autor a
     JOIN canciones_autores ca ON a.id = ca.id_autor
     WHERE ca.id_cancion = $1`,
    [id_cancion]
  );
  return result.rows;
};

// Obtener todas las canciones de un autor
const obtenerCancionesPorAutor = async (id_autor) => {
  const result = await db.query(
    `SELECT c.*
     FROM cancion c
     JOIN canciones_autores ca ON c.id = ca.id_cancion
     WHERE ca.id_autor = $1`,
    [id_autor]
  );
  return result.rows;
};

module.exports = {
  agregarAutorACancion,
  eliminarAutorDeCancion,
  obtenerAutoresPorCancion,
  obtenerCancionesPorAutor,
};
