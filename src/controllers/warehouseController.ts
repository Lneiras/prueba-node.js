import { Request, Response } from "express";
import { Warehouse } from "../models/Warehouse";
import { Inventory } from "../models/Inventory";
import { Medicine } from "../models/Medicine";

/**
 * Lista almacenes activos.
 */
export async function getWarehouses(_req: Request, res: Response): Promise<void> {
  try {
    const warehouses = await Warehouse.findAll({ where: { isActive: true } });
    res.json(warehouses);
  } catch {
    res.status(500).json({ message: "Error al consultar almacenes" });
  }
}

/**
 * Busca un almacén activo por id.
 */
export async function getWarehouseById(req: Request, res: Response): Promise<void> {
  try {
    const warehouse = await Warehouse.findOne({
      where: { id: Number(req.params.id), isActive: true }
    });

    if (!warehouse) {
      res.status(404).json({ message: "Almacén no encontrado" });
      return;
    }

    res.json(warehouse);
  } catch {
    res.status(500).json({ message: "Error al consultar almacén" });
  }
}

/**
 * Crea un almacén.
 */
export async function createWarehouse(req: Request, res: Response): Promise<void> {
  try {
    const { name, address } = req.body;

    if (!name || !address) {
      res.status(400).json({ message: "name y address son obligatorios" });
      return;
    }

    const warehouse = await Warehouse.create({ name, address, isActive: true });
    res.status(201).json(warehouse);
  } catch {
    res.status(500).json({ message: "Error al crear almacén" });
  }
}

/**
 * Actualiza un almacén.
 */
export async function updateWarehouse(req: Request, res: Response): Promise<void> {
  try {
    const warehouse = await Warehouse.findOne({
      where: { id: Number(req.params.id), isActive: true }
    });

    if (!warehouse) {
      res.status(404).json({ message: "Almacén no encontrado" });
      return;
    }

    await warehouse.update(req.body);
    res.json(warehouse);
  } catch {
    res.status(500).json({ message: "Error al actualizar almacén" });
  }
}

/**
 * Elimina lógicamente un almacén.
 */
export async function deleteWarehouse(req: Request, res: Response): Promise<void> {
  try {
    const warehouse = await Warehouse.findByPk(Number(req.params.id));

    if (!warehouse || !warehouse.isActive) {
      res.status(404).json({ message: "Almacén no encontrado" });
      return;
    }

    await warehouse.update({ isActive: false });
    res.json({ message: "Almacén eliminado lógicamente" });
  } catch {
    res.status(500).json({ message: "Error al eliminar almacén" });
  }
}

/**
 * Consulta el inventario de un almacén.
 */
export async function getInventory(req: Request, res: Response): Promise<void> {
  try {
    const warehouse = await Warehouse.findOne({
      where: { id: Number(req.params.id), isActive: true }
    });

    if (!warehouse) {
      res.status(404).json({ message: "Almacén no encontrado" });
      return;
    }

    const inventory = await Inventory.findAll({
      where: { warehouseId: warehouse.id },
      include: [{ model: Medicine, where: { isActive: true } }]
    });

    res.json(inventory);
  } catch {
    res.status(500).json({ message: "Error al consultar inventario" });
  }
}

/**
 * Crea o suma inventario para un medicamento en un almacén.
 * Se valida que el medicamento y el almacén existan y estén activos.
 */
export async function addInventory(req: Request, res: Response): Promise<void> {
  try {
    const warehouseId: number = Number(req.params.id);
    const { medicineId, quantity } = req.body as { medicineId?: number; quantity?: number };

    if (!medicineId || quantity === undefined || quantity <= 0) {
      res.status(400).json({ message: "medicineId y una quantity mayor a cero son obligatorios" });
      return;
    }

    const warehouse = await Warehouse.findOne({ where: { id: warehouseId, isActive: true } });
    const medicine = await Medicine.findOne({ where: { id: Number(medicineId), isActive: true } });

    if (!warehouse) {
      res.status(404).json({ message: "Almacén no encontrado" });
      return;
    }

    if (!medicine) {
      res.status(404).json({ message: "Medicamento no encontrado" });
      return;
    }

    const [inventory, created] = await Inventory.findOrCreate({
      where: { warehouseId, medicineId: Number(medicineId) },
      defaults: { warehouseId, medicineId: Number(medicineId), quantity }
    });

    if (!created) {
      await inventory.update({ quantity: inventory.quantity + quantity });
    }

    res.status(created ? 201 : 200).json(inventory);
  } catch {
    res.status(500).json({ message: "Error al actualizar inventario" });
  }
}
