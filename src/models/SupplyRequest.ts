import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "CANCELLED";

interface SupplyRequestAttributes {
  id: number;
  clinicId: number;
  medicineId: number;
  quantity: number;
  warehouseId: number;
  status: RequestStatus;
  isActive: boolean;
}

interface SupplyRequestCreationAttributes extends Optional<SupplyRequestAttributes, "id" | "isActive"> {}

export class SupplyRequest extends Model<SupplyRequestAttributes, SupplyRequestCreationAttributes> implements SupplyRequestAttributes {
  public id!: number;
  public clinicId!: number;
  public medicineId!: number;
  public quantity!: number;
  public warehouseId!: number;
  public status!: RequestStatus;
  public isActive!: boolean;
}

SupplyRequest.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    clinicId: { type: DataTypes.INTEGER, allowNull: false },
    medicineId: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    warehouseId: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED", "COMPLETED", "CANCELLED"),
      allowNull: false,
      defaultValue: "PENDING"
    },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  },
  { sequelize, tableName: "supply_requests", timestamps: true }
);
