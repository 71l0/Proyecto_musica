const express = require('express');
const router = express.Router();
const bandas_generos = require('../models/bandas-generosModel');

//Obtener los generos de una banda
router.get('/banda/:id_banda/genero', async (req, res) => {
    try {
        const autores = await bandas_generos.obtenerGeneroDeBanda(req.params.id_banda);
        res.json(autores);
    } catch (error) {
        res.status(500).json({error: "Error al obtener los generos de la banda"});
    }
});

//Obtener las bandas de un genero
router.get('/genero/:id_genero/banda', async (req, res) => {
    try {
        const banda = await bandas_generos.obtenerBandasDeGenero(req.params.id_genero);
        res.json(banda);
    } catch (error) {
        res.status(500).json({error: "Error al obtener las bandas de un autor"});
    }
});

router.post('/', async (req, res) => {
  try {
    const { id_banda, id_genero } = req.body;
    const nueva = await bandas_generos.agregarGeneroABanda(id_banda, id_genero);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la relación entre genero y banda' });
  }
});

router.delete('/:id_banda/:id_genero', async (req, res) => {
  try {
    await bandas_generos.eliminarGeneroDeBanda(req.params.id_banda, req.params.id_genero);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la relación entre genero y banda' });
  }
});

module.exports = router;