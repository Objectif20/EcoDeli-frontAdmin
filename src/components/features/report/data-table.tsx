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
  CheckIcon,
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

export const schema = z.object({
  id: z.string(),
  user_id: z.string(),
  title: z.string(),
  content: z.string(),
  admin_id: z.string().optional(),
  status: z.string(),
  photo_url: z.string().optional(),
  name: z.string(),
});

export const columnLink = [
  { column_id: "title", text: "Titre" },
  { column_id: "content", text: "Contenu" },
  { column_id: "status", text: "Statut" },
];

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "id",
    accessorKey: "name", // Utilisation de name comme clé d'accès
    header: "Utilisateur",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.photo_url ? (
          <img
            src={row.original.photo_url}
            alt={row.original.name}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
        )}
        <span>{row.original.name}</span>
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Titre",
    cell: ({ row }) => row.original.title,
  },
  {
    accessorKey: "content",
    header: "Contenu",
    cell: ({ row }) => row.original.content,
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "wait" ? "outline" : "success"}
        className="gap-1"
      >
        {row.original.status === "wait" ? (
          <>
            <span className="size-1.5 rounded-full bg-amber-500" aria-hidden="true"></span>
            En attente
          </>
        ) : (
          <>
            <CheckIcon className="text-emerald-500" size={12} aria-hidden="true" />
            Validé
          </>
        )}
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
            <SheetDescription>Détails de l'utilisateur</SheetDescription>
          </SheetHeader>
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto py-4 text-sm">
            <div className="flex flex-col gap-3">
              <Label>Photo</Label>
              {row.original.photo_url ? (
                <img
                  src={row.original.photo_url}
                  alt={row.original.name}
                  className="w-20 h-20 rounded-full mx-auto"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-300 mx-auto"></div>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <Label>Nom</Label>
              <p>{row.original.name}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Label>Titre</Label>
              <p>{row.original.title}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Label>Contenu</Label>
              <p>{row.original.content}</p>
            </div>
            <div>
              <Label>Statut</Label>
              <br />
              <Badge
                variant={row.original.status === "wait" ? "outline" : "success"}
                className="gap-1"
              >
                {row.original.status === "wait" ? (
                  <>
                    <span className="size-1.5 rounded-full bg-amber-500" aria-hidden="true"></span>
                    En attente
                  </>
                ) : (
                  <>
                    <CheckIcon className="text-emerald-500" size={12} aria-hidden="true" />
                    Validé
                  </>
                )}
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
