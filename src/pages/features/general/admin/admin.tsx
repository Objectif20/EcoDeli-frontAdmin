import { useEffect, useMemo, useState } from "react";
import { AdminDataTable } from "@/components/features/general/admin/data-table";
import { PaginationControls } from "@/components/pagination-controle";
import { useDispatch, useSelector } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { getAllAdmins } from "@/api/admin.api"; // Assurez-vous que le chemin est correct
import { z } from "zod"; // Assurez-vous d'importer zod
import { RootState } from "@/redux/store";

// Définition du schéma avec zod
export const adminSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  roles: z.array(z.string()),
  photo_url: z.string(),
});

export default function AdminPage() {
  const dispatch = useDispatch();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [adminData, setAdminData] = useState<z.infer<typeof adminSchema>[]>([]);


  const admin = useSelector((state: RootState & { admin: { admin: any } }) => state.admin.admin);
  
  const isSuperAdmin = admin?.super_admin;
  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: ["Accueil", "Administrateurs"],
        links: ["/office/dashboard"],
      })
    );

    
    const fetchAdminData = async () => {
      const data = await getAllAdmins();
      if (data) {
        const transformedData = data.map(admin => ({
          id: admin.admin_id,
          name: `${admin.first_name} ${admin.last_name}`,
          email: admin.email,
          roles: admin.active ? ["admin"] : [],
          photo_url: admin.photo || "https://example.com/default-photo.jpg",
        }));

        const validatedData = transformedData.map(item => adminSchema.parse(item));
        setAdminData(validatedData);
      }
    };

    fetchAdminData();
  }, [dispatch]);

  const paginatedData = useMemo(() => {
    const startIndex = pageIndex * pageSize;
    const endIndex = Math.min(startIndex + pageSize, adminData.length);
    return adminData.slice(startIndex, endIndex);
  }, [pageIndex, pageSize, adminData]);

  useEffect(() => {
    setPageIndex(0);
  }, [pageSize]);



  /*const profileList = [
    { value: "merchant", label: "Commerçant" },
    { value: "provider", label: "Prestataire" },
    { value: "client", label: "Expéditeur" },
    { value: "deliveryman", label: "Transporteur" },
    { value: "admin", label: "Administrateur" },
  ];

  const [selectedProfile, setSelectedProfile] = useState<{ label: string; value: string }[]>([]);*/
  

  return (
    <>
      <AdminDataTable key={`${pageIndex}-${pageSize}`} data={paginatedData} isSuperAdmin={isSuperAdmin} />
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
    </>
  );
}
