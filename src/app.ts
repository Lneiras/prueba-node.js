import express, { Express } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";
import "./docs/swaggerRoutes";
import { errorHandler } from "./middlewares/errorMiddleware";

const app: Express = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "RiwiMediCare Plus API",
    docs: "/api-docs",
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

export default app;
