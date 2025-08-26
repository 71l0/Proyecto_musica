exports.seed = async function(knex) {
  await knex('idioma').del();
  await knex('idioma').insert([
    { id: 1, nombre: 'Ingles' },
    { id: 2, nombre: 'Espanol' },
    { id: 3, nombre: 'Frances' }
  ]);
};
