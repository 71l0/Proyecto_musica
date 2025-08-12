const db = require('../mock/autoresGenerosMock.js');
//const db = require('../db/index.js');

// Asignar un genero a autor
const agregarAutorGeneros = async (id_genero, id_autor) => {
  const result = await db.query(
    `INSERT INTO autores_generos (id_genero, id_autor)
     VALUES ($1, $2) RETURNING *`,
    [id_genero, id_autor]
  );
  return result.rows[0];
};

// Eliminar una relación autor-genero
const eliminarAutorDeGenero = async (id_genero, id_autor) => {
  await db.query(
    `DELETE FROM autores_generos
     WHERE id_genero = $1 AND id_autor = $2`,
    [id_genero, id_autor]
  );
};

// Obtener todos los autores de un genero
const obtenerAutoresPorGenero = async (id_genero) => {
  const result = await db.query(
    `SELECT a.*
     FROM autor a
     JOIN autores_generos ca ON a.id = ca.id_autor
     WHERE ca.id_genero = $1`,
    [id_genero]
  );
  return result.rows;
};

// Obtener todas los generos de un autor
const obtenerGenerosDeAutor = async (id_autor) => {
  const result = await db.query(
    `SELECT c.*
     FROM genero c
     JOIN autores_generos ca ON c.id = ca.id_genero
     WHERE ca.id_autor = $1`,
    [id_autor]
  );
  return result.rows;
};

module.exports = {
  agregarAutorGeneros,
  eliminarAutorDeGenero,
  obtenerAutoresPorGenero,
  obtenerGenerosDeAutor,
};
