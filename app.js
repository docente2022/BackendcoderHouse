const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Middleware para parsear el cuerpo de las solicitudes JSON
app.use(bodyParser.json());

// Requerir las rutas
const productsRoutes = require('./routes/products');
const cartsRoutes = require('./routes/carts');

// Usar las rutas en la aplicación
app.use('/api/products', productsRoutes);
app.use('/api/carts', cartsRoutes);

// Configuración adicional, si es necesario

// Puerto en el que se ejecutará el servidor
const port = 8080;

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
