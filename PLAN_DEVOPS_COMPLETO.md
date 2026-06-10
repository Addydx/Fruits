# 🚀 PLAN DEVOPS COMPLETO - FrutíOps

**Objetivo:** Aprender DevOps profesional con herramientas **100% gratuitas** y desplegar tu aplicación en producción.

**Tiempo estimado:** 6-8 semanas (dedicando 4-5 horas/semana)

**Costo total:** $0 USD

---

## 📊 Mapa General del Plan

```
┌─────────────────────────────────────────────────────────────┐
│                    DEVOPS LEARNING PATH                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  FASE 1 (Actual)                                             │
│  └─ Integración Frontend-Backend                           │
│     └─ Mostrar frutas desde API en React                   │
│                                                               │
│  FASE 2 (Containerización)                                   │
│  ├─ Dockerizar Backend (Node.js)                           │
│  ├─ Dockerizar Frontend (React)                            │
│  ├─ Docker Compose (orquestar ambos)                       │
│  └─ Probar localmente                                       │
│                                                               │
│  FASE 3 (Automatización - CI/CD)                             │
│  ├─ GitHub Actions pipeline                                │
│  ├─ Linting automático                                      │
│  ├─ Tests automáticos                                       │
│  └─ Build automático                                        │
│                                                               │
│  FASE 4 (Despliegue en Producción)                           │
│  ├─ Render.com (Backend + PostgreSQL)                       │
│  ├─ Vercel (Frontend)                                       │
│  └─ Conectar ambos en producción                            │
│                                                               │
│  FASE 5 (Monitoreo y Observabilidad)                         │
│  ├─ UptimeRobot (monitoreo de uptime)                       │
│  ├─ Sentry (error tracking)                                 │
│  └─ Logs en Render/Vercel                                   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 FASE 1: Integración Frontend-Backend (ACTUAL)

**Estado:** En progreso  
**Tiempo:** 1-2 horas  
**Resultado:** Mostrar todas las frutas desde API en React

### Pasos:
1. ✅ Crear carpeta `services/` con `fruitService.js`
2. ✅ Crear componente `FruitList.jsx`
3. ✅ Crear `HomePage.jsx`
4. ✅ Agregar estilos CSS
5. ✅ Probar que funciona en `http://localhost:5173`

### Archivos a crear:
```
src/
├── services/fruitService.js
├── components/FruitList.jsx
├── components/FruitList.css
└── pages/HomePage.jsx
```

### Comando para probar:
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

**Referencia:** Ver `GUIA_INTEGRACION.md` para detalles completos.

---

## 🐳 FASE 2: Dockerización (APRENDER DOCKER)

**Tiempo:** 3-4 horas  
**Resultado:** Proyecto funciona en Docker igual que en local

**¿Por qué Docker?**
- Funciona igual en tu PC, en CI/CD y en producción
- Es lo estándar en DevOps
- Las empresas lo usan siempre
- Necesario para aprender

### 2.1 Dockerizar Backend

**Archivo a crear:** `backend/Dockerfile`

```dockerfile
# Usar imagen base de Node.js (versión slim para menor tamaño)
FROM node:20-slim

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (solo de producción)
RUN npm ci --only=production

# Copiar el código del backend
COPY . .

# Exponer puerto 3000
EXPOSE 3000

# Comando para iniciar
CMD ["node", "server.js"]
```

**¿Qué hace?**
- Usa imagen de Node.js oficial (slim = más pequeña)
- Instala solo las dependencias necesarias
- Copia el código
- Expone el puerto 3000
- Ejecuta `node server.js`

**Archivo a crear:** `backend/.dockerignore`

```
node_modules
npm-debug.log
.env
.git
.gitignore
README.md
```

---

### 2.2 Dockerizar Frontend

**Archivo a crear:** `frontend/Dockerfile`

```dockerfile
# Stage 1: Build
FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Build de la aplicación
RUN npm run build

# Stage 2: Serve (multi-stage para reducir tamaño)
FROM node:20-slim

WORKDIR /app

# Instalar servidor simple para servir archivos estáticos
RUN npm install -g serve

# Copiar archivos construidos del stage anterior
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
```

