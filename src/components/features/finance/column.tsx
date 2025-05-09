"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export type TransactionType = "abonnements" | "virements reçus" | "virements émis"
export type TransactionCategory = "abonnements" | "livraison" | "prestations"

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

      return (
        <Badge variant={type === "abonnements" ? "default" : type === "virements reçus" ? "success" : "destructive"}>
          {type}
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

      return <Badge variant="outline">{category}</Badge>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "date",
    header: "Date",
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
