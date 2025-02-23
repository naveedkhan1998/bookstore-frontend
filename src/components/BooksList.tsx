import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { getBooks } from "../features/booksSlice";
import { BookVolume } from "../comman-types";
import DefaultImage from "../assets/pp.jpg";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, BookOpen } from "lucide-react";
import Card from "./ui/card/card.component";
import Pagination from "./ui/pagination/pagination.component";

const BooksList = () => {
  const pageSize = 15;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const navigate = useNavigate();
  const books = useAppSelector(getBooks);

  // Pagination logic
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedBooks = books.slice(startIndex, endIndex);
  const totalPages = Math.ceil(books.length / pageSize);

  const handleBookClick = (id: string) => {
    setSelectedId(id);
    setTimeout(() => {
      navigate(`/book/${id}`);
    }, 300);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const renderBook = (book: BookVolume) => (
    <motion.div
      key={book.id}
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <Card
        onClick={() => handleBookClick(book.id)}
        className={`transform transition-all duration-300 ${
          selectedId === book.id ? "scale-95 opacity-80" : ""
        }`}
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
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="flex flex-col items-center gap-4"
          animate={{
            y: [0, -10, 0],
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
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
        transition={{ delay: 0.2 }}
      >
        <div className="container flex justify-center mx-auto">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            maxVisible={5}
          />
        </div>
      </motion.div>

      <div className="container mx-auto px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: 20 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pt-6"
          >
            {paginatedBooks.map(renderBook)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BooksList;
