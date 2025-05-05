import React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const clientSchema = z.object({
  id: z.string(),
  profile_picture: z.string().nullable(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  nbDemandeDeLivraison: z.number(),
  nomAbonnement: z.string(),
  nbSignalements: z.number(),
});

type Client = z.infer<typeof clientSchema>;

export const clientColumns: ColumnDef<z.infer<typeof clientSchema>>[] = [
  {
    id: "profile",
    accessorKey: "profile_picture",
    header: "Client",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.profile_picture ? (
          <img
            src={row.original.profile_picture}
            alt={`${row.original.first_name} ${row.original.last_name}`}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
        )}
        <span>{`${row.original.first_name} ${row.original.last_name}`}</span>
      </div>
    ),
    enableHiding: false,
  },
  { accessorKey: "email", header: "Email", cell: ({ row }) => row.original.email },
  {
    accessorKey: "nbDemandeDeLivraison",
    header: "Nb Demandes de Livraison",
    cell: ({ row }) => row.original.nbDemandeDeLivraison,
  },
  {
    accessorKey: "nomAbonnement",
    header: "Nom Abonnement",
    cell: ({ row }) => row.original.nomAbonnement,
  },
  {
    accessorKey: "nbSignalements",
    header: "Nb Signalements",
    cell: ({ row }) => row.original.nbSignalements,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const navigate = useNavigate();
      return (
        <Button
          variant="link"
          className="w-fit px-0 text-left text-foreground"
          onClick={() => navigate(`/office/profile/clients/${row.original.id}`)}
        >
          Détails
        </Button>
      );
    },
  },
];

interface DataTableProps {
  data: Client[];
}

export function DataTable({ data: initialData }: DataTableProps) {
  const [data, setData] = React.useState(initialData);

  React.useEffect(() => {
    if (initialData && initialData.length > 0) {
      setData(initialData);
    }
  }, [initialData]);

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns: clientColumns,
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
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader className="sticky top-0 bg-muted">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={clientColumns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
