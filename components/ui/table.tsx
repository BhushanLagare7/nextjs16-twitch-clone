/**
 * @file components/ui/table.tsx
 * @description Unstyled, accessible HTML table primitive components built on
 * native `<table>` elements with Tailwind CSS utility classes applied.
 *
 * Each component forwards all standard HTML props to its underlying element
 * and accepts an optional `className` prop for style overrides. A `data-slot`
 * attribute is added to each element to enable targeted CSS selection when
 * composing more complex table layouts.
 *
 * Exported components:
 * - {@link Table}        — Root scrollable table wrapper.
 * - {@link TableHeader}  — `<thead>` with a bottom border on each row.
 * - {@link TableBody}    — `<tbody>` that removes the border from its last row.
 * - {@link TableFooter}  — `<tfoot>` with a muted background and top border.
 * - {@link TableRow}     — `<tr>` with hover and selected-state highlighting.
 * - {@link TableHead}    — `<th>` with consistent height, padding, and alignment.
 * - {@link TableCell}    — `<td>` with consistent padding and vertical alignment.
 * - {@link TableCaption} — `<caption>` styled as muted helper text below the table.
 */

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Table component - Scrollable root table wrapper.
 *
 * Wraps a native `<table>` in a horizontally-scrollable `<div>` container
 * so the table remains usable on narrow viewports. Applies `caption-bottom`
 * so any `<caption>` is positioned below the table body.
 *
 * @param {React.ComponentProps<"table">} props - All standard `<table>` HTML attributes.
 * @returns {JSX.Element} A scrollable table container.
 */
function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      className="relative w-full overflow-x-auto"
      data-slot="table-container"
    >
      <table
        className={cn("w-full caption-bottom text-sm", className)}
        data-slot="table"
        {...props}
      />
    </div>
  );
}

/**
 * TableHeader component - Styled `<thead>` element.
 *
 * Applies a bottom border to every `<tr>` inside the header via a Tailwind
 * group selector (`[&_tr]:border-b`).
 *
 * @param {React.ComponentProps<"thead">} props - All standard `<thead>` HTML attributes.
 * @returns {JSX.Element} A styled table header section.
 */
function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      className={cn("[&_tr]:border-b", className)}
      data-slot="table-header"
      {...props}
    />
  );
}

/**
 * TableBody component - Styled `<tbody>` element.
 *
 * Removes the bottom border from the last `<tr>` inside the body to avoid a
 * double-border with any surrounding container.
 *
 * @param {React.ComponentProps<"tbody">} props - All standard `<tbody>` HTML attributes.
 * @returns {JSX.Element} A styled table body section.
 */
function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      className={cn("[&_tr:last-child]:border-0", className)}
      data-slot="table-body"
      {...props}
    />
  );
}

/**
 * TableFooter component - Styled `<tfoot>` element.
 *
 * Renders with a muted background, a top border, and medium font weight.
 * Removes the bottom border from the last `<tr>` inside the footer.
 *
 * @param {React.ComponentProps<"tfoot">} props - All standard `<tfoot>` HTML attributes.
 * @returns {JSX.Element} A styled table footer section.
 */
function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      className={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className,
      )}
      data-slot="table-footer"
      {...props}
    />
  );
}

/**
 * TableRow component - Styled `<tr>` element.
 *
 * Applies a bottom border, a subtle hover background (`bg-muted/50`), and a
 * selected-state background when `data-state="selected"` is present (set by
 * TanStack Table's `row.getIsSelected()` helper).
 *
 * @param {React.ComponentProps<"tr">} props - All standard `<tr>` HTML attributes.
 * @returns {JSX.Element} A styled table row.
 */
function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      className={cn(
        "border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted",
        className,
      )}
      data-slot="table-row"
      {...props}
    />
  );
}

/**
 * TableHead component - Styled `<th>` element.
 *
 * Renders with a fixed height, horizontal padding, left-aligned text, and
 * medium font weight. Removes right padding when the cell contains a checkbox
 * (`has-[[role=checkbox]]:pr-0`). Prevents text from wrapping (`whitespace-nowrap`).
 *
 * @param {React.ComponentProps<"th">} props - All standard `<th>` HTML attributes.
 * @returns {JSX.Element} A styled table header cell.
 */
function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground has-[[role=checkbox]]:pr-0",
        className,
      )}
      data-slot="table-head"
      {...props}
    />
  );
}

/**
 * TableCell component - Styled `<td>` element.
 *
 * Applies consistent padding, middle vertical alignment, and `whitespace-nowrap`
 * to keep cell content on a single line. Removes right padding when the cell
 * contains a checkbox (`has-[[role=checkbox]]:pr-0`).
 *
 * @param {React.ComponentProps<"td">} props - All standard `<td>` HTML attributes.
 * @returns {JSX.Element} A styled table data cell.
 */
function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      className={cn(
        "p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0",
        className,
      )}
      data-slot="table-cell"
      {...props}
    />
  );
}

/**
 * TableCaption component - Styled `<caption>` element.
 *
 * Renders below the table body (governed by `caption-bottom` on {@link Table})
 * with small muted text, typically used for descriptive or accessibility notes.
 *
 * @param {React.ComponentProps<"caption">} props - All standard `<caption>` HTML attributes.
 * @returns {JSX.Element} A styled table caption.
 */
function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      data-slot="table-caption"
      {...props}
    />
  );
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
