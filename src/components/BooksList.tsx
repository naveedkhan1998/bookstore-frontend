import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { getBooks } from "../features/booksSlice";
import { BookVolume } from "../comman-types";
import DefaultImage from "../assets/pp.jpg";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, BookOpen } from "lucide-react";
import Card from "./ui/card/card.component";
import Pagination from "./ui/pagination/pagination.component";

const BOOKS_SCROLL_KEY = "booksListScrollPosition";

const BooksList = () => {
  const pageSize = 15;
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const books = useAppSelector(getBooks);

  // Get page from URL or default to 1
  const [currentPage, setCurrentPage] = useState(() => {
    return Number(searchParams.get("page")) || 1;
  });

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
    // Save scroll position before page change
    sessionStorage.setItem(BOOKS_SCROLL_KEY, "0");
    window.scrollTo(0, 0);
  };

  // Handle book navigation
  const handleBookClick = (id: string) => {
    // Save current scroll position and page
    const scrollPosition = window.scrollY;
    sessionStorage.setItem(BOOKS_SCROLL_KEY, scrollPosition.toString());

    // Navigate to book with state
    navigate(`/book/${id}`, {
      state: { from: location.pathname + location.search },
    });
  };

  // Restore scroll position on back navigation
  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem(BOOKS_SCROLL_KEY);
    if (savedScrollPosition) {
      window.scrollTo(0, parseInt(savedScrollPosition));
      sessionStorage.removeItem(BOOKS_SCROLL_KEY);
    }
  }, []);

  // Update URL when page changes
  useEffect(() => {
    const pageParam = searchParams.get("page");
    if (pageParam && Number(pageParam) !== currentPage) {
      setCurrentPage(Number(pageParam));
    }
  }, [searchParams]);

  // Pagination logic
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedBooks = books.slice(startIndex, endIndex);
  const totalPages = Math.ceil(books.length / pageSize);

  const renderBook = (book: BookVolume) => (
    <motion.div
      key={book.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        onClick={() => handleBookClick(book.id)}
        image={{
          src: book.volumeInfo.imageLinks?.thumbnail || DefaultImage,
          alt: book.volumeInfo.title,
        }}
      >
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-semibold line-clamp-1">
            {book.volumeInfo.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
            By {book.volumeInfo.authors?.join(", ") || "Unknown Author"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Published:{" "}
            {new Date(book.volumeInfo.publishedDate || "").getFullYear()}
          </p>
        </motion.div>
      </Card>
    </motion.div>
  );

  if (books.length === 0) {
    return (
      <motion.div
        className="flex items-center justify-center h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div className="flex flex-col items-center gap-4">
          <BookOpen className="w-16 h-16 text-primary" />
          <div className="flex items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-secondary" />
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Loading your library...
            </p>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <motion.div
        className="sticky top-0 z-10 py-4 bg-main-primary/80 dark:bg-dark-primary/80 backdrop-blur"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="container flex justify-center mx-auto">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            maxVisible={5}
          />
        </div>
      </motion.div>

      <div className="container mx-auto px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {paginatedBooks.map(renderBook)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BooksList;
