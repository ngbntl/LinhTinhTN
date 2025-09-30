import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router";
import { LanguageSwitcher } from "./components";

export const AuthLayout = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-primary-30">
      <div className="w-full">
        <Outlet />
        <LanguageSwitcher className="absolute top-6 right-16" />
      </div>
      <Toaster richColors position="bottom-right" />
    </div>
  );
};