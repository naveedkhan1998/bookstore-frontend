import Modal from "../components/Modal";
import { useParams } from "react-router-dom";
import { getElixirs } from "../features/elixirSlice";
import { getBooks } from "../features/booksSlice";
import { useAppSelector } from "../app/hooks";
import { BookVolume } from "../comman-types";
import { useGetVolumeQuery } from "../services/googleBooksServices";

const renderValue = (value: any) => {
  if (typeof value === "object" && value !== null) {
    return (
      <ul className="px-4 flex flex-col items-center justify-center">
        {Object.entries(value).map(
          ([subKey, subValue]) =>
            subKey !== "id" && (
              <li key={subKey}>
                <strong>{subKey}:</strong>
                <span className=" text-ellipsis overflow-hidden ... ">
                  {subKey}:
                </span>
                {renderValue(subValue)}
              </li>
            )
        )}
      </ul>
    );
  }

  return String(value);
};

const BookPage = () => {
  const { id } = useParams();
  const books = useAppSelector(getBooks);

  // Find the selected elixir based on the id parameter
  const { data, isSuccess } = useGetVolumeQuery(id);

  let selectedBook = books.find((obj: BookVolume) => obj.id === id);
  if (isSuccess) {
    selectedBook = data;
  }

  if (!selectedBook) {
    console.log("no object");
  }

  return (
    <Modal>
      {selectedBook && (
        <div>
          <ul className="px-4 flex flex-col items-center justify-center">
            {Object.entries(selectedBook).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {renderValue(value)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Modal>
  );
};

export default BookPage;
