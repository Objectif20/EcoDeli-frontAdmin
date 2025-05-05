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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllAdmins } from "@/api/admin.api";
import { ReportApi } from "@/api/report.api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useTranslation } from "react-i18next";

// Schéma de validation
export const schema = z.object({
  report_id: z.string(),
  status: z.string(),
  state: z.string(),
  report_message: z.string(),
  user: z.object({
    user_id: z.string(),
    email: z.string(),
  }),
  admin: z.array(z.object({
    admin_id: z.string(),
    email: z.string(),
    first_name: z.string(),
    last_name: z.string(),
  })).nullable(),
});

export const columnLink = [
  { column_id: "report_message", text: "Message" },
  { column_id: "user_email", text: "Email Utilisateur" },
  { column_id: "admin_name", text: "Nom Admin" },
  { column_id: "status", text: "Statut" },
];

const columns = (t: (key: string) => string): ColumnDef<z.infer<typeof schema>>[] => [
  {
    accessorKey: "report_message",
    header: "Message",
    cell: ({ row }) => {
      const message = row.original.report_message;
      return message.length > 50 ? message.substring(0, 50) + "..." : message;
    },
  },
  {
    id: "user_email",
    accessorKey: "user.email",
    header: "Email Utilisateur",
    cell: ({ row }) => <span>{row.original.user.email}</span>,
  },
  {
    id: "admin_name",
    accessorKey: "admin",
    header: "Attribué à l'admin",
    cell: ({ row }) => {
      const admin = row.original.admin ? row.original.admin[0] : null;
      return admin ? `${admin.first_name} ${admin.last_name}` : "N/A";
    },
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
            {t("pages.report.table.status.waiting")}
          </>
        ) : (
          <>
            <CheckIcon className="text-emerald-500" size={12} aria-hidden="true" />
            {t("pages.report.table.status.validated")}
          </>
        )}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <AssignAdminModal
        reportId={row.original.report_id}
        admin_id={row.original.admin && row.original.admin[0]?.admin_id || undefined}
        message={row.original.report_message}
      />
    ),
  },
];

export function DataTable({ data: initialData }: { data: z.infer<typeof schema>[] }) {
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
    columns: columns(t),
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    getRowId: (row) => row.report_id,
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
                <span className="hidden lg:inline">{t("pages.report.table.columnVisibility.button")}</span>
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
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {t(`pages.report.table.columns.${column.id}`)}
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

function AssignAdminModal({ reportId, admin_id, message }: { reportId: string, admin_id?: string, message: string }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedAdminId, setSelectedAdminId] = React.useState<string | undefined>(admin_id);
  const [admins, setAdmins] = React.useState<AdminData[]>([]);
  const [comment, setComment] = React.useState<string>("");

  const admin = useSelector((state: RootState & { admin: { admin: any } }) => state.admin.admin);

  const isSuperAdmin = admin.super_admin || false;
  const adminId = admin.admin_id;

  React.useEffect(() => {
    getAllAdmins().then((data) => {
      if (data) {
        setAdmins(data);
      }
    });
  }, []);

  const handleAssignAdmin = async () => {
    if (selectedAdminId) {
      await ReportApi.attributeReport(reportId, selectedAdminId);
      setIsOpen(false);
    }
  };

  const handleCommentSubmit = async () => {
    await ReportApi.responseReport(reportId, comment);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="w-fit px-0 text-left text-foreground">
          {adminId === admin_id ? t("pages.report.table.dialog.buttons.manage") : isSuperAdmin ? t("pages.report.table.dialog.buttons.assignAdmin") : t("pages.report.table.dialog.buttons.comment")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {adminId === admin_id
              ? t("pages.report.table.dialog.title.manage")
              : isSuperAdmin
              ? t("pages.report.table.dialog.title.assign")
              : t("pages.report.table.dialog.title.comment")}
          </DialogTitle>
          <DialogDescription>
            {adminId === admin_id
              ? t("pages.report.table.dialog.description.manage")
              : isSuperAdmin
              ? t("pages.report.table.dialog.description.assign")
              : t("pages.report.table.dialog.description.comment")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isSuperAdmin && adminId !== admin_id ? (
            <>
              <Label htmlFor="admin_id_get">{t("pages.report.table.dialog.labels.selectAdmin")}</Label>
              <Select
                value={selectedAdminId}
                onValueChange={setSelectedAdminId}
              >
                <SelectTrigger id="admin_id_get" className="h-auto ps-2 w-full [&>span]:flex [&>span]:items-center [&>span]:gap-2">
                  <SelectValue placeholder={t("pages.report.table.dialog.labels.selectAdmin")} />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {admins.length > 0 ? (
                    admins.map((admin) => (
                      <SelectItem key={admin.admin_id} value={admin.admin_id}>
                        <span className="flex items-center gap-2">
                          {admin.photo ? (
                            <img
                              className="rounded-full w-8 h-8 object-cover"
                              src={admin.photo}
                              alt={admin.first_name}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "";
                              }}
                            />
                          ) : (
                            <div className="rounded-full w-8 h-8 flex items-center justify-center bg-secondary">
                              {getAdminInitials(admin)}
                            </div>
                          )}
                          <span>
                            <span className="block font-medium text-left">
                              {admin.first_name} {admin.last_name}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              {admin.email}
                            </span>
                          </span>
                        </span>
                      </SelectItem>
                    ))
                  ) : (
                    <></>
                  )}
                </SelectContent>
              </Select>
            </>
          ) : (
            <>
              <div>{message}</div>
              <Label htmlFor="comment">{t("pages.report.table.dialog.labels.addComment")}</Label>
              <textarea
                id="comment"
                className="w-full p-2 border rounded"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={isSuperAdmin && adminId !== admin_id ? handleAssignAdmin : handleCommentSubmit}>
            {isSuperAdmin && adminId !== admin_id ? t("pages.report.table.dialog.buttons.assign") : t("pages.report.table.dialog.buttons.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface AdminData {
  admin_id: string;
  first_name: string;
  last_name: string;
  email: string;
  photo?: string;
}

function getAdminInitials(admin: AdminData) {
  return `${admin.first_name.charAt(0)}${admin.last_name.charAt(0)}`;
}
