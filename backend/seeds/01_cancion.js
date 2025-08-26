exports.seed = async function(knex) {
  await knex('cancion').del();
};
