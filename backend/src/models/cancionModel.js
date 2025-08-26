//const db = require('../mock/cancionMock.js');
const db = require("../db/knex.js");

//Obtener todas las cancion
const getCancion = async () => db('cancion').select();

//Obtener cancion por id
const getCancionPorId = async (id) => db('cancion').where({ id }).first();

//Crear cancion
const crearCancion = async ({ titulo, idioma_id, banda_id }) => {
    const [nueva] = await db('cancion')
    .insert({ titulo, idioma_id, banda_id })
    .returning('*');
  return nueva;
};

//Editar cancion
const editarCancion = async (id, { titulo, idioma_id, banda_id }) => {
  const [editada] = await db('cancion')
    .where({ id })
    .update({ titulo, idioma_id, banda_id })
    .returning('*');
  return editada;
};

//Eliminar cancion
const eliminarCancion = async (id) => db('cancion').where({ id }).del();

module.exports = {
  getCancion,
  getCancionPorId,
  crearCancion,
  editarCancion,
  eliminarCancion,
};
