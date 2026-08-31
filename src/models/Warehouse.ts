import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface WarehouseAttributes {
  id: number;
  name: string;
  address: string;
  isActive: boolean;
}

interface WarehouseCreationAttributes extends Optional<WarehouseAttributes, "id" | "isActive"> {}

export class Warehouse extends Model<WarehouseAttributes, WarehouseCreationAttributes> implements WarehouseAttributes {
  public id!: number;
  public name!: string;
  public address!: string;
  public isActive!: boolean;
}

Warehouse.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    address: { type: DataTypes.STRING(200), allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  },
  { sequelize, tableName: "warehouses", timestamps: true }
);
