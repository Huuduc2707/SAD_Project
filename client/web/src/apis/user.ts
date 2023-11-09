import { User } from "@/types/user";
import { baseApi } from "./base";

export interface ApiUserTokenResponse {
  refresh: string;
  access: string;
  user: User;
}

export interface ApiUserLoginVariables {
  username: string;
  password: string;
}

export interface ApiUserSignupVariables {
  username: string;
  password: string;
  email: string;
  name: string;
  phone_number: string;
}

export const userApi = {
  login(variables: ApiUserLoginVariables) {
    return baseApi.post<ApiUserTokenResponse>("/api/user/login", variables);
  },
  signup(variables: ApiUserSignupVariables) {
    return baseApi.post<ApiUserTokenResponse>("/api/user/signup", variables);
  },
  getCurrentUser() {
    return baseApi.get<User>("/api/user");
  },
};
