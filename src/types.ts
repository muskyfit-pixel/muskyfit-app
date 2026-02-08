export type UserRole = "client" | "coach";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
