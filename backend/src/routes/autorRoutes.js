const express = require('express');
const router = express.Router();
const autorModel = require('../models/autorModel');

router.get('/', async (req, res) => {
    try {
        const autores = await autorModel.getAutores();
        res.json(autores);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los autores" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const autores = await autorModel.getAutorPorId(req.params.id);
        if (!autores) {
            return res.status(404).json({ error: "Autor no encontrado" });
        }
        res.json(autores);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el autor" });
    }
});

router.post('/', async (req, res) => {
  try {
    const nueva = await autorModel.crearAutor(req.body);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear autor' });
  }
});

router.put('/:id', async (req, res) => {
    try {
        const editada = await autorModel.editarAutor(req.params.id, req.body);
        res.json(editada);
    } catch (error) {
        res.status(500).json({ error: 'Error al editar autor' });
    }
});

router.delete('/:id', async (req, res) => {
  try {
    await autorModel.eliminarAutor(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar autor' });
  }
});

module.exports = router;