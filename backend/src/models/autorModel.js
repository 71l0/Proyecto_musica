const db = require("../mock/autorMock.js");
//const db = require("../db/index.js");

//Obtener todas los autores
const getAutores = async () => {
    const result = await db.query('SELECT * FROM autor');
    return result.rows;
}

//Obtener autor por id
const getAutorPorId = async () => {
    const result = await db.query('SELECT * FROM autor WHERE id = $1', [id]);
    return result.rows[0];
}

//Crear autor
const crearAutor = async ({ nombre_completo, fecha_debut, descripcion }) => {
    const result = await db.query(
        `INSERT INTO cancion (nombre_completo, fecha_debut, descripcion)
        VALUES ($1, $2, $3) RETURNING *`,
        [nombre_completo, fecha_debut, descripcion]
    );
    return result.rows[0];
}

//Editar autor
const editarAutor = async (id, { nombre_completo, fecha_debut, descripcion }) => {
  const result = await db.query(
    `UPDATE cancion
     SET nombre_completo = $1, fecha_debut = $2, descripcion = $3
     WHERE id = $4
     RETURNING *`,
    [nombre_completo, fecha_debut, descripcion, id]
  );
  return result.rows[0];
};

//Eliminar autor
const eliminarAutor = async (id) => {
  await db.query('DELETE FROM autor WHERE id = $1', [id]);
};

module.exports = {
  getAutores,
  getAutorPorId,
  crearAutor,
  editarAutor,
  eliminarAutor,
};
