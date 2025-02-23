import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "../components/Modal";
import { useAppSelector } from "../app/hooks";
import { getUserBooklists } from "../features/booklistSlice";
import BookComponent from "../components/BookComponent";
import { FaLock, FaGlobe, FaCalendar, FaClock } from "react-icons/fa";

const UserBooklistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const userBooklists = useAppSelector(getUserBooklists);
  const booklist = userBooklists.bookLists?.find((obj) => obj._id === id);
  const [sortBy, setSortBy] = useState<"dateAdded" | "title">("dateAdded");

  const formatDateTime = (dateTimeString: string): string => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(dateTimeString));
  };

  if (!booklist) {
    return (
      <Modal>
        <div className="flex items-center justify-center h-full">
          <p className="text-xl text-gray-600">Booklist not found</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal>
      <div className="flex flex-col h-full max-w-7xl mx-auto p-6 gap-6">
        {/* Header Section */}
        <header className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">
              {booklist.name}
            </h1>
            <span className="flex items-center gap-2 text-gray-600">
              {booklist.isPrivate ? <FaLock /> : <FaGlobe />}
              {booklist.isPrivate ? "Private" : "Public"}
            </span>
          </div>
          <div className="mt-4 flex gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <FaCalendar /> Created: {formatDateTime(booklist.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <FaClock /> Updated: {formatDateTime(booklist.updatedAt)}
            </span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Books ({booklist.books.length})
            </h2>
            <select
              className="px-4 py-2 border rounded-md"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "dateAdded" | "title")
              }
            >
              <option value="dateAdded">Sort by Date Added</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>

          {booklist.books.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <p className="text-lg">No books in this list yet</p>
              <p className="mt-2">
                Start adding books to build your collection
              </p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
              {booklist.books.map((book_id) => (
                <BookComponent key={book_id} book_id={book_id} />
              ))}
            </div>
          )}
        </main>
      </div>
    </Modal>
  );
};

export default UserBooklistPage;
