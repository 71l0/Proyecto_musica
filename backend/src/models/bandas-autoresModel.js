const db = require('../mock/bandasAutoresMock.js'); 
//const db = require('../db/index.js');

// Asignar un autor a banda
const agregarAutorABanda = async (id_autor, id_banda) => {
  const result = await db.query(
    `INSERT INTO bandas_autores (id_autor, id_banda)
     VALUES ($1, $2) RETURNING *`,
    [id_autor, id_banda]
  );
  return result.rows[0];
};

// Eliminar una relación bandas-autores
const eliminarAutorDeBanda = async (id_autor, id_banda) => {
  await db.query(
    `DELETE FROM bandas_autores
     WHERE id_autor = $1 AND id_banda = $2`,
    [id_autor, id_banda]
  );
};

// Obtener todos los autores de una banda
const obtenerAutorDeBanda = async (id_banda) => {
  const result = await db.query(
    `SELECT a.*
     FROM autor a
     JOIN bandas_autores ca ON a.id = ca.id_autor
     WHERE ca.id_banda = $1`,
    [id_banda]
  );
  return result.rows;
};

// Obtener todas las bandas de un autor
const obtenerBandaDeAutor = async (id_autor) => {
  const result = await db.query(
    `SELECT c.*
     FROM banda c
     JOIN bandas_autores ca ON c.id = ca.id_banda
     WHERE ca.id_autor = $1`,
    [id_autor]
  );
  return result.rows;
};

module.exports = {
  agregarAutorABanda,
  eliminarAutorDeBanda,
  obtenerAutorDeBanda,
  obtenerBandaDeAutor,
};