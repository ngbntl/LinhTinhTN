import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageOption {
  value: string;
  label: string;
  flag: string;
}
  
interface LanguageSwitcherProps {
  options?: LanguageOption[];
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  options = [
    { value: "en", label: "English", flag: "/app/images/front/flag-en.svg" },
    { value: "jp", label: "日本語", flag: "/app/images/front/flag-jp.svg" },
    { value: "vi", label: "Tiếng Việt", flag: "/app/images/front/flag-vi.svg" },
  ],
  className = ""
}) => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language || 'en');
  
  const handleLanguageChange = (language: string) => {
    setCurrentLang(language);
    i18n.changeLanguage(language);
  };

  const getCurrentFlag = () => {
    const currentOption = options.find(opt => opt.value === currentLang);
    return currentOption?.flag || options[0].flag;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={`flex items-center gap-2 py-1 px-2 bg-slate-800 bg-opacity-10 rounded-md ${className}`}>
        <img
          src={getCurrentFlag()}
          alt={currentLang}
          className="w-6 h-6 lg:w-8 lg:h-8 rounded-sm shadow-sm"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleLanguageChange(option.value)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <img
                src={option.flag}
                alt={option.label}
                className="w-5 h-5 lg:w-6 lg:h-6 rounded-sm shadow-sm"
              />
              {option.label}
            </div>
            {currentLang === option.value && (
              <Check className="h-4 w-4 ml-2" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};