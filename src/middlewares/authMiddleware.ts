import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { UserRole } from "../types/auth";

/**
 * Protege las rutas que requieren autenticación.
 * Lee el header Authorization, valida el JWT y guarda el usuario en req.
 * Se usa un middleware sencillo para centralizar esta validación.
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  try {
    const authorization: string | undefined = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      res.status(401).json({ message: "Token requerido" });
      return;
    }

    const token: string = authorization.replace("Bearer ", "");
    const payload = verifyToken(token);

    (req as Request & { user?: { id: number; role: UserRole } }).user = payload;
    next();
  } catch {
    res.status(401).json({ message: "Token inválido o vencido" });
  }
}

/**
 * Restringe una ruta a los roles recibidos.
 * Se mantiene como una función pequeña porque solo necesita comparar el rol.
 */
export function authorizeRoles(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as Request & { user?: { id: number; role: UserRole } }).user;

    if (!user) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({ message: "No tiene permisos para esta operación" });
      return;
    }

    next();
  };
}
