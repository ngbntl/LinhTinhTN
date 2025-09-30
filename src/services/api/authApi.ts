import { User } from "@/components/type";
import axiosClient from "./axiosClient";

export type UserRegister = {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

type UserData = {
  username: string;
  email: string;
  phone: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  name: string;
  avatar?: string;
};

type ChangePassword = {
  email: string;
  old_password: string;
  new_password: string;
  new_password_confirmation: string;
};

type ChangePasswordByToken = {
  token: string;
  password: string;
  password_confirmation: string;
};

type ChangePasswordResponse = {
  status: string;
  message: string | null;
  data: boolean;
};

type LogoutResponse = {
  status: string;
  message: string | null;
  data: boolean;
};

export const authApi = {
  login: (data: User): Promise<UserData> =>
    axiosClient.post("/auth/login", data),

  register: (data: UserRegister): Promise<UserData> =>
    axiosClient.post("/auth/register", data),

  changePassword: (data: ChangePassword): Promise<ChangePasswordResponse> =>
    axiosClient.post("/crew/change-password", data),

  changePasswordByToken: (
    data: ChangePasswordByToken
  ): Promise<ChangePasswordResponse> =>
    axiosClient.post("/crew/change-password-token", data),

  forgotPassword: (data: { email: string }): Promise<ChangePasswordResponse> =>
    axiosClient.post("/crew/send-mail-forgot-password", data),

  logout: (): Promise<LogoutResponse> => axiosClient.post("/logout"),
};
