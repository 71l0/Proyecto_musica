const express = require('express');
const router = express.Router();
const autores_generos = require('../models/autores-generosModel');

//Obtener los autores de un genero
router.get('/genero/:id_genero/autores', async (req, res) => {
    try {
        const autores = await autores_generos.obtenerAutoresPorGenero(req.params.id_genero);
        res.json(autores);
    } catch (error) {
        res.status(500).json({error: "Error al obtener los autores de los generos"});
    }
});

//Obtener los generos de un autor
router.get('/autor/:id_autor/generos', async (req, res) => {
    try {
        const genero = await autores_generos.obtenerGenerosDeAutor(req.params.id_autor);
        res.json(autores);
    } catch (error) {
        res.status(500).json({error: "Error al obtener los generos de los autores"});
    }
});

router.post('/', async (req, res) => {
  try {
    const { id_genero, id_autor } = req.body;
    const nueva = await autoresGeneros.agregarAutorGeneros(id_genero, id_autor);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la relación entre autor y género' });
  }
});

router.delete('/:id_genero/:id_autor', async (req, res) => {
  try {
    await autoresGeneros.eliminarAutorDeGenero(req.params.id_genero, req.params.id_autor);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la relación entre autor y género' });
  }
});

module.exports = router;