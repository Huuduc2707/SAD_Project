export enum Role {
  Manager = "manager",
  Employee = "employee",
  User = "user",
}

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  phone_number: string;
  role: Role;
}
