import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { BookMarked, Lock, Globe } from "lucide-react";
import Modal from "../components/Modal";
import { useAppSelector } from "../app/hooks";
import { getUserBooklists } from "../features/booklistSlice";
import BookComponent from "../components/BookComponent";
import PageContent from "../layouts/PageContent";
import { EmptyState, Grid } from "../layouts/ContentComponents";

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
        <EmptyState title="Booklist not found" />
      </Modal>
    );
  }

  return (
    <Modal>
      <PageContent
        title={booklist.name}
        subtitle={`Created: ${formatDateTime(booklist.createdAt)} • Updated: ${formatDateTime(booklist.updatedAt)}`}
        icon={BookMarked}
        headerActions={
          <span className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300">
            {booklist.isPrivate ? (
              <Lock className="w-4 h-4" />
            ) : (
              <Globe className="w-4 h-4" />
            )}
            {booklist.isPrivate ? "Private" : "Public"}
          </span>
        }
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">
            Books ({booklist.books.length})
          </h3>
          <select
            className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "dateAdded" | "title")}
          >
            <option value="dateAdded">Sort by Date Added</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>

        {booklist.books.length === 0 ? (
          <EmptyState
            title="No books in this list yet"
            description="Start adding books to build your collection"
          />
        ) : (
          <Grid cols={{ default: 1, sm: 2, md: 3, lg: 4, xl: 5 }}>
            {booklist.books.map((book_id) => (
              <BookComponent key={book_id} book_id={book_id} />
            ))}
          </Grid>
        )}
      </PageContent>
    </Modal>
  );
};

export default UserBooklistPage;
