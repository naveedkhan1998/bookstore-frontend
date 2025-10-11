import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { getBooks } from "../features/booksSlice";
import { BookVolume } from "../comman-types";
import DefaultImage from "../assets/pp.jpg";
import { motion, AnimatePresence } from "framer-motion";
import { Library } from "lucide-react";
import Card from "../components/ui/card/card.component";
import Pagination from "../components/ui/pagination/pagination.component";
import PageContent from "../layouts/PageContent";
import { LoadingState } from "../layouts/ContentComponents";

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
      <PageContent 
        title="Book Library" 
        subtitle="Discover your next favorite read"
        icon={Library}
      >
        <LoadingState message="Loading your library..." />
      </PageContent>
    );
  }

  return (
    <PageContent 
      title="Book Library" 
      subtitle={`${books.length} books available`}
      icon={Library}
      noPadding
    >
      <div className="min-h-screen">
        <motion.div
          className="sticky top-0 z-10 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-700"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="container flex justify-center mx-auto px-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              maxVisible={5}
            />
          </div>
        </motion.div>

        <div className="container mx-auto px-4 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {paginatedBooks.map(renderBook)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </PageContent>
  );
};

export default BooksList;
