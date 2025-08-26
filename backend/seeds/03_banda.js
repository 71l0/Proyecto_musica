exports.seed = async function(knex) {
  await knex('banda').del();
  await knex('banda').insert([
    { id: 1, nombre: 'The Beatles', fecha_debut: 1960, descripcion: 'Banda britanica de rock' },
    { id: 2, nombre: 'Soda Stereo', fecha_debut: 1982, descripcion: 'Banda argentina de rock en espanol' },
    { id: 3, nombre: 'Daft Punk', fecha_debut: 1993, descripcion: 'Duo frances de musica electronica' },
  ]);
};
    