/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  
    // Tabla idioma
  const hasIdioma = await knex.schema.hasTable('idioma');
  if (!hasIdioma) {
    await knex.schema.createTable('idioma', (table) => {
      table.increments('id').primary();
      table.string('nombre').notNullable();
    })
  }
  // Tabla banda
  const hasBanda = await knex.schema.hasTable('banda');
  if (!hasBanda) {
    await knex.schema.createTable('banda', (table) => {
      table.increments('id').primary();
      table.string('nombre').notNullable();
      table.integer('fecha_debut');
      table.text('descripcion');
    });
  }
  // Tabla cancion
  const hasCancion = await knex.schema.hasTable('cancion');
  if (!hasCancion) {
    await knex.schema.createTable('cancion', (table) => {
      table.increments('id').primary();
      table.string('titulo').notNullable();
      table
        .integer('idioma_id')
        .unsigned()
        .references('id')
        .inTable('idioma')
        .onDelete('SET NULL');
      table
        .integer('banda_id')
        .unsigned()
        .references('id')
        .inTable('banda')
        .onDelete('SET NULL');
    });
  };
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('cancion')
  await knex.schema.dropTableIfExists('banda')
  await knex.schema.dropTableIfExists('idioma');
};