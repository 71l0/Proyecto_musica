const express = require('express');
const router = express.Router();
const canciones_autores = require('../models/canciones-autoresModel');

//Obtener los autores de una cancion
router.get('/cancion/:id_cancion/autores', async (req, res) => {
    try {
        const autores = await canciones_autores.obtenerAutoresPorCancion(req.params.id_cancion);
        res.json(autores);
    } catch (error) {
        res.status(500).json({error: "Error al obtener los autores de la cancion"});
    }
});

//Obtener las canciones de un autor
router.get('/autor/:id_autor/cancion', async (req, res) => {
    try {
        const cancion = await canciones_autores.obtenerCancionesPorAutor(req.params.id_autor);
        res.json(cancion);
    } catch (error) {
        res.status(500).json({error: "Error al obtener las cancion de un autor"});
    }
});

router.post('/', async (req, res) => {
  try {
    const { id_cancion, id_autor } = req.body;
    const nueva = await canciones_autores.agregarAutorACancion(id_cancion, id_autor);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la relación entre autor y cancion' });
  }
});

router.delete('/:id_cancion/:id_autor', async (req, res) => {
  try {
    await canciones_autores.eliminarAutorDeCancion(req.params.id_cancion, req.params.id_autor);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la relación entre autor y cancion' });
  }
});

module.exports = router;