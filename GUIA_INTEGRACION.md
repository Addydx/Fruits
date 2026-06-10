# 🔗 Guía: Conectar Backend y Frontend - Mostrar Frutas

Una guía paso a paso para conectar tu React con el backend y mostrar las frutas desde la API.

---

## 📁 Paso 1: Estructura de Carpetas (Crear)

Primero, crea esta estructura en tu carpeta `src/`:

```
src/
├── App.jsx
├── App.css
├── main.jsx
├── index.css
├── assets/
│   └── fruittree2.jpg
├── services/                    ← CREAR ESTA CARPETA
│   └── fruitService.js          ← CREAR ESTE ARCHIVO
├── components/                  ← CREAR ESTA CARPETA
│   └── FruitList.jsx            ← CREAR ESTE ARCHIVO
└── pages/                       ← CREAR ESTA CARPETA
    └── HomePage.jsx             ← CREAR ESTE ARCHIVO
```

**¿Por qué esta estructura?**
- `services/` → Aquí van las peticiones al API (separado de los componentes)
- `components/` → Componentes reutilizables (como mostrar la lista de frutas)
- `pages/` → Páginas completas de la app

---

## 🛠️ Paso 2: Crear el Servicio de API

**Archivo:** `src/services/fruitService.js`

```javascript
// Esta es la URL base del backend
const API_URL = 'http://localhost:3000';

// Función para obtener todas las frutas
export const getFruits = async () => {
  try {
    const response = await fetch(`${API_URL}/fruits`);
    
    // Si la respuesta no es correcta, lanzar un error
    if (!response.ok) {
      throw new Error('Error al obtener las frutas');
    }
    
    // Convertir la respuesta a JSON y devolverla
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en getFruits:', error);
    throw error;
  }
};
```

**¿Qué hace?**
- Define la URL base del backend (`http://localhost:3000`)
- Crea una función `getFruits` que hace una petición GET a `/fruits`
- Maneja errores si algo sale mal
- Devuelve los datos (la lista de frutas)

---

## 🎨 Paso 3: Crear el Componente para Mostrar Frutas

**Archivo:** `src/components/FruitList.jsx`

```javascript
import { useState, useEffect } from 'react';
import { getFruits } from '../services/fruitService';
import './FruitList.css'; // Lo crearemos después

function FruitList() {
  // Estado para guardar las frutas
  const [fruits, setFruits] = useState([]);
  
  // Estado para mostrar si está cargando
  const [loading, setLoading] = useState(true);
  
  // Estado para mostrar errores
  const [error, setError] = useState(null);

  // useEffect: Se ejecuta cuando el componente se monta (aparece en pantalla)
  useEffect(() => {
    const cargarFrutas = async () => {
      try {
        setLoading(true);
        const datos = await getFruits();
        setFruits(datos);
        setError(null);
      } catch (err) {
        setError('No se pudieron cargar las frutas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarFrutas();
  }, []); // El array vacío [] significa que se ejecute solo una vez

  // Si está cargando, mostrar "Cargando..."
  if (loading) return <p>Cargando frutas...</p>;

  // Si hay error, mostrar el mensaje de error
  if (error) return <p style={{color: 'red'}}>{error}</p>;

  // Si no hay frutas, mostrar mensaje
  if (fruits.length === 0) return <p>No hay frutas disponibles</p>;

  // Si todo está bien, mostrar las frutas
  return (
    <div className="fruit-list">
      <h2>Frutas Disponibles</h2>
      <div className="fruit-grid">
        {fruits.map((fruit) => (
          <div key={fruit.id} className="fruit-card">
            <h3>{fruit.name}</h3>
            <p><strong>Familia:</strong> {fruit.family}</p>
            <p><strong>Calorías:</strong> {fruit.nutritions.calories} kcal</p>
            <p><strong>Azúcar:</strong> {fruit.nutritions.sugar}g</p>
            <p><strong>Proteína:</strong> {fruit.nutritions.protein}g</p>
            <p><strong>Grasa:</strong> {fruit.nutritions.fat}g</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FruitList;
```

**¿Qué hace?**
- `useState()` → Crea variables que cambian (estado)
- `useEffect()` → Se ejecuta cuando el componente aparece
- Llama a `getFruits()` (el servicio que creamos)
- Muestra "Cargando..." mientras obtiene datos
- Muestra errores si algo falla
- Mostrará cada fruta en una tarjeta (card)

---

## 🎨 Paso 4: Estilos del Componente de Frutas

**Archivo:** `src/components/FruitList.css`

```css
.fruit-list {
  padding: 20px;
}

.fruit-list h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.fruit-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.fruit-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background: #f9f9f9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.fruit-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.fruit-card h3 {
  color: #2ecc71;
  margin-bottom: 10px;
}

.fruit-card p {
  margin: 8px 0;
  font-size: 14px;
  color: #666;
}
```

---

## 📄 Paso 5: Crear la Página Principal

**Archivo:** `src/pages/HomePage.jsx`

```javascript
import fruittree from '../assets/fruittree2.jpg';
import FruitList from '../components/FruitList';

function HomePage() {
  return (
    <>
      <header>
        <h1>🍎 Frutas - FrutíOps</h1>
      </header>

      <main>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          padding: '20px',
        }}>
          <img 
            src={fruittree} 
            alt="Fruit Tree" 
            style={{width:'100%', height:'auto', objectFit:'cover'}}
          />
          <div>
            <h2>Las frutas</h2>
            <p>
              Aquí podrás ver una variedad de frutas donde verás los atributos 
              de esta como las calorías y un poco de información nutricional.
            </p>
          </div>
        </div>

        {/* Aquí se mostrarán las frutas */}
        <FruitList />
      </main>
    </>
  );
}

export default HomePage;
```

---

## 🔄 Paso 6: Actualizar App.jsx

**Archivo:** `src/App.jsx`

```javascript
import HomePage from './pages/HomePage';
import './App.css';

function App() {
  return <HomePage />;
}

export default App;
```

Ahora App.jsx es más limpio y solo importa la página principal.

---

## ✅ Paso 7: Verificar que el Backend está corriendo

Antes de probar, asegúrate de que el backend esté funcionando:

```bash
# En una terminal, ve a la carpeta backend
cd backend

# Inicia el servidor
npm run dev
```

Deberías ver algo como:
```
Servidor escuchando en el puerto 3000
```

---

## 🚀 Paso 8: Ejecutar el Frontend

En otra terminal, en la carpeta frontend:

```bash
npm run dev
```

Deberías ver algo como:
```
Local:   http://localhost:5173/
```

---

## 🎯 Resumen de archivos a crear/modificar

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `src/services/fruitService.js` | Crear | Servicio para peticiones al API |
| `src/components/FruitList.jsx` | Crear | Componente que muestra las frutas |
| `src/components/FruitList.css` | Crear | Estilos de las frutas |
| `src/pages/HomePage.jsx` | Crear | Página principal con imagen y frutas |
| `src/App.jsx` | Modificar | Usar HomePage en lugar de contenido directo |

---

## 📋 Checklist de Verificación

- [ ] Backend corriendo en `http://localhost:3000`
- [ ] Frontend corriendo en `http://localhost:5173`
- [ ] Carpetas creadas: `services/`, `components/`, `pages/`
- [ ] Archivos creados según la tabla anterior
- [ ] No hay errores en la consola del navegador
- [ ] Se muestran las frutas en la pantalla

---

## 🐛 Solución de Problemas

### No aparecen las frutas
1. Verifica que el backend esté corriendo (`npm run dev` en carpeta backend)
2. Abre la consola del navegador (F12)
3. Busca errores en la pestaña "Console"
4. Verifica que la URL sea correcta en `fruitService.js`

### Error: "CORS error"
- El backend debe tener CORS habilitado (ya lo tiene)
- Verifica que la URL sea exacta: `http://localhost:3000`

### Error: "Cannot find module"
- Verifica que los paths sean correctos en los imports
- Recuerda usar `../` para subir de carpeta

---

## 💡 Próximos Pasos (Opcional)

Una vez que funcione esto, puedes agregar:
1. Buscar frutas por nombre
2. Ver detalles de una fruta
3. Agregar frutas a favoritos
4. Mostrar estadísticas

---

**¡Listo! Ahora tienes una estructura profesional y escalable para tu proyecto React.**
