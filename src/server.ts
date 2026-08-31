import dotenv from "dotenv";
import app from "./app";
import { sequelize } from "./config/database";
import "./models";

dotenv.config();

const PORT: number = Number(process.env.PORT || 3000);


async function startServer(): Promise<void> {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("No fue posible iniciar la aplicación:", error);
    process.exit(1);
  }
}

startServer();
