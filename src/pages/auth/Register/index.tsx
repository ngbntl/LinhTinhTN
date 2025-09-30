import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { ROUTERS } from "@/constant";
import { authApi } from "@/services/api/authApi";
import { registerSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { z } from "zod";

type RegisterFormData = z.infer<ReturnType<typeof registerSchema>>;

export const Register: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema(t)),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: RegisterFormData) => authApi.register(values),
    onSuccess: () => {
      toast.success(t("register.success"));
      navigate(ROUTERS.LOGIN);
    },
    onError: () => {
      toast.error(t("register.failed"));
    },
  });

  function onSubmit(values: RegisterFormData) {
    if (!values.username || !values.password || !values.email || !values.phone) {
      return;
    }
    mutation.mutate(values);
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[url('/app/images/bg/bg_meow.png')] bg-white items-center justify-center bg-gray-100 p-4 bg-cover bg-center bg-no-repeat">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-6 rounded-xl bg-white backdrop-blur-sm p-8 shadow-2xl shadow-black/50"
        >
          <h2 className="text-center text-2xl font-bold text-primary-30">
            JFIX - {t("register.register")}
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("register.username")}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      className={
                        form.formState.errors.username ? "border-red-500" : ""
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("register.phone")}</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      {...field}
                      className={
                        form.formState.errors.phone ? "border-red-500" : ""
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("register.email")}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    {...field}
                    className={
                      form.formState.errors.email ? "border-red-500" : ""
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("register.password")}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    className={
                      form.formState.errors.password ? "border-red-500" : ""
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("register.confirmPassword")}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    className={
                      form.formState.errors.confirmPassword ? "border-red-500" : ""
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-md"
          >
            {mutation.isPending ? t("register.submitting") : t("register.sign-up")}
          </Button>

          <div className="mt-4 text-center">
            <span className="text-sm">{t("register.have-account")}</span>
            <Link
              to={ROUTERS.LOGIN}
              className="text-sm text-primary hover:underline hover:font-inter hover:text-sm font-medium"
            >
              {` ${t("register.login")}`}
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Register;