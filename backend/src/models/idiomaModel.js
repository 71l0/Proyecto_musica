//const db = require('../mock/idiomaMock.js');
const db = require("../db/knex.js");

//Obtener todas los idioma
const getIdioma = async () => db('idioma').select();

//Obtener idioma por id
const getIdiomaPorId = async (id) => db('idioma').where({ id }).first();

//Crear idioma
const crearIdioma = async ({ nombre }) => {
     const [nueva] = await db('idioma')
        .insert({ nombre })
        .returning('*');
      return nueva;
}

//Editar idioma
const editarIdioma = async (id, { nombre }) => {
  const [editada] = await db('idioma')
      .where({ id })
      .update({ nombre })
      .returning('*');
    return editada;
};

//Eliminar idioma
const eliminarIdioma = async (id) => db('idioma').where({ id }).del();

module.exports = {
  getIdioma,
  getIdiomaPorId,
  crearIdioma,
  editarIdioma,
  eliminarIdioma,
};