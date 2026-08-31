import crypto from "crypto";


export function hashPassword(password: string): string {
  const salt: string = crypto.randomBytes(16).toString("hex");
  const hash: string = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}


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
