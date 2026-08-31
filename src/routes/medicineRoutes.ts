import { Router } from "express";
import {
  createMedicine,
  deleteMedicine,
  getMedicineById,
  getMedicines,
  updateMedicine
} from "../controllers/medicineController";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware";

const router: Router = Router();


router.use(authenticate, authorizeRoles("ADMIN"));

router.get("/", getMedicines);
router.get("/:id", getMedicineById);
router.post("/", createMedicine);
router.put("/:id", updateMedicine);
router.delete("/:id", deleteMedicine);

export default router;
