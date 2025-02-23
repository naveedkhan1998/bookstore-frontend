import React from "react";
import { useGetVolumeQuery } from "../services/googleBooksServices";
import { useNavigate } from "react-router-dom";
import { BookVolume } from "../comman-types";
import DefaultImage from "../assets/pp.jpg";
import { motion } from "framer-motion";

type BookID = {
  book_id: string;
};

const BookComponentList: React.FC<BookID> = ({ book_id }) => {
  const { data, isSuccess } = useGetVolumeQuery(book_id);
  const navigate = useNavigate();

  if (!isSuccess || !data) {
    return null;
  }

  const book: BookVolume = data as BookVolume;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => navigate(`/book/${book.id}`)}
      className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
    >
      <img
        src={book.volumeInfo.imageLinks?.thumbnail || DefaultImage}
        alt={book.volumeInfo.title}
        className="w-24 h-36 object-cover rounded-md shadow-sm"
      />
      <div className="flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {book.volumeInfo.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            By {book.volumeInfo.authors?.join(", ") || "Unknown Author"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {book.volumeInfo.description || "No description available"}
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span>
            {book.volumeInfo.publishedDate
              ? new Date(book.volumeInfo.publishedDate).getFullYear()
              : "Unknown year"}
          </span>
          {book.volumeInfo.pageCount && (
            <span>{book.volumeInfo.pageCount} pages</span>
          )}
          {book.volumeInfo.categories && (
            <span>{book.volumeInfo.categories[0]}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BookComponentList;
