import { Router } from "express";
import {
  createClinic,
  deleteClinic,
  getClinicById,
  getClinics,
  updateClinic
} from "../controllers/clinicController";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware";

const router: Router = Router();


router.use(authenticate, authorizeRoles("ADMIN"));

router.get("/", getClinics);
router.get("/:id", getClinicById);
router.post("/", createClinic);
router.put("/:id", updateClinic);
router.delete("/:id", deleteClinic);

export default router;
