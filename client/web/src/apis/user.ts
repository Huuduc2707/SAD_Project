import { User } from "@/types/user";
import { baseApi } from "./base";

export interface ApiUserTokenResponse {
  refresh: string;
  access: string;
  user: User;
}

export interface UserTokenObtainSchema {
  username: string;
  password: string;
}

export interface CustomerRegisterRequest {
  username: string;
  password: string;
  email: string;
  name: string;
  phone_number: string;
}

export interface CustomerProfileRequest {
  email: string;
  name: string;
  phone_number: string;
}

export const userApi = {
  login(variables: UserTokenObtainSchema) {
    return baseApi.post<ApiUserTokenResponse>("/api/user/login", variables);
  },
  signup(variables: CustomerRegisterRequest) {
    return baseApi.post<ApiUserTokenResponse>("/api/user/signup", variables);
  },
  getCurrentUser(token?: string) {
    return baseApi.get<User>("/api/user", {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  },
  editUserProfile(variables: CustomerProfileRequest) {
    return baseApi.put<User>("/api/user/edit_profile", variables);
  },
};
