import { sequelize } from "../config/database";
import { Clinic, Medicine, Warehouse, Inventory, SupplyRequest } from "../models";
import { RequestStatus } from "../models/SupplyRequest";

const VALID_STATUSES: RequestStatus[] = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
  "CANCELLED"
];

interface CreateRequestInput {
  clinicId: number;
  medicineId: number;
  quantity: number;
  warehouseId: number;
  status?: RequestStatus;
}
 
export async function createSupplyRequest(input: CreateRequestInput): Promise<SupplyRequest> {
  if (input.quantity <= 0) {
    throw new Error("La cantidad solicitada debe ser mayor a cero");
  }

  if (input.status && !VALID_STATUSES.includes(input.status)) {
    throw new Error("Estado de solicitud no permitido");
  }

  const transaction = await sequelize.transaction();

  try {
    const clinic = await Clinic.findOne({
      where: { id: input.clinicId, isActive: true },
      transaction
    });

    if (!clinic) {
      throw new Error("La clínica no existe");
    }

    const medicine = await Medicine.findOne({
      where: { id: input.medicineId, isActive: true },
      transaction
    });

    if (!medicine) {
      throw new Error("El medicamento no existe");
    }

    const warehouse = await Warehouse.findOne({
      where: { id: input.warehouseId, isActive: true },
      transaction
    });

    if (!warehouse) {
      throw new Error("El almacén no existe");
    }

    const inventory = await Inventory.findOne({
      where: {
        warehouseId: input.warehouseId,
        medicineId: input.medicineId
      },
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!inventory || inventory.quantity < input.quantity) {
      throw new Error("El almacén no tiene inventario suficiente");
    }

    await inventory.update(
      { quantity: inventory.quantity - input.quantity },
      { transaction }
    );

    const request = await SupplyRequest.create(
      {
        clinicId: input.clinicId,
        medicineId: input.medicineId,
        quantity: input.quantity,
        warehouseId: input.warehouseId,
        status: input.status || "PENDING",
        isActive: true
      },
      { transaction }
    );

    await transaction.commit();
    return request;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

 
export async function updateRequestStatus(
  requestId: number,
  status: RequestStatus
): Promise<SupplyRequest> {
  if (!VALID_STATUSES.includes(status)) {
    throw new Error("Estado de solicitud no permitido");
  }

  const request = await SupplyRequest.findOne({
    where: { id: requestId, isActive: true }
  });

  if (!request) {
    throw new Error("Solicitud no encontrada");
  }

  await request.update({ status });
  return request;
}
