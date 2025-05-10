import React from "react";
import {
    ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const deliverymanSchema = z.object({
  id: z.string(),
  profile_picture: z.string().nullable(),
  first_name: z.string(),
  last_name: z.string(),
  status: z.boolean(),
  email: z.string(),
  rate: z.number().optional(),
});

type Deliveryman = z.infer<typeof deliverymanSchema>;

export const deliverymanColumns: ColumnDef<z.infer<typeof deliverymanSchema>>[] = [
  {
    id: "profile",
    accessorKey: "profile_picture",
    header: "Livreur",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.profile_picture ? (
          <Avatar>
            <AvatarImage
              src={row.original.profile_picture}
              alt={`${row.original.first_name} ${row.original.last_name}`} />
            <AvatarFallback>
              {`${row.original.first_name.charAt(0)}${row.original.last_name.charAt(0)}`}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
        )}
        <span>{`${row.original.first_name} ${row.original.last_name}`}</span>
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => (
      <Badge variant={row.original.status ? "success" : "destructive"}>
        {row.original.status ? "Validé" : "Non validé"}
      </Badge>
    ),
  },
  { accessorKey: "email", header: "Email Pro", cell: ({ row }) => row.original.email },
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
          onClick={() => navigate(`/office/profile/deliverymen/${row.original.id}`)}
        >
          Détails
        </Button>
      );
    },
  },
];

interface DataTableProps {
  data: Deliveryman[];
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
    columns: deliverymanColumns,
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
              <TableCell colSpan={deliverymanColumns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
