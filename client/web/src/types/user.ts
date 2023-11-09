export enum Role {
  Manager = "M",
  Employee = "E",
  Customer = "C",
}

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  phone_number: string;
  role: Role;
}
