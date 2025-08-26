//const db = require("../mock/bandaMock.js");
const db = require("../db/knex.js");

//Obtener todas las banda
const getBanda = async () => db('banda').select();

//Obtener banda por id
const getBandaPorId = async (id) => db('banda').where({ id }).first();
//Crear banda
const crearBanda = async ({ nombre, fecha_debut, descripcion }) => {
    const [nueva] = await db('banda')
        .insert({ nombre, fecha_debut, descripcion })
        .returning('*');
      return nueva;
}

//Editar banda
const editarBanda = async (id, { nombre, fecha_debut, descripcion }) => {
  const [editada] = await db('banda')
      .where({ id })
      .update({ nombre, fecha_debut, descripcion })
      .returning('*');
    return editada;  
};

//Eliminar banda
const eliminarBanda = async (id) => db('banda').where({ id }).del();

module.exports = {
  getBanda,
  getBandaPorId,
  crearBanda,
  editarBanda,
  eliminarBanda,
};
