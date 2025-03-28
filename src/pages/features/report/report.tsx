import { useEffect, useState } from "react";
import { DataTable } from "@/components/features/report/data-table";
import { PaginationControls } from "@/components/pagination-controle";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { Report, ReportApi } from "@/api/report.api";

export default function ReportPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [reports, setReports] = useState<Report[]>([]);

    const dispatch = useDispatch();
      useEffect(() => {
        dispatch(
          setBreadcrumb({
            segments: ["Accueil", "Signalements"],
            links: ["/office/dashboard"],
          })
        );
      }, [dispatch]);


      useEffect(() => {
          const fetchReport = async () => {
            try {
      
              const response = await ReportApi.getReports(pageIndex, pageSize)
      
              if (response) {
                const data: Report[] = response.data.map(report => ({
                  ...report,
                }));
          
                setReports(data);
                console.log(data)
              }
      
            } catch (error) {
              console.error("Erreur lors de la récupération des prestataires", error);
            }
          };
      
          fetchReport();
        }, [pageIndex, pageSize]);

  useEffect(() => {
    setPageIndex(0);
  }, [pageSize]);

  return (
    <>
      <DataTable key={`${pageIndex}-${pageSize}`} data={reports} />
      <PaginationControls
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPageIndexChange={setPageIndex}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPageIndex(0);
        }}
      />
    </>
  );
}
