import { ROUTERS } from "@/constant";
import { Facebook, Github, Instagram } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="border-t bg-[#181821] pb-4 pt-10 px-1">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col items-center gap-4">
            <img
              src={"/app/images/logo/jfix_logo_white.svg"}
              alt="JFIX"
              className="lg:w-20 lg:h-20 h-16 w-16 rounded-lg"
            />
            <p className="text-sm font-medium text-white">
              {t("footer.description")}
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">
              {t("footer.links")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to={ROUTERS.HOME}
                  className="text-sm text-white hover:text-primary-30 hover:font-inter hover:text-sm font-thin"
                >
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTERS.ABOUT}
                  className="text-sm text-white hover:text-primary-30 hover:font-inter hover:text-sm font-thin"
                >
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTERS.CONTACT}
                  className="text-sm text-white hover:text-primary-30 hover:font-inter hover:text-sm font-thin"
                >
                  {t("nav.contact")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">
              {t("footer.contact")}
            </h3>
            <ul className="space-y-2">
              <li className="text-sm text-white hover:text-primary-30 hover:font-inter hover:text-sm font-thin">
                {t("footer.email")}: nmtruong.dev@gmail.com
              </li>
              <li className="text-sm text-white hover:text-primary-30 hover:font-inter hover:text-sm font-thin">
                {t("footer.phone")}: +84 921 233 332
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">
              {t("footer.university")}
            </h3>
            <p className="text-sm text-white hover:text-primary-30 hover:font-inter hover:text-sm font-thin">
              {t("footer.address")}
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://github.com/truongnm-0478"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-primary-30"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.facebook.com/truongngo2707"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-primary-30"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/03.nmt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-primary-30"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-white font-thin">
          © {new Date().getFullYear()} JFIX. {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
};
