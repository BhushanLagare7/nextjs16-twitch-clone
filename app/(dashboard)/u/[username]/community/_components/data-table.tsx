/**
 * @file app/(dashboard)/u/[username]/community/_components/data-table.tsx
 * @description Generic, reusable DataTable component backed by TanStack Table v9.
 *
 * Supports column sorting, column text filtering (via a username filter input),
 * and client-side pagination. The feature set is governed by the
 * {@link DataTableFeatures} registered in `data-table-features.ts`.
 */

"use client";

import { useState } from "react";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type RowData,
  type SortingState,
  useTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { type DataTableFeatures, features } from "./data-table-features";

/**
 * Props for the {@link DataTable} component.
 *
 * @template TData - The shape of a single row's data object.
 * @property {ColumnDef<DataTableFeatures, TData>[]} columns - Column definitions
 *   created with the typed `columnHelper` from `columns.tsx`.
 * @property {TData[]} data - The full dataset to display in the table.
 */
interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData>[];
  data: TData[];
}

/**
 * DataTable component - Generic TanStack Table v9 table with sorting, filtering, and pagination.
 *
 * Renders a filterable, sortable, and paginated table for any dataset shaped
 * by `TData`. The `username` column is wired to the filter input; all
 * other columns support header-click sorting via their own column definitions.
 *
 * @template TData - The shape of a single row's data object.
 * @param {DataTableProps<TData>} props - Component props.
 * @returns {JSX.Element} The rendered table with filter input and pagination controls.
 */
export function DataTable<TData extends RowData>({
  columns,
  data,
}: DataTableProps<TData>) {
  /** Current sorting state — column ID and direction (asc/desc). */
  const [sorting, setSorting] = useState<SortingState>([]);

  /** Current column filter state — used to filter rows by the `username` column. */
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useTable({
    features,
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      {/* Filter input — filters rows by the `username` column value */}
      <div className="flex items-center py-4">
        <Input
          className="max-w-sm"
          placeholder="Filter users..."
          value={
            (table.getColumn("username")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
        />
      </div>

      {/* Table — renders header groups and body rows using TanStack's FlexRender */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <table.FlexRender header={header} />
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
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // Empty state — shown when no rows match the current filter.
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={columns.length}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls — previous/next page buttons */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          disabled={!table.getCanPreviousPage()}
          size="sm"
          variant="outline"
          onClick={() => table.previousPage()}
        >
          Previous
        </Button>
        <Button
          disabled={!table.getCanNextPage()}
          size="sm"
          variant="outline"
          onClick={() => table.nextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
