import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { getBooks } from "../features/booksSlice";
import { BookVolume } from "../comman-types";
import DefaultImage from "../assets/pp.jpg";

import { Loader2 } from "lucide-react";
import Card from "./ui/card/card.component";
import Pagination from "./ui/pagination/pagination.component";

const BooksList = () => {
  const pageSize = 15;
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const books = useAppSelector(getBooks);

  // Pagination logic
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedBooks = books.slice(startIndex, endIndex);
  const totalPages = Math.ceil(books.length / pageSize);

  const handleBookClick = (id: string) => {
    navigate(`/book/${id}`);
  };

  const renderBook = (book: BookVolume) => (
    <Card
      key={book.id}
      onClick={() => handleBookClick(book.id)}
      image={{
        src: book.volumeInfo.imageLinks?.thumbnail || DefaultImage,
        alt: book.volumeInfo.title,
      }}
    >
      <div className="space-y-2">
        <h3 className="font-semibold line-clamp-1">{book.volumeInfo.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
          By {book.volumeInfo.authors?.join(", ") || "Unknown Author"}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Published:{" "}
          {new Date(book.volumeInfo.publishedDate || "").getFullYear()}
        </p>
      </div>
    </Card>
  );

  if (books.length === 0) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-secondary" />
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Loading books...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Sticky Pagination Header */}
      <div className="sticky top-0 z-10 py-4 bg-main-primary/80 dark:bg-dark-primary/80 backdrop-blur">
        <div className="container flex justify-center mx-auto">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            maxVisible={5}
          />
        </div>
      </div>

      {/* Books Grid */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pt-6">
          {paginatedBooks.map(renderBook)}
        </div>
      </div>
    </div>
  );
};

export default BooksList;
