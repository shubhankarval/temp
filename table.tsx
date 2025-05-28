// PaginationControls.tsx
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationLink,
} from "@/components/ui/pagination";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) => {
  const pageNumbers = getVisiblePages(currentPage, totalPages);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          />
        </PaginationItem>

        {pageNumbers[0] > 1 && (
          <>
            <PaginationItem>
              <PaginationLink href="#" onClick={() => onPageChange(1)}>
                1
              </PaginationLink>
            </PaginationItem>
            {pageNumbers[0] > 2 && <PaginationEllipsis />}
          </>
        )}

        {pageNumbers.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              isActive={page === currentPage}
              onClick={() => onPageChange(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {pageNumbers.at(-1)! < totalPages && (
          <>
            {pageNumbers.at(-1)! < totalPages - 1 && <PaginationEllipsis />}
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={() => onPageChange(totalPages)}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

const getVisiblePages = (current: number, total: number): number[] => {
  if (total <= 3) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 2) return [1, 2, 3];
  if (current >= total - 1) return [total - 2, total - 1, total];
  return [current - 1, current, current + 1];
};

// RelationTable.tsx
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaginationControls } from "./PaginationControls";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface RelationRow {
  relation: string;
  src: string;
  target: string;
}

interface RelationTableProps {
  data: RelationRow[];
}

export const RelationTable = ({ data }: RelationTableProps) => {
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;

  const table = useReactTable({
    data,
    columns,
    state: { pagination: { pageIndex, pageSize } },
    onPaginationChange: (updater) => {
      const newState = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
      setPageIndex(newState.pageIndex);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
    pageCount: Math.ceil(data.length / pageSize),
  });

  return (
    <div className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row, idx) => (
            <TableRow
              key={row.id}
              className={cn(idx % 2 === 0 ? "bg-muted/50" : "")}
              onClick={() => console.log("Open side sheet for row")}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PaginationControls
        currentPage={pageIndex + 1}
        totalPages={table.getPageCount()}
        onPageChange={(newPage) => setPageIndex(newPage - 1)}
      />
    </div>
  );
};

const columns: ColumnDef<RelationRow>[] = [
  {
    accessorKey: "relation",
    header: "Relation",
    cell: ({ getValue }) => (
      <span
        className={cn(
          "font-semibold",
          getValue() === "parent" && "text-green-600",
          getValue() === "child" && "text-blue-600",
          getValue() === "peer" && "text-orange-600"
        )}
      >
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "desc",
    header: "Description",
    cell: ({ row }) => {
      const src = row.original.src;
      const target = row.original.target;
      const relation = row.original.relation;
      return `${src} is ${relation} of ${target}`;
    },
  },
  {
    accessorKey: "src",
    header: "Source",
  },
  {
    accessorKey: "target",
    header: "Target",
  },
];
