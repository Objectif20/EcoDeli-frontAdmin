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
  StarIcon,
  CheckIcon,
  X,
} from "lucide-react";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
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
  email: z.string(),
  name: z.string(),
  company: z.string(),
  status: z.string(),
  profile_picture: z.string().nullable(),
  service_number: z.number().optional(),
  rate: z.number().optional(),
  phone_number: z.string(),
});

export const columnLink = [
  { column_id: "name", text: "Nom" },
  { column_id: "company", text: "Entreprise" },
  { column_id: "status", text: "Statut" },
  { column_id: "service_number", text: "Prestations" },
  { column_id: "phone_number", text: "Téléphone" },
  { column_id: "rate", text: "Note Globale" },
];

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "id",
    accessorKey: "profile_picture",
    header: "Prestataire",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={row.original.profile_picture || undefined}
              alt={`${row.original.name} `} />
            <AvatarFallback>
              {`${row.original.name.charAt(0)}`}
            </AvatarFallback>
          </Avatar>

        <span>{`${row.original.name}`}</span>
      </div>
    ),
    enableHiding: false,
  },
  { accessorKey: "company", header: "Entreprise", cell: ({ row }) => row.original.company },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.status === "wait"
        ? "outline"
        : row.original.status === "okay"
        ? "outline"
        : "outline"
        }
        className="gap-1"
      >
        {row.original.status === "wait" ? (
          <>
        <span className="size-1.5 rounded-full bg-amber-500" aria-hidden="true"></span>
        En attente
          </>
        ) : row.original.status === "okay" ? (
          <>
        <CheckIcon className="text-emerald-500" size={12} aria-hidden="true" />
        Validé
          </>
        ) : (
          <>
          <X className="text-red-500" size={12} aria-hidden="true" />
        Refusé
          </>
        )}
      </Badge>
    ),
  },
  {
    accessorKey: "service_number",
    header: "Prestations",
    cell: ({ row }) =>
      row.original.service_number && row.original.service_number > 0 ? (
        <span>{row.original.service_number}</span>
      ) : (
        <Badge variant="outline" className="px-1.5 ">
          Aucune prestation
        </Badge>
      ),
  },
  { accessorKey: "phone_number", header: "Téléphone", cell: ({ row }) => row.original.phone_number },
  {
    accessorKey: "rate",
    header: "Note Globale",
    cell: ({ row }) =>
      row.original.rate !== undefined && row.original.rate > 0 ? (
        <div className="flex items-center">
          {[...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
              <StarIcon
                key={index}
                className={`size-4 ${
                  starValue <= (row.original.rate ?? 0)
                    ? "text-yellow-500"
                    : starValue - 0.5 <= (row.original.rate ?? 0)
                    ? "text-yellow-500/50"
                    : "text-gray-300"
                }`}
              />
            );
          })}
        </div>
      ) : (
        <Badge variant="outline" className="px-1.5 ">
          Aucune note
        </Badge>
      ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const navigate = useNavigate();
      return (
        <Button
          variant="link"
          className="w-fit px-0 text-left text-foreground"
          onClick={() => navigate(`/office/profile/providers/${row.original.id}`)}
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
