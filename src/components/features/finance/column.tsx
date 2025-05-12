import { useTranslation } from 'react-i18next';
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type TransactionType = "sub" | "in" | "out";
export type TransactionCategory = "sub" | "delivery" | "service";

export type Transaction = {
  id: string;
  name: string;
  type: TransactionType;
  category: TransactionCategory;
  date: string;
  invoiceUrl?: string;
};

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "name",
    header: () => {
      const { t } = useTranslation();
      return t("pages.transactions.table.name");
    },
  },
  {
    accessorKey: "type",
    header: () => {
      const { t } = useTranslation();
      return t("pages.transactions.table.type");
    },
    cell: ({ row }) => {
      const { t } = useTranslation();
      const type = row.getValue("type") as TransactionType;
      const typeDisplayMap = {
        "sub": t("pages.transactions.badge.sub"),
        "in": t("pages.transactions.badge.in"),
        "out": t("pages.transactions.badge.out")
      };

      return (
        <Badge variant={type === "sub" ? "default" : type === "in" ? "success" : "destructive"}>
          {typeDisplayMap[type]}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "category",
    header: () => {
      const { t } = useTranslation();
      return t("pages.transactions.table.category");
    },
    cell: ({ row }) => {
      const { t } = useTranslation();
      const category = row.getValue("category") as TransactionCategory;
      const categoryDisplayMap = {
        "sub": t("pages.transactions.badge.sub"),
        "delivery": t("pages.transactions.badge.delivery"),
        "service": t("pages.transactions.badge.service")
      };

      return <Badge variant="outline">{categoryDisplayMap[category]}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "date",
    header: () => {
      const { t } = useTranslation();
      return t("pages.transactions.table.date");
    },
    cell: ({ row }) => {
      const date = row.getValue("date") as string;

      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
      } else {
        return date;
      }
    },
  },
  {
    id: "actions",
    header: () => {
      const { t } = useTranslation();
      return t("pages.transactions.table.invoice");
    },
    cell: ({ row }) => {
      const { t } = useTranslation();
      const transaction = row.original;

      return (
        <Button
          variant="outline"
          size="sm"
          disabled={!transaction.invoiceUrl}
          onClick={() => window.open(transaction.invoiceUrl, "_blank")}
        >
          <Download className="h-4 w-4 mr-2" />
          {t("pages.transactions.table.downloadInvoice")}
        </Button>
      );
    },
  },
];
