import {
  regexEmail,
  regexPassword,
  regexPhone,
  regexUsername
} from "@/constant";
import { z } from "zod";

export const loginSchema = (t: (key: string) => string) => z.object({
  username: z.string()
    .min(3, t('validation.username.min'))
    .max(50, t('validation.username.max'))
    .regex(regexUsername, t('validation.username.regex')),
  password: z.string()
    .min(3, t('validation.password.min'))
    .max(50, t('validation.password.max'))
    .regex(regexPassword, t('validation.password.regex')),
});

export const registerSchema = (t: (key: string) => string) => z.object({
    username: z.string()
      .min(3, t("validation.username.min"))
      .max(50, t("validation.username.max"))
      .regex(regexUsername, t("validation.username.regex")),
    email: z.string()
      .regex(regexEmail, t("validation.invalid-email")),
    phone: z.string()
      .regex(regexPhone, t("validation.invalid-phone")),
    password: z.string()
      .min(3, t('validation.password.min'))
      .max(50, t('validation.password.max'))
      .regex(regexPassword, t("validation.password.regex")),
    confirmPassword: z.string()
      .min(1, t("validation.required"))
      .regex(regexPassword, t("validation.password.regex")),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t("validation.password.match"),
    path: ["confirmPassword"],
});