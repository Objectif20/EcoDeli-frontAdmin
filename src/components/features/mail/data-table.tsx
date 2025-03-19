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
import { ColumnsIcon, ChevronDownIcon, CheckIcon, XIcon } from "lucide-react";
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
import { MinimalTiptapEditorReadOnly } from "@/components/minimal-tiptap";

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

export const columnLink = [
  {
    column_id: "subject",
    text: "Objet",
  },
  {
    column_id: "sentDate",
    text: "date d'envoi",
  },
  {
    column_id: "isSent",
    text: "Est envoyé",
  },
  {
    column_id: "author",
    text: "Auteur",
  },
  {
    column_id: "profiles",
    text: "Profils concernés",
  },
  {
    column_id: "isNewsletter",
    text: "Newsletter",
  },
];

const emailColumns: ColumnDef<z.infer<typeof emailSchema>>[] = [
  {
    accessorKey: "subject",
    header: "Objet",
    cell: ({ row }) => row.original.subject,
  },
  {
    accessorKey: "sentDate",
    header: "Date d'envoi",
    cell: ({ row }) => row.original.sentDate,
  },
  {
    accessorKey: "isSent",
    header: "Envoyé",
    cell: ({ row }) => (
      <Badge variant={row.original.isSent ? "success" : "outline"}>
        {row.original.isSent ? "Envoyé" : "Non envoyé"}
      </Badge>
    ),
  },
  {
    accessorKey: "author",
    header: "Rédacteur",
    cell: ({ row }) => row.original.author,
  },
  {
    accessorKey: "profiles",
    header: "Profils",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-2">
        {row.original.profiles.map((profile, index) => (
          <Badge key={index} variant="outline">
            {profile}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "isNewsletter",
    header: "Newsletter",
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
            Voir plus
          </Button>
        </SheetTrigger>
        
        <SheetContent side="right" className="flex flex-col">
          <SheetHeader className="gap-1">
            <SheetTitle>{row.original.subject}</SheetTitle>
            <SheetDescription>Détails de l'email</SheetDescription>
          </SheetHeader>
           
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto py-4 text-sm">
            <div className="flex flex-col gap-3">
              <Label>Date d'envoi</Label>
              <p>{row.original.sentDate}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Label>Rédacteur</Label>
              <p>{row.original.author}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Label>Profils</Label>
              <div className="flex flex-wrap gap-2">
                {row.original.profiles.map((profile, index) => (
                  <Badge key={index} variant="outline">
                    {profile}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label>Contenu</Label>
              <MinimalTiptapEditorReadOnly
                value={row.original.content}
                className="w-full"
                editorContentClassName="p-5"
                output="html"
                placeholder="Contenu de l'email"
                autofocus
                editable={false}
                editorClassName="focus:outline-none"
              />
            </div>
          </div>
          <SheetFooter className="mt-auto flex gap-2 sm:flex-col sm:space-x-0">
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

// Composant DataTable pour les emails
export function EmailDataTable({
  data: initialData,
}: {
  data: z.infer<typeof emailSchema>[];
}) {
  const [data, _] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

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
