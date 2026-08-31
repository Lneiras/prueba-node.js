import jwt from "jsonwebtoken";
import { UserRole } from "../types/auth";

interface TokenPayload {
  id: number;
  role: UserRole;
}


export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET || "clave_secreta_para_prueba", {
    expiresIn: "8h"
  });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(
    token,
    process.env.JWT_SECRET || "clave_secreta_para_prueba"
  ) as TokenPayload;
}
