"use client"

import { useState } from "react"
import { columns } from "./column"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { DataTable } from "./data-table"
import { ExportCSVDialog } from "./csv-dialog"

export function Transactions({ transactions }: { transactions: any[] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setOpen(true)}>
          <Download className="mr-2 h-4 w-4" />
          Exporter CSV
        </Button>
      </div>
      <DataTable columns={columns} data={transactions} />
      <ExportCSVDialog open={open} onOpenChange={setOpen} />
    </div>
  )
}
