import { Router } from "express";
import {
  changeRequestStatus,
  createRequest,
  deleteRequest,
  getActiveRequests,
  getAllRequests,
  getClinicRequestHistory,
  getRequestById,
  getRequestHistory,
  updateRequest
} from "../controllers/requestController";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware";

const router: Router = Router();

 
router.use(authenticate);

 
router.get("/active", getActiveRequests);
router.get("/history", getRequestHistory);
router.get("/clinic/:clinicId", getClinicRequestHistory);

/**
 * El gestor y el admin pueden crear solicitudes y cambiar su estado.
 */
router.post("/", authorizeRoles("ADMIN", "MANAGER"), createRequest);
router.patch("/:id/status", authorizeRoles("ADMIN", "MANAGER"), changeRequestStatus);

/**
 * esto esta reservado para admin.
 */
router.get("/", authorizeRoles("ADMIN"), getAllRequests);
router.get("/:id", authorizeRoles("ADMIN"), getRequestById);
router.put("/:id", authorizeRoles("ADMIN"), updateRequest);
router.delete("/:id", authorizeRoles("ADMIN"), deleteRequest);

export default router;
