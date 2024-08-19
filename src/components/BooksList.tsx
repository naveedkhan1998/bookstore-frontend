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
      className="relative max-w-sm overflow-hidden text-sm transition-shadow ease-in rounded-md bg-main-secondary dark:bg-dark-secondary hover:shadow-2xl delay-250 hover:shadow-black hover"
      key={book.id}
      id={book.id}
      onClick={() => handleDivClick(book.id)}
      renderImage={() => <img height={250} width={250} src={book.volumeInfo.imageLinks?.thumbnail || DefaultImage} alt={book.volumeInfo.title} className="object-fill w-full h-80" />}
    >
      <h5 className="text-2xl font-bold tracking-tight ">Title: {book.volumeInfo.title.length > 20 ? `${book.volumeInfo.title.substring(0, 20)}...` : book.volumeInfo.title}</h5>
      <p className="font-normal ">Authors: {book.volumeInfo.authors}</p>
      <p className="font-normal ">Published: {book.volumeInfo.publishedDate}</p>
    </Card>
  );

  return (
    <div className="flex flex-col w-full pb-6 ">
      {/* max-h-screen */}
      {paginatedData.length > 0 ? (
        <>
          <div className="sticky top-0 z-10 flex justify-center pt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              showIcons
              className="text-main-text dark:text-dark-text"
              theme={{
                pages: {
                  base: "xs:mt-0 mt-2 inline-flex items-center -space-x-px",
                  showIcon: "inline-flex",
                  previous: {
                    base: "ml-0 rounded-l-lg border border-gray-300 bg-main-secondary px-3 py-2 leading-tight text-main-text enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-dark-secondary dark:text-dark-text enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
                    icon: "h-5 w-5",
                  },
                  next: {
                    base: "rounded-r-lg border border-gray-300 bg-main-secondary px-3 py-2 leading-tight text-main-text enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-dark-secondary dark:text-dark-text enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
                    icon: "h-5 w-5",
                  },
                  selector: {
                    base: "w-12 border border-gray-300 bg-main-secondary py-2 leading-tight text-main-text enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-dark-secondary dark:text-dark-text enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
                    active: "bg-cyan-50 text-cyan-600 hover:bg-cyan-100 hover:text-cyan-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white",
                    disabled: "cursor-not-allowed opacity-50",
                  },
                },
              }}
            />
          </div>

          <div className="grid grid-cols-[auto,fr] flex-grow-1 overflow-auto p-12 ">
            <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(275px,1fr))]">{paginatedData.map(renderBook)}</div>
          </div>
        </>
      ) : (
        <div className="text-center flex items-center justify-center h-[90dvh]">
          <Spinner aria-label="Center-aligned spinner example" size="xl" />
        </div>
      )}
    </div>
  );
};

export default BooksList;
