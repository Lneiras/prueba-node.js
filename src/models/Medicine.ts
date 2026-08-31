import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface MedicineAttributes {
  id: number;
  name: string;
  code: string;
  description: string;
  unit: string;
  isActive: boolean;
}

interface MedicineCreationAttributes extends Optional<MedicineAttributes, "id" | "isActive"> {}

export class Medicine extends Model<MedicineAttributes, MedicineCreationAttributes> implements MedicineAttributes {
  public id!: number;
  public name!: string;
  public code!: string;
  public description!: string;
  public unit!: string;
  public isActive!: boolean;
}

Medicine.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    description: { type: DataTypes.STRING(250), allowNull: false },
    unit: { type: DataTypes.STRING(50), allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  },
  { sequelize, tableName: "medicines", timestamps: true }
);
