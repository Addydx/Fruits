# 📋 API Routes - FrutíOps

**Base URL:** `http://localhost:3000`

---

## 🌐 Endpoints

### Info General
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Bienvenida API |
| GET | `/health` | Estado servidor |

### 🍎 Frutas
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/fruits` | Todas las frutas |
| GET | `/fruits/:name` | Fruta por nombre |

### 📊 Estadísticas
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/stats` | Calorías, azúcar promedio, fruta más dulce |

### ⭐ Favoritos
| Método | Ruta | Body | Descripción |
|--------|------|------|-------------|
| GET | `/favorites` | - | Listar favoritas |
| POST | `/favorites` | `{name: "Apple"}` | Agregar favorita |
| DELETE | `/favorites/:name` | - | Eliminar favorita |

---

## 📝 Ejemplos Rápidos

**GET /fruits:**
```javascript
fetch('http://localhost:3000/fruits')
  .then(res => res.json())
  .then(data => console.log(data));
```

**GET /fruits/:name:**
```javascript
fetch('http://localhost:3000/fruits/Apple')
  .then(res => res.json())
  .then(data => console.log(data));
```

**GET /stats:**
```javascript
fetch('http://localhost:3000/stats')
  .then(res => res.json())
  .then(data => console.log(data));
```

**GET /favorites:**
```javascript
fetch('http://localhost:3000/favorites')
  .then(res => res.json())
  .then(data => console.log(data));
```

**POST /favorites:**
```javascript
fetch('http://localhost:3000/favorites', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Apple' })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

**DELETE /favorites/:name:**
```javascript
fetch('http://localhost:3000/favorites/Apple', {
  method: 'DELETE'
})
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## ✅ Respuestas Ejemplo

**GET /fruits (array de objetos):**
```json
[
  {
    "name": "Apple",
    "family": "Rosaceae",
    "nutritions": {
      "calories": 52,
      "sugar": 10.39
    }
  }
]
```

**POST /favorites (201 - creado):**
```json
{
  "id": 1717945320123,
  "name": "Apple",
  "createdAt": "2024-06-09T15:35:20.123Z"
}
```

**GET /stats:**
```json
{
  "totalFruits": 58,
  "averageCalories": 61.45,
  "averageSugar": 11.23,
  "fruitWithMostSugar": {
    "name": "Grape",
    "sugar": 16.25
  }
}
```

---

## ⚠️ Errores Comunes

| Código | Endpoint | Causa |
|--------|----------|-------|
| 404 | `/fruits/:name` | Fruta no existe |
| 409 | `POST /favorites` | Fruta ya en favoritas |
| 400 | `POST /favorites` | Falta el campo "name" |
| 404 | `DELETE /favorites/:name` | Favorita no existe |

---

## 💡 Tips

- ✅ CORS habilitado (aceptar desde cualquier origen)
- 📌 Los nombres de frutas deben ser exactos: "Apple", no "apple"
- ⚠️ Favoritos se guardan en memoria (se pierden al reiniciar)
- 🔗 Necesita conexión a API externa Fruityvice
