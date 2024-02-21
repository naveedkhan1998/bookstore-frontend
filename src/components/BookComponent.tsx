import React from "react";
import { useGetVolumeQuery } from "../services/googleBooksServices";
import { useNavigate } from "react-router-dom";
import { BookVolume } from "../comman-types";
import DefaultImage from "../assets/pp.jpg";

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
    <div className="flex flex-col gap-2">
      <div
        key={book.id}
        id={book.id}
        onClick={() => handleDivClick(book.id)}
        className="relative group bg-main-secondary dark:bg-dark-secondary rounded-lg overflow-hidden shadow-md mb-4 transition-transform duration-300 ease-in-out transform hover:shadow-lg"
      >
        <div className="relative">
          <img
            src={book.volumeInfo.imageLinks?.thumbnail || DefaultImage}
            alt={book.volumeInfo.title}
            className="rounded-xl w-full h-80 object-fill"
          />
          <div className="absolute bottom-0 flex flex-col justify-center px-2 py-2 items-left w-full bg-main-secondary dark:bg-dark-secondary bg-opacity-70 rounded-t-xl opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
            <h2 className="text-black text-lg font-semibold mb-2 z-10">
              Title: {book.volumeInfo.title}
            </h2>
            <p className="text-black mb-2">
              <span className="font-semibold">Authors:</span>{" "}
              {book.volumeInfo.authors?.join(", ")}
            </p>
            <p className="text-black">
              <span className="font-semibold">Publication Date:</span>{" "}
              {book.volumeInfo.publishedDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookComponent;
