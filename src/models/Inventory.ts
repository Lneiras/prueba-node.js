import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface InventoryAttributes {
  id: number;
  warehouseId: number;
  medicineId: number;
  quantity: number;
}

interface InventoryCreationAttributes extends Optional<InventoryAttributes, "id"> {}

export class Inventory extends Model<InventoryAttributes, InventoryCreationAttributes> implements InventoryAttributes {
  public id!: number;
  public warehouseId!: number;
  public medicineId!: number;
  public quantity!: number;
}

Inventory.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    warehouseId: { type: DataTypes.INTEGER, allowNull: false },
    medicineId: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
  },
  {
    sequelize,
    tableName: "inventories",
    timestamps: true,
    indexes: [{ unique: true, fields: ["warehouseId", "medicineId"] }]
  }
);
