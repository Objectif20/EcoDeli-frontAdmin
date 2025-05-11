import { useEffect, useState } from "react";
import { LanguageDataTable } from "@/components/features/general/languages/data-table";
import { PaginationControls } from "@/components/pagination-controle";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageApi } from "@/api/languages.api";

interface Language {
  id: string;
  name: string;
  iso_code: string;
  available: boolean;
}

export default function LanguagePage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [languages, setLanguages] = useState<Language[]>([]);

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t("pages.languages.breadcrumb.home"), t("pages.languages.breadcrumb.languages")],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch, t]);

  const fetchLanguages = async () => {
    try {
      const response = await LanguageApi.getLanguages(pageIndex + 1, pageSize);
      const formattedLanguages: Language[] = response.data.map((lang) => ({
        id: lang.language_id,
        name: lang.language_name,
        iso_code: lang.iso_code,
        available: lang.active,
      }));
      setLanguages(formattedLanguages);
      setTotalItems(response.meta.total);
    } catch (error) {
      console.error("Erreur lors du chargement des langues", error);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, [pageIndex, pageSize]);

  const navigate = useNavigate();

  return (
    <>
      <h1 className="text-2xl font-semibold">{t("pages.languages.languagePage.title")}</h1>
      <div className="flex justify-end mb-4">
        <Button onClick={() => navigate('/office/general/languages/add')}>
          {t("pages.languages.languagePage.importButton")}
        </Button>
      </div>
      <LanguageDataTable key={`${pageIndex}-${pageSize}`} data={languages} />
      <PaginationControls
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageIndexChange={setPageIndex}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPageIndex(0);
        }}
      />
    </>
  );
}
