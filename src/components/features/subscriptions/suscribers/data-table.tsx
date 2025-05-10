"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
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
import { useTranslation } from "react-i18next";

export const subscriberSchema = z.object({
  subscription_id: z.string(),
  user_id: z.string(),
  email: z.string(),
  plan_id: z.number(),
  plan_name: z.string(),
  start_date: z.string(),
  end_date: z.string().optional().nullable(),
  is_merchant: z.boolean(),
});

export const subscriberColumnLink = [
  { column_id: "email", text: "pages.subscription.list.table.columns.email" },
  { column_id: "is_merchant", text: "pages.subscription.list.table.columns.is_merchant" },
  { column_id: "plan_name", text: "pages.subscription.list.table.columns.plan_name" },
  { column_id: "start_date", text: "pages.subscription.list.table.columns.start_date" },
  { column_id: "end_date", text: "pages.subscription.list.table.columns.end_date" },
];

const SubscriberDataTable = ({ data: initialData }: { data: z.infer<typeof subscriberSchema>[] }) => {
  const { t } = useTranslation();
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

  const subscriberColumns = [
    {
      accessorKey: "email",
      header: t("pages.subscription.list.table.columns.email"),
      cell: ({ row }: { row: { original: z.infer<typeof subscriberSchema> } }) => row.original.email,
    },
    {
      accessorKey: "is_merchant",
      header: t("pages.subscription.list.table.columns.is_merchant"),
      cell: ({ row }: { row: { original: z.infer<typeof subscriberSchema> } }) => (row.original.is_merchant ? "✅" : "❌"),
    },
    {
      accessorKey: "plan_name",
      header: t("pages.subscription.list.table.columns.plan_name"),
      cell: ({ row }: { row: { original: z.infer<typeof subscriberSchema> } }) => row.original.plan_name,
    },
    {
      accessorKey: "start_date",
      header: t("pages.subscription.list.table.columns.start_date"),
      cell: ({ row }: { row: { original: z.infer<typeof subscriberSchema> } }) => {
        const date = new Date(row.original.start_date);
        return date.toLocaleDateString('fr-FR');
      },
    },
    {
      accessorKey: "end_date",
      header: t("pages.subscription.list.table.columns.end_date"),
      cell: ({ row }: { row: { original: z.infer<typeof subscriberSchema> } }) => {
        if (!row.original.end_date) {
          return "";
        }
        const date = new Date(row.original.end_date);
        return date.toLocaleDateString('fr-FR');
      },
    }
  ];

  const table = useReactTable({
    data,
    columns: subscriberColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    getRowId: (row) => row.subscription_id,
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
                  {t("pages.subscription.list.table.columns_button")}
                </span>
                <span className="lg:hidden">
                  {t("pages.subscription.list.table.columns_button")}
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
                  const columnLinkItem = subscriberColumnLink.find(
                    (link) => link.column_id === column.id
                  );
                  const displayText = columnLinkItem
                    ? t(columnLinkItem.text)
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
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
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
                  colSpan={subscriberColumns.length}
                  className="h-24 text-center"
                >
                  {t("pages.subscription.list.table.no_results")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default SubscriberDataTable;
