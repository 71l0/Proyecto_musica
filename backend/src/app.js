const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json);

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
app.use('/api/canciones', cancionRoutes);
app.use('/api/autores', autorRoutes);
app.use('/api/generos', generoRoutes);
app.use('/api/idiomas', idiomaRoutes);
app.use('/api/bandas', bandaRoutes);
app.use('/api/canciones-autores', cancionesAutoresRoutes);
app.use('/api/canciones-generos', cancionesGenerosRoutes);
app.use('/api/autores-generos', autoresGenerosRoutes);
app.use('/api/bandas-generos', bandasGenerosRoutes);
app.use('/api/bandas-autores', bandasAutoresRoutes);

module.exports = app;