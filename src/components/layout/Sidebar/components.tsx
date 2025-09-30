import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ROUTERS } from "@/constant";
import { cn } from "@/lib/utils";
import useLanguage from "@/store/useLanguage";
import { Download, LogOut, Settings } from "lucide-react";
import { forwardRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const languageOptions = [
  { value: "en", label: "English", flag: "/app/images/front/flag-en.svg" },
  { value: "jp", label: "日本語", flag: "/app/images/front/flag-jp.svg" },
  { value: "vi", label: "Tiếng Việt", flag: "/app/images/front/flag-vi.svg" },
];

const SettingsButton = forwardRef<HTMLButtonElement>((props, ref) => {
  const { t } = useTranslation();
  return (
    <button
      ref={ref}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors select-none relative w-full",
        "hover:bg-primary/5 hover:text-primary",
        "text-[#707EAE]",
        "lg:text-sm md:text-xs"
      )}
      {...props}
    >
      <Settings className="h-[18px] w-[18px] stroke-[2.5px] transform-none transition-transform" />
      <span
        className={cn(
          "font-medium transform-none transition-none whitespace-nowrap",
          "lg:block md:hidden"
        )}
      >
        {t("sidebar.settings")}
      </span>
    </button>
  );
});

export const SettingsMenu = forwardRef<HTMLButtonElement>((props, ref) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { lang, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (open) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [open]);

  const handleLogout = () => {
    // Handle logout logic here
    navigate(ROUTERS.LOGIN);
  };

  const handleCheckUpdate = () => {
    // Handle check update logic here
    console.log("Checking for updates...");
  };

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <SettingsButton ref={ref} {...props} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white border border-gray-100 shadow-sm ml-4">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="text-sm">
            {t("header.language")}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="flex flex-col gap-1">
            {languageOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleLanguageChange(option.value)}
                className={cn(
                  "flex items-center gap-2 cursor-pointer",
                  lang === option.value
                    ? "bg-accent text-accent-foreground font-normal"
                    : ""
                )}
              >
                <img
                  src={option.flag}
                  alt={option.value}
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded-sm shadow-sm"
                />
                <span className="font-medium">
                  {t(`header.languages.${option.value}`)}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleCheckUpdate}
        >
          <Download className="h-4 w-4" />
          <span className="font-medium">{t("sidebar.checkUpdate")}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer text-red-500 hover:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span className="font-medium">{t("sidebar.logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});