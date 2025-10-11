import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "framer-motion";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  maxVisible?: number;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
  maxVisible = 5,
}: PaginationProps) => {
  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  const PageButton = ({
    page,
    active = false,
  }: {
    page: number;
    active?: boolean;
  }) => (
    <motion.button
      onClick={() => onPageChange(page)}
      className={twMerge(
        "relative px-3 py-1.5 rounded-lg text-sm font-semibold",
        "transition-all duration-300 min-w-[36px]",
        active
          ? "text-white shadow-lg scale-105"
          : "text-gray-700 dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary hover:bg-gray-100 dark:hover:bg-gray-800/50",
      )}
      whileHover={active ? {} : { scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      initial={false}
      aria-current={active ? "page" : undefined}
    >
      {active && (
        <motion.div
          layoutId="activePageBackground"
          className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-lg"
          initial={false}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <span className="relative z-10">{page}</span>
    </motion.button>
  );

  const NavigationButton = ({
    direction,
    onClick,
    disabled,
    isJump = false,
  }: {
    direction: "left" | "right";
    onClick: () => void;
    disabled: boolean;
    isJump?: boolean;
  }) => (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={twMerge(
        "p-1.5 rounded-lg transition-all duration-200",
        "text-gray-700 dark:text-gray-300",
        disabled
          ? "opacity-40 cursor-not-allowed"
          : "hover:bg-gradient-to-r hover:from-brand-primary hover:to-brand-secondary hover:text-white hover:shadow-md",
        isJump && "border border-gray-300 dark:border-gray-700",
      )}
      whileHover={disabled ? {} : { scale: 1.08, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.92 }}
      aria-label={
        isJump
          ? direction === "left"
            ? "First page"
            : "Last page"
          : direction === "left"
            ? "Previous page"
            : "Next page"
      }
    >
      {direction === "left" ? (
        isJump ? (
          <ChevronsLeft className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )
      ) : isJump ? (
        <ChevronsRight className="w-4 h-4" />
      ) : (
        <ChevronRight className="w-4 h-4" />
      )}
    </motion.button>
  );

  const Ellipsis = () => (
    <motion.span
      className="px-1.5 text-gray-500 dark:text-gray-500 font-bold select-none"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
    >
      •••
    </motion.span>
  );

  return (
    <motion.nav
      className={twMerge(
        "flex items-center gap-1.5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-2 rounded-xl border border-gray-200 dark:border-gray-800 shadow-md",
        className,
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      aria-label="Pagination"
    >
      {/* First page button */}
      <NavigationButton
        direction="left"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        isJump
      />

      {/* Previous page button */}
      <NavigationButton
        direction="left"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />

      {/* Divider */}
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-0.5" />

      <AnimatePresence mode="popLayout">
        <motion.div
          key={`page-${currentPage}`}
          className="flex items-center gap-0.5"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.25 }}
        >
          {pageNumbers[0] > 1 && (
            <>
              <PageButton page={1} />
              {pageNumbers[0] > 2 && <Ellipsis />}
            </>
          )}

          {pageNumbers.map((page) => (
            <PageButton key={page} page={page} active={page === currentPage} />
          ))}

          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <Ellipsis />
              )}
              <PageButton page={totalPages} />
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-0.5" />

      {/* Next page button */}
      <NavigationButton
        direction="right"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />

      {/* Last page button */}
      <NavigationButton
        direction="right"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        isJump
      />

      {/* Page info */}
      <div className="ml-1.5 pl-2 border-l border-gray-300 dark:border-gray-700">
        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          Page{" "}
          <span className="text-brand-primary font-bold">{currentPage}</span> of{" "}
          <span className="text-gray-900 dark:text-gray-100 font-bold">
            {totalPages}
          </span>
        </span>
      </div>
    </motion.nav>
  );
};

export default Pagination;
