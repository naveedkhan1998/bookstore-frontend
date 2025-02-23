import { ChevronLeft, ChevronRight } from "lucide-react";
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
        "px-3 py-2 rounded-lg text-sm font-medium relative",
        "transition-colors duration-200",
        active
          ? "text-white"
          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={false}
      aria-current={active ? "page" : undefined}
    >
      {active && (
        <motion.div
          layoutId="activePageBackground"
          className="absolute inset-0 bg-secondary rounded-lg"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <span className="relative z-10">{page}</span>
    </motion.button>
  );

  const NavigationButton = ({
    direction,
    onClick,
    disabled,
  }: {
    direction: "left" | "right";
    onClick: () => void;
    disabled: boolean;
  }) => (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      whileHover={disabled ? {} : { scale: 1.1 }}
      whileTap={disabled ? {} : { scale: 0.9 }}
      aria-label={direction === "left" ? "Previous page" : "Next page"}
    >
      {direction === "left" ? (
        <ChevronLeft className="w-5 h-5" />
      ) : (
        <ChevronRight className="w-5 h-5" />
      )}
    </motion.button>
  );

  const Ellipsis = () => (
    <motion.span
      className="px-2 text-gray-400"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      ...
    </motion.span>
  );

  return (
    <motion.nav
      className={twMerge(
        "flex items-center gap-1 bg-main-primary dark:bg-dark-primary p-2 rounded-lg",
        className,
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      aria-label="Pagination"
    >
      <NavigationButton
        direction="left"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          className="flex items-center"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.2 }}
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

      <NavigationButton
        direction="right"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    </motion.nav>
  );
};

export default Pagination;
