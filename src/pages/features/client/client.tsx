import { useEffect, useState } from "react";
import { PaginationControls } from "@/components/pagination-controle";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { DataTable } from "@/components/features/client/data-table";

const fakeClientsData = [
  {
    id: "1",
    profile_picture: "https://via.placeholder.com/150",
    first_name: "Alice",
    last_name: "Dupont",
    email: "alice.dupont@example.com",
    nbDemandeDeLivraison: 10,
    nomAbonnement: "Premium",
    nbSignalements: 2,
  },
  {
    id: "2",
    profile_picture: null,
    first_name: "Bob",
    last_name: "Martin",
    email: "bob.martin@example.com",
    nbDemandeDeLivraison: 5,
    nomAbonnement: "Basic",
    nbSignalements: 0,
  },
];

export default function ClientPage() {
  const dispatch = useDispatch();
  const [clients, setClients] = useState(fakeClientsData);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(fakeClientsData.length);

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: ["Accueil", "Clients"],
        links: ["/office/dashboard"],
      })
    );

    setClients(fakeClientsData);
    setTotalItems(fakeClientsData.length);
  }, [dispatch]);

  return (
    <>
      <div className="w-full">
        <h1 className="text-2xl font-semibold mb-4">Les clients sur EcoDeli</h1>
        <DataTable key={`${pageIndex}-${pageSize}`} data={clients} />
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
