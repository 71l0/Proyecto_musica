const express = require('express');
const router = express.Router();
const idiomaModel = require('../models/idiomaModel');

router.get('/', async (req, res) => {
    try {
        const idiomas = await idiomaModel.getIdiomas();
        res.json(idiomas);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener idiomas" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const idioma = await idiomaModel.getidiomaPorId(req.params.id);
        if (!idioma) {
            return res.status(404).json({ error: "Idioma no encontrado" });
        }
        res.json(idioma);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener idioma" });
    }
});

router.post('/', async (req, res) => {
  try {
    const nueva = await idiomaModel.crearIdioma(req.body);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear idioma' });
  }
});

router.put('/:id', async (req, res) => {
    try {
        const editada = await idiomaModel.editarIdioma(req.params.id, req.body);
        res.json(editada);
    } catch (error) {
        res.status(500).json({ error: 'Error al editar idioma' });
    }
});

router.delete('/:id', async (req, res) => {
  try {
    await idiomaModel.eliminarIdioma(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar idioma' });
  }
});

module.exports = router;