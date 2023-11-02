import { User } from "@/types/user";
import { baseApi } from "./base";

export interface AuthResponse {
  refresh: string;
  access: string;
  user: User;
}

export interface UserApiLoginVariables {
  username: string;
  password: string;
}

export interface UserApiRegisterVariables {
  username: string;
  password: string;
  email: string;
  name: string;
  phone_number: string;
}

export const userApi = {
  login(variables: UserApiLoginVariables) {
    return baseApi.post<AuthResponse>("/api/user/login", variables);
  },
  register(variables: UserApiRegisterVariables) {
    return baseApi.post<AuthResponse>("/api/user/signup", variables);
  },
  getCurrentUser() {
    return baseApi.get<User>("/api/user");
  },
};
