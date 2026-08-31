import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();


export const sequelize: Sequelize = new Sequelize(
  process.env.DB_NAME || "riwimedicare",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "postgres",
  {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    dialect: "postgres",
    logging: false
  }
);
