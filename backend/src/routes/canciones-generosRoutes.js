const express = require('express');
const router = express.Router();
const canciones_genero = require('../models/canciones-generosModel');

//Obtener los generos de una cancion
router.get('/cancion/:id_cancion/generos', async (req, res) => {
    try {
        const genero = await canciones_genero.obtenerGenerosDeCancion(req.params.id_cancion);
        res.json(genero);
    } catch (error) {
        res.status(500).json({error: "Error al obtener los generos de la cancion"});
    }
});

//Obtener las canciones de un genero
router.get('/genero/:id_genero/cancion', async (req, res) => {
    try {
        const cancion = await canciones_genero.obtenerCancionesPorGenero(req.params.id_genero);
        res.json(cancion);
    } catch (error) {
        res.status(500).json({error: "Error al obtener las cancion de un genero"});
    }
});

router.post('/', async (req, res) => {
  try {
    const { id_cancion, id_genero } = req.body;
    const nueva = await canciones_genero.agregarGeneroACancion(id_cancion, id_genero);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la relación entre genero y cancion' });
  }
});

router.delete('/:id_cancion/:id_genero', async (req, res) => {
  try {
    await canciones_genero.eliminarGeneroDeCancion(req.params.id_cancion, req.params.id_genero);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la relación entre genero y cancion' });
  }
});

module.exports = router;