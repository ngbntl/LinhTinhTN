import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { ROUTERS } from "@/constant";
import useLanguage from "@/store/useLanguage";
import {
  ChevronDown,
  BookOpen,
  Target,
  Settings,
  Trophy,
  User,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

const languageOptions = [
  { value: "en", label: "English", flag: "/app/images/front/flag-en.svg" },
  { value: "jp", label: "日本語", flag: "/app/images/front/flag-jp.svg" },
  { value: "vi", label: "Tiếng Việt", flag: "/app/images/front/flag-vi.svg" },
];

const navigationItems = [
  {
    key: "vocabulary",
    label: "Từ vựng",
    hasDropdown: true,
    icon: BookOpen,
    items: [
      { key: "home", label: "Trang chủ", path: ROUTERS.VOCABULARY },
      { key: "review", label: "Ôn tập", path: ROUTERS.VOCABULARY_REVIEW },
      {
        key: "flashcard",
        label: "Flashcard",
        path: ROUTERS.VOCABULARY_FLASHCARD,
      },
    ],
  },
  {
    key: "quiz",
    label: "Kiểm tra",
    hasDropdown: true,
    icon: Trophy,
    items: [
      {
        key: "quiz-setup",
        label: "Tạo đề kiểm tra",
        path: ROUTERS.VOCABULARY_QUIZ_SETUP,
      },
      {
        key: "quiz-random",
        label: "Kiểm tra ngẫu nhiên",
        path: ROUTERS.VOCABULARY_QUIZ,
      },
    ],
  },
  {
    key: "progress",
    label: "Tiến độ",
    hasDropdown: false,
    icon: Target,
    path: ROUTERS.VOCABULARY,
  },
  {
    key: "settings",
    label: "Cài đặt",
    hasDropdown: false,
    icon: Settings,
    path: ROUTERS.USER_SETTINGS,
  },
];

export const Header = () => {
  const { t } = useTranslation();
  const { lang, setLanguage } = useLanguage();
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const handleLanguageChange = (language: string) => {
    setLanguage(language);
    i18n.changeLanguage(language);
  };

  return (
    <header className="w-full bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={ROUTERS.VOCABULARY} className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-800">N3Rush</span>
              <span className="text-xs text-gray-500">日本語学習</span>
            </div>
          </Link>

          {/* Navigation Menu */}
          <Menubar className="border-none bg-transparent">
            {navigationItems.map((item) => (
              <MenubarMenu key={item.key}>
                <MenubarTrigger
                  className="cursor-pointer flex items-center space-x-2 hover:text-blue-600 transition-colors"
                  onClick={() =>
                    !item.hasDropdown && item.path && navigate(item.path)
                  }
                >
                  <item.icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                  {item.hasDropdown && <ChevronDown className="h-4 w-4" />}
                </MenubarTrigger>
                {item.hasDropdown && item.items && (
                  <MenubarContent className="min-w-48">
                    {item.items.map((subItem) => (
                      <MenubarItem key={subItem.key} className="cursor-pointer">
                        <Link
                          to={subItem.path}
                          className="flex items-center w-full px-2 py-1 hover:text-blue-600"
                        >
                          {subItem.label}
                        </Link>
                      </MenubarItem>
                    ))}
                  </MenubarContent>
                )}
              </MenubarMenu>
            ))}
          </Menubar>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <Menubar className="border-none bg-transparent">
              <MenubarMenu>
                <MenubarTrigger className="cursor-pointer flex items-center space-x-2 hover:bg-gray-50 rounded-lg px-2 py-1">
                  <img
                    src={
                      languageOptions.find((opt) => opt.value === lang)?.flag
                    }
                    alt={lang}
                    className="h-4 w-6 object-cover rounded border"
                  />
                  <span className="text-sm font-medium">
                    {languageOptions.find((opt) => opt.value === lang)?.label}
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </MenubarTrigger>
                <MenubarContent>
                  {languageOptions.map((option) => (
                    <MenubarItem
                      key={option.value}
                      onClick={() => handleLanguageChange(option.value)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <img
                          src={option.flag}
                          alt={option.value}
                          className="h-4 w-6 object-cover rounded border"
                        />
                        <span>{option.label}</span>
                      </div>
                    </MenubarItem>
                  ))}
                </MenubarContent>
              </MenubarMenu>
            </Menubar>

            {/* User Menu */}
            <Menubar className="border-none bg-transparent">
              <MenubarMenu>
                <MenubarTrigger className="cursor-pointer flex items-center space-x-2 hover:bg-gray-50 rounded-lg px-2 py-1">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <ChevronDown className="h-3 w-3" />
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem onClick={() => navigate(ROUTERS.USER_PROFILE)}>
                    <User className="h-4 w-4 mr-2" />
                    Hồ sơ cá nhân
                  </MenubarItem>
                  <MenubarItem onClick={() => navigate(ROUTERS.USER_SETTINGS)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Cài đặt
                  </MenubarItem>
                  <MenubarItem onClick={() => navigate(ROUTERS.LOGIN)}>
                    Đăng xuất
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>

            {/* Quick Action - Study Button */}
            <Button
              onClick={() => navigate(ROUTERS.VOCABULARY)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Học ngay
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
