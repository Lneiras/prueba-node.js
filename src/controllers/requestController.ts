import { Op } from "sequelize";
import { Request, Response } from "express";
import { Clinic, Medicine, Warehouse, SupplyRequest } from "../models";
import { RequestStatus } from "../models/SupplyRequest";
import { createSupplyRequest, updateRequestStatus } from "../services/requestService";

 
export async function createRequest(req: Request, res: Response): Promise<void> {
  try {
    const { clinicId, medicineId, quantity, warehouseId, status } = req.body as {
      clinicId?: number;
      medicineId?: number;
      quantity?: number;
      warehouseId?: number;
      status?: RequestStatus;
    };

    if (!clinicId || !medicineId || quantity === undefined || !warehouseId) {
      res.status(400).json({
        message: "clinicId, medicineId, quantity y warehouseId son obligatorios"
      });
      return;
    }

    const request = await createSupplyRequest({
      clinicId: Number(clinicId),
      medicineId: Number(medicineId),
      quantity: Number(quantity),
      warehouseId: Number(warehouseId),
      status
    });

    res.status(201).json(request);
  } catch (error) {
    const message: string = error instanceof Error ? error.message : "Error al crear solicitud";

    if (
      message.includes("no existe") ||
      message.includes("no tiene") ||
      message.includes("mayor a cero") ||
      message.includes("no permitido")
    ) {
      res.status(400).json({ message });
      return;
    }

    res.status(500).json({ message: "Error al crear solicitud" });
  }
}

 
export async function changeRequestStatus(req: Request, res: Response): Promise<void> {
  try {
    const status = req.body.status as RequestStatus;

    if (!status) {
      res.status(400).json({ message: "status es obligatorio" });
      return;
    }

    const request = await updateRequestStatus(Number(req.params.id), status);
    res.json(request);
  } catch (error) {
    const message: string = error instanceof Error ? error.message : "Error al actualizar solicitud";

    if (message.includes("no permitido") || message.includes("no encontrada")) {
      res.status(400).json({ message });
      return;
    }

    res.status(500).json({ message: "Error al actualizar solicitud" });
  }
}

 
export async function getActiveRequests(_req: Request, res: Response): Promise<void> {
  try {
    const requests = await SupplyRequest.findAll({
      where: {
        isActive: true,
        status: { [Op.in]: ["PENDING", "APPROVED"] }
      },
      include: [Clinic, Medicine, Warehouse]
    });

    res.json(requests);
  } catch {
    res.status(500).json({ message: "Error al consultar solicitudes activas" });
  }
}

 
export async function getRequestHistory(_req: Request, res: Response): Promise<void> {
  try {
    const requests = await SupplyRequest.findAll({
      include: [Clinic, Medicine, Warehouse],
      order: [["createdAt", "DESC"]]
    });

    res.json(requests);
  } catch {
    res.status(500).json({ message: "Error al consultar historial" });
  }
}

 
export async function getClinicRequestHistory(req: Request, res: Response): Promise<void> {
  try {
    const clinicId: number = Number(req.params.clinicId);

    const clinic = await Clinic.findOne({
      where: { id: clinicId, isActive: true }
    });

    if (!clinic) {
      res.status(404).json({ message: "Clínica no encontrada" });
      return;
    }

    const requests = await SupplyRequest.findAll({
      where: { clinicId },
      include: [Clinic, Medicine, Warehouse],
      order: [["createdAt", "DESC"]]
    });

    res.json(requests);
  } catch {
    res.status(500).json({ message: "Error al consultar historial de clínica" });
  }
}

 
export async function getAllRequests(_req: Request, res: Response): Promise<void> {
  try {
    const requests = await SupplyRequest.findAll({
      where: { isActive: true },
      include: [Clinic, Medicine, Warehouse],
      order: [["createdAt", "DESC"]]
    });

    res.json(requests);
  } catch {
    res.status(500).json({ message: "Error al consultar solicitudes" });
  }
}

/**
 * Consulta una solicitud por id.
 */
export async function getRequestById(req: Request, res: Response): Promise<void> {
  try {
    const request = await SupplyRequest.findOne({
      where: { id: Number(req.params.id), isActive: true },
      include: [Clinic, Medicine, Warehouse]
    });

    if (!request) {
      res.status(404).json({ message: "Solicitud no encontrada" });
      return;
    }

    res.json(request);
  } catch {
    res.status(500).json({ message: "Error al consultar solicitud" });
  }
}

 
export async function updateRequest(req: Request, res: Response): Promise<void> {
  try {
    const request = await SupplyRequest.findOne({
      where: { id: Number(req.params.id), isActive: true }
    });

    if (!request) {
      res.status(404).json({ message: "Solicitud no encontrada" });
      return;
    }

    const allowedFields: Partial<SupplyRequest> = {};

    if (req.body.status !== undefined) {
      const valid: RequestStatus[] = ["PENDING", "APPROVED", "REJECTED", "COMPLETED", "CANCELLED"];
      if (!valid.includes(req.body.status)) {
        res.status(400).json({ message: "Estado de solicitud no permitido" });
        return;
      }
      allowedFields.status = req.body.status;
    }

    await request.update(allowedFields);
    res.json(request);
  } catch {
    res.status(500).json({ message: "Error al actualizar solicitud" });
  }
}

/**
 * Elimina una solicitud.
 */
export async function deleteRequest(req: Request, res: Response): Promise<void> {
  try {
    const request = await SupplyRequest.findByPk(Number(req.params.id));

    if (!request || !request.isActive) {
      res.status(404).json({ message: "Solicitud no encontrada" });
      return;
    }

    await request.update({ isActive: false });
    res.json({ message: "Solicitud eliminada lógicamente" });
  } catch {
    res.status(500).json({ message: "Error al eliminar solicitud" });
  }
}
