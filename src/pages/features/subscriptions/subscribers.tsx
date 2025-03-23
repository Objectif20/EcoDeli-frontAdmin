import { useEffect, useMemo, useState } from "react";
import { PaginationControls } from "@/components/pagination-controle";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { GetSubscribersList } from "@/api/subscriptions.api";
import { z } from "zod";
import { SubscriberDataTable } from "@/components/features/subscriptions/suscribers/data-table";

export const subscriberSchema = z.object({
  subscription_id: z.string(),
  user_id: z.string(),
  email: z.string(),
  plan_id: z.number(),
  plan_name: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  is_merchant: z.boolean(),
});

export default function SubscriberPage() {
  const dispatch = useDispatch();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [subscriberData, setSubscriberData] = useState<z.infer<typeof subscriberSchema>[]>([]);
  const [totalItems, setTotalItems] = useState(0);


  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: ["Accueil", "Abonnés"],
        links: ["/office/dashboard"],
      })
    );

    const fetchSubscriberData = async () => {
      try {
        const { data, meta } = await GetSubscribersList(pageIndex + 1, pageSize);
        if (data) {
          const validatedData = data.map(item => subscriberSchema.parse(item));
          setSubscriberData(validatedData);
          setTotalItems(meta.total);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des abonnements", error);
      }
    };

    fetchSubscriberData();
  }, [dispatch, pageIndex, pageSize]);

  const paginatedData = useMemo(() => {
    return subscriberData;
  }, [subscriberData]);

  useEffect(() => {
    setPageIndex(0);
  }, [pageSize]);

  return (
    <>
      <div className="w-full">
        <h1 className="text-2xl font-semibold mb-4">Ensemble des abonnés EcoDeli</h1>
      <SubscriberDataTable key={`${pageIndex}-${pageSize}`} data={paginatedData} />
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
