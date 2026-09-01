import { Request, Response } from "express";
import { User } from "../models/User";
import { comparePassword, hashPassword } from "../utils/password";
import { generateToken } from "../utils/jwt";
import { UserRole } from "../types/auth";


export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, role } = req.body as {
      name?: string;
      email?: string;
      password?: string;
      role?: UserRole;
    };

    if (!name || !email || !password || !role) {
      res.status(400).json({ message: "name, email, password y role son obligatorios" });
      return;
    }

    if (!["ADMIN", "MANAGER"].includes(role)) {
      res.status(400).json({ message: "El role debe ser ADMIN o MANAGER" });
      return;
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      res.status(409).json({ message: "El email ya está registrado" });
      return;
    }

    const user = await User.create({
      name,
      email,
      password: hashPassword(password),
      role,
      isActive: true
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error("Error en register:", error); //borrar
    res.status(500).json({ message: "Error al registrar usuario" });
  }
}



export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      res.status(400).json({ message: "email y password son obligatorios" });
      return;
    }

    const user = await User.findOne({ where: { email, isActive: true } });

    if (!user || !comparePassword(password, user.password)) {
      res.status(401).json({ message: "Credenciales inválidas" });
      return;
    }

    const token: string = generateToken({ id: user.id, role: user.role });

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Error en login:", error); // pa borrar
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
}
