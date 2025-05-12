import { useEffect, useState } from "react";
import { PaginationControls } from "@/components/pagination-controle";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { DataTable } from "@/components/features/deliveryman/data-table";
import { AllDeliveryPerson, DeliverymanApi } from "@/api/deliveryman.api";
import { useTranslation } from "react-i18next";

export default function DeliverymanPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [deliverymen, setDeliverymen] = useState<AllDeliveryPerson[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t("pages.deliveryman-details.breadcrumb.home"), t("pages.deliveryman-details.breadcrumb.deliverymen")],
        links: ["/office/dashboard"],
      })
    );

    const fetchDeliverymen = async () => {
      try {
        const { data, meta } = await DeliverymanApi.getDeliverymanList(pageIndex + 1, pageSize);
        setDeliverymen(data);
        setTotalItems(meta.total);
      } catch (error) {
        console.error("Failed to fetch deliverymen:", error);
      }
    };

    fetchDeliverymen();
  }, [dispatch, pageIndex, pageSize, t]);

  return (
    <>
      <div className="w-full">
        <h1 className="text-2xl font-semibold mb-4">{t("pages.deliveryman-details.title")}</h1>
        <DataTable key={`${pageIndex}-${pageSize}`} data={deliverymen} />
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
