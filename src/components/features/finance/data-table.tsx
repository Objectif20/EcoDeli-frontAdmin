"use client"

import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [selectedYear, setSelectedYear] = useState<string>("")
  const [selectedMonth, setSelectedMonth] = useState<string>("")

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  const handleNameFilter = (value: string) => {
    table.getColumn("name")?.setFilterValue(value)
  }

  const handleTypeFilter = (value: string) => {
    if (value === "all") {
      table.getColumn("type")?.setFilterValue([])
    } else {
      table.getColumn("type")?.setFilterValue([value])
    }
  }

  const handleDateFilter = () => {
    if (selectedYear || selectedMonth) {
      table.getColumn("date")?.setFilterValue((value: string) => {
        if (!value) return false

        if (value.includes("/")) {
          const [month, year] = value.split("/")

          if (selectedYear && selectedMonth) {
            return year === selectedYear && month === selectedMonth
          } else if (selectedYear) {
            return year === selectedYear
          } else if (selectedMonth) {
            return month === selectedMonth
          }
        }
        else {
          const date = new Date(value)
          const year = date.getFullYear().toString()
          const month = (date.getMonth() + 1).toString().padStart(2, "0")

          if (selectedYear && selectedMonth) {
            return year === selectedYear && month === selectedMonth
          } else if (selectedYear) {
            return year === selectedYear
          } else if (selectedMonth) {
            return month === selectedMonth
          }
        }

        return true
      })
    } else {
      table.getColumn("date")?.setFilterValue(undefined)
    }
  }

  const resetFilters = () => {
    setSelectedYear("")
    setSelectedMonth("")
    setColumnFilters([])
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <Input
          placeholder="Rechercher par nom..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => handleNameFilter(event.target.value)}
          className="max-w-sm"
        />

        <Select
          value={(table.getColumn("type")?.getFilterValue() as string[])?.[0] || "all"}
          onValueChange={handleTypeFilter}
        >
          <SelectTrigger className="max-w-[200px]">
            <SelectValue placeholder="Type de transaction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="abonnements">Abonnements</SelectItem>
            <SelectItem value="virements reçus">Virements reçus</SelectItem>
            <SelectItem value="virements émis">Virements émis</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Mois" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="01">Janvier</SelectItem>
              <SelectItem value="02">Février</SelectItem>
              <SelectItem value="03">Mars</SelectItem>
              <SelectItem value="04">Avril</SelectItem>
              <SelectItem value="05">Mai</SelectItem>
              <SelectItem value="06">Juin</SelectItem>
              <SelectItem value="07">Juillet</SelectItem>
              <SelectItem value="08">Août</SelectItem>
              <SelectItem value="09">Septembre</SelectItem>
              <SelectItem value="10">Octobre</SelectItem>
              <SelectItem value="11">Novembre</SelectItem>
              <SelectItem value="12">Décembre</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="secondary" onClick={handleDateFilter}>
            Filtrer
          </Button>

          <Button variant="outline" onClick={resetFilters}>
            Réinitialiser
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Aucun résultat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} transaction(s)
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Précédent
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Suivant
          </Button>
        </div>
      </div>
    </div>
  )
}
