import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface ClinicAttributes {
  id: number;
  name: string;
  nit: string;
  responsibleName: string;
  responsibleEmail: string;
  responsiblePhone: string;
  isActive: boolean;
}

interface ClinicCreationAttributes extends Optional<ClinicAttributes, "id" | "isActive"> {}

export class Clinic extends Model<ClinicAttributes, ClinicCreationAttributes> implements ClinicAttributes {
  public id!: number;
  public name!: string;
  public nit!: string;
  public responsibleName!: string;
  public responsibleEmail!: string;
  public responsiblePhone!: string;
  public isActive!: boolean;
}

Clinic.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    nit: { type: DataTypes.STRING(30), allowNull: false, unique: true },
    responsibleName: { type: DataTypes.STRING(100), allowNull: false },
    responsibleEmail: { type: DataTypes.STRING(150), allowNull: false },
    responsiblePhone: { type: DataTypes.STRING(30), allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  },
  { sequelize, tableName: "clinics", timestamps: true }
);
