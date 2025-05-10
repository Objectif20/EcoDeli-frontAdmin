"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export type TransactionType = "sub" | "in" | "out"
export type TransactionCategory = "sub" | "delivery" | "service"

export type Transaction = {
  id: string
  name: string
  type: TransactionType
  category: TransactionCategory
  date: string
  invoiceUrl?: string
}

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "type",
    header: "Type de transaction",
    cell: ({ row }) => {
      const type = row.getValue("type") as TransactionType
      const typeDisplayMap = {
        "sub": "Abonnement",
        "in": "Virement reçu",
        "out": "Virement émis"
      }

      return (
        <Badge variant={type === "sub" ? "default" : type === "in" ? "success" : "destructive"}>
          {typeDisplayMap[type]}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "category",
    header: "Catégorie",
    cell: ({ row }) => {
      const category = row.getValue("category") as TransactionCategory
      const categoryDisplayMap = {
        "sub": "Abonnement",
        "delivery": "Livraison",
        "service": "Prestation"
      }

      return <Badge variant="outline">{categoryDisplayMap[category]}</Badge>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "date",
    header: "Date",
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
    header: "Facture",
    cell: ({ row }) => {
      const transaction = row.original

      return (
        <Button
          variant="outline"
          size="sm"
          disabled={!transaction.invoiceUrl}
          onClick={() => window.open(transaction.invoiceUrl, "_blank")}
        >
          <Download className="h-4 w-4 mr-2" />
          Télécharger
        </Button>
      )
    },
  },
]
