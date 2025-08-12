const db = require('../mock/cancionMock.js');
//const db = require("../db/index.js");

//Obtener todas las canciones
const getCanciones = async () => {
    const result = await db.query('SELECT * FROM cancion');
    return result.rows;
}

//Obtener cancion por id
const getCancionPorId = async (id) => {
    const result = await db.query('SELECT * FROM cancion WHERE id = $1', [id]);
    return result.rows[0];
}

//Crear cancion
const crearCancion = async ({ titulo, id_idioma, id_banda }) => {
    const result = await db.query(
        `INSERT INTO cancion (titulo, id_idioma, id_banda)
        VALUES ($1, $2, $3) RETURNING *`,
        [titulo, id_idioma, id_banda]
    );
    return result.rows[0];
}

//Editar cancion
const editarCancion = async (id, { titulo, id_idioma, id_banda }) => {
  const result = await db.query(
    `UPDATE cancion
     SET titulo = $1, id_idioma = $2, id_banda = $3
     WHERE id = $4
     RETURNING *`,
    [titulo, id_idioma, id_banda, id]
  );
  return result.rows[0];
};

//Eliminar cancion
const eliminarCancion = async (id) => {
  await db.query('DELETE FROM cancion WHERE id = $1', [id]);
};

module.exports = {
  getCanciones,
  getCancionPorId,
  crearCancion,
  editarCancion,
  eliminarCancion,
};
