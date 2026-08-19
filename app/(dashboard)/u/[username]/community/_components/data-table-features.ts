/**
 * @file app/(dashboard)/u/[username]/community/_components/data-table-features.ts
 * @description TanStack Table v9 feature registration for the Community Settings DataTable.
 *
 * Declares exactly which table features are used so that any unused features
 * can be tree-shaken from the production bundle. Both the `features` object
 * and its derived type {@link DataTableFeatures} must be threaded through all
 * TanStack Table generic parameters (`ColumnDef`, `Column`, `Table`, `Row`)
 * to ensure the type system reflects only the registered feature APIs.
 */

import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
} from "@tanstack/react-table";

/**
 * Registered TanStack Table v9 features for the blocked-users DataTable.
 *
 * New in v9: only features listed here are included in the bundle —
 * anything omitted is tree-shaken out. Registered features:
 * - `columnFilteringFeature`   — enables per-column text filtering.
 * - `columnVisibilityFeature`  — enables showing/hiding individual columns.
 * - `rowPaginationFeature`     — enables client-side pagination.
 * - `rowSelectionFeature`      — enables row selection (checkbox) support.
 * - `rowSortingFeature`        — enables column-based row sorting.
 * - `filteredRowModel`         — computes the filtered subset of rows.
 * - `paginatedRowModel`        — computes the current page of rows.
 * - `sortedRowModel`           — computes the sorted order of rows.
 * - `filterFns.includesString` — substring filter function used by column filters.
 * - `sortFns.alphanumeric`     — alphanumeric sort comparator.
 * - `sortFns.text`             — locale-aware text sort comparator.
 */
export const features = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
});

/**
 * Derived type of the registered feature set.
 *
 * Pass this as the first generic argument to `ColumnDef`, `Column`, `Table`,
 * and `Row` so each type knows exactly which feature APIs are available at
 * compile time.
 *
 * @example
 * // In column definitions:
 * const columnHelper = createColumnHelper<DataTableFeatures, BlockedUser>();
 *
 * // In the table component:
 * const table = useTable<DataTableFeatures>({ features, data, columns });
 */
export type DataTableFeatures = typeof features;
