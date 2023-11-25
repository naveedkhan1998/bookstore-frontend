import React, { useState } from "react";
import { useGetVolumesQuery } from "../services/googleBooksServices";
import { useNavigate } from "react-router-dom";
import { BookVolume } from "../comman-types";
import Button from "./Button";
import { MoveLeftIcon, MoveRightIcon } from "lucide-react";
import { getBooks } from "../features/booksSlice";
import { useAppSelector } from "../app/hooks";
import DefaultImage from "../assets/pp.jpg";

const BooksList = () => {
  //const { data, isSuccess, refetch } = useGetVolumesQuery("all");
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
    //console.log("hello ", id);
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPageButtons = () => {
    const maxVisiblePages = 3;
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index
    ).map((page) => (
      <Button
        key={page}
        size={"icon"}
        variant={"default"}
        onClick={() => handlePageChange(page)}
        className={`mx-1 my-1 p-2 ${
          page === currentPage ? " text-slate-600" : "bg-gray-200 text-black"
        } sm:mx-2 sm:my-0`}
      >
        {page}
      </Button>
    ));
  };

  const renderBook = (book: BookVolume) => (
    <div className="flex flex-col gap-2">
      <div
        key={book.id}
        id={book.id}
        onClick={() => handleDivClick(book.id)}
        className="relative group bg-zinc-400 rounded-lg overflow-hidden shadow-md mb-4 transition-transform duration-300 ease-in-out transform hover:shadow-lg"
      >
        <div className="relative">
          <img
            src={book.volumeInfo.imageLinks?.thumbnail || DefaultImage}
            alt={book.volumeInfo.title}
            className="rounded-xl w-full h-80 object-fill"
          />
          <div className="absolute bottom-0 flex flex-col justify-center px-2 py-2 items-left w-full bg-zinc-400 bg-opacity-70 rounded-t-xl opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
            <h2 className="text-black text-lg font-semibold mb-2 z-10">
              Title: {book.volumeInfo.title}
            </h2>
            <p className="text-black mb-2">
              <span className="font-semibold">Authors:</span>{" "}
              {book.volumeInfo.authors}
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

  return (
    <div className="flex flex-col w-full ">{/* max-h-screen */}
      {paginatedData.length > 0 ? (
        <>
          <div className="flex gap-10 lg:gap-20 bg-zinc-400 justify-between p-2  mx-4 mt-4 mb-4 shadow-2xl rounded-full ">
            <Button
              size={"icon"}
              variant={"ghost"}
              onClick={() => handlePageChange(currentPage - 1)}
              className={`mx-1 my-1 p-2 ${
                currentPage === 1 ? "hidden" : " text-slate-600"
              } sm:mx-2 sm:my-0`}
              disabled={currentPage === 1}
            >
              <MoveLeftIcon />
            </Button>
            {renderPageButtons()}
            <Button
              size={"icon"}
              variant={"ghost"}
              onClick={() => handlePageChange(currentPage + 1)}
              className={`mx-1 my-1 p-2 ${
                currentPage === totalPages ? "hidden" : " text-slate-600"
              } sm:mx-2 sm:my-0`}
              disabled={currentPage === totalPages}
            >
              <MoveRightIcon />
            </Button>
          </div>
          <div className="grid grid-cols-[auto,fr] flex-grow-1 overflow-auto">
            <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
              {paginatedData.map(renderBook)}
            </div>
          </div>
        </>
      ) : (
        <div>Search Books!!</div>
      )}
    </div>
  );
};

export default BooksList;
