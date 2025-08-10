const express = require('express');
const router = express.Router();
const cancionModel = require('../models/cancionModel');

router.get('/', async (req, res) => {
    try {
        const canciones = await cancionModel.getCanciones();
        res.json(canciones);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener canciones" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const cancion = await cancionModel.getCancionPorId(req.params.id);
        if (!cancion) {
            return res.status(404).json({ error: "Canción no encontrada" });
        }
        res.json(cancion);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener canción" });
    }
});

router.post('/', async (req, res) => {
  try {
    const nueva = await cancionModel.crearCancion(req.body);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear canción' });
  }
});

router.put('/:id', async (req, res) => {
    try {
        const editada = await cancionModel.editarCancion(req.params.id, req.body);
        res.json(editada);
    } catch (error) {
        res.status(500).json({ error: 'Error al editar canción' });
    }
});

router.delete('/:id', async (req, res) => {
  try {
    await cancionModel.eliminarCancion(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar canción' });
  }
});

module.exports = router;