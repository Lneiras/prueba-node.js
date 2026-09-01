import { Request, Response } from "express";
import { Clinic } from "../models/Clinic";


export async function getClinics(_req: Request, res: Response): Promise<void> {
  try {
    const clinics = await Clinic.findAll({ where: { isActive: true } });
    res.json(clinics);
  } catch {
    res.status(500).json({ message: "Error al consultar clínicas" });
  }
}


export async function getClinicById(req: Request, res: Response): Promise<void> {
  try {
    const clinic = await Clinic.findOne({
      where: { id: Number(req.params.id), isActive: true }
    });

    if (!clinic) {
      res.status(404).json({ message: "Clínica no encontrada" });
      return;
    }

    res.json(clinic);
  } catch {
    res.status(500).json({ message: "Error al consultar clínica" });
  }
}


export async function createClinic(req: Request, res: Response): Promise<void> {
  try {
    const { name, nit, responsibleName, responsibleEmail, responsiblePhone } = req.body;

    if (!name || !nit || !responsibleName || !responsibleEmail || !responsiblePhone) {
      res.status(400).json({ message: "Todos los datos de la clínica son obligatorios" });
      return;
    }

    const duplicate = await Clinic.findOne({ where: { nit } });

    if (duplicate) {
      res.status(409).json({ message: "Ya existe una clínica con ese NIT" });
      return;
    }

    const clinic = await Clinic.create({
      name,
      nit,
      responsibleName,
      responsibleEmail,
      responsiblePhone,
      isActive: true
    });

    res.status(201).json(clinic);
  } catch {
    res.status(500).json({ message: "Error al crear clínica" });
  }
}

export async function updateClinic(req: Request, res: Response): Promise<void> {
  try {
    const clinic = await Clinic.findOne({
      where: { id: Number(req.params.id), isActive: true }
    });

    if (!clinic) {
      res.status(404).json({ message: "Clínica no encontrada" });
      return;
    }

    if (req.body.nit && req.body.nit !== clinic.nit) {
      const duplicate = await Clinic.findOne({ where: { nit: req.body.nit } });
      if (duplicate) {
        res.status(409).json({ message: "Ya existe una clínica con ese NIT" });
        return;
      }
    }

    await clinic.update(req.body);
    res.json(clinic);
  } catch {
    res.status(500).json({ message: "Error al actualizar clínica" });
  }
}

export async function deleteClinic(req: Request, res: Response): Promise<void> {
  try {
    const clinic = await Clinic.findByPk(Number(req.params.id));

    if (!clinic || !clinic.isActive) {
      res.status(404).json({ message: "Clínica no encontrada" });
      return;
    }

    await clinic.update({ isActive: false });
    res.json({ message: "Clínica eliminada lógicamente" });
  } catch {
    res.status(500).json({ message: "Error al eliminar clínica" });
  }
}
