const express = require('express');
const router = express.Router();
const generoModel = require('../models/generoModel');

router.get('/', async (req, res) => {
    try {
        const generos = await generoModel.getGenero();
        res.json(generos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener generos" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const genero = await generoModel.getGeneroPorId(req.params.id);
        if (!genero) {
            return res.status(404).json({ error: "Genero no encontrado" });
        }
        res.json(genero);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener genero" });
    }
});

router.post('/', async (req, res) => {
  try {
    const nueva = await generoModel.crearGenero(req.body);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear genero' });
  }
});

router.put('/:id', async (req, res) => {
    try {
        const editada = await generoModel.editarGenero(req.params.id, req.body);
        res.json(editada);
    } catch (error) {
        res.status(500).json({ error: 'Error al editar genero' });
    }
});

router.delete('/:id', async (req, res) => {
  try {
    await generoModel.eliminarGenero(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar genero' });
  }
});

module.exports = router;