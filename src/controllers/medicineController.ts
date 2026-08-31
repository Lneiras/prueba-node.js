import { Request, Response } from "express";
import { Medicine } from "../models/Medicine";

/**
 * Lista medicamentos activos.
 */
export async function getMedicines(_req: Request, res: Response): Promise<void> {
  try {
    const medicines = await Medicine.findAll({ where: { isActive: true } });
    res.json(medicines);
  } catch {
    res.status(500).json({ message: "Error al consultar medicamentos" });
  }
}

/**
 * Busca un medicamento.
 */
export async function getMedicineById(req: Request, res: Response): Promise<void> {
  try {
    const medicine = await Medicine.findOne({
      where: { id: Number(req.params.id), isActive: true }
    });

    if (!medicine) {
      res.status(404).json({ message: "Medicamento no encontrado" });
      return;
    }

    res.json(medicine);
  } catch {
    res.status(500).json({ message: "Error al consultar medicamento" });
  }
}

/**
 * Crea un medicamento y evita códigos duplicados.
 */
export async function createMedicine(req: Request, res: Response): Promise<void> {
  try {
    const { name, code, description, unit } = req.body;

    if (!name || !code || !description || !unit) {
      res.status(400).json({ message: "name, code, description y unit son obligatorios" });
      return;
    }

    const duplicate = await Medicine.findOne({ where: { code } });

    if (duplicate) {
      res.status(409).json({ message: "Ya existe un medicamento con ese código" });
      return;
    }

    const medicine = await Medicine.create({
      name,
      code,
      description,
      unit,
      isActive: true
    });

    res.status(201).json(medicine);
  } catch {
    res.status(500).json({ message: "Error al crear medicamento" });
  }
}

/**
 * Actualiza un medicamento.
 */
export async function updateMedicine(req: Request, res: Response): Promise<void> {
  try {
    const medicine = await Medicine.findOne({
      where: { id: Number(req.params.id), isActive: true }
    });

    if (!medicine) {
      res.status(404).json({ message: "Medicamento no encontrado" });
      return;
    }

    if (req.body.code && req.body.code !== medicine.code) {
      const duplicate = await Medicine.findOne({ where: { code: req.body.code } });
      if (duplicate) {
        res.status(409).json({ message: "Ya existe un medicamento con ese código" });
        return;
      }
    }

    await medicine.update(req.body);
    res.json(medicine);
  } catch {
    res.status(500).json({ message: "Error al actualizar medicamento" });
  }
}

/**
 * Elimina un medicamento.
 */
export async function deleteMedicine(req: Request, res: Response): Promise<void> {
  try {
    const medicine = await Medicine.findByPk(Number(req.params.id));

    if (!medicine || !medicine.isActive) {
      res.status(404).json({ message: "Medicamento no encontrado" });
      return;
    }

    await medicine.update({ isActive: false });
    res.json({ message: "Medicamento eliminado lógicamente" });
  } catch {
    res.status(500).json({ message: "Error al eliminar medicamento" });
  }
}
