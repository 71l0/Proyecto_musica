const express = require('express');
const router = express.Router();
const bandaModel = require('../models/bandaModel');

router.get('/', async (req, res) => {
    try {
        const banda = await bandaModel.getBanda();
        res.json(banda);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las bandas" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const banda = await bandaModel.getBandaPorId(req.params.id);
        if (!banda) {
            return res.status(404).json({ error: "Banda no encontrada" });
        }
        res.json(banda);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la banda" });
    }
});

router.post('/', async (req, res) => {
  try {
    const nueva = await bandaModel.crearBanda(req.body);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear banda' });
  }
});

router.put('/:id', async (req, res) => {
    try {
        const editada = await bandaModel.editarBanda(req.params.id, req.body);
        res.json(editada);
    } catch (error) {
        res.status(500).json({ error: 'Error al editar banda' });
    }
});

router.delete('/:id', async (req, res) => {
  try {
    await bandaModel.eliminarBanda(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar banda' });
  }
});

module.exports = router;