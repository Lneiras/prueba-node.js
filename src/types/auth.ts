export type UserRole = "ADMIN" | "MANAGER";

export interface AuthenticatedRequest {
  user?: {
    id: number;
    role: UserRole;
  };
}
