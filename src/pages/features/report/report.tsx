import { useEffect, useState } from "react";
import { DataTable } from "@/components/features/report/data-table";
import { PaginationControls } from "@/components/pagination-controle";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { Report, ReportApi } from "@/api/report.api";
import { useTranslation } from "react-i18next";

export default function ReportPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [reports, setReports] = useState<Report[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t("pages.report.breadcrumb.home"), t("pages.report.breadcrumb.reports")],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch, t]);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await ReportApi.getReports(pageIndex, pageSize);
        if (response) {
          const data: Report[] = response.data.map((report) => ({
            ...report,
          }));
          setReports(data);
          setTotalItems(response.meta.total);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des signalements", error);
      }
    };

    fetchReport();
  }, [pageIndex, pageSize]);

  useEffect(() => {
    setPageIndex(0);
  }, [pageSize]);

  return (
    <>
      <h1 className="text-2xl font-semibold">{t("pages.report.reportPage.title")}</h1>
      <DataTable key={`${pageIndex}-${pageSize}`} data={reports} />
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
