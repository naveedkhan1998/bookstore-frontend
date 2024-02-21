import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookVolume } from "../comman-types";
import { getBooks } from "../features/booksSlice";
import { useAppSelector } from "../app/hooks";
import DefaultImage from "../assets/pp.jpg";
import { Card, Pagination, Spinner } from "flowbite-react";

const BooksList = () => {
  const pageSize = 15;
  const [currentPage, setCurrentPage] = useState(1);

  const dataFromStore = useAppSelector(getBooks);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = dataFromStore.slice(startIndex, endIndex);
  const totalPages = Math.ceil(dataFromStore.length / pageSize);

  const navigate = useNavigate();

  function handleDivClick(id: String) {
    navigate(`/book/${id}`);
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderBook = (book: BookVolume) => (
    <Card
      className="max-w-sm relative group bg-zinc-400 rounded-md overflow-hidden shadow-md mb-4 hover:shadow-2xl transition-shadow ease-in-out delay-250 text-sm"
      key={book.id}
      id={book.id}
      onClick={() => handleDivClick(book.id)}
      renderImage={() => (
        <img
          width={500}
          height={500}
          src={book.volumeInfo.imageLinks?.thumbnail || DefaultImage}
          alt={book.volumeInfo.title}
          className="w-full h-80 object-fill"
        />
      )}
    >
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Title: {book.volumeInfo.title}
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        Authors: {book.volumeInfo.authors}
      </p>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        Published: {book.volumeInfo.publishedDate}
      </p>
    </Card>
  );

  return (
    <div className="flex flex-col w-full ">
      {/* max-h-screen */}
      {paginatedData.length > 0 ? (
        <div className="">
          <div className="flex overflow-x-auto sm:justify-center p-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              showIcons
            />
          </div>

          <div className="grid grid-cols-[auto,fr] flex-grow-1 overflow-auto">
            <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
              {paginatedData.map(renderBook)}
            </div>
          </div>
          <div className="flex overflow-x-auto sm:justify-center p-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      ) : (
        <div className="text-center flex items-center justify-center">
          <Spinner aria-label="Center-aligned spinner example" size="xl" />
        </div>
      )}
    </div>
  );
};

export default BooksList;
