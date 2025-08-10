const db = require("../db");

//Obtener todas las bandas
const getBandas = async () => {
    const result = await db.query('SELECT * FROM banda');
    return result.rows;
}

//Obtener banda por id
const getBandaPorId = async () => {
    const result = await db.query('SELECT * FROM banda WHERE id = $1', [id]);
    return result.rows[0];
}

//Crear banda
const crearBanda = async ({ nombre_completo, fecha_debut, descripcion }) => {
    const result = await db.query(
        `INSERT INTO banda (nombre_completo, fecha_debut, descripcion)
        VALUES ($1, $2, $3) RETURNING *`,
        [nombre_completo, fecha_debut, descripcion]
    );
    return result.rows[0];
}

//Editar banda
const editarBanda = async (id, { nombre_completo, fecha_debut, descripcion }) => {
  const result = await db.query(
    `UPDATE banda
     SET nombre_completo = $1, fecha_debut = $2, descripcion = $3
     WHERE id = $4
     RETURNING *`,
    [nombre_completo, fecha_debut, descripcion, id]
  );
  return result.rows[0];
};

//Eliminar banda
const eliminarBanda = async (id) => {
  await db.query('DELETE FROM banda WHERE id = $1', [id]);
};

module.exports = {
  getBandas,
  getBandaPorId,
  crearBanda,
  editarBanda,
  eliminarBanda,
};