**¿Por qué dos stages?**
- Stage 1: Construye la aplicación (necesita todo)
- Stage 2: Solo ejecuta (descarta herramientas de build)
- Resultado: Imagen más pequeña (50% menos)

**Archivo a crear:** `frontend/.dockerignore`

```
node_modules
npm-debug.log
.env
.git
.gitignore
README.md
dist
```

---

### 2.3 Docker Compose

**Archivo a crear:** `docker-compose.yml` (en raíz del proyecto)

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
    networks:
      - frutiops-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3001:3000"
    depends_on:
      - backend
    networks:
      - frutiops-network
    environment:
      - VITE_API_URL=http://backend:3000

networks:
  frutiops-network:
    driver: bridge
```

**¿Qué hace?**
- Define dos servicios: backend y frontend
- Backend en puerto 3000, frontend en 3001
- Conecta ambos por red (se ven entre sí)
- Frontend espera a backend (`depends_on`)
- Healthcheck para verificar que backend está activo

### 2.4 Probar con Docker Compose

```bash
# Ir a raíz del proyecto
cd frutiops-devops

# Construir imágenes y levantar servicios
docker-compose up --build

# Debería mostrar:
# backend  | Servidor escuchando en el puerto 3000
# frontend | Listening on http://localhost:3001
```

**Verificar:**
```bash
# En otra terminal:
curl http://localhost:3000/fruits
curl http://localhost:3000/health
```

**Acceder desde navegador:**
- Backend: `http://localhost:3000`
- Frontend: `http://localhost:3001`

### 2.5 Comandos Docker Útiles

```bash
# Levantar servicios
docker-compose up

# Levantar en background
docker-compose up -d

# Ver logs
docker-compose logs -f

# Logs de un servicio específico
docker-compose logs -f backend

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v

# Reconstruir sin cache
docker-compose up --build --no-cache

# Ver imágenes creadas
docker images

# Ver contenedores corriendo
docker ps

# Entrar a un contenedor (bash)
docker exec -it <container_id> sh
```

---

## 🔄 FASE 3: CI/CD con GitHub Actions

**Tiempo:** 2-3 horas  
**Resultado:** Tests automáticos en cada push

**¿Por qué GitHub Actions?**
- Gratuito para repos públicos (∞ minutos)
- Se ejecuta automáticamente
- Evita subir código roto
- Estándar en la industria

### 3.1 Crear archivo de workflow

**Archivo a crear:** `.github/workflows/ci-cd.yml`

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  # Job 1: Linting y Build del Frontend
  frontend:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci
      
      - name: Run linter
        working-directory: ./frontend
        run: npm run lint
      
      - name: Build
        working-directory: ./frontend
        run: npm run build

  # Job 2: Validación del Backend
  backend:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      
      - name: Install dependencies
        working-directory: ./backend
        run: npm ci
      
      - name: Check syntax
        working-directory: ./backend
        run: node -c server.js
      
      - name: Run tests (if any)
        working-directory: ./backend
        run: npm test --if-present

  # Job 3: Build Docker images (verificar que construyen sin errores)
  docker:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Build Backend image
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          push: false
          tags: frutiops-backend:latest
      
      - name: Build Frontend image
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          push: false
          tags: frutiops-frontend:latest
```

**¿Qué hace?**
- **Frontend job:** Valida código, ejecuta linter, construye
- **Backend job:** Valida sintaxis, ejecuta tests
- **Docker job:** Verifica que las imágenes se construyan
- Se ejecuta en cada push a main/develop
- Falla si algo está mal (evita código roto)

### 3.2 Agregar scripts de linting

**En `frontend/package.json`** (ya está):
```json
"lint": "eslint ."
```

**En `backend/package.json`** (agregar si no existe):
```json
"scripts": {
  "dev": "nodemon server.js",
  "start": "node server.js",
  "lint": "eslint . --fix"
}
```

Si quieres agregar ESLint al backend:
```bash
cd backend
npm install --save-dev eslint
npx eslint --init
```

### 3.3 Verificar en GitHub

1. Hacer commit y push:
```bash
git add .
git commit -m "Add CI/CD pipeline"
git push origin main
```

2. Ir a tu repositorio en GitHub
3. Ir a la pestaña "Actions"
4. Ver el workflow ejecutándose
5. Debería mostrar checkmark verde si todo está bien

---

## 🌍 FASE 4: Despliegue en Producción

**Tiempo:** 2-3 horas  
**Costo:** $0 (completamente gratuito)

### 4.1 Backend en Render.com

**¿Por qué Render?**
- Gratuito perpetuo (sin tiempo límite)
- Soporta Node.js
- Incluye PostgreSQL gratuito
- Deploy automático desde GitHub

**Pasos:**

1. **Ir a [render.com](https://render.com)**

2. **Sign up con GitHub**

3. **Crear nuevo servicio Web:**
   - Click en "New +"
   - Seleccionar "Web Service"

4. **Conectar repositorio:**
   - Seleccionar tu repo de GitHub
   - Autorizar si es necesario

5. **Configurar:**
   - **Name:** `frutiops-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Seleccionar "Free"

6. **Variables de entorno (si es necesario):**
   - Click en "Environment"
   - Agregar variables (ej: NODE_ENV=production)

7. **Deploy:**
   - Click en "Create Web Service"
   - Esperar a que se depliegue (2-3 minutos)

**URL resultado:** `https://frutiops-backend.onrender.com`

**Verificar:**
```bash
curl https://frutiops-backend.onrender.com/health
curl https://frutiops-backend.onrender.com/fruits
```

---

### 4.2 Frontend en Vercel

**¿Por qué Vercel?**
- Gratuito perpetuo
- Optimizado para React/Next.js
- CDN global
- Deploy en segundos

**Pasos:**

1. **Ir a [vercel.com](https://vercel.com)**

2. **Sign up con GitHub**

3. **Importar proyecto:**
   - Click en "Add New..."
   - Seleccionar "Project"
   - Seleccionar tu repo

4. **Configurar:**
   - **Project Name:** `frutiops`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm ci`

5. **Variables de entorno:**
   - Click en "Environment Variables"
   - Agregar: `VITE_API_URL=https://frutiops-backend.onrender.com`

6. **Deploy:**
   - Click en "Deploy"
   - Esperar (1-2 minutos)

**URL resultado:** `https://frutiops.vercel.app`

**Verificar:** Abrir URL en navegador

---

### 4.3 Conectar Frontend y Backend

**En `frontend/.env.production`:**
```
VITE_API_URL=https://frutiops-backend.onrender.com
```

**En `frontend/src/services/fruitService.js`:**
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getFruits = async () => {
  try {
    const response = await fetch(`${API_URL}/fruits`);
    
    if (!response.ok) {
      throw new Error('Error al obtener las frutas');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en getFruits:', error);
    throw error;
  }
};
```

**Hacer commit y push:**
```bash
git add .
git commit -m "Add production environment variables"
git push origin main
```

Vercel se redeployará automáticamente. Esperar 1-2 minutos.

---

### 4.4 Verificación

- [ ] Backend en `https://frutiops-backend.onrender.com` funciona
- [ ] Frontend en `https://frutiops.vercel.app` funciona
- [ ] Frontend puede conectarse a backend
- [ ] Frutas se muestran en producción

---

## 📊 FASE 5: Monitoreo y Observabilidad

**Tiempo:** 1-2 horas  
**Costo:** $0 (todas gratuitas)

### 5.1 UptimeRobot (Monitoreo de Uptime)

**¿Por qué?**
- Verifica que tu app esté en línea
- Alertas por email/Slack
- Historial de disponibilidad
- Gratuito: 50 monitors

**Pasos:**

1. **Ir a [uptimerobot.com](https://uptimerobot.com)**

2. **Sign up (gratuito, sin tarjeta)**

3. **Crear monitor para Backend:**
   - Click en "Add Monitoring"
   - **Monitor Type:** HTTP(s)
   - **URL:** `https://frutiops-backend.onrender.com/health`
   - **Friendly Name:** `FrutíOps Backend Health`
   - **Check Interval:** 5 minutes
   - Click en "Create Monitor"

4. **Crear monitor para Frontend:**
   - Click en "Add Monitoring"
   - **Monitor Type:** HTTP(s)
   - **URL:** `https://frutiops.vercel.app`
   - **Friendly Name:** `FrutíOps Frontend`
   - **Check Interval:** 5 minutes
   - Click en "Create Monitor"

5. **Configurar Alertas:**
   - Click en "My Settings"
   - Ir a "Notifications"
   - Agregar Email/Slack/SMS para alertas

**Verificar:** Dashboard muestra ambos monitors "Up" en verde

---

### 5.2 Sentry (Error Tracking)

**¿Por qué?**
- Detecta errores en producción automáticamente
- Stack traces completos
- Integración con GitHub

#### **Setup en Backend**

1. **Ir a [sentry.io](https://sentry.io)**

2. **Sign up con GitHub (gratuito)**

3. **Crear proyecto:**
   - Click en "Create Project"
   - Seleccionar "Node.js"
   - **Team:** default
   - **Project name:** `frutiops-backend`
   - Click en "Create Project"

4. **Copiar DSN** (algo como `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`)

5. **Instalar Sentry en backend:**
```bash
cd backend
npm install @sentry/node @sentry/tracing
```

6. **Configurar en `backend/server.js`:**

Al inicio del archivo (después de imports):
```javascript
const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

Sentry.init({
  dsn: process.env.SENTRY_DSN || "YOUR_DSN_HERE",
  integrations: [
    nodeProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  environment: process.env.NODE_ENV || "production",
});
```

Después de `app.use(cors())`:
```javascript
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

7. **Variables de entorno en Render:**
   - En tu servicio Render del backend
   - Click en "Environment"
   - Agregar: `SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`

#### **Setup en Frontend**

1. **Crear proyecto en Sentry:**
   - Click en "Create Project"
   - Seleccionar "React"
   - **Project name:** `frutiops-frontend`

2. **Copiar DSN**

3. **Instalar Sentry en frontend:**
```bash
cd frontend
npm install @sentry/react @sentry/tracing
```

4. **Configurar en `frontend/src/main.jsx`:**

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import * as Sentry from "@sentry/react"
import App from './App.jsx'
import './index.css'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN || "YOUR_DSN_HERE",
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
  integrations: [
    Sentry.replayIntegration(),
  ],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})

const App2 = Sentry.withProfiler(App)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App2 />
  </React.StrictMode>,
)
```

5. **Variables en Vercel:**
   - En tu proyecto Vercel
   - Ir a "Settings" → "Environment Variables"
   - Agregar: `VITE_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`

### 5.3 Verificar Monitoreo

- [ ] UptimeRobot muestra ambos servicios "Up"
- [ ] Sentry Backend configurado y recibiendo eventos
- [ ] Sentry Frontend configurado y recibiendo eventos
- [ ] Alertas configuradas

---

## 📋 Stack Final (100% Gratuito)

| Componente | Herramienta | Costo | Características |
|------------|------------|-------|-----------------|
| **Control de versiones** | GitHub | $0 | Repos ilimitados |
| **CI/CD** | GitHub Actions | $0 | ∞ minutos (público) |
| **Backend** | Render.com | $0 | Node.js perpetuo |
| **Frontend** | Vercel | $0 | React optimizado |
| **Contenedores** | Docker (local) | $0 | Desarrollo + deploy |
| **Monitoreo** | UptimeRobot | $0 | 50 monitors |
| **Error tracking** | Sentry | $0 | 5K eventos/mes |
| **Total mensual** | **-** | **$0** | **Professional stack** |

---

## 🗂️ Estructura Final del Proyecto

```
frutiops-devops/
├── .github/
│   └── workflows/
│       └── ci-cd.yml                        ← NUEVO
├── backend/
│   ├── Dockerfile                           ← NUEVO
│   ├── .dockerignore                        ← NUEVO
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── Dockerfile                           ← NUEVO
│   ├── .dockerignore                        ← NUEVO
│   ├── src/
│   │   ├── services/
│   │   │   └── fruitService.js              ← NUEVO
│   │   ├── components/
│   │   │   ├── FruitList.jsx                ← NUEVO
│   │   │   └── FruitList.css                ← NUEVO
│   │   ├── pages/
│   │   │   └── HomePage.jsx                 ← NUEVO
│   │   ├── App.jsx                          (modificar)
│   │   ├── main.jsx                         (modificar con Sentry)
│   │   └── ...
│   ├── .env.production                      ← NUEVO
│   ├── package.json
│   └── package-lock.json
├── docker-compose.yml                       ← NUEVO
├── .env.example                             ← NUEVO
├── API_ROUTES.md                            ✅ EXISTENTE
├── GUIA_INTEGRACION.md                      ✅ EXISTENTE
├── PLAN_DEVOPS_COMPLETO.md                  ← ESTE ARCHIVO
└── README.md
```

---

## ⏰ Timeline Recomendado

| Semana | Fase | Horas | Resultado |
|--------|------|-------|-----------|
| 1 | Integración Frontend-Backend | 2-3 | Frutas mostradas en React |
| 2 | Docker (Backend + Frontend) | 3-4 | Proyecto en contenedores |
| 3 | Docker Compose + pruebas | 2-3 | Todo funciona con Docker |
| 4 | GitHub Actions CI/CD | 2-3 | Tests automáticos activos |
| 5 | Desplegar en Render + Vercel | 2-3 | App en internet ($0) |
| 6 | Monitoreo (UptimeRobot + Sentry) | 2-3 | Observabilidad completa |
| **Total** | **-** | **14-19 horas** | **DevOps profesional** |

---

## 🎓 Qué Aprenderás

### Conceptos DevOps
- ✅ Versionado con Git/GitHub
- ✅ Contenedorización con Docker
- ✅ Orquestación con Docker Compose
- ✅ CI/CD automation con GitHub Actions
- ✅ Deployment y hosting
- ✅ Monitoreo y observabilidad
- ✅ Error tracking en producción

### Herramientas Prácticas
- ✅ Docker y Dockerfile
- ✅ Docker Compose
- ✅ GitHub Actions workflows
- ✅ Render.com deployment
- ✅ Vercel deployment
- ✅ UptimeRobot monitoring
- ✅ Sentry error tracking

### Mejores Prácticas
- ✅ Multi-stage Docker builds
- ✅ Environment variables
- ✅ Health checks
- ✅ Automated testing
- ✅ Production debugging
- ✅ Scaling considerations

---

## ✅ Checklist de Verificación

### Fase 1: Integración ✓
- [ ] Componente FruitList muestra frutas
- [ ] No hay errores en consola
- [ ] Frutas se cargan desde API en localhost:3000
- [ ] Estilos CSS aplicados correctamente

### Fase 2: Docker
- [ ] `backend/Dockerfile` existe y construye sin errores
- [ ] `frontend/Dockerfile` existe y construye sin errores
- [ ] `docker-compose.yml` está en raíz
- [ ] `docker-compose up` funciona
- [ ] Frontend es accesible en `localhost:3001`
- [ ] Backend es accesible en `localhost:3000`
- [ ] Frutas se cargan en frontend a través de backend

### Fase 3: CI/CD
- [ ] `.github/workflows/ci-cd.yml` existe
- [ ] GitHub Actions se ejecuta en push
- [ ] Build pasa sin errores
- [ ] Linting está configurado
- [ ] Workflow tiene checkmark verde

### Fase 4: Despliegue
- [ ] Backend deployed en Render.com
- [ ] Frontend deployed en Vercel
- [ ] URLs funcionan en internet
- [ ] Backend: `https://frutiops-backend.onrender.com/health` responde
- [ ] Frontend: `https://frutiops.vercel.app` muestra frutas
- [ ] Frontend puede conectarse a backend de producción
- [ ] Variables de entorno configuradas correctamente

### Fase 5: Monitoreo
- [ ] UptimeRobot creado y funciona
- [ ] UptimeRobot monitorea backend (health endpoint)
- [ ] UptimeRobot monitorea frontend (home page)
- [ ] Sentry configurado en backend
- [ ] Sentry configurado en frontend
- [ ] Ambos proyectos Sentry reciben eventos
- [ ] Alertas email/Slack configuradas

---

## 🔗 Links Útiles

### Documentación Oficial
- [Docker Docs](https://docs.docker.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Sentry Docs](https://docs.sentry.io/)
- [UptimeRobot Docs](https://uptimerobot.com/help/)

### Tutoriales Útiles
- [Docker for Beginners](https://docker-curriculum.com/)
- [GitHub Actions Tutorial](https://www.youtube.com/results?search_query=github+actions+tutorial)
- [DevOps Basics](https://www.youtube.com/results?search_query=devops+for+beginners)

---

## 🚀 Próximos Pasos

### Inmediato:
1. Terminar FASE 1 (integración Frontend-Backend)
2. Hacer commit y push a GitHub

### Semana 1-2:
1. Crear Dockerfiles (FASE 2)
2. Probar con docker-compose
3. Hacer commit y push

### Semana 2-3:
1. Crear GitHub Actions workflow (FASE 3)
2. Verificar que pasa en cada push
3. Hacer commit y push

### Semana 3-4:
1. Deploy en Render.com (FASE 4)
2. Deploy en Vercel (FASE 4)
3. Conectar y verificar

### Semana 4-5:
1. Configurar UptimeRobot (FASE 5)
2. Configurar Sentry (FASE 5)
3. Verificar monitoreo

### Semana 6:
1. Documentar todo
2. Crear README con instrucciones
3. Demostrar a equipo/amigos

---

## 💡 Tips Importantes

### Git Workflow Recomendado
```bash
# Crear rama para desarrollo
git checkout -b develop
git push origin develop

# Hacer cambios
git add .
git commit -m "descriptive message"
git push origin develop

# Cuando esté listo para producción
git checkout main
git merge develop
git push origin main
```

### Variables de Entorno
**Nunca** commitar:
- Credenciales
- API keys
- Contraseñas
- URLs de desarrollo

**Usar `.env.example`:**
```env
# Backend
PORT=3000
NODE_ENV=development
SENTRY_DSN=

# Frontend
VITE_API_URL=http://localhost:3000
VITE_SENTRY_DSN=
```

### Docker Best Practices
1. Usar `.dockerignore` para excluir innecesarios
2. Usar multi-stage builds para reducir tamaño
3. No correr como root
4. Usar healthchecks
5. Versionar imágenes

---

## 🆘 Solución de Problemas

### Docker no funciona
```bash
# Verificar instalación
docker --version
docker run hello-world

# Si no está instalado
# Windows/Mac: Descargar Docker Desktop
# Linux: sudo apt-get install docker.io
```

### Puerto ya en uso
```bash
# Ver qué está usando puerto 3000
lsof -i :3000

# O cambiar puerto en docker-compose.yml
ports: ["3001:3000"]
```

### Render no despliega
1. Verificar que `backend` está en carpeta correcta
2. Verificar Build Command: `npm install`
3. Verificar Start Command: `node server.js`
4. Revisar logs de deployment

### Vercel no despliega
1. Verificar Root Directory: `frontend`
2. Verificar Build Command: `npm run build`
3. Verificar Output Directory: `dist`
4. Revisar Build Logs

### Frontend no conecta con backend
1. Verificar `.env.production` tiene URL correcta
2. Verificar CORS en backend (ya está habilitado)
3. Abrir DevTools → Network → ver errores
4. Verificar URL en `fruitService.js`

---

## 📞 Resumen Final

Tu proyecto FrutíOps está diseñado para:
- ✅ **Aprender DevOps profesional** con herramientas reales
- ✅ **Sin gastar dinero** ($0/mes permanente)
- ✅ **Usando estándares industria** (Docker, GitHub, CI/CD)
- ✅ **Con portafolio demostrable** para CV/LinkedIn
- ✅ **Escalable** para agregar más funcionalidades

**Este plan es:**
- Realista y probado
- Paso a paso
- Completamente gratuito
- Profesional y moderno
- Ideal para aprendizaje

---

**¡Estás listo para convertirte en DevOps!**

**Última actualización:** Junio 2024  
**Versión:** 1.0  
**Autor:** FrutíOps DevOps Team
