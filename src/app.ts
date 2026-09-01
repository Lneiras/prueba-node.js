import express, { Express } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";
import "./docs/swaggerRoutes";
import { errorHandler } from "./middlewares/errorMiddleware";
import authRoutes from "./routes/authRoutes";
import clinicRoutes from "./routes/clinicRoutes";
import warehouseRoutes from "./routes/warehouseRoutes";
import medicineRoutes from "./routes/medicineRoutes";
import requestRoutes from "./routes/requestRoutes";
import seedRoutes from "./routes/seedRoutes";



const app: Express = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "RiwiMediCare Plus API",
    docs: "/api-docs",
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/clinics", clinicRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/seed", seedRoutes);

app.use(errorHandler);

export default app;
