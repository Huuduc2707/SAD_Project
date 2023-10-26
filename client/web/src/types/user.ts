export enum Role {
  Manager = "manager",
  Employee = "employee",
  User = "user",
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}
