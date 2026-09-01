# RiwiMediCare Plus - API REST

## Coder

* Nombre: Laura Neira

## Tecnologías

* Node.js
* TypeScript
* Express
* Sequelize
* PostgreSQL
* JWT
* Multer
* Swagger
* Docker
* Docker Compose

---

## 1. Instalación

### Requisitos

Para ejecutar el proyecto utilizando Docker se necesita:

* Docker
* Docker Compose

No es necesario instalar PostgreSQL directamente en el equipo, ya que PostgreSQL se ejecuta dentro de un contenedor.

### Clonar el proyecto

```bash
git clone https://github.com/Lneiras/prueba-desempe-o-node.js.git
cd prueba-desempe-o-node.js
```

### Configurar variables de entorno

Copiar el archivo `.env.example`:

```bash
cp .env.example .env
```

En Windows también se puede copiar manualmente `.env.example` como `.env`.

---

## 2. Configuración de variables de entorno

El archivo `.env` contiene la configuración de la aplicación y de PostgreSQL.

Ejemplo:

```env
PORT=3000

DB_HOST=db
DB_PORT=5432
DB_NAME=riwimedicare
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=clave_secreta_para_prueba
JWT_EXPIRES_IN=2h
```

### Importante

Cuando la API se ejecuta dentro de Docker, `DB_HOST` debe ser:

```env
DB_HOST=db
```

`db` corresponde al nombre del servicio de PostgreSQL definido en `docker-compose.yml`.

No se debe utilizar:

```env
DB_HOST=localhost
```

para la conexión entre los contenedores.

---

## 3. Ejecutar el proyecto con Docker

El proyecto utiliza Docker Compose para levantar:

* La API Node.js.
* La base de datos PostgreSQL.

### Construir y levantar los contenedores

```bash
docker compose up --build
```

También se puede ejecutar en segundo plano:

```bash
docker compose up --build -d
```

La primera ejecución puede tardar un poco mientras Docker descarga las imágenes y construye la aplicación.

### Ver los contenedores

```bash
docker compose ps
```

### Ver los logs de la API

```bash
docker compose logs -f app
```

### Ver los logs de PostgreSQL

```bash
docker compose logs -f db
```

### Detener los contenedores

```bash
docker compose down
```

---

## 4. Base de datos PostgreSQL

PostgreSQL se ejecuta automáticamente mediante Docker Compose.

La configuración utilizada es:

```text
Base de datos: riwimedicare
Usuario: postgres
Puerto: 5432
```

La API se conecta al servicio de PostgreSQL utilizando:

```env
DB_HOST=db
```

Al iniciar la API, Sequelize crea las tablas automáticamente mediante `sync()`.

No es necesario ejecutar manualmente:

```sql
CREATE DATABASE riwimedicare;
```

cuando se utiliza Docker Compose, ya que la base de datos es creada por el contenedor de PostgreSQL.

---

## 5. Ejecutar la aplicación sin Docker

También es posible ejecutar la API localmente.

Para esta opción se necesita tener instalado:

* Node.js 18 o superior.
* PostgreSQL.

### Instalar dependencias

```bash
npm install
```

### Configurar `.env`

Para PostgreSQL instalado localmente se puede utilizar:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=riwimedicare
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=clave_secreta_para_prueba
JWT_EXPIRES_IN=2h
```

### Crear la base de datos

```sql
CREATE DATABASE riwimedicare;
```

### Ejecutar en desarrollo

```bash
npm run dev
```

### Compilar TypeScript

```bash
npm run build
```

### Ejecutar la versión compilada

```bash
npm start
```

---

## 6. URLs de la aplicación

Cuando la aplicación está ejecutándose:

### API

```text
http://localhost:3000
```

### Swagger

```text
http://localhost:3000/api-docs
```

Swagger permite consultar los endpoints disponibles, parámetros, cuerpos de las solicitudes y respuestas principales.

---

## 7. Registro y login

### Registro

El registro no requiere JWT.

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Admin\",\"email\":\"admin@riwimedicare.com\",\"password\":\"123456\",\"role\":\"ADMIN\"}"
```

También se puede registrar un gestor:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Gestor\",\"email\":\"gestor@riwimedicare.com\",\"password\":\"123456\",\"role\":\"MANAGER\"}"
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@riwimedicare.com\",\"password\":\"123456\"}"
```

La respuesta contiene un JWT.

Copiar el token recibido y utilizarlo en los endpoints protegidos:

```text
Authorization: Bearer TU_TOKEN
```

---

## 8. Seed de datos mediante JSON + Multer

El proyecto permite cargar datos iniciales mediante un archivo JSON.

Endpoint:

```text
POST /api/seed/upload
```

Requiere un usuario `ADMIN` autenticado.

El archivo debe enviarse utilizando el campo:

```text
file
```

Ejemplo:

```bash
curl -X POST http://localhost:3000/api/seed/upload \
  -H "Authorization: Bearer TU_TOKEN" \
  -F "file=@seeds/data.json"
