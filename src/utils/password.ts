import crypto from "crypto";

/**
 * Genera un hash de contraseña usando funciones nativas de Node.js.
 * Se usa crypto para evitar agregar una dependencia externa solo para el manejo
 * básico de contraseñas requerido por esta prueba.
 */
export function hashPassword(password: string): string {
  const salt: string = crypto.randomBytes(16).toString("hex");
  const hash: string = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Compara una contraseña enviada con el hash guardado en la base de datos.
 * Devuelve true únicamente cuando ambos valores corresponden.
 */
export function comparePassword(password: string, storedPassword: string): boolean {
  const parts: string[] = storedPassword.split(":");

  if (parts.length !== 2) {
    return false;
  }

  const salt: string = parts[0];
  const storedHash: string = parts[1];
  const hash: string = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");

  return crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(storedHash, "hex")
  );
}
