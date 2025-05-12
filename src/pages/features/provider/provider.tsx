import { useEffect, useState } from "react";
import { DataTable } from "@/components/features/provider/data-table";
import { PaginationControls } from "@/components/pagination-controle";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { Provider } from "@/api/provider.api";
import { useTranslation } from "react-i18next";

export default function ProviderPage() {
  const dispatch = useDispatch();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const {t} = useTranslation("");
  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t("pages.provider.breadcrumb.home"), t("pages.provider.breadcrumb.providers")],
        links: ["/office/dashboard"]
      })
    );
  }, [dispatch]);

  useEffect(() => {
    const fetchProviders = async () => {
      try {

        const response = await Provider.getAllProviders(pageIndex, pageSize)

        if (response) {
          const data: Provider[] = response.data.map(provider => ({
            ...provider,
            profile_picture: provider.profile_picture ?? null,
          }));
    
          setProviders(data);
          setTotalItems(response.totalRows);
        }

      } catch (error) {
        console.error("Erreur lors de la récupération des prestataires", error);
      }
    };

    fetchProviders();
  }, [pageIndex, pageSize]);


  return (
    <>
      <div className="w-full">
      <h1 className="text-2xl font-semibold mb-4">{t("pages.provider.title")}</h1>
      <DataTable key={`${pageIndex}-${pageSize}`} data={providers} />
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
      </div>
    </>
  );
}
