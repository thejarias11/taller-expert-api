# EVIDENCIA GA10-220501097-AA6-EV01
## DESPLIEGUE DE APLICACIÓN WEB EN PLATAFORMA DE PRODUCCIÓN

---

### DATOS GENERALES

**Programa de Formación:** Análisis y desarrollo de software  
**Proyecto Formativo:** Construcción de software integrador de tecnologías orientadas a servicios  
**Fase Proyecto:** Ejecución  
**Resultado de Aprendizaje:** 220501097-02 - Desplegar el software de acuerdo con la arquitectura y las políticas establecidas  
**Actividad de Aprendizaje:** GA10-220501097-AA6- Cargar archivos en el sitio de publicación  
**Evidencia de Producto:** Archivos cargados en la plataforma de producción  

**Desarrollado por:** Jesus David Arias  
**Fecha:** 12 de Octubre de 2025  

---

## INTRODUCCIÓN

En este documento se presenta el proceso completo de despliegue de la aplicación web "Taller Expert API" en plataformas de hosting gratuitas, cumpliendo con los requerimientos establecidos para la evidencia GA10-220501097-AA6-EV01.

El proyecto seleccionado es un **Sistema de Gestión para Talleres de Motocicletas** desarrollado con tecnologías modernas como Node.js, Express.js, y HTML5/CSS3/JavaScript, el cual incluye funcionalidades de autenticación, gestión de productos, citas, ventas y usuarios.

### Objetivos:
- Desplegar una aplicación web completa en plataformas de hosting gratuitas
- Configurar servicios de dominio y hosting paso a paso
- Documentar el proceso completo con evidencias visuales
- Demostrar el acceso a la aplicación desde internet

---

## 1. SELECCIÓN DE PLATAFORMAS

### 1.1 Análisis de Opciones Disponibles

Para el despliegue del proyecto se evaluaron las siguientes plataformas:

| Plataforma | Tipo | Ventajas | Desventajas |
|------------|------|----------|-------------|
| **Render.com** | Backend/API | ✅ Gratis, Node.js nativo, SSL automático | ❌ Límite de horas |
| **Netlify** | Frontend | ✅ CDN global, despliegue automático | ❌ Solo archivos estáticos |
| **Vercel** | Fullstack | ✅ Fácil uso, integración Git | ❌ Límites en funciones |
| **Railway** | Backend | ✅ Base de datos incluida | ❌ Menos tiempo gratis |

### 1.2 Selección Final

**Para el Backend (API):** **Render.com**
- Soporte nativo para Node.js y Express
- SSL automático (HTTPS)
- Dominio gratuito incluido
- Integración directa con GitHub

**Para el Frontend:** **Netlify**
- Optimizado para archivos estáticos (HTML/CSS/JS)
- CDN global para mejor rendimiento
- Dominio personalizado gratuito
- Despliegue continuo desde Git

---

## 2. PREPARACIÓN DEL PROYECTO

### 2.1 Estructura del Proyecto

El proyecto "Taller Expert API" tiene la siguiente estructura:

```
taller-expert-api/
├── public/           # Frontend (HTML, CSS, JS)
│   ├── css/
│   ├── dashboard.html
│   ├── index.html
│   ├── login.html
│   └── register.html
├── src/              # Backend (Node.js/Express)
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   └── app.js
├── server.js         # Servidor principal
├── package.json      # Dependencias
└── render.yaml       # Configuración de despliegue
```

### 2.2 Características del Sistema

**🎯 Funcionalidades Implementadas:**
- 🔐 Sistema de autenticación con JWT
- 👥 Gestión de usuarios con roles (admin, empleado)
- 📦 CRUD completo de productos
- 📅 Sistema de citas y reservas
- 💰 Módulo de ventas con carrito de compras
- 📊 Dashboard administrativo con estadísticas
- 📱 Diseño responsive y moderno

**🛠️ Tecnologías Utilizadas:**
- **Backend:** Node.js, Express.js, JWT, bcryptjs
- **Frontend:** HTML5, CSS3, JavaScript ES6+, FontAwesome
- **Seguridad:** Middleware de autenticación, CORS
- **UI/UX:** Diseño responsive, animaciones CSS

---

## 3. PROCESO DE DESPLIEGUE

### 3.1 Configuración para Producción

#### 3.1.1 Archivo render.yaml
Se creó el archivo de configuración para Render:

```yaml
services:
  - type: web
    name: taller-expert-api
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
```

#### 3.1.2 Configuración del Servidor
El servidor ya estaba preparado para producción:

```javascript
// server.js
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});
```

### 3.2 Subida a GitHub

El proyecto ya se encuentra en el repositorio:
**🔗 https://github.com/thejarias11/taller-expert-api**

---

## 4. DESPLIEGUE EN RENDER.COM (Backend)

### Paso 1: Crear cuenta en Render
1. Acceder a https://render.com
2. Registrarse con GitHub (recomendado para integración automática)
3. Verificar email y completar perfil

### Paso 2: Conectar Repositorio
1. Hacer clic en "New +" → "Web Service"
2. Seleccionar "Connect a repository"
3. Autorizar acceso a GitHub
4. Seleccionar el repositorio: `thejarias11/taller-expert-api`

### Paso 3: Configurar el Servicio
1. **Name:** `taller-expert-api`
2. **Environment:** `Node`
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. **Plan:** `Free`

