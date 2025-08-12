const db = require('../mock/idiomaMock.js');
//const db = require("../db/index.js");

//Obtener todas los idiomas
const getIdiomas = async () => {
    const result = await db.query('SELECT * FROM idioma');
    return result.rows;
}

//Obtener idioma por id
const getIdiomaPorId = async () => {
    const result = await db.query('SELECT * FROM idioma WHERE id = $1', [id]);
    return result.rows[0];
}

//Crear idioma
const crearIdioma = async ({ nombre }) => {
    const result = await db.query(
        `INSERT INTO cancion (nombre)
        VALUES ($1) RETURNING *`,
        [nombre]
    );
    return result.rows[0];
}

//Editar idioma
const editarIdioma = async (id, { nombre }) => {
  const result = await db.query(
    `UPDATE idioma
     SET nombre = $1
     WHERE id = $2
     RETURNING *`,
    [nombre, id]
  );
  return result.rows[0];
};

//Eliminar idioma
const eliminarIdioma = async (id) => {
  await db.query('DELETE FROM idioma WHERE id = $1', [id]);
};

module.exports = {
  getIdiomas,
  getIdiomaPorId,
  crearIdioma,
  editarIdioma,
  eliminarIdioma,
};