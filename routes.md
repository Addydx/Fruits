// Obtener todas las frutas
const res = await fetch('http://localhost:3000/fruits');
const fruits = await res.json();

// Buscar una fruta
const res = await fetch('http://localhost:3000/fruits/banana');

// Agregar favorita
await fetch('http://localhost:3000/favorites', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'mango' })
});

// Eliminar favorita
await fetch('http://localhost:3000/favorites/mango', {
  method: 'DELETE'
});