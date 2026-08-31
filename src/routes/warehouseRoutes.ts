import { Router } from "express";
import {
  addInventory,
  createWarehouse,
  deleteWarehouse,
  getInventory,
  getWarehouseById,
  getWarehouses,
  updateWarehouse
} from "../controllers/warehouseController";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware";

const router: Router = Router();

/**
 * El CRUD de almacenes e inventario administrativo requiere rol ADMIN.
 */
router.use(authenticate, authorizeRoles("ADMIN"));

router.get("/", getWarehouses);
router.get("/:id", getWarehouseById);
router.post("/", createWarehouse);
router.put("/:id", updateWarehouse);
router.delete("/:id", deleteWarehouse);
router.get("/:id/inventory", getInventory);
router.post("/:id/inventory", addInventory);

export default router;
