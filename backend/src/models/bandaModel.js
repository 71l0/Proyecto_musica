const db = require("../mock/bandaMock.js");
//const db = require("../db/index.js");

//Obtener todas las bandas
const getBandas = async () => {
    return db;
}

//Obtener banda por id
const getBandaPorId = async () => {
    return db.find(banda => banda.id === Number(id));
}

//Crear banda
const crearBanda = async ({ nombre, fecha_debut, descripcion }) => {
    const nueva = {
          id: db.length ? Math.max(...db.map(c => c.id)) + 1 : 1,
          nombre,
          fecha_debut,
          descripcion
        };
        db.push(nueva);
        return nueva;
}

//Editar banda
const editarBanda = async (id, { nombre, fecha_debut, descripcion }) => {
  const idx = db.findIndex(c => c.id === Number(id));
    if (idx === -1) return null;
    db[idx] = { ...db[idx], nombre, fecha_debut, descripcion };
    return db[idx];
};

//Eliminar banda
const eliminarBanda = async (id) => {
   const idx = db.findIndex(c => c.id === Number(id));
   if (idx === -1) db.splice(idx, 1);
};

module.exports = {
  getBandas,
  getBandaPorId,
  crearBanda,
  editarBanda,
  eliminarBanda,
};