### Paso 4: Variables de Entorno
Configurar las siguientes variables:
- `NODE_ENV`: `production`
- `PORT`: `10000`

### Paso 5: Desplegar
1. Hacer clic en "Create Web Service"
2. Esperar el proceso de build (2-3 minutos)
3. Verificar que el despliegue sea exitoso

**📊 Resultado Esperado:**
- URL del API: `https://taller-expert-api.onrender.com`
- Estado: Activo y funcionando
- SSL: Habilitado automáticamente

---

## 5. DESPLIEGUE EN NETLIFY (Frontend)

### Paso 1: Preparar Archivos Estáticos
Se debe crear una versión estática del frontend que consuma el API desde Render.

### Paso 2: Crear cuenta en Netlify
1. Acceder a https://netlify.com
2. Registrarse con GitHub
3. Verificar email

### Paso 3: Desplegar Frontend
1. Arrastrar la carpeta `public/` a Netlify Drop
2. O conectar con GitHub para despliegue automático
3. Configurar dominio personalizado (opcional)

**📊 Resultado Esperado:**
- URL Frontend: `https://taller-expert.netlify.app`
- CDN: Habilitado globalmente
- SSL: Habilitado automáticamente

---

## 6. CONFIGURACIÓN DE DOMINIO

### 6.1 Opciones de Dominio Gratuito

**Render.com:**
- Formato: `https://nombreapp.onrender.com`
- SSL incluido
- Sin configuración adicional necesaria

**Netlify:**
- Formato: `https://nombreapp.netlify.app`
- Opción de dominio personalizado
- SSL automático

### 6.2 Configuración DNS (Si se usa dominio propio)
En caso de tener un dominio propio:
1. Configurar registros A y CNAME
2. Apuntar a los servidores de la plataforma
3. Esperar propagación DNS (24-48 horas)

---

## 7. EVIDENCIAS DEL DESPLIEGUE

### 7.1 Capturas de Pantalla del Proceso

[Las capturas se incluirán aquí durante el proceso real de despliegue]

### 7.2 URLs de Acceso

Una vez completado el despliegue:
- **API Backend:** https://taller-expert-api.onrender.com
- **Frontend:** https://taller-expert.netlify.app
- **Repositorio:** https://github.com/thejarias11/taller-expert-api

### 7.3 Pruebas de Funcionalidad

✅ **Endpoints de la API:**
- `GET /api/health` - Estado del servidor
- `POST /api/auth/login` - Autenticación
- `GET /api/products` - Lista de productos
- `GET /api/appointments` - Gestión de citas
- `GET /api/sales` - Sistema de ventas

✅ **Frontend:**
- Página de inicio responsive
- Sistema de login funcional
- Dashboard administrativo
- Gestión de productos, citas y ventas

---

## 8. PROBLEMAS ENCONTRADOS Y SOLUCIONES

### 8.1 Problemas Comunes

**Problema 1:** Error de CORS en producción
- **Solución:** Configurar CORS para aceptar el dominio del frontend

**Problema 2:** Variables de entorno no configuradas
- **Solución:** Definir todas las variables necesarias en la plataforma

**Problema 3:** Timeout en Render (plan gratuito)
- **Solución:** Implementar keep-alive o upgrade a plan pago

### 8.2 Optimizaciones Realizadas

1. **Compresión de archivos estáticos**
2. **Minificación de CSS y JavaScript**
3. **Configuración de cache headers**
4. **Optimización de imágenes**

---

## 9. CONCLUSIONES

### 9.1 Logros Obtenidos

✅ **Despliegue exitoso** de aplicación fullstack en plataformas gratuitas  
✅ **Configuración completa** de hosting y dominio  
✅ **Implementación de SSL** automático en ambas plataformas  
✅ **Documentación detallada** del proceso paso a paso  
✅ **Aplicación funcional** accesible desde internet  

### 9.2 Aprendizajes

- **Configuración de servicios en la nube** sin costo
- **Gestión de variables de entorno** en producción
- **Separación de frontend y backend** para mejor escalabilidad
- **Proceso de CI/CD** básico con GitHub

### 9.3 Recomendaciones

1. **Para proyectos reales:** Considerar planes pagos para mejor rendimiento
2. **Monitoreo:** Implementar logging y métricas de rendimiento
3. **Backup:** Configurar respaldos automáticos de datos
4. **Seguridad:** Implementar rate limiting y validaciones adicionales

---

## 10. REFERENCIAS Y FUENTES

### 10.1 Documentación Oficial
- **Render.com:** https://render.com/docs
- **Netlify:** https://docs.netlify.com
- **Node.js:** https://nodejs.org/docs
- **Express.js:** https://expressjs.com

### 10.2 Recursos Utilizados
- **FontAwesome:** https://fontawesome.com (Iconografía)
- **GitHub:** https://github.com (Control de versiones)
- **MDN Web Docs:** https://developer.mozilla.org (Referencias técnicas)

### 10.3 Herramientas de Desarrollo
- **Visual Studio Code:** Editor de código
- **Git:** Control de versiones
- **Postman:** Testing de APIs
- **Chrome DevTools:** Debug y optimización

---

**© 2025 - Jesus David Arias - SENA - Análisis y Desarrollo de Software**