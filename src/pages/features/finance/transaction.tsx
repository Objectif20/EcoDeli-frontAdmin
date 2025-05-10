import { FinanceApi } from "@/api/finance.api";
import { Transaction } from "@/components/features/finance/column";
import { Transactions } from "@/components/features/finance/transactions";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export const allTransactions: Transaction[] = [
  {
    id: "TR-001",
    name: "Jean Dupont",
    type: "sub",
    category: "sub",
    date: "01/2024",
    invoiceUrl: "https://example.com/invoice/TR-001.pdf",
  },
  {
    id: "TR-002",
    name: "Marie Martin",
    type: "in",
    category: "service",
    date: "2024-02-15",
    invoiceUrl: "https://example.com/invoice/TR-002.pdf",
  },
  {
    id: "TR-003",
    name: "Pierre Durand",
    type: "out",
    category: "delivery",
    date: "2024-03-22",
    invoiceUrl: "https://example.com/invoice/TR-003.pdf",
  },
  {
    id: "TR-004",
    name: "Sophie Bernard",
    type: "sub",
    category: "sub",
    date: "02/2024",
    invoiceUrl: "https://example.com/invoice/TR-004.pdf",
  },
  {
    id: "TR-005",
    name: "Lucas Petit",
    type: "in",
    category: "service",
    date: "2024-01-10",
    invoiceUrl: "https://example.com/invoice/TR-005.pdf",
  },
  {
    id: "TR-006",
    name: "Emma Leroy",
    type: "out",
    category: "delivery",
    date: "2023-12-05",
    invoiceUrl: "https://example.com/invoice/TR-006.pdf",
  },
  {
    id: "TR-007",
    name: "Thomas Moreau",
    type: "sub",
    category: "sub",
    date: "03/2024",
    invoiceUrl: "https://example.com/invoice/TR-007.pdf",
  },
  {
    id: "TR-008",
    name: "Camille Roux",
    type: "in",
    category: "service",
    date: "2024-04-18",
    invoiceUrl: "https://example.com/invoice/TR-008.pdf",
  },
  {
    id: "TR-009",
    name: "Antoine Girard",
    type: "out",
    category: "delivery",
    date: "2023-11-30",
    invoiceUrl: "https://example.com/invoice/TR-009.pdf",
  },
  {
    id: "TR-010",
    name: "Julie Fournier",
    type: "sub",
    category: "sub",
    date: "04/2024",
    invoiceUrl: "https://example.com/invoice/TR-010.pdf",
  },
  {
    id: "TR-011",
    name: "Nicolas Lambert",
    type: "in",
    category: "service",
    date: "2024-05-02",
    invoiceUrl: "https://example.com/invoice/TR-011.pdf",
  },
  {
    id: "TR-012",
    name: "Léa Bonnet",
    type: "out",
    category: "delivery",
    date: "2023-10-15",
    invoiceUrl: "https://example.com/invoice/TR-012.pdf",
  }
];

const fetchTransactions = async (
  filters: any,
  pageIndex: number,
  pageSize: number
): Promise<{ transactions: Transaction[]; totalRows: number }> => {
  try {
    const params: any = {
      pageIndex,
      pageSize,
    };

    if (filters.name) {
      params.name = filters.name;
    }

    if (filters.type && filters.type !== "all") {
      params.type = filters.type;
    }

    if (filters.year) {
      params.year = filters.year;
    }

    if (filters.month) {
      params.month = filters.month;
    }

    const response = await FinanceApi.getTransactions(params);

    return {
      transactions: response.data,
      totalRows: response.totalRows,
    };
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

export default function TransactionsPage() {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    name: "",
    type: "all",
    year: "",
    month: "",
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: ["Accueil", "Transactions"],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch]);

  const fetchData = async () => {
    const { transactions, totalRows } = await fetchTransactions(filters, pageIndex, pageSize);
    setTransactions(transactions);
    setTotalRows(totalRows);
  };

  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleApplyFilters = async () => {
    const params = new URLSearchParams();
    if (filters.name) params.append('name', filters.name);
    if (filters.type && filters.type !== "all") params.append('type', filters.type);
    if (filters.year) params.append('year', filters.year);
    if (filters.month) params.append('month', filters.month);
  
    params.append('pageIndex', pageIndex.toString());
    params.append('pageSize', pageSize.toString());
  
    const queryString = params.toString();
    const url = `https://example.com/api/transactions?${queryString}`;
  
    console.log("URL with filters and pagination:", url);
  
    await fetchData();
  };

  const handleResetFilters = () => {
    setFilters({
      name: "",
      type: "all",
      year: "",
      month: "",
    });
    fetchData();
  };

  const handlePageChange = (newPageIndex: number) => {
    console.log(`Changing page to: ${newPageIndex}`);
    setPageIndex(newPageIndex);
    handleApplyFilters(); 
  };
  
  const handlePageSizeChange = (newPageSize: number) => {
    console.log(`Changing page size to: ${newPageSize}`);
    setPageSize(newPageSize);
    setPageIndex(0); 
    handleApplyFilters();
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Gestion des Transactions</h1>
      <Transactions
        transactions={transactions}
        filters={filters}
        onFilterChange={handleFilterChange}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        totalRows={totalRows}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
