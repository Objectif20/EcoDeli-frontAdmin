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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { updateLanguage } from "@/api/languages.api";
import { DialogDescription } from "@radix-ui/react-dialog";

export const languageSchema = z.object({
  id: z.string(),
  name: z.string(),
  iso_code: z.string(),
  available: z.boolean(),
});

export const languageColumnLink = [
  { column_id: "name", text: "Nom" },
  { column_id: "iso_code", text: "Code ISO" },
  { column_id: "available", text: "Disponible" },
];

const languageColumns: ColumnDef<z.infer<typeof languageSchema>>[] = [
  {
    id: "flag",
    accessorKey: "iso_code",
    header: "Drapeau",
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
  { accessorKey: "name", header: "Nom", cell: ({ row }) => row.original.name },
  { accessorKey: "iso_code", header: "Code ISO", cell: ({ row }) => row.original.iso_code },
  {
    accessorKey: "available",
    header: "Disponible",
    cell: ({ row }) => (
      <Badge variant={row.original.available ? "success" : "destructive"}>
        {row.original.available ? "Oui" : "Non"}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [open, setOpen] = React.useState(false);
      const [updatedLanguage, setUpdatedLanguage] = React.useState({
        language_name: row.original.name,
        iso_code: row.original.iso_code,
        active: row.original.available,
        file: null as File | null,
      });

      const handleUpdate = async () => {
        try {
          await updateLanguage(row.original.id, {
            language_name: updatedLanguage.language_name,
            iso_code: updatedLanguage.iso_code,
            active: updatedLanguage.active,
          }, updatedLanguage.file || undefined);
          setOpen(false);
        } catch (error) {
          console.error("Erreur lors de la mise à jour de la langue", error);
        }
      };

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setUpdatedLanguage((prev) => ({
          ...prev,
          [name]: type === "checkbox" ? checked : value,
        }));
      };

      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setUpdatedLanguage((prev) => ({
          ...prev,
          file,
        }));
      };

      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="link" className="w-fit px-0 text-left text-foreground">
              Mettre à jour
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mettre à jour la langue</DialogTitle>
              <DialogDescription>Mettez à jour les informations vis à vis de cette langue</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="name">Nom de la langue</Label>
                <Input
                  name="language_name"
                  placeholder="Nom"
                  value={updatedLanguage.language_name}
                  onChange={handleChange}
                  id="name"
                />
              </div>
              <div>
                <Label htmlFor="iso_code">Code ISO</Label>
                <Input
                  name="iso_code"
                  placeholder="Code ISO"
                  value={updatedLanguage.iso_code}
                  onChange={handleChange}
                  id="iso_code"
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="active"
                  name="active"
                  checked={updatedLanguage.active}
                  onCheckedChange={(checked) =>
                    handleChange({
                      target: { name: "active", value: checked },
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                />
                <Label htmlFor="active">Active</Label>
              </div>
              <div>
                <Label htmlFor="file">Fichier de langue</Label>
                <Input
                  accept=".json"
                  type="file"
                  onChange={handleFileChange}
                  id="file"
                />
              </div>
              <div className="flex justify-end mt-4 mx-2">
                <Button className="mr-4" type="button" onClick={() => setOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">Mettre à jour</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      );
    },
  },
];

export function LanguageDataTable({ data: initialData }: { data: z.infer<typeof languageSchema>[] }) {
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
                  Aucun résultat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
