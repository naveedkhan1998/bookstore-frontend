import React from "react";
import { BookCategory } from "../comman-types";
import { useLocation } from "react-router-dom";
import Modal from "../components/Modal";
import BookComponent from "../components/BookComponent";

const PublicBookPage = () => {
  const location = useLocation();
  const { from } = location.state;
  const book: BookCategory = from;

  //console.log(from)

  return (
    <Modal>
      <>
        <div className="flex flex-col p-6 w-full overflow-auto text-gray-800 ">
          <div className="flex flex-col mb-4 w-full shadow-2xl p-6 rounded-2xl">
            <p className="text-lg font-bold mb-1">
              Booklist Name: {book?.name}
            </p>
            <p className="text-lg font-bold mb-1">
              Author Name: {book.authorName}
            </p>
          </div>
          <div className="grid grid-cols-[auto,fr] flex-grow-1  w-full items-center shadow-2xl p-6 rounded-2xl">
            <h1 className="text-xl font-bold mb-2">Books In the Booklist:</h1>
            <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
              {book?.books.map((book_id) => (
                <>
                  <BookComponent book_id={book_id} />
                </>
              ))}
            </div>
          </div>
        </div>
      </>
    </Modal>
  );
};

export default PublicBookPage;
