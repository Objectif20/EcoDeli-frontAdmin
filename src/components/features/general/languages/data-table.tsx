"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ColumnsIcon,
  ChevronDownIcon,
} from "lucide-react";
import { z } from "zod";
import ReactCountryFlag from "react-country-flag";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";

export const languageSchema = z.object({
  id: z.string(),
  name: z.string(),
  iso_code: z.string(),
  available: z.boolean(),
});

export const languageColumnLink = [
  { column_id: "name", text: "Nom" },
  { column_id: "iso_code", text: "Code ISO" },
  { column_id: "available", text: "Disponible" },
];

const languageColumns: ColumnDef<z.infer<typeof languageSchema>>[] = [
  {
    id: "flag",
    accessorKey: "iso_code",
    header: "Drapeau",
    cell: ({ row }) => (
      <ReactCountryFlag
        countryCode={row.original.iso_code}
        svg
        style={{
          width: '2em',
          height: '2em',
        }}
        title={row.original.name}
      />
    ),
    enableHiding: false,
  },
  { accessorKey: "name", header: "Nom", cell: ({ row }) => row.original.name },
  { accessorKey: "iso_code", header: "Code ISO", cell: ({ row }) => row.original.iso_code },
  {
    accessorKey: "available",
    header: "Disponible",
    cell: ({ row }) => (
      <Badge variant={row.original.available ? "success" : "destructive"}>
        {row.original.available ? "Oui" : "Non"}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="link" className="w-fit px-0 text-left text-foreground">
            Voir plus
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="flex flex-col">
          <SheetHeader className="gap-1">
            <SheetTitle>{row.original.name}</SheetTitle>
            <SheetDescription>Détails de la langue</SheetDescription>
          </SheetHeader>
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto py-4 text-sm">
            <div className="flex flex-col gap-3">
              <Label>Drapeau</Label>
              <ReactCountryFlag
                countryCode={row.original.iso_code}
                svg
                style={{
                  width: '4em',
                  height: '4em',
                }}
                title={row.original.name}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label>Nom</Label>
              <p>{row.original.name}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Label>Code ISO</Label>
              <p>{row.original.iso_code}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Label>Disponible</Label>
              <Badge variant={row.original.available ? "success" : "destructive"}>
                {row.original.available ? "Oui" : "Non"}
              </Badge>
            </div>
          </div>
          <SheetFooter className="mt-auto flex gap-2 sm:flex-col sm:space-x-0">
            <Button className="w-full">En voir plus</Button>
            <SheetClose asChild>
              <Button variant="outline" className="w-full">
                Fermer
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    ),
  },
];

export function LanguageDataTable({ data: initialData }: { data: z.infer<typeof languageSchema>[] }) {
  const [data, setData] = React.useState(initialData);

  React.useEffect(() => {
    if (initialData && initialData.length > 0) {
      setData(initialData);
    }
  }, [initialData]);

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns: languageColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="flex justify-end items-center gap-2 w-full my-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ColumnsIcon className="h-4 w-4 mr-2" />
                <span className="hidden lg:inline">Colonnes</span>
                <span className="lg:hidden">Colonnes</span>
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  const columnLinkItem = languageColumnLink.find(
                    (link) => link.column_id === column.id
                  );
                  const displayText = columnLinkItem
                    ? columnLinkItem.text
                    : column.id;

                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {displayText}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="sticky top-0 bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={languageColumns.length}
                  className="h-24 text-center"
                >
                  Aucun résultat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
