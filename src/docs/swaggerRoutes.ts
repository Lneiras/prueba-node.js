/**
 * Este archivo contiene la documentación Swagger JSDoc de los endpoints.
 * Se mantiene separado de los controladores para no mezclar documentación con lógica.
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar usuario
 *     description: Endpoint público para registrar ADMIN o MANAGER.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Usuario creado.
 *       400:
 *         description: Datos inválidos.
 *       409:
 *         description: Email duplicado.
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login exitoso con JWT.
 *       401:
 *         description: Credenciales inválidas.
 */

/**
 * @swagger
 * /api/clinics:
 *   get:
 *     summary: Listar clínicas
 *     tags: [Clinics]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Lista de clínicas activas.
 *   post:
 *     summary: Crear clínica
 *     tags: [Clinics]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, nit, responsibleName, responsibleEmail, responsiblePhone]
 *             properties:
 *               name: { type: string, example: Clinica Norte }
 *               nit: { type: string, example: 900123456-1 }
 *               responsibleName: { type: string, example: Ana Perez }
 *               responsibleEmail: { type: string, example: ana@clinica.com }
 *               responsiblePhone: { type: string, example: 3001234567 }
 *     responses:
 *       201:
 *         description: Clínica creada.
 *       409:
 *         description: NIT duplicado.
 */

/**
 * @swagger
 * /api/clinics/{id}:
 *   get:
 *     summary: Consultar clínica
 *     tags: [Clinics]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Clínica encontrada.
 *       404:
 *         description: Clínica no encontrada.
 *   put:
 *     summary: Actualizar clínica
 *     tags: [Clinics]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Clínica actualizada.
 *   delete:
 *     summary: Eliminación lógica de clínica
 *     tags: [Clinics]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Clínica marcada como inactiva.
 */

/**
 * @swagger
 * /api/warehouses:
 *   get:
 *     summary: Listar almacenes
 *     tags: [Warehouses]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Lista de almacenes.
 *   post:
 *     summary: Crear almacén
 *     tags: [Warehouses]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Almacén creado.
 */

/**
 * @swagger
 * /api/warehouses/{id}/inventory:
 *   get:
 *     summary: Consultar inventario
 *     tags: [Warehouses]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Inventario del almacén.
 *   post:
 *     summary: Agregar inventario
 *     tags: [Warehouses]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [medicineId, quantity]
 *             properties:
 *               medicineId: { type: integer, example: 1 }
 *               quantity: { type: integer, example: 100 }
 *     responses:
 *       201:
 *         description: Inventario creado.
 *       200:
 *         description: Inventario aumentado.
 */

/**
 * @swagger
 * /api/medicines:
 *   get:
 *     summary: Listar medicamentos
 *     tags: [Medicines]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Lista de medicamentos.
 *   post:
 *     summary: Crear medicamento
 *     tags: [Medicines]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Medicamento creado.
 */

/**
 * @swagger
 * /api/requests:
 *   get:
 *     summary: Listar solicitudes para administración
 *     tags: [Requests]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Lista de solicitudes activas.
 *   post:
 *     summary: Crear solicitud de abastecimiento
 *     tags: [Requests]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RequestCreate'
 *     responses:
 *       201:
 *         description: Solicitud creada.
 *       400:
 *         description: Validación de clínica, medicamento, cantidad o inventario.
 */

/**
 * @swagger
 * /api/requests/{id}/status:
 *   patch:
 *     summary: Cambiar estado de solicitud
 *     tags: [Requests]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, APPROVED, REJECTED, COMPLETED, CANCELLED]
 *     responses:
 *       200:
 *         description: Estado actualizado.
 *       400:
 *         description: Estado no permitido.
 */

/**
 * @swagger
 * /api/requests/active:
 *   get:
 *     summary: Consultar solicitudes activas
 *     tags: [Requests]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Solicitudes pendientes o aprobadas.
 */

/**
 * @swagger
 * /api/requests/history:
 *   get:
 *     summary: Consultar historial completo
 *     tags: [Requests]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Historial completo de solicitudes.
 */

/**
 * @swagger
 * /api/requests/clinic/{clinicId}:
 *   get:
 *     summary: Historial de una clínica
 *     tags: [Requests]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: clinicId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Historial de solicitudes de la clínica.
 *       404:
 *         description: Clínica no encontrada.
 */

/**
 * @swagger
 * /api/seed/upload:
 *   post:
 *     summary: Cargar datos iniciales desde JSON
 *     description: Recibe un archivo JSON mediante Multer y lo utiliza como seeder.
 *     tags: [Seed]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Seed cargado correctamente.
 *       400:
 *         description: Archivo inválido.
 */
