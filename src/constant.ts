export const enum ROUTERS {
  // Default
  DEFAULT = "/",
  ABOUT = "/about",
  CONTACT = "/contact",
  HOME = "/",

  // Auth
  LOGIN = "/login",
  REGISTER = "/register",
  FORGOT_PASSWORD = "/forgot-password",

  // User
  USER_PROFILE = "/profile",
  USER_SETTINGS = "/settings",

  // Admin
  ADMIN_DASHBOARD = "/admin/dashboard",
  ADMIN_USERS = "/admin/users",
  ADMIN_SETTINGS = "/admin/settings",
  BLANK_PAGE = "admin/blank_page",
  UNAUTHORIZED = "admin/403_unauthorized",

  // Vocabulary
  VOCABULARY = "/vocabulary",
  VOCABULARY_DAY = "/vocabulary/day",
  VOCABULARY_REVIEW = "/vocabulary/review",
  VOCABULARY_QUIZ = "/vocabulary/quiz",
  VOCABULARY_QUIZ_SETUP = "/vocabulary/quiz-setup",
  VOCABULARY_FLASHCARD = "/vocabulary/flashcard",
}

export const enum STORAGE_VAR {
  User = "goline-ams-user",
  AccessToken = "goline-ams-access-token",
  RefreshToken = "goline-ams-refresh-token",
}

export const enum ROLE {
  ADMIN = "admin",
}

export const MAX_FILE_SIZE = 1024 * 1024; // 1MB
export const ALLOWED_TYPES = ["text/csv"];

export const MAX_LENGTH_INPUT = 255;

export const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const regexUsername = /^[a-zA-Z0-9_]+$/;
export const regexPhone = /^\d{10}$/;
export const regexPassword =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
