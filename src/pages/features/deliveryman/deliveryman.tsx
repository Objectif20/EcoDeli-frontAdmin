import { useEffect, useState } from "react";
import { PaginationControls } from "@/components/pagination-controle";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { DataTable } from "@/components/features/deliveryman/data-table";

const fakeDeliverymenData = [
  {
    id: "1",
    profile_picture: "https://via.placeholder.com/150",
    first_name: "John",
    last_name: "Doe",
    status: true,
    email: "john.doe@example.com",
    rate: 4.5,
  },
  {
    id: "2",
    profile_picture: null,
    first_name: "Jane",
    last_name: "Smith",
    status: false,
    email: "jane.smith@example.com",
    rate: 3.0,
  },
];

export default function DeliverymanPage() {
  const dispatch = useDispatch();
  const [deliverymen, setDeliverymen] = useState(fakeDeliverymenData);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(fakeDeliverymenData.length);

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: ["Accueil", "Livreurs"],
        links: ["/office/dashboard"],
      })
    );

    setDeliverymen(fakeDeliverymenData);
    setTotalItems(fakeDeliverymenData.length);
  }, [dispatch]);

  return (
    <>
      <div className="w-full">
        <h1 className="text-2xl font-semibold mb-4">Les livreurs sur EcoDeli</h1>
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
