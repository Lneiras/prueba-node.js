import { Router } from "express";
import { login, register } from "../controllers/authController";

const router: Router = Router();

/**
 * Endpoint público para registrar usuarios.
 */
router.post("/register", register);

/**
 * Endpoint público para iniciar sesión y obtener el JWT.
 */
router.post("/login", login);

export default router;
