import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/features/provider/data-table";
import { PaginationControls } from "@/components/pagination-controle";

export default function ProviderPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const exampleData = [
    {
      id: "1",
      email: "imbertchristelle@example.com",
      rate: 1.2,
      service_number: 10,
      name: "Odette Sauvage-Daniel",
      company: "Teixeira",
      status: "valid",
      phone_number: "06 05026549",
      profile_picture: "https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=612x612&w=0&k=20&c=tyLvtzutRh22j9GqSGI33Z4HpIwv9vL_MZw_xOE19NQ="
    },
  ];

  const paginatedData = useMemo(() => {
    const startIndex = pageIndex * pageSize;
    const endIndex = Math.min(startIndex + pageSize, exampleData.length);
    return exampleData.slice(startIndex, endIndex);
  }, [pageIndex, pageSize, exampleData]);

  useEffect(() => {
    setPageIndex(0);
  }, [pageSize]);


  return (
    <>
      <DataTable key={`${pageIndex}-${pageSize}`} data={paginatedData} />
      <PaginationControls
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalItems={exampleData.length}
        onPageIndexChange={setPageIndex}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPageIndex(0);
        }}
      />
    </>
  );
}
