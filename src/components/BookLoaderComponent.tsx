import React from "react";
import { useGetVolumeQuery } from "../services/googleBooksServices";
import { useAppDispatch } from "../app/hooks";
import { addBook } from "../features/loadBookSlice";

type BookID = {
  book_id: string;
};

const BookLoaderComponent: React.FC<BookID> = ({ book_id }) => {
  const { data, isSuccess } = useGetVolumeQuery(book_id);
  const dispatch = useAppDispatch();

  if (isSuccess) {
    dispatch(addBook(data));
  }

  return <></>;
};

export default BookLoaderComponent;
