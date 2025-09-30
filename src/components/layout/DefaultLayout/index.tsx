import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router";
import { Header } from "../Header";

export const DefaultLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8f8f8]" role="main">
      {/* <Header /> */}
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8 lg:py-10">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      <Toaster richColors position="bottom-right" />
    </div>
  );
};
