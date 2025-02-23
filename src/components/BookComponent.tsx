import React from "react";
import { useGetVolumeQuery } from "../services/googleBooksServices";
import { useNavigate } from "react-router-dom";
import { BookVolume } from "../comman-types";
import DefaultImage from "../assets/pp.jpg";
import Card from "./ui/card/card.component";
import { motion } from "framer-motion";
type BookID = {
  book_id: string;
};

const BookComponent: React.FC<BookID> = ({ book_id }) => {
  const { data, isSuccess } = useGetVolumeQuery(book_id);
  const navigate = useNavigate();

  if (!isSuccess || !data) {
    return null;
  }

  const book: BookVolume = data as BookVolume;

  function handleDivClick(id: string) {
    navigate(`/book/${id}`);
  }

  return (
    <div className="flex gap-2 flex-cols-[repeat(auto-fill,minmax(250px,fr))]">
      <Card
        className="w-[250px] h-[500px] relative bg-main-secondary dark:bg-dark-secondary rounded-md overflow-hidden hover:shadow-2xl transition-shadow ease-in delay-250 text-sm hover:shadow-black"
        key={book.id}
        onClick={() => handleDivClick(book.id)}
        image={{
          src: book.volumeInfo.imageLinks?.thumbnail || DefaultImage,
          alt: book.volumeInfo.title,
        }}
        variant="gradient"
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
    </div>
  );
};

export default BookComponent;
