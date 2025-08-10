CREATE TABLE idioma (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
)

CREATE TABLE genero (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
)

CREATE TABLE autor (
    id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    fecha_debut DATE NOT NULL,
    descripcion TEXT
)

CREATE TABLE autores_generos (
    id SERIAL PRIMARY KEY,
    id_autor INT REFERENCES autor(id) ON DELETE CASCADE,
    id_genero INT REFERENCES genero(id) ON DELETE CASCADE
)

CREATE TABLE banda (
    id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    fecha_debut DATE NOT NULL,
    descripcion TEXT
)

CREATE TABLE bandas_generos (
    id SERIAL PRIMARY KEY,
    id_banda INT REFERENCES banda(id) ON DELETE CASCADE,
    id_genero INT REFERENCES genero(id) ON DELETE CASCADE
)

CREATE TABLE bandas_autores (
    id SERIAL PRIMARY KEY,
    id_autor INT REFERENCES autor(id) ON DELETE CASCADE,
    id_banda INT REFERENCES banda(id) ON DELETE CASCADE
)

CREATE TABLE cancion (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    id_idioma INT REFERENCES idioma(id) ON DELETE SET NULL,
    id_banda INT REFERENCES banda(id) ON DELETE SET NULL
)

CREATE TABLE canciones_autores (
    id SERIAL PRIMARY KEY,
    id_cancion INT REFERENCES cancion(id) ON DELETE CASCADE,
    id_autor INT REFERENCES autor(id) ON DELETE CASCADE   
)

CREATE TABLE canciones_generos (
    id SERIAL PRIMARY KEY,
    id_cancion INT REFERENCES cancion(id) ON DELETE CASCADE,
    id_genero INT REFERENCES genero(id) ON DELETE CASCADE   
)

