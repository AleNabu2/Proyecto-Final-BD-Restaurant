const express = require('express');
const path = require('path');

const imagesRoutes = require('./routes/imagesRoutes')
const firebaseRoutes = require('./routes/firebase/firebaseRoutes');
const sqlRoutes = require('./routes/mysql/sqlRoutes');
const etlRoutes = require('./routes/etlRoutes')

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/images', imagesRoutes);
app.use('/nosql', firebaseRoutes);
app.use('/sql', sqlRoutes);
app.use('/etl', etlRoutes);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
