import { useEffect, useState } from "react";
import { PaginationControls } from "@/components/pagination-controle";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { DataTable } from "@/components/features/client/data-table";
import { AllClient, ClientApi } from "@/api/client.api";
import { useTranslation } from "react-i18next";

export default function ClientPage() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [clients, setClients] = useState<AllClient[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t("pages.client.breadcrumb.home"), t("pages.client.breadcrumb.clients")],
        links: ["/office/dashboard"],
      })
    );

    const fetchClients = async () => {
      try {
        const { data, meta } = await ClientApi.getClientList(pageIndex + 1, pageSize);
        setClients(data);
        setTotalItems(meta.total);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      }
    };

    fetchClients();
  }, [dispatch, pageIndex, pageSize, t]);

  return (
    <>
      <div className="w-full">
        <h1 className="text-2xl font-semibold mb-4">{t("pages.client.title")}</h1>
        <DataTable key={`${pageIndex}-${pageSize}`} data={clients} />
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
