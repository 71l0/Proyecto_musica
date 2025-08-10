const express = require('express');
const router = express.Router();
const bandas_autores = require('../models/bandas-autoresModel');

//Obtener los autores de una banda
router.get('/banda/:id_banda/autores', async (req, res) => {
    try {
        const autores = await bandas_autores.obtenerAutorDeBanda(req.params.id_banda);
        res.json(autores);
    } catch (error) {
        res.status(500).json({error: "Error al obtener los autores de la banda"});
    }
});

//Obtener las bandas de un autor
router.get('/autor/:id_autor/banda', async (req, res) => {
    try {
        const banda = await bandas_autores.obtenerBandaDeAutor(req.params.id_autor);
        res.json(banda);
    } catch (error) {
        res.status(500).json({error: "Error al obtener las bandas de un autor"});
    }
});

router.post('/', async (req, res) => {
  try {
    const { id_banda, id_autor } = req.body;
    const nueva = await bandas_autores.agregarAutorABanda(id_banda, id_autor);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la relación entre autor y banda' });
  }
});

router.delete('/:id_banda/:id_autor', async (req, res) => {
  try {
    await bandas_autores.eliminarAutorDeBanda(req.params.id_banda, req.params.id_autor);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la relación entre autor y banda' });
  }
});

module.exports = router;