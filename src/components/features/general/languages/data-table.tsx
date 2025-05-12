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
import { useNavigate } from "react-router-dom";
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

export const languageSchema = z.object({
  id: z.string(),
  name: z.string(),
  iso_code: z.string(),
  available: z.boolean(),
});

export function LanguageDataTable({ data: initialData }: { data: z.infer<typeof languageSchema>[] }) {
  const { t } = useTranslation();
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

  const languageColumns: ColumnDef<z.infer<typeof languageSchema>>[] = [
    {
      id: "flag",
      accessorKey: "iso_code",
      header: t("pages.languages.languagePage.table.flag"),
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
    {
      accessorKey: "name",
      header: t("pages.languages.languagePage.table.name"),
      cell: ({ row }) => row.original.name
    },
    {
      accessorKey: "iso_code",
      header: t("pages.languages.languagePage.table.isoCode"),
      cell: ({ row }) => row.original.iso_code
    },
    {
      accessorKey: "available",
      header: t("pages.languages.languagePage.table.available"),
      cell: ({ row }) => (
        <Badge variant={row.original.available ? "success" : "destructive"}>
          {row.original.available ? t("pages.languages.languagePage.table.yes") : t("pages.languages.languagePage.table.no")}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: t("pages.languages.languagePage.table.actions"),
      cell: ({ row }) => {
        const navigate = useNavigate();

        const handleUpdateClick = () => {
          navigate(`/office/general/languages/${row.original.id}`);
        };

        return (
          <Button variant="link" onClick={handleUpdateClick} className="w-fit px-0 text-left text-foreground">
            {t("pages.languages.languagePage.table.update")}
          </Button>
        );
      },
    },
  ];

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

  const languageColumnLink = [
    { column_id: "name", text: t("pages.languages.languagePage.table.name") },
    { column_id: "iso_code", text: t("pages.languages.languagePage.table.isoCode") },
    { column_id: "available", text: t("pages.languages.languagePage.table.available") },
  ];

  return (
    <>
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="flex justify-end items-center gap-2 w-full my-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ColumnsIcon className="h-4 w-4 mr-2" />
                <span className="hidden lg:inline">{t("pages.languages.languagePage.pagination.columns")}</span>
                <span className="lg:hidden">{t("pages.languages.languagePage.pagination.columns")}</span>
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
                  {t("pages.languages.languagePage.table.noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
