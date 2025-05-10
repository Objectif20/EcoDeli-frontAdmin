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

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const schema = z.object({
  id: z.string(),
  companyName: z.string(),
  siret: z.string(),
  country: z.string(),
  phone: z.string(),
  description: z.string(),
  profilePicture: z.string().nullable(),
  firstName: z.string(),
  lastName: z.string(),
});

export const columnLink = [
  { column_id: "companyName", text: "Entreprise" },
  { column_id: "siret", text: "SIRET" },
  { column_id: "country", text: "Pays" },
  { column_id: "phone", text: "Téléphone" },
  { column_id: "description", text: "Description" },
  { column_id: "profilePicture", text: "Commerçant" },
];

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "profile",
    accessorKey: "profilePicture",
    header: "Commerçant",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={row.original.profilePicture || undefined}
              alt={`${row.original.firstName} ${row.original.lastName}`} />
            <AvatarFallback>
              {`${row.original.firstName.charAt(0)}${row.original.lastName.charAt(0)}`}
            </AvatarFallback>
          </Avatar>

        <span>{`${row.original.firstName} ${row.original.lastName}`}</span>
      </div>
    ),
    enableHiding: false,
  },
  {
    id: "id",
    accessorKey: "companyName",
    header: "Entreprise",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span>{row.original.companyName}</span>
      </div>
    ),
    enableHiding: false,
  },
  { accessorKey: "siret", header: "SIRET", cell: ({ row }) => row.original.siret },
  { accessorKey: "country", header: "Pays", cell: ({ row }) => row.original.country },
  { accessorKey: "phone", header: "Téléphone", cell: ({ row }) => row.original.phone },
  { accessorKey: "description", header: "Description", cell: ({ row }) => row.original.description },
  {
    id: "actions",
    cell: ({ row }) => {
      const navigate = useNavigate();
      return (
        <Button
          variant="link"
          className="w-fit px-0 text-left text-foreground"
          onClick={() => navigate(`/office/profile/merchants/${row.original.id}`)}
        >
          Accéder au profil
        </Button>
      );
    },
  },
];

export function DataTable({ data: initialData }: { data: z.infer<typeof schema>[] }) {
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
    columns,
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
                  const columnLinkItem = columnLink.find(
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
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
