import { useState } from "react";
import { columns, Transaction } from "./column";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { DataTable } from "./data-table";
import { ExportCSVDialog } from "./csv-dialog";
import { useTranslation } from "react-i18next";

interface TransactionsProps {
  transactions: Transaction[];
  filters: any;
  onFilterChange: (filters: any) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  totalRows: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (newPageIndex: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
}

export function Transactions({
  transactions,
  filters,
  onFilterChange,
  onApplyFilters,
  onResetFilters,
  totalRows,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: TransactionsProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const handleNameFilter = (value: string) => {
    onFilterChange({ ...filters, name: value });
  };

  const handleTypeFilter = (value: string) => {
    onFilterChange({ ...filters, type: value });
  };

  const handleYearFilter = (value: string) => {
    onFilterChange({ ...filters, year: value });
  };

  const handleMonthFilter = (value: string) => {
    onFilterChange({ ...filters, month: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setOpen(true)}>
          <Download className="mr-2 h-4 w-4" />
          {t("pages.transactions.exportButton")}
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={transactions}
        filters={filters}
        onNameFilter={handleNameFilter}
        onTypeFilter={handleTypeFilter}
        onYearFilter={handleYearFilter}
        onMonthFilter={handleMonthFilter}
        onApplyFilters={onApplyFilters}
        onResetFilters={onResetFilters}
        totalRows={totalRows}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
      <ExportCSVDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

