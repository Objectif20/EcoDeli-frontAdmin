import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/features/report/data-table";
import { PaginationControls } from "@/components/pagination-controle";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";

export default function ReportPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

    const dispatch = useDispatch();
      useEffect(() => {
        dispatch(
          setBreadcrumb({
            segments: ["Accueil", "Signalements"],
            links: ["/office/dashboard"],
          })
        );
      }, [dispatch]);

  const exampleSignalements = [
    {
      id: "1",
      user_id: "user123",
      title: "Signalement de contenu inapproprié",
      content: "Ce contenu contient des propos inappropriés...",
      admin_id: "admin456",
      status: "wait",
      photo_url: "https://via.placeholder.com/150",
      name: "Jean Dupont",
    },
    {
      id: "2",
      user_id: "user124",
      title: "Problème technique",
      content: "Le site ne fonctionne pas correctement...",
      admin_id: "admin457",
      status: "validated",
      photo_url: "https://via.placeholder.com/150",
      name: "Marie Martin",
    },
  ];

  const paginatedData = useMemo(() => {
    const startIndex = pageIndex * pageSize;
    const endIndex = Math.min(startIndex + pageSize, exampleSignalements.length);
    return exampleSignalements.slice(startIndex, endIndex);
  }, [pageIndex, pageSize, exampleSignalements]);

  useEffect(() => {
    setPageIndex(0);
  }, [pageSize]);

  return (
    <>
      <DataTable key={`${pageIndex}-${pageSize}`} data={paginatedData} />
      <PaginationControls
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalItems={exampleSignalements.length}
        onPageIndexChange={setPageIndex}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPageIndex(0);
        }}
      />
    </>
  );
}
