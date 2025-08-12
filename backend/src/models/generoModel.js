const db = require('../mock/generoMock.js');
//const db = require("../db/index.js");

//Obtener todas los genero
const getGenero = async () => {
    const result = await db.query('SELECT * FROM genero');
    return result.rows;
}

//Obtener genero por id
const getGeneroPorId = async () => {
    const result = await db.query('SELECT * FROM genero WHERE id = $1', [id]);
    return result.rows[0];
}

//Crear genero
const crearGenero = async ({ nombre }) => {
    const result = await db.query(
        `INSERT INTO genero (nombre)
        VALUES ($1) RETURNING *`,
        [nombre]
    );
    return result.rows[0];
}

//Editar genero
const editarGenero = async (id, { nombre }) => {
  const result = await db.query(
    `UPDATE genero
     SET nombre = $1
     WHERE id = $2
     RETURNING *`,
    [nombre, id]
  );
  return result.rows[0];
};

//Eliminar genero
const eliminarGenero = async (id) => {
  await db.query('DELETE FROM genero WHERE id = $1', [id]);
};

module.exports = {
  getGenero,
  getGeneroPorId,
  crearGenero,
  editarGenero,
  eliminarGenero,
};