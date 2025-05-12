import { useEffect, useState } from "react";
import { DataTable } from "@/components/features/merchant/data-table";
import { PaginationControls } from "@/components/pagination-controle";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { AllMerchant, MerchantAPI } from "@/api/merchant.api";
import { useTranslation } from "react-i18next";

export default function MerchantPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [merchants, setMerchants] = useState<AllMerchant[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t("pages.merchant.breadcrumb.home"), t("pages.merchant.breadcrumb.merchants")],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch, t]);

  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const response = await MerchantAPI.getAllMerchants(pageIndex, pageSize);

        if (response) {
          setMerchants(response.data);
          setTotalItems(response.meta.total);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des commerçants", error);
      }
    };

    fetchMerchants();
  }, [pageIndex, pageSize]);

  return (
    <>
      <div className="w-full">
        <h1 className="text-2xl font-semibold mb-4">{t("pages.merchant.title")}</h1>
        <DataTable key={`${pageIndex}-${pageSize}`} data={merchants} t={t} />
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
