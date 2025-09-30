import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/useUserStore";
import { Bell, Book, BookOpen, Home, ListTodo, LucideIcon, Settings, SquareKanban, User2, Users } from "lucide-react";
import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { SettingsMenu } from "./components";

interface MenuItem {
  icon: LucideIcon;
  label: string;
  path: string;
  roles?: string[];
}

const MenuLink = forwardRef<HTMLAnchorElement, { item: MenuItem; isActive: boolean }>(({ item, isActive }, ref) => {
  const Icon = item.icon;
  return (
    <Link
      ref={ref}
      to={item.path}
      className={cn(
        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors select-none relative",
        "hover:bg-primary/5 hover:text-primary",
        isActive 
          ? "bg-primary text-white before:absolute before:right-0 before:top-0 before:h-full before:w-1 before:rounded-l-xl before:bg-primary-light" 
          : "text-[#707EAE]",
        "lg:text-sm md:text-xs"
      )}
    >
      <Icon className="h-[18px] w-[18px] stroke-[2.5px] transform-none transition-transform" />
      <span className={cn(
        "font-medium transform-none transition-none whitespace-nowrap",
        "lg:block md:hidden"
      )}>{item.label}</span>
    </Link>
  );
});

const MenuItem = ({ item }: { item: MenuItem }) => {
  const isActive = useLocation().pathname === item.path;
  const { user } = useUserStore();

  // If item has roles and user's role is not in the allowed roles, don't render
  if (item.roles && !item.roles.includes(user.role || '')) {
    return null;
  }

  return (
    <div className="lg:block md:block">
      <div className="lg:hidden md:block">
        <Tooltip>
          <TooltipTrigger asChild>
            <MenuLink item={item} isActive={isActive} />
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-primary text-white border border-gray-100 shadow-sm">
            <p>{item.label}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="lg:block md:hidden">
        <MenuLink item={item} isActive={isActive} />
      </div>
    </div>
  );
};

export const Sidebar = () => {
  const { t } = useTranslation();
  const { user } = useUserStore();

  const menuItems: MenuItem[] = [
    { icon: Home, label: t("sidebar.home"), path: "/" },
    { icon: Bell, label: t("sidebar.notifications"), path: "/notifications" },
    { icon: Book, label: t("sidebar.study"), path: "/study" },
    { icon: ListTodo, label: t("sidebar.progress"), path: "/progress" },
    { icon: User2, label: t("sidebar.profile"), path: "/profile" },
    {
      icon: SquareKanban,
      label: t("sidebar.dashboard"),
      path: "/dashboard",
      roles: ["admin"]
    },
    {
      icon: Users,
      label: t("sidebar.userManagement"),
      path: "/admin/users",
      roles: ["admin"]
    },
    {
      icon: Settings,
      label: t("sidebar.adminSettings"),
      path: "/admin/settings",
      roles: ["admin"]
    },
    {
      icon: BookOpen,
      label: t("sidebar.lessonManagement"),
      path: "/admin/lessons",
      roles: ["admin"]
    }
  ];

  return (
    <TooltipProvider>
      <>
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            "fixed left-0 top-0 z-40 h-screen bg-white transition-all duration-300",
            "hidden md:flex md:flex-col",
            "lg:w-[280px] md:w-[72px]"
          )}
        >
          {/* Logo Section */}
          <div className="flex h-[72px] items-center px-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
                <img src="/app/images/logo/jfix_white.svg" alt="G-EASY" className="h-8 w-8" />
              </div>
              <div className={cn(
                "flex-col lg:flex md:hidden"
              )}>
                <span className="text-lg font-bold text-primary transform-none transition-none">J-Fixer</span>
                <span className="text-xs font-medium text-gray-500 transform-none transition-none">{t("sidebar.description")}</span>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex flex-1 flex-col justify-between py-6">
            <div className="space-y-1 px-3">
              {menuItems.map((item) => (
                <MenuItem key={item.path} item={item} />
              ))}
            </div>

            {/* Settings at bottom */}
            <div className="px-3 lg:block md:flex md:justify-center">
              <div className="lg:block md:block">
                <div className="lg:hidden md:block">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SettingsMenu />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-primary text-white border border-gray-100 shadow-sm">
                      <p className="text-sm font-medium">{t("sidebar.settings")}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="lg:block md:hidden">
                  <SettingsMenu />
                </div>
              </div>
            </div>
          </nav>
        </aside>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white shadow-sm md:hidden">
          <div className="flex h-[72px] items-center justify-around">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = useLocation().pathname === item.path;
              
              // Skip admin items in mobile view
              if (item.roles && !item.roles.includes(user.role || '')) {
                return null;
              }
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center gap-1.5 px-3 py-2 transition-colors select-none relative",
                    "hover:text-primary hover:bg-primary-5 rounded-2xl",
                    isActive
                      ? "text-primary rounded-2xl"
                      : "text-[#707EAE]",
                    "min-w-[72px]"
                  )}
                >
                  <Icon className="h-[18px] w-[18px] stroke-[2.5px] transform-none transition-transform" />
                  <span className="transform-none transition-none whitespace-nowrap text-[10px] font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </>
    </TooltipProvider>
  );
};