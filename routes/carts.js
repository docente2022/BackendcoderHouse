const express = require('express');
const router = express.Router();
const fs = require('fs');

// Ruta para crear un nuevo carrito
router.post('/', (req, res) => {
  const newCart = req.body;
  const carts = readCarts();

  // Generar un nuevo ID para el carrito (puedes usar una estrategia única, como un UUID)
  newCart.id = Math.random().toString(36).substr(2, 9);

  carts.push(newCart);
  saveCarts(carts);

  res.status(201).json(newCart);
});

// Ruta para listar los productos en un carrito por su ID
router.get('/:cid', (req, res) => {
  const cid = req.params.cid;
  const carts = readCarts();
  const cart = carts.find((c) => c.id === cid);

  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado.' });
  }

  res.json(cart.products);
});

// Ruta para agregar un producto a un carrito
router.post('/:cid/product/:pid', (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const quantity = req.body.quantity || 1; // Cantidad predeterminada de 1
  const carts = readCarts();

  const cartIndex = carts.findIndex((c) => c.id === cid);

  if (cartIndex === -1) {
    return res.status(404).json({ error: 'Carrito no encontrado.' });
  }

  const productToAdd = { product: pid, quantity: quantity };
  const cart = carts[cartIndex];

  // Buscar si el producto ya existe en el carrito
  const productIndex = cart.products.findIndex((p) => p.product === pid);

  if (productIndex !== -1) {
    // Si el producto ya existe, actualizar la cantidad
    cart.products[productIndex].quantity += quantity;
  } else {
    // Si el producto no existe, agregarlo al carrito
    cart.products.push(productToAdd);
  }

  saveCarts(carts);

  res.json(cart);
});

// Función para leer carritos desde el archivo
function readCarts() {
  try {
    const data = fs.readFileSync('data/carritos.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Función para guardar carritos en el archivo
function saveCarts(carts) {
  fs.writeFileSync('data/carritos.json', JSON.stringify(carts, null, 2), 'utf8');
}

module.exports = router;
