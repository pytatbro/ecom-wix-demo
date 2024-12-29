"use client";

import { useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { cn } from "@/lib/utils";

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
}

export default function PaginationBar({
  currentPage,
  totalPages,
}: PaginationBarProps) {
  const searchParams = useSearchParams();

  function getUrlOfPage(page: number) {
    const temp = new URLSearchParams(searchParams);
    temp.set("page", page.toString());
    return `?${temp.toString()}`;
  }

  if (totalPages <= 1) return null;
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={getUrlOfPage(currentPage - 1)}
            className={cn(
              currentPage === 1 && "pointer-events-none text-muted-foreground",
            )}
          />
        </PaginationItem>
        {Array.from({ length: totalPages }).map((_, i) => {
          const pageNumber = i + 1;
          const isStartOrEndPage =
            pageNumber === 1 || pageNumber === totalPages;
          const isNearCurrentPage = Math.abs(pageNumber - currentPage) <= 2;
          if (!isStartOrEndPage && !isNearCurrentPage) {
            if (pageNumber === 2 || pageNumber === totalPages - 1) {
              return (
                <PaginationItem key={pageNumber} className="hidden md:block">
                  <PaginationEllipsis />
                </PaginationItem>
              );
            } else {
              return null;
            }
          }
          return (
            <PaginationItem
              key={pageNumber}
              className={cn(
                "hidden md:block",
                pageNumber === currentPage && "pointer-events-none block",
              )}
            >
              <PaginationLink
                href={getUrlOfPage(pageNumber)}
                isActive={pageNumber === currentPage}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext
            href={getUrlOfPage(currentPage + 1)}
            className={cn(
              currentPage >= totalPages &&
                "pointer-events-none text-muted-foreground",
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
