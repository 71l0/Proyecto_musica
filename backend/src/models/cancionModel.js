const db = require('../mock/cancionMock.js');
//const db = require("../db/index.js");

//Obtener todas las canciones
const getCanciones = async () => {
    return db; 
}

//Obtener cancion por id
const getCancionPorId = async (id) => {
    return db.find(cancion => cancion.id === Number(id));
}

//Crear cancion
const crearCancion = async ({ titulo, id_idioma, id_banda }) => {
    const nueva = {
      id: db.length ? Math.max(...db.map(c => c.id)) + 1 : 1,
      titulo,
      id_idioma,
      id_banda
    };
    db.push(nueva);
    return nueva;
}

//Editar cancion
const editarCancion = async (id, { titulo, id_idioma, id_banda }) => {
  const idx = db.findIndex(c => c.id === Number(id));
  if (idx === -1) return null;
  db[idx] = { ...db[idx], titulo, id_idioma, id_banda };
  return db[idx];
};

//Eliminar cancion
const eliminarCancion = async (id) => {
 const idx = db.findIndex(c => c.id === Number(id));
 if (idx === -1) db.splice(idx, 1);
};

module.exports = {
  getCanciones,
  getCancionPorId,
  crearCancion,
  editarCancion,
  eliminarCancion,
};
