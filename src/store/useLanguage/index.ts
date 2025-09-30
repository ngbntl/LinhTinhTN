import { create } from "zustand";
import Cookies from "js-cookie";

export const getLanguageStorage = () => {
  return Cookies.get("asuka-cruise-lang")
    ? Cookies.get("asuka-cruise-lang")!
    : "vi";
};

const setLanguageStorage = (lang: string) => {
  Cookies.set("asuka-cruise-lang", lang, { expires: 7 });
};

export type RootState = {
  lang: string;
};

type Actions = {
  setLanguage: (lang: string) => void;
  unSetLanguage: () => void;
};

const useLanguage = create<RootState & Actions>((set) => ({
  lang: getLanguageStorage(),
  setLanguage: (lang) => {
    set(() => ({ lang: lang }));
    setLanguageStorage(lang);
  },
  unSetLanguage: () => set(() => ({ lang: "vi" })),
}));

export default useLanguage;
