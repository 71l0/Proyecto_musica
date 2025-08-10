const db = require('../db');

// Asignar un genero a banda
const agregarGeneroABanda = async (id_genero, id_banda) => {
  const result = await db.query(
    `INSERT INTO bandas_generos (id_genero, id_banda)
     VALUES ($1, $2) RETURNING *`,
    [id_genero, id_banda]
  );
  return result.rows[0];
};

// Eliminar una relación banda-genero
const eliminarGeneroDeBanda = async (id_genero, id_banda) => {
  await db.query(
    `DELETE FROM bandas_generos
     WHERE id_genero = $1 AND id_banda = $2`,
    [id_genero, id_banda]
  );
};

// Obtener todos las bandas de un genero
const obtenerBandasDeGenero = async (id_genero) => {
  const result = await db.query(
    `SELECT a.*
     FROM banda a
     JOIN bandas_generos ca ON a.id = ca.id_banda
     WHERE ca.id_genero = $1`,
    [id_genero]
  );
  return result.rows;
};

// Obtener todas los generos de un autor
const obtenerGeneroDeBanda = async (id_banda) => {
  const result = await db.query(
    `SELECT c.*
     FROM genero c
     JOIN bandas_generos ca ON c.id = ca.id_genero
     WHERE ca.id_banda = $1`,
    [id_banda]
  );
  return result.rows;
};

module.exports = {
  agregarGeneroABanda,
  eliminarGeneroDeBanda,
  obtenerBandasDeGenero,
  obtenerGeneroDeBanda,
};