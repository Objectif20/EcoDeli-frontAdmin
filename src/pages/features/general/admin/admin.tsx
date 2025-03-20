import { useEffect, useMemo, useState } from "react";
import { AdminDataTable } from "@/components/features/general/admin/data-table";
import { PaginationControls } from "@/components/pagination-controle";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";

export default function AdminPage() {
    const dispatch = useDispatch();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
      dispatch(
        setBreadcrumb({
          segments: ["Accueil", "Administrateurs"],
          links: ["/office/dashboard"],
        })
      );
    }, [dispatch]);

  const exampleAdminData = [
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      roles: ["superadmin", "editor"],
      photo_url: "https://example.com/alice.jpg",
    },
    {
      id: "2",
      name: "Bob Smith",
      email: "bob.smith@example.com",
      roles: ["admin"],
      photo_url: "https://example.com/bob.jpg",
    },
  ];

  const paginatedData = useMemo(() => {
    const startIndex = pageIndex * pageSize;
    const endIndex = Math.min(startIndex + pageSize, exampleAdminData.length);
    return exampleAdminData.slice(startIndex, endIndex);
  }, [pageIndex, pageSize, exampleAdminData]);

  useEffect(() => {
    setPageIndex(0);
  }, [pageSize]);

  return (
    <>
      <AdminDataTable key={`${pageIndex}-${pageSize}`} data={paginatedData} isSuperAdmin={true} />
      <PaginationControls
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalItems={exampleAdminData.length}
        onPageIndexChange={setPageIndex}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPageIndex(0);
        }}
      />
    </>
  );
}