```

El archivo de ejemplo contiene información para:

* Usuarios.
* Clínicas.
* Almacenes.
* Medicamentos.
* Inventario.

El endpoint evita duplicar usuarios por email y clínicas por NIT.

---

## 9. Ejemplos de endpoints

### Crear clínica

```bash
curl -X POST http://localhost:3000/api/clinics \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Clinica Norte\",\"nit\":\"900123456-1\",\"responsibleName\":\"Ana Perez\",\"responsibleEmail\":\"ana@clinica.com\",\"responsiblePhone\":\"3001234567\"}"
```

### Crear almacén

```bash
curl -X POST http://localhost:3000/api/warehouses \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Almacen Principal\",\"address\":\"Calle 10 # 20-30\"}"
```

### Crear medicamento

```bash
curl -X POST http://localhost:3000/api/medicines \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Acetaminofen 500mg\",\"code\":\"MED-001\",\"description\":\"Analgesico\",\"unit\":\"tableta\"}"
```

### Agregar inventario

```bash
curl -X POST http://localhost:3000/api/warehouses/1/inventory \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"medicineId\":1,\"quantity\":100}"
```

### Crear solicitud como MANAGER

```bash
curl -X POST http://localhost:3000/api/requests \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"clinicId\":1,\"medicineId\":1,\"quantity\":10,\"warehouseId\":1,\"status\":\"PENDING\"}"
```

### Actualizar estado

```bash
curl -X PATCH http://localhost:3000/api/requests/1/status \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"APPROVED\"}"
```

### Consultar solicitudes activas

```bash
curl http://localhost:3000/api/requests/active \
  -H "Authorization: Bearer TU_TOKEN"
```

### Consultar historial de una clínica

```bash
curl http://localhost:3000/api/requests/clinic/1 \
  -H "Authorization: Bearer TU_TOKEN"
```

### Consultar historial completo

```bash
curl http://localhost:3000/api/requests/history \
  -H "Authorization: Bearer TU_TOKEN"
```

---

## 10. Roles

### ADMIN

Puede ejecutar:

* CRUD de clínicas.
* CRUD de almacenes.
* CRUD de medicamentos.
* Gestión de inventario.
* Gestión de solicitudes.
* Seed de datos.

### MANAGER

Puede:

* Crear solicitudes.
* Actualizar estados de solicitudes.
* Consultar solicitudes.

El registro es público porque el enunciado permite que el usuario seleccione su rol durante el registro.

---

## 11. Eliminación lógica

Los registros principales utilizan el campo:

```text
isActive
```

Las eliminaciones no borran físicamente la información de PostgreSQL.

En su lugar, el registro se marca como:

```text
isActive = false
```

Esto permite conservar la información y mantener el historial.

---

## 12. Estados de solicitud

Las solicitudes utilizan los siguientes estados:

```text
PENDING
APPROVED
REJECTED
COMPLETED
CANCELLED
```

---

## 13. Docker

La aplicación utiliza Docker Compose para ejecutar el backend y PostgreSQL.

La estructura básica es:

```text
Docker Compose
│
├── api
│   └── Node.js + TypeScript + Express
│
└── db
    └── PostgreSQL
```

### Construir la aplicación

```bash
docker compose build
```

### Iniciar

```bash
docker compose up
```

### Iniciar en segundo plano

```bash
docker compose up -d
```

### Detener

```bash
docker compose down
```

### Detener y eliminar también los volúmenes

```bash
docker compose down -v
```

> `docker compose down -v` elimina los volúmenes asociados y, por lo tanto, también los datos persistidos de PostgreSQL. Utilizar este comando solamente cuando se quiera reiniciar completamente la base de datos.

---

## 14. Conventional Commits y Gitflow

### Ramas principales

```text
main
develop
feature/*
```

Ejemplo:

```text
main
│
├── feature/auth
├── feature/clinics
├── feature/catalog
├── feature/requests
├── feature/seeder
└── docs/api
```


---

## 15. Backup SQL

El archivo `backup.sql` contiene la estructura SQL y datos de ejemplo para recuperar la base de datos.

---

## 16. Swagger

La documentación de la API está disponible en:

```text
http://localhost:3000/api-docs
```

Incluye:

* Métodos HTTP.
* Rutas.
* Parámetros.
* Body de las solicitudes.
* Respuestas principales.
* Autenticación mediante JWT.

