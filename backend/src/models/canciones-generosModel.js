const db = require('../db');

// Relacionar un género con una canción
const agregarGeneroACancion = async (id_cancion, id_genero) => {
  const result = await db.query(
    `INSERT INTO canciones_generos (id_cancion, id_genero)
     VALUES ($1, $2) RETURNING *`,
    [id_cancion, id_genero]
  );
  return result.rows[0];
};

// Eliminar relación canción-género
const eliminarGeneroDeCancion = async (id_cancion, id_genero) => {
  await db.query(
    `DELETE FROM canciones_generos
     WHERE id_cancion = $1 AND id_genero = $2`,
    [id_cancion, id_genero]
  );
};

//Obtener todos los géneros de una canción
const obtenerGenerosDeCancion = async (id_cancion) => {
  const result = await db.query(
    `SELECT g.*
     FROM genero g
     JOIN canciones_generos cg ON g.id = cg.id_genero
     WHERE cg.id_cancion = $1`,
    [id_cancion]
  );
  return result.rows;
};

//Obtener todas las canciones que tienen un género específico
const obtenerCancionesPorGenero = async (id_genero) => {
  const result = await db.query(
    `SELECT c.*
     FROM cancion c
     JOIN canciones_generos cg ON c.id = cg.id_cancion
     WHERE cg.id_genero = $1`,
    [id_genero]
  );
  return result.rows;
};

module.exports = {
  agregarGeneroACancion,
  eliminarGeneroDeCancion,
  obtenerGenerosDeCancion,
  obtenerCancionesPorGenero,
};
