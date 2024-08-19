import React from "react";
import { useGetVolumeQuery } from "../services/googleBooksServices";
import { useNavigate } from "react-router-dom";
import { BookVolume } from "../comman-types";
import DefaultImage from "../assets/pp.jpg";
import { Card } from "flowbite-react";

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
        id={book.id}
        onClick={() => handleDivClick(book.id)}
        renderImage={() => <img height={250} width={250} src={book.volumeInfo.imageLinks?.thumbnail || DefaultImage} alt={book.volumeInfo.title} className="w-full h-[250px] object-fill" />}
      >
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-slate-400">
          Title: {book.volumeInfo.title.length > 20 ? `${book.volumeInfo.title.substring(0, 20)}...` : book.volumeInfo.title}
        </h5>
        <p className="font-normal text-gray-700 dark:text-slate-400">Authors: {book.volumeInfo.authors}</p>
        <p className="font-normal text-gray-700 dark:text-slate-400">Published: {book.volumeInfo.publishedDate}</p>
      </Card>
    </div>
  );
};

export default BookComponent;
