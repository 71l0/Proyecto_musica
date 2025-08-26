const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

//Rutas
const cancionRoutes = require('./routes/cancionRoutes');
const autorRoutes = require('./routes/autorRoutes');
const generoRoutes = require('./routes/generoRoutes');
const idiomaRoutes = require('./routes/idiomaRoutes');
const bandaRoutes = require('./routes/bandaRoutes');
const cancionesAutoresRoutes = require('./routes/canciones-autoresRoutes');
const cancionesGenerosRoutes = require('./routes/canciones-generosRoutes');
const autoresGenerosRoutes = require('./routes/autores-generosRoutes');
const bandasGenerosRoutes = require('./routes/bandas-generosRoutes');
const bandasAutoresRoutes = require('./routes/bandas-autoresRoutes');

//Usar rutas
app.use('/cancion', cancionRoutes);
app.use('/autores', autorRoutes);
app.use('/generos', generoRoutes);
app.use('/idioma', idiomaRoutes);
app.use('/banda', bandaRoutes);
app.use('/canciones-autores', cancionesAutoresRoutes);
app.use('/canciones-generos', cancionesGenerosRoutes);
app.use('/autores-generos', autoresGenerosRoutes);
app.use('/bandas-generos', bandasGenerosRoutes);
app.use('/bandas-autores', bandasAutoresRoutes);

module.exports = app;