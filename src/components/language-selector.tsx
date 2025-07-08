"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { updateLang } from "@/redux/slices/adminSlice";
import { updateLanguage } from "@/api/admin.api";
import { LanguageApi } from "@/api/languages.api";
import { changeLanguageWithReload } from "@/i18n";

interface Language {
  language_id: string;
  language_name: string;
  iso_code: string;
  active: boolean;
}

interface LanguageSelectorProps {
  mode: "text" | "flag" | "sidebar";
  className?: string;
}

export default function LanguageSelector({
  mode = "text",
  className,
}: LanguageSelectorProps) {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("fr");
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const { i18n } = useTranslation();
  const dispatch = useDispatch();

  const admin = useSelector((state: RootState) => state.admin.admin);

  useEffect(() => {
    async function fetchLanguages() {
      try {
        const response = await LanguageApi.getAlllanguage();
        const activeLanguages = response.filter((lang) => lang.active);
        setLanguages(activeLanguages);

        const currentLang = i18n.language || "fr";
        const matchedLang = activeLanguages.find(
          (lang) => lang.iso_code === currentLang
        );
        const initialLang = matchedLang ? matchedLang.iso_code : "fr";

        setSelectedLanguage(initialLang);
      } catch (error) {
        console.error("Failed to fetch languages:", error);
      }
    }

    fetchLanguages();
  }, [i18n.language]);

  useEffect(() => {
    if (i18n.language && i18n.language !== selectedLanguage) {
      setSelectedLanguage(i18n.language);
    }
  }, [i18n.language]);

  const getFlag = (isoCode: string) => {
    if (!isoCode || isoCode.length !== 2) return "🌐";
    const codePoints = Array.from(isoCode.toUpperCase()).map(
      (char) => 127397 + char.charCodeAt(0)
    );
    return String.fromCodePoint(...codePoints);
  };

  const handleLanguageChange = async (isoCode: string) => {
    if (isChangingLanguage || isoCode === selectedLanguage) return;

    setIsChangingLanguage(true);

    try {
      setSelectedLanguage(isoCode);

      dispatch(updateLang(isoCode));

      await changeLanguageWithReload(isoCode);

      if (admin) {
        const selectedLang = languages.find(
          (lang) => lang.iso_code === isoCode
        );
        if (selectedLang) {
          try {
            await updateLanguage(selectedLang.language_id);
          } catch (apiError) {
            console.warn("⚠️ Erreur mise à jour profil admin :", apiError);
          }
        }
      }
    } catch (error) {
      console.error("❌ Erreur lors du changement de langue :", error);
      setSelectedLanguage(i18n.language || "fr");
    } finally {
      setIsChangingLanguage(false);
    }
  };

  if (mode === "text") {
    return (
      <Select
        value={selectedLanguage}
        onValueChange={handleLanguageChange}
        disabled={isChangingLanguage}
      >
        <SelectTrigger className={cn(className)}>
          <SelectValue>
            <div className="flex items-center gap-2">
              <span>{getFlag(selectedLanguage)}</span>
              <span>
                {languages.find((l) => l.iso_code === selectedLanguage)
                  ?.language_name || selectedLanguage}
              </span>
              {isChangingLanguage && (
                <span className="text-xs opacity-70">...</span>
              )}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language.language_id} value={language.iso_code}>
              <div className="flex items-center gap-2">
                <span>{getFlag(language.iso_code)}</span>
                <span>{language.language_name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm",
          isChangingLanguage && "opacity-70 cursor-wait",
          className
        )}
        disabled={isChangingLanguage}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{getFlag(selectedLanguage)}</span>
          {isChangingLanguage && (
            <span className="text-xs opacity-70">...</span>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuSeparator />
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.language_id}
            onClick={() => handleLanguageChange(language.iso_code)}
            className="flex cursor-pointer items-center gap-2"
            disabled={isChangingLanguage}
          >
            <span>{getFlag(language.iso_code)}</span>
            <span>{language.language_name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
