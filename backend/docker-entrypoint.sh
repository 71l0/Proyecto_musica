#!/bin/bash
set -e

# Esperar a que la base de datos esté lista (opcional, útil si DB está en otro contenedor)
# Puedes usar pg_isready o un sleep simple
# sleep 5

# Ejecutar migraciones
npx knex migrate:latest --env development

# Ejecutar seeds
npx knex seed:run --env development

# Iniciar el servidor
exec node src/server.js
