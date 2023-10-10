const express = require('express');
const router = express.Router();
const fs = require('fs');

// Ruta para listar todos los productos
router.get('/', (req, res) => {
  // Aquí puedes leer los productos desde el archivo productos.json
  const products = readProducts();
  res.json(products);
});

// Ruta para obtener un producto por ID
router.get('/:pid', (req, res) => {
  const pid = req.params.pid;
  const products = readProducts();
  const product = products.find((p) => p.id === pid);

  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado.' });
  }

  res.json(product);
});

// Ruta para agregar un nuevo producto
router.post('/', (req, res) => {
  const newProduct = req.body;
  const products = readProducts();

  // Generar un nuevo ID (puedes usar una estrategia única, como un UUID)
  newProduct.id = Math.random().toString(36).substr(2, 9);

  products.push(newProduct);
  saveProducts(products);

  res.status(201).json(newProduct);
});

// Ruta para actualizar un producto por ID
router.put('/:pid', (req, res) => {
  const pid = req.params.pid;
  const updatedProduct = req.body;
  const products = readProducts();

  const index = products.findIndex((p) => p.id === pid);

  if (index === -1) {
    return res.status(404).json({ error: 'Producto no encontrado.' });
  }

  // No se actualiza el ID
  updatedProduct.id = pid;
  products[index] = updatedProduct;
  saveProducts(products);

  res.json(updatedProduct);
});

// Ruta para eliminar un producto por ID
router.delete('/:pid', (req, res) => {
  const pid = req.params.pid;
  const products = readProducts();

  const index = products.findIndex((p) => p.id === pid);

  if (index === -1) {
    return res.status(404).json({ error: 'Producto no encontrado.' });
  }

  products.splice(index, 1);
  saveProducts(products);

  res.json({ message: 'Producto eliminado con éxito.' });
});

// Función para leer productos desde el archivo
function readProducts() {
  try {
    const data = fs.readFileSync('data/productos.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Función para guardar productos en el archivo
function saveProducts(products) {
  fs.writeFileSync('data/productos.json', JSON.stringify(products, null, 2), 'utf8');
}

module.exports = router;
