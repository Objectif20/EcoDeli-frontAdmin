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
import { CheckIcon, ChevronDownIcon, ColumnsIcon, XIcon } from "lucide-react";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { MinimalTiptapEditorReadOnly } from "@/components/minimal-tiptap";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";

// Nouveau schéma pour les emails
export const emailSchema = z.object({
  id: z.string(),
  subject: z.string(),
  sentDate: z.string(),
  isSent: z.boolean(),
  author: z.string(),
  profiles: z.array(z.string()),
  content: z.string(),
  isNewsletter: z.boolean(),
});

export const ColumnLink = () => {
  const { t } = useTranslation();

  const columnLink = [
    {
      column_id: "subject",
      text: t("pages.mail.table.columns.subject"),
    },
    {
      column_id: "sentDate",
      text: t("pages.mail.table.columns.sentDate"),
    },
    {
      column_id: "isSent",
      text: t("pages.mail.table.columns.isSent"),
    },
    {
      column_id: "author",
      text: t("pages.mail.table.columns.author"),
    },
    {
      column_id: "profiles",
      text: t("pages.mail.table.columns.profiles"),
    },
    {
      column_id: "isNewsletter",
      text: t("pages.mail.table.columns.isNewsletter"),
    },
  ];

  return columnLink;
};

export function EmailDataTable({
  data: initialData,
}: {
  data: z.infer<typeof emailSchema>[];
}) {
  const { t } = useTranslation();
  const [data, setData] = React.useState(initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const emailColumns: ColumnDef<z.infer<typeof emailSchema>>[] = [
    {
      accessorKey: "subject",
      header: t("pages.mail.table.columns.subject"),
      cell: ({ row }) => row.original.subject,
    },
    {
      accessorKey: "sentDate",
      header: t("pages.mail.table.columns.sentDate"),
      cell: ({ row }) => {
        const formattedDate = new Intl.DateTimeFormat("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(new Date(row.original.sentDate));

        return formattedDate;
      },
    },
    {
      accessorKey: "isSent",
      header: t("pages.mail.table.columns.isSent"),
      cell: ({ row }) => (
        <Badge variant={row.original.isSent ? "success" : "outline"}>
          {row.original.isSent
            ? t("pages.mail.table.status.sent")
            : t("pages.mail.table.status.notSent")}
        </Badge>
      ),
    },
    {
      accessorKey: "profiles",
      header: t("pages.mail.table.columns.profiles"),
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          {row.original.profiles.map((profile, index) => (
            <Badge key={index} variant="outline">
              {t(`pages.mail.table.profileLabels.${profile}`) || profile}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "isNewsletter",
      header: t("pages.mail.table.columns.isNewsletter"),
      cell: ({ row }) => (
        <div className="flex items-center">
          {row.original.isNewsletter ? (
            <CheckIcon className="text-green-500" />
          ) : (
            <XIcon className="text-red-500" />
          )}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="link"
              className="w-fit px-0 text-left text-foreground"
            >
              {t("pages.mail.table.columns.actions")}
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="flex flex-col">
            <SheetHeader className="gap-1">
              <SheetTitle>{row.original.subject}</SheetTitle>
              <SheetDescription>
                {t("pages.mail.table.details.title")}
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-4 overflow-y-auto py-4 text-sm">
              <div className="flex flex-col gap-3">
                <Label>{t("pages.mail.table.details.sentDate")}</Label>
                <p>
                  {new Intl.DateTimeFormat("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  }).format(new Date(row.original.sentDate))}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Label>{t("pages.mail.table.details.content")}</Label>
                <MinimalTiptapEditorReadOnly
                  value={row.original.content}
                  className="w-full"
                  editorContentClassName="p-5"
                  output="html"
                  placeholder={t("pages.mail.editor.placeholder")}
                  autofocus
                  editable={false}
                  editorClassName="focus:outline-none"
                />
              </div>
            </div>
            <SheetFooter className="mt-auto flex gap-2 sm:flex-col sm:space-x-0">
              <SheetClose asChild>
                <Button variant="outline" className="w-full">
                  {t("pages.mail.table.details.close")}
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns: emailColumns,
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
                  {t("pages.mail.table.columnVisibility.button")}
                </span>
                <span className="lg:hidden">
                  {t("pages.mail.table.columnVisibility.button")}
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
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {t(`pages.mail.table.columnVisibility.menu.${column.id}`)}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
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
                  colSpan={emailColumns.length}
                  className="h-24 text-center"
                >
                  {t("pages.merchant.no-results")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
