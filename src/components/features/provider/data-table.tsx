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
} from "lucide-react";
import { z } from "zod";
import { useTranslation } from "react-i18next";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

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

// Modify columnLink to accept t (translation function) as a parameter
export const columnLink = (t: any) => [
  { column_id: "name", text: t("pages.provider.table.columns.name") },
  { column_id: "company", text: t("pages.provider.table.columns.company") },
  { column_id: "status", text: t("pages.provider.table.columns.status") },
  {
    column_id: "service_number",
    text: t("pages.provider.table.columns.service_number"),
  },
  {
    column_id: "phone_number",
    text: t("pages.provider.table.columns.phone_number"),
  },
  { column_id: "rate", text: t("pages.provider.table.columns.rate") },
];

const columns = (t: any): ColumnDef<z.infer<typeof schema>>[] => [
  {
    id: "id",
    accessorKey: "profile_picture",
    header: t("pages.provider.table.columns.prestataire"),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage
            src={row.original.profile_picture || undefined}
            alt={`${row.original.name}`}
          />
          <AvatarFallback>{`${row.original.name.charAt(0)}`}</AvatarFallback>
        </Avatar>
        <span>{`${row.original.name}`}</span>
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "company",
    header: t("pages.provider.table.columns.entreprise"),
    cell: ({ row }) => row.original.company,
  },
  {
    accessorKey: "status",
    header: t("pages.provider.table.columns.statut"),
    cell: ({ row }) => {
      return (
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
              <span
                className="size-1.5 rounded-full bg-amber-500"
                aria-hidden="true"
              ></span>
              {t("pages.provider.table.status.wait")}
            </>
          ) : row.original.status === "okay" ? (
            <>
              <CheckIcon
                className="text-emerald-500"
                size={12}
                aria-hidden="true"
              />
              {t("pages.provider.table.status.okay")}
            </>
          ) : (
            <>
              <span
                className="size-1.5 rounded-full bg-amber-500"
                aria-hidden="true"
              ></span>
              {t("pages.provider.table.status.wait")}
            </>
          )}
        </Badge>
      );
    },
  },
  {
    accessorKey: "service_number",
    header: t("pages.provider.table.columns.prestations"),
    cell: ({ row }) => {
      return row.original.service_number && row.original.service_number > 0 ? (
        <span>{row.original.service_number}</span>
      ) : (
        <Badge variant="outline" className="px-1.5">
          {t("pages.provider.table.badges.no_services")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "phone_number",
    header: t("pages.provider.table.columns.telephone"),
    cell: ({ row }) => row.original.phone_number,
  },
  {
    accessorKey: "rate",
    header: t("pages.provider.table.columns.note_globale"),
    cell: ({ row }) => {
      return row.original.rate !== undefined && row.original.rate > 0 ? (
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
        <Badge variant="outline" className="px-1.5">
          {t("pages.provider.table.badges.no_rating")}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const navigate = useNavigate();
      return (
        <Button
          variant="link"
          className="w-fit px-0 text-left text-foreground"
          onClick={() =>
            navigate(`/office/profile/providers/${row.original.id}`)
          }
        >
          {t("pages.provider.table.columns.actions")}
        </Button>
      );
    },
  },
];

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[];
}) {
  const { t } = useTranslation();
  const [data, setData] = React.useState(initialData);

  React.useEffect(() => {
    if (initialData && initialData.length > 0) {
      setData(initialData);
    }
  }, [initialData]);

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns: columns(t), // Pass t to columns
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
                <span className="hidden lg:inline">
                  {t("pages.provider.table.columns_toggle")}
                </span>
                <span className="lg:hidden">
                  {t("pages.provider.table.columns_toggle")}
                </span>
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
                  const columnLinkItem = columnLink(t).find(
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
                  colSpan={columns(t).length}
                  className="h-24 text-center"
                >
                  {t("pages.provider.table.columns.no_results")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
