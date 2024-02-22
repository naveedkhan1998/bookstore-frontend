import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "../components/Modal";
import { useAppSelector } from "../app/hooks";
import { getUserBooklists } from "../features/booklistSlice";
import { useGetVolumeQuery } from "../services/googleBooksServices";
import { BookVolume } from "../comman-types";
import BookComponent from "../components/BookComponent";
import Button from "../components/Button";

const UserBooklistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const userBooklists = useAppSelector(getUserBooklists);
  const booklist = userBooklists.bookLists?.find((obj) => obj._id === id);

  const formatDateTime = (dateTimeString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    return new Date(dateTimeString).toLocaleString(undefined, options);
  };

  return (
    <Modal>
      <div className="flex flex-col p-6 w-full overflow-auto text-gray-800 ">
        <div className="flex flex-col mb-4 w-full shadow-2xl p-6 rounded-md border">
          <p className="text-lg font-bold mb-1">
            Booklist Name: {booklist?.name}
          </p>
          <p>Type: {booklist?.isPrivate ? "Private" : "Public"}</p>
          <p>Created At: {formatDateTime(booklist?.createdAt || "")}</p>
          <p>Last Update At: {formatDateTime(booklist?.updatedAt || "")}</p>
        </div>
        <div className="grid grid-cols-[auto,fr] flex-grow-1  w-full items-center shadow-2xl p-6 rounded-md border">
          <h1 className="text-xl font-bold mb-2">Books In the Booklist:</h1>
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
            {booklist?.books.map((book_id) => (
              <BookComponent book_id={book_id} />
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UserBooklistPage;
