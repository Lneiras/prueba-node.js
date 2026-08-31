import { Router } from "express";
import multer from "multer";
import { uploadSeed } from "../controllers/seedController";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware";

const router: Router = Router();


const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype === "application/json") {
      callback(null, true);
      return;
    }

    callback(new Error("Solo se permiten archivos JSON"));
  }
});

/**
 * El endpoint del seeder requiere autenticación y rol admin.
 */
router.post("/upload", authenticate, authorizeRoles("ADMIN"), upload.single("file"), uploadSeed);

export default router;
