DROP TABLE IF EXISTS cancion;
DROP TABLE IF EXISTS banda;
DROP TABLE IF EXISTS idioma;

CREATE TABLE idioma (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE banda (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    fecha_debut INT NOT NULL,
    descripcion TEXT
);

CREATE TABLE cancion (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    idioma_id INT REFERENCES idioma(id),
    banda_id INT REFERENCES banda(id)
);

-- Datos iniciales
INSERT INTO idioma (nombre) VALUES ('Ingles'), ('Espanol'), ('Frances');

INSERT INTO banda (nombre, fecha_debut, descripcion) VALUES 
  ('The Beatles', 1960, 'Banda de musica rock y pop de Liverpool, Inglaterra'),
  ('Soda Stereo', 1982, 'Banda de rock argentina formada en Buenos Aires'),
  ('Daft Punk', 1993, 'Duo frances de musica electronica y rock electronico');

INSERT INTO cancion (titulo, idioma_id, banda_id) VALUES
  ('Yellow Submarine', 1, 1),
  ('De Musica Ligera', 2, 2),
  ('One More Time', 1, 3);
