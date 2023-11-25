import Modal from "../components/Modal";
import { useParams } from "react-router-dom";
import { getBooks } from "../features/booksSlice";
import { useAppSelector } from "../app/hooks";
import { BookVolume } from "../comman-types";
import { useGetVolumeQuery } from "../services/googleBooksServices";
import DefaultPic from "../assets/pp.jpg";

const BookPage = () => {
  const { id } = useParams();
  const books = useAppSelector(getBooks);

  // Find the selected book based on the id parameter
  const { data, isSuccess } = useGetVolumeQuery(id);

  let selectedBook = books.find((obj: BookVolume) => obj.id === id);
  if (isSuccess) {
    selectedBook = data;
  }

  if (!selectedBook) {
    console.log("no object");
  }

  const removeHtmlTags = (input: string) => {
    return input.replace(/<[^>]*>/g, "");
  };

  return (
    <Modal>
      {selectedBook && (
        <div className="flex flex-col items-center space-y-4 p-4">
          <img
            src={selectedBook.volumeInfo.imageLinks?.thumbnail || DefaultPic}
            alt="Book Thumbnail"
            className="rounded-md"
            height={250}
            width={250}
          />
          <h2 className="text-2xl font-semibold mb-4">
            Title: {selectedBook.volumeInfo.title}
          </h2>
          {selectedBook.volumeInfo.subtitle && (
            <p className="text-gray-600 mb-4">
              {selectedBook.volumeInfo.subtitle}
            </p>
          )}
          {selectedBook.saleInfo && (
            <div className="text-gray-700 space-y-2">
              <p>
                <span className="font-semibold">List Price:</span>{" "}
                {selectedBook.saleInfo.listPrice
                  ? `${selectedBook.saleInfo.listPrice.amount} ${selectedBook.saleInfo.listPrice.currencyCode}`
                  : "N/A"}
              </p>
              <p>
                <span className="font-semibold">Retail Price:</span>{" "}
                {selectedBook.saleInfo.retailPrice
                  ? `${selectedBook.saleInfo.retailPrice.amount} ${selectedBook.saleInfo.retailPrice.currencyCode}`
                  : "N/A"}
              </p>
            </div>
          )}
          <p className="text-gray-700">
            <span className="font-semibold">Authors:</span>{" "}
            {selectedBook.volumeInfo.authors?.join(" , ") || 'N/A'}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Publisher:</span>{" "}
            {selectedBook.volumeInfo.publisher || "N/A"}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Published Date:</span>{" "}
            {selectedBook.volumeInfo.publishedDate || "N/A"}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Description:</span>{" "}
            {removeHtmlTags(selectedBook.volumeInfo.description || "N/A")}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Page Count:</span>{" "}
            {selectedBook.volumeInfo.pageCount || "N/A"}
          </p>
        </div>
      )}
    </Modal>
  );
};

export default BookPage;
