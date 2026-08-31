
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'MANAGER')),
    "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clinics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    nit VARCHAR(30) NOT NULL UNIQUE,
    "responsibleName" VARCHAR(100) NOT NULL,
    "responsibleEmail" VARCHAR(150) NOT NULL,
    "responsiblePhone" VARCHAR(30) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS warehouses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    address VARCHAR(200) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS medicines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(250) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventories (
    id SERIAL PRIMARY KEY,
    "warehouseId" INTEGER NOT NULL REFERENCES warehouses(id),
    "medicineId" INTEGER NOT NULL REFERENCES medicines(id),
    quantity INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE ("warehouseId", "medicineId")
);

CREATE TABLE IF NOT EXISTS supply_requests (
    id SERIAL PRIMARY KEY,
    "clinicId" INTEGER NOT NULL REFERENCES clinics(id),
    "medicineId" INTEGER NOT NULL REFERENCES medicines(id),
    quantity INTEGER NOT NULL,
    "warehouseId" INTEGER NOT NULL REFERENCES warehouses(id),
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED')),
    "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

 
INSERT INTO users (name, email, password, role)
VALUES
('Administrador', 'admin@riwimedicare.com', 'b5ec09e5d6ed544fdae2e4ed2f041a21:87d053f7d9e2c0120937bf88646a0c686f574cf08578ea4d8a0d45a911151c20269fad3fde3752502f3ed90513f5d890bd71a309259a0f59bc4189973d457258', 'ADMIN'),
('Gestor de Solicitudes', 'gestor@riwimedicare.com', '3626fb45a4ffd9d2236cf18aa217117c:41a5b566c793e15239102b779d0a9f9fbebb0e1416964935c3b94b4ed93caa8c6ab97518f6b8e7f408a4a810e2148093ff3f74973afef169cc7c07879776d415', 'MANAGER')
ON CONFLICT (email) DO NOTHING;

INSERT INTO clinics (name, nit, "responsibleName", "responsibleEmail", "responsiblePhone")
VALUES
('Clinica Norte', '900123456-1', 'Ana Perez', 'ana@clinicanorte.com', '3001234567'),
('Centro Medico Sur', '900987654-2', 'Carlos Gomez', 'carlos@centromedico.com', '3019876543')
ON CONFLICT (nit) DO NOTHING;

INSERT INTO warehouses (name, address)
SELECT 'Almacen Principal', 'Calle 10 # 20-30'
WHERE NOT EXISTS (SELECT 1 FROM warehouses WHERE name = 'Almacen Principal');

INSERT INTO warehouses (name, address)
SELECT 'Almacen Secundario', 'Carrera 40 # 50-60'
WHERE NOT EXISTS (SELECT 1 FROM warehouses WHERE name = 'Almacen Secundario');

INSERT INTO medicines (name, code, description, unit)
VALUES
('Acetaminofen 500mg', 'MED-001', 'Analgesico y antipiretico', 'tableta'),
('Ibuprofeno 400mg', 'MED-002', 'Antiinflamatorio', 'tableta')
ON CONFLICT (code) DO NOTHING;

INSERT INTO inventories ("warehouseId", "medicineId", quantity)
SELECT w.id, m.id, 100
FROM warehouses w, medicines m
WHERE w.name = 'Almacen Principal' AND m.code = 'MED-001'
ON CONFLICT ("warehouseId", "medicineId") DO NOTHING;

INSERT INTO inventories ("warehouseId", "medicineId", quantity)
SELECT w.id, m.id, 80
FROM warehouses w, medicines m
WHERE w.name = 'Almacen Principal' AND m.code = 'MED-002'
ON CONFLICT ("warehouseId", "medicineId") DO NOTHING;

INSERT INTO inventories ("warehouseId", "medicineId", quantity)
SELECT w.id, m.id, 50
FROM warehouses w, medicines m
WHERE w.name = 'Almacen Secundario' AND m.code = 'MED-001'
ON CONFLICT ("warehouseId", "medicineId") DO NOTHING;
