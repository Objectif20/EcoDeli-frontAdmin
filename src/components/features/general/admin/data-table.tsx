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

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multiselect";
import { useTranslation } from "react-i18next";

export const adminSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  roles: z.array(z.string()),
  photo_url: z.string(),
});

export const adminColumnLink = [
  { column_id: "name", text: "pages.admin.list.columns.name" },
  { column_id: "email", text: "pages.admin.list.columns.email" },
  { column_id: "roles", text: "pages.admin.list.columns.roles" },
];


const rolesMapping = {
  "TICKET": "pages.admin.create.roles_options.ticket",
  "MAIL": "pages.admin.create.roles_options.mail",
  "PROVIDER": "pages.admin.create.roles_options.provider",
  "MERCHANT": "pages.admin.create.roles_options.merchant",
  "DELIVERY": "pages.admin.create.roles_options.delivery",
  "FINANCE": "pages.admin.create.roles_options.finance",
};

const getRoleLabel = (roleValue: keyof typeof rolesMapping, t: any) => {
  return t(rolesMapping[roleValue]) || roleValue;
};

const adminColumns = (isSuperAdmin: boolean, t: any): ColumnDef<z.infer<typeof adminSchema>>[] => {
  const rolesOptions = [
    { value: "ticket", label: t("pages.admin.create.roles_options.ticket") },
    { value: "mail", label: t("pages.admin.create.roles_options.mail") },
    { value: "provider", label: t("pages.admin.create.roles_options.provider") },
    { value: "merchant", label: t("pages.admin.create.roles_options.merchant") },
    { value: "delivery", label: t("pages.admin.create.roles_options.delivery") },
    { value: "finance", label: t("pages.admin.create.roles_options.finance") },
  ];

  return [
    {
      id: "id",
      accessorKey: "photo_url",
      header: t("pages.admin.list.columns.admin"),
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
    { accessorKey: "email", header: t("pages.admin.list.columns.email"), cell: ({ row }) => row.original.email },
    {
      accessorKey: "roles",
      header: t("pages.admin.list.columns.roles"),
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          {row.original.roles.map((role, index) => (
            <Badge key={index} variant="outline">
              {getRoleLabel(role as keyof typeof rolesMapping, t)}
            </Badge>
          ))}
        </div>
      ),
    },
    ...(isSuperAdmin
      ? [
          {
            id: "actions",
            cell: ({ row }: { row: any }) => {
              const [open, setOpen] = React.useState(false);
              const [selectedRoles, setSelectedRoles] = React.useState(
                row.original.roles.map((role: any) => ({
                  value: role,
                  label: getRoleLabel(role as keyof typeof rolesMapping, t),
                }))
              );

              const updateRoles = () => {
                setOpen(false);
              };

              return (
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button variant="link" className="w-fit px-0 text-left text-foreground">
                      {t("pages.admin.list.actions.modify")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>{t("pages.admin.list.actions.modify_roles_title")}</DialogTitle>
                      <DialogDescription>
                        {t("pages.admin.list.actions.modify_roles_description", { name: row.original.name })}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div>
                        <Label htmlFor="roles" className="text-right">
                          {t("pages.admin.list.columns.roles")}
                        </Label>
                        <MultiSelect
                          options={rolesOptions}
                          onValueChange={(newRoles) =>
                            setSelectedRoles(newRoles.map((role) => ({
                              value: role,
                              label: getRoleLabel(role as keyof typeof rolesMapping, t),
                            })))
                          }
                          defaultValue={selectedRoles}
                          placeholder={t("pages.admin.list.actions.select_roles")}
                          variant="inverted"
                          animation={2}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={updateRoles}>
                        {t("pages.admin.list.actions.save")}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              );
            },
          },
        ]
      : []),
  ];
};

export function AdminDataTable({
  data: initialData,
  isSuperAdmin,
}: {
  data: z.infer<typeof adminSchema>[];
  isSuperAdmin: boolean;
}) {
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

  const table = useReactTable({
    data,
    columns: adminColumns(isSuperAdmin, t),
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
                <span className="hidden lg:inline">{t("pages.admin.list.columns.columns")}</span>
                <span className="lg:hidden">{t("pages.admin.list.columns.columns")}</span>
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
                  const columnLinkItem = adminColumnLink.find(
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
                      {cell.column.id === "roles"
                        ? row.original.roles.map((role, index) => (
                            <Badge key={index} variant="outline">
                              {getRoleLabel(role as keyof typeof rolesMapping, t)}
                            </Badge>
                          ))
                        : flexRender(
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
                  colSpan={adminColumns(isSuperAdmin, t).length}
                  className="h-24 text-center"
                >
                  {t("pages.admin.list.no_results")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
