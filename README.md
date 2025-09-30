# 🏍️ Taller Expert - Sistema de Gestión para Taller de Motos

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

Sistema web completo para la gestión de talleres de motocicletas desarrollado con Node.js y Express.

## 📋 Descripción

**Taller Expert** es una aplicación web que permite gestionar todos los aspectos de un taller de motos:
- 🔐 **Sistema de autenticación** seguro con roles de usuario
- 📦 **Gestión de inventario** de repuestos y productos
- 📅 **Agendamiento de citas** para servicios y mantenimiento
- 👥 **Control de acceso** diferenciado (Administrador/Empleado)

## 🚀 Características

### 🔐 Módulo de Autenticación
- Registro e inicio de sesión de usuarios
- Contraseñas encriptadas con bcrypt
- Tokens JWT para autenticación segura
- Control de sesiones y middleware de protección

### 📦 Módulo de Productos
- CRUD completo de productos del inventario
- Control de stock y precios
- Categorización de productos
- Permisos diferenciados por rol

### 📅 Módulo de Citas
- Agendamiento de servicios
- Seguimiento de estado de citas
- Gestión de clientes y vehículos
- Asignación de técnicos

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **JWT** - Tokens de autenticación
- **bcryptjs** - Encriptación de contraseñas
- **CORS** - Manejo de peticiones cruzadas

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos y diseño responsive
- **JavaScript** - Interactividad del cliente
- **Fetch API** - Comunicación con el backend

### Herramientas
- **Git** - Control de versiones
- **Postman** - Pruebas de API
- **VS Code** - Editor de código

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/taller-expert-api.git
cd taller-expert-api
Instalar dependencias

bash
npm install
Configurar variables de entorno

bash
# Crear archivo .env en la raíz del proyecto
PORT=3000
JWT_SECRET=mi_clave_secreta_jwt
Ejecutar la aplicación

bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
Acceder a la aplicación

text
Frontend: http://localhost:3000
API: http://localhost:3000/api
📡 API Endpoints
🔐 Autenticación
Método	Endpoint	Descripción	Autenticación
POST	/api/auth/register	Registrar nuevo usuario	Pública
POST	/api/auth/login	Iniciar sesión	Pública
📦 Gestión de Productos
Método	Endpoint	Descripción	Permisos
GET	/api/products	Listar todos los productos	Todos
GET	/api/products/:id	Obtener producto específico	Todos
POST	/api/products	Crear nuevo producto	Admin
PUT	/api/products/:id	Actualizar producto	Admin
DELETE	/api/products/:id	Eliminar producto	Admin
📅 Gestión de Citas
Método	Endpoint	Descripción	Permisos
GET	/api/appointments	Listar citas	Todos
POST	/api/appointments	Crear nueva cita	Admin/Empleado
PUT	/api/appointments/:id/status	Actualizar estado	Admin/Empleado
DELETE	/api/appointments/:id	Eliminar cita	Admin
🩺 Sistema
Método	Endpoint	Descripción
GET	/api/health	Estado del servidor
👤 Usuarios de Prueba
El sistema incluye usuarios por defecto para testing:

🔧 Administrador
text
Usuario: admin
Contraseña: 123456
Permisos: Acceso completo a todas las funcionalidades del sistema.

🔧 Empleado
text
Usuario: empleado1
Contraseña: abcdef
Permisos: Gestión de citas y consulta de inventario.

🗂️ Estructura del Proyecto
text
taller-expert-api/
├── src/
│   ├── controllers/         # Lógica de negocio
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── appointmentController.js
│   ├── routes/             # Definición de endpoints
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── appointmentRoutes.js
│   ├── middleware/         # Autenticación y validaciones
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   └── app.js             # Configuración de Express
├── public/                # Frontend web
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   └── css/
│       └── style.css
├── server.js              # Punto de entrada
├── package.json           # Dependencias del proyecto
└── README.md              # Este archivo
🧪 Pruebas
Pruebas con Postman
Importar la colección de Postman incluida

Configurar environment con la URL base

Ejecutar los tests endpoints en orden

Pruebas manuales
bash
# Health Check
curl http://localhost:3000/api/health

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}'
📝 Criterios de Evaluación Cumplidos
✅ EV01 - Servicios de Registro y Login
Servicio de registro funcional

Servicio de inicio de sesión

Validaciones de seguridad implementadas

Encriptación de contraseñas

✅ EV02 - Pruebas con Postman
Tests completos de todos los endpoints

Documentación de API

Video demostrativo

✅ EV03 - APIs del Proyecto
Módulo de productos completo

Módulo de citas funcional

Control de acceso por roles

Validaciones implementadas

✅ EV04 - Pruebas Integrales
Sistema funcionando end-to-end

Interfaz web operativa

Control de versiones con Git

🎥 Demo y Video
Video Demostrativo: 

🤝 Contribución
Fork el proyecto

Crear una rama para tu feature (git checkout -b feature/AmazingFeature)

Commit tus cambios (git commit -m 'Add some AmazingFeature')

Push a la rama (git push origin feature/AmazingFeature)

Abrir un Pull Request

📄 Licencia
Este proyecto fue desarrollado para fines educativos como parte del programa de formación en Análisis y Desarrollo de Software del SENA.

👨‍💻 Desarrollador
Grupo No-name
m

💼 GitHub: @thejarias11

🎓 Programa: Análisis y Desarrollo de Software - SENA

<div align="center">
¡Si te gusta el proyecto, dale una ⭐ en GitHub!

</div> ```
