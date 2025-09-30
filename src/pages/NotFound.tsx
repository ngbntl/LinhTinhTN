import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-900">
          {t("not-found.title")}
        </h2>
        <p className="mt-2 text-gray-600">
          {t("not-found.description")}
        </p>
        <div className="mt-8">
          <Link to="/">
            <Button
              className={cn(
                "bg-primary text-white hover:bg-primary/90",
                "px-6 py-2 rounded-lg",
                "transition-colors duration-200"
              )}
            >
              {t("not-found.button")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
