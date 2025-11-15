# 🚀 Guía de Despliegue - AgroGlobal Backend

Esta guía te ayudará a desplegar el backend de AgroGlobal en **Render.com**.

---

## 📋 Requisitos Previos

- Cuenta en [Render.com](https://render.com) (gratis)
- Base de datos MySQL (puede ser en Railway, PlanetScale, o cualquier proveedor)
- Repositorio de GitHub con el código del proyecto

---

## 🗄️ Paso 1: Configurar la Base de Datos

Si aún no tienes una base de datos MySQL, puedes usar:

### Opción A: Railway (Recomendado)
1. Ve a [Railway.app](https://railway.app)
2. Crea un nuevo proyecto
3. Agrega un servicio MySQL
4. Copia las credenciales de conexión

### Opción B: PlanetScale
1. Ve a [PlanetScale](https://planetscale.com)
2. Crea una nueva base de datos
3. Copia las credenciales de conexión

---

## 🌐 Paso 2: Desplegar en Render

### 2.1 Crear el Web Service

1. Inicia sesión en [Render.com](https://render.com)
2. Click en **"New +"** → **"Web Service"**
3. Conecta tu repositorio de GitHub
4. Configura el servicio:

```
Name: agroglobal-backend
Region: Oregon (US West)
Branch: main (o tu rama principal)
Root Directory: (dejar vacío)
Environment: Node
Build Command: npm install && npm run build
Start Command: npm run start:prod
```

### 2.2 Configurar Variables de Entorno

En la sección **Environment**, agrega las siguientes variables:

#### Base de Datos
```
DB_HOST=tu-host-mysql.com
DB_PORT=3306
DB_USERNAME=tu-usuario
DB_PASSWORD=tu-password
DB_DATABASE=agroglobal
```

#### JWT & Seguridad
```
JWT_SECRET=genera-un-secreto-largo-y-seguro-aqui
JWT_EXPIRES_IN=7d
NODE_ENV=production
```

#### CORS - Frontend
```
FRONT_URL=https://tu-frontend.vercel.app
```

> **Nota:** Render detectará automáticamente el `PORT`, no necesitas configurarlo.

### 2.3 Desplegar

1. Click en **"Create Web Service"**
2. Render comenzará a construir y desplegar tu aplicación
3. Espera a que termine el proceso (puede tomar 3-5 minutos)
4. Una vez completado, verás tu URL en el dashboard

---

## ✅ Paso 3: Verificar el Despliegue

1. Abre la URL de tu servicio: `https://tu-app.onrender.com`
2. Deberías ver un mensaje o respuesta del servidor
3. Prueba un endpoint: `https://tu-app.onrender.com/api`

### Endpoints de Prueba

```bash
# Health check
GET https://tu-app.onrender.com/api

# Obtener productos aprobados (público)
GET https://tu-app.onrender.com/api/products/approved

# Login (requiere usuario en BD)
POST https://tu-app.onrender.com/api/auth/login
```

---

## 🔧 Configuración del Frontend

Una vez desplegado el backend, actualiza tu frontend con la URL del backend:

```javascript
// En tu archivo de configuración del frontend
const API_URL = 'https://tu-app.onrender.com/api';
```

Y actualiza la variable `FRONT_URL` en Render con la URL de tu frontend desplegado.

---

## 📁 Estructura de Archivos para Despliegue

```
backen-1/
├── src/                    # Código fuente
├── uploads/                # Carpeta de imágenes subidas
│   ├── products/
│   ├── cultivos/
│   └── vet-shops/
├── .env.example           # Ejemplo de variables de entorno
├── render.yaml            # Configuración de Render
├── Procfile               # Para otros servicios (opcional)
├── package.json           # Dependencias
└── DEPLOYMENT.md          # Este archivo
```

---

## 🔄 Actualizaciones y Re-despliegue

Render despliega automáticamente cuando haces push a tu rama principal:

```bash
git add .
git commit -m "Actualización del backend"
git push origin main
```

Render detectará el cambio y redesplegará automáticamente.

---

## 🐛 Solución de Problemas

### Error: "Application failed to respond"
- Verifica que el `PORT` esté configurado correctamente
- Revisa los logs en Render Dashboard
- Asegúrate de que `start:prod` esté en package.json

### Error de Conexión a Base de Datos
- Verifica las credenciales en las variables de entorno
- Asegúrate de que la base de datos permita conexiones externas
- Revisa que el puerto sea correcto (generalmente 3306 para MySQL)

### Error de CORS
- Verifica que `FRONT_URL` esté configurado correctamente
- Asegúrate de que la URL no tenga "/" al final
- Revisa que coincida exactamente con la URL de tu frontend

### Imágenes no se cargan
- Las imágenes se almacenan en el sistema de archivos de Render
- En el plan gratuito, las imágenes se mantienen entre despliegues
- Considera usar AWS S3 o Cloudinary para almacenamiento permanente

---

## 📊 Monitoreo

### Ver Logs en Tiempo Real
1. Ve a tu servicio en Render Dashboard
2. Click en **"Logs"**
3. Verás todos los logs de la aplicación

### Métricas
- Render proporciona métricas básicas de CPU, memoria y respuesta
- Disponible en la pestaña **"Metrics"**

---

## 💰 Planes de Render

### Plan Free (Actual)
- ✅ Gratis
- ✅ 512 MB RAM
- ✅ Compartido CPU
- ⚠️ Se duerme después de 15 min de inactividad
- ⚠️ 750 horas/mes

### Plan Starter ($7/mes)
- ✅ Siempre activo (no se duerme)
- ✅ 512 MB RAM
- ✅ Más CPU
- ✅ Horas ilimitadas

---

## 🔐 Seguridad en Producción

### Variables de Entorno Críticas

**NUNCA** expongas estas variables en el código:
- ❌ DB_PASSWORD
- ❌ JWT_SECRET
- ❌ Credenciales de APIs

Siempre usa variables de entorno en Render.

### SSL/HTTPS
- ✅ Render proporciona SSL automático
- ✅ Todas las conexiones son HTTPS por defecto

### Base de Datos
- Usa contraseñas fuertes
- Habilita SSL en la conexión a la base de datos (ya configurado)
- Realiza backups regulares

---

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs en Render Dashboard
2. Consulta la [documentación de Render](https://render.com/docs)
3. Verifica la configuración de variables de entorno
4. Revisa este documento nuevamente

---

## 🎉 ¡Listo!

Tu backend de AgroGlobal está ahora desplegado y listo para usar. 🚀

**URL del Backend:** `https://tu-app.onrender.com`
**URL de la API:** `https://tu-app.onrender.com/api`

Recuerda configurar tu frontend para que apunte a esta URL.
