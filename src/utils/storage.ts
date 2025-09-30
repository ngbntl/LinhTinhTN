import { STORAGE_VAR } from "@/constant";

interface User {
  username: string | null;
  role: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  avatar?: string | null;
}

export const getAccessToken = () => {
  return sessionStorage.getItem(STORAGE_VAR.AccessToken);
};

export const setAccessToken = (token: string) => {
  sessionStorage.setItem(STORAGE_VAR.AccessToken, token);
};

export const removeAccessToken = () => {
  sessionStorage.removeItem(STORAGE_VAR.AccessToken);
};

export const getRefreshToken = () => {
  return sessionStorage.getItem(STORAGE_VAR.RefreshToken);
};

export const setRefreshToken = (token: string) => {
  sessionStorage.setItem(STORAGE_VAR.RefreshToken, token);
};

export const removeRefreshToken = () => {
  sessionStorage.removeItem(STORAGE_VAR.RefreshToken);
};

export const revokeAllTokens = () => {
  removeAccessToken();
  removeRefreshToken();
};

export const setCurrentUser = (user: User) => {
  localStorage.setItem(STORAGE_VAR.User, JSON.stringify(user));
};

export const getCurrentUser = () => {
  const user = localStorage.getItem(STORAGE_VAR.User);
  return user ? JSON.parse(user) : null;
};

export const removeCurrentUser = () => {
  localStorage.removeItem(STORAGE_VAR.User);
};
