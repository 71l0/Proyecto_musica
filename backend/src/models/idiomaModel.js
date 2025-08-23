const db = require('../mock/idiomaMock.js');
//const db = require("../db/index.js");

//Obtener todas los idiomas
const getIdiomas = async () => {
    return db;
}

//Obtener idioma por id
const getIdiomaPorId = async () => {
    return db.find(idioma => idioma.id === Number(id));
}

//Crear idioma
const crearIdioma = async ({ nombre }) => {
    const nueva = {
          id: db.length ? Math.max(...db.map(c => c.id)) + 1 : 1,
          nombre
        };
        db.push(nueva);
        return nueva;
}

//Editar idioma
const editarIdioma = async (id, { nombre }) => {
  const idx = db.findIndex(c => c.id === Number(id));
    if (idx === -1) return null;
    db[idx] = { ...db[idx], nombre };
    return db[idx];
};

//Eliminar idioma
const eliminarIdioma = async (id) => {
  const idx = db.findIndex(c => c.id === Number(id));
  if (idx === -1) db.splice(idx, 1);
};

module.exports = {
  getIdiomas,
  getIdiomaPorId,
  crearIdioma,
  editarIdioma,
  eliminarIdioma,
};