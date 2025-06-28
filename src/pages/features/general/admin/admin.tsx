import { useEffect, useMemo, useState } from "react";
import { AdminDataTable } from "@/components/features/general/admin/data-table";
import { PaginationControls } from "@/components/pagination-controle";
import { useDispatch, useSelector } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { getAllAdmins } from "@/api/admin.api";
import { z } from "zod";
import { RootState } from "@/redux/store";
import CreateAdmin from "@/components/features/general/admin/create-admin";
import { useTranslation } from "react-i18next";

export const adminSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  roles: z.array(z.string()),
  photo_url: z.string(),
});
export default function AdminPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [adminData, setAdminData] = useState<z.infer<typeof adminSchema>[]>([]);

  const admin = useSelector((state: RootState & { admin: { admin: any } }) => state.admin.admin);

  const isSuperAdmin = admin?.super_admin;

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t("pages.admin.list.breadcrumb_home"), t("pages.admin.list.breadcrumb_admins")],
        links: ["/office/dashboard"],
      })
    );

    fetchAdminData();
  }, [dispatch, t]);

  const fetchAdminData = async () => {
    const data = await getAllAdmins();
    if (data) {
      const transformedData = data.map(admin => ({
        id: admin.admin_id,
        name: `${admin.first_name} ${admin.last_name}`,
        email: admin.email,
        roles: admin.roles ?? [],
        photo_url: admin.photo || "https://example.com/default-photo.jpg",
      }));

      const validatedData = transformedData.map(item => adminSchema.parse(item));
      setAdminData(validatedData);
    }
  };

  const paginatedData = useMemo(() => {
    const startIndex = pageIndex * pageSize;
    const endIndex = Math.min(startIndex + pageSize, adminData.length);
    return adminData.slice(startIndex, endIndex);
  }, [pageIndex, pageSize, adminData]);

  useEffect(() => {
    setPageIndex(0);
  }, [pageSize]);

  return (
    <>
      <div className="w-full">
        <h1 className="text-2xl font-semibold mb-4">{t("pages.admin.list.title")}</h1>
        {isSuperAdmin && (<CreateAdmin onAdminCreated={fetchAdminData} />)}
        <AdminDataTable
          key={`${pageIndex}-${pageSize}`}
          data={paginatedData}
          isSuperAdmin={isSuperAdmin}
          onRolesUpdated={fetchAdminData}
        />
        <PaginationControls
          pageIndex={pageIndex}
          pageSize={pageSize}
          totalItems={adminData.length}
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

