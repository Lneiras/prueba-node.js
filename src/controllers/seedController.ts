import { Request, Response } from "express";
import { Clinic, Inventory, Medicine, User, Warehouse } from "../models";
import { hashPassword } from "../utils/password";

interface SeedFile {
  users?: Array<{
    name: string;
    email: string;
    password: string;
    role: "ADMIN" | "MANAGER";
  }>;
  clinics?: Array<{
    name: string;
    nit: string;
    responsibleName: string;
    responsibleEmail: string;
    responsiblePhone: string;
  }>;
  warehouses?: Array<{
    name: string;
    address: string;
  }>;
  medicines?: Array<{
    name: string;
    code: string;
    description: string;
    unit: string;
  }>;
  inventories?: Array<{
    warehouseId: number;
    medicineId: number;
    quantity: number;
  }>;
}

 
export async function uploadSeed(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ message: "Debe enviar un archivo JSON en el campo file" });
      return;
    }

    if (req.file.mimetype !== "application/json") {
      res.status(400).json({ message: "El archivo debe ser JSON" });
      return;
    }

    const data: SeedFile = JSON.parse(req.file.buffer.toString("utf-8"));

    if (data.users) {
      for (const item of data.users) {
        const existing = await User.findOne({ where: { email: item.email } });
        if (!existing) {
          await User.create({
            ...item,
            password: hashPassword(item.password),
            isActive: true
          });
        }
      }
    }

    if (data.clinics) {
      for (const item of data.clinics) {
        const existing = await Clinic.findOne({ where: { nit: item.nit } });
        if (!existing) {
          await Clinic.create({ ...item, isActive: true });
        }
      }
    }

    if (data.warehouses) {
      for (const item of data.warehouses) {
        await Warehouse.findOrCreate({
          where: { name: item.name },
          defaults: { ...item, isActive: true }
        });
      }
    }

    if (data.medicines) {
      for (const item of data.medicines) {
        await Medicine.findOrCreate({
          where: { code: item.code },
          defaults: { ...item, isActive: true }
        });
      }
    }

    if (data.inventories) {
      for (const item of data.inventories) {
        await Inventory.findOrCreate({
          where: {
            warehouseId: item.warehouseId,
            medicineId: item.medicineId
          },
          defaults: item
        });
      }
    }

    res.status(201).json({ message: "Seed cargado correctamente" });
  } catch {
    res.status(400).json({ message: "El archivo JSON no es válido o no pudo cargarse" });
  }
}
