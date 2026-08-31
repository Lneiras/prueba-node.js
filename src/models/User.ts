import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import { UserRole } from "../types/auth";

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id" | "isActive"> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: UserRole;
  public isActive!: boolean;
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(200), allowNull: false },
    role: { type: DataTypes.ENUM("ADMIN", "MANAGER"), allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  },
  { sequelize, tableName: "users", timestamps: true }
);
