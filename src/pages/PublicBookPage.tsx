import { useState, useEffect } from "react";
import { BookCategory } from "../comman-types";
import { useLocation } from "react-router-dom";
import Modal from "../components/Modal";
import BookComponentList from "../components/BookComponentList";
import Button from "../components/ui/button/Button";

import { MessageCircle, Send } from "lucide-react";
import {
  useAddBooklistReviewMutation,
  useGetALLBooklistsQuery,
} from "../services/booklistsServices";
import { useAppSelector } from "../app/hooks";
import { getCurrentToken } from "../features/authSlice";
import { toast } from "react-toastify";
import {
  getPublicBooklists,
  setPublicBookslist,
} from "../features/publicBooklistSlice";
import { useDispatch } from "react-redux";
import { getCurrentUserDetails } from "../features/userSlice";
import { useAdminHideReviewMutation } from "../services/adminServices";
import { motion, AnimatePresence } from "framer-motion";

const PublicBookPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const access_token = useAppSelector(getCurrentToken);
  const user = useAppSelector(getCurrentUserDetails);
  const booklists = useAppSelector(getPublicBooklists);
  const { from } = location.state;
  const initialBook: BookCategory = from;

  const [book, setBook] = useState<BookCategory | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const MAX_REVIEW_LENGTH = 500;

  const { data, isSuccess, refetch } = useGetALLBooklistsQuery(access_token);
  const [addBooklistReview] = useAddBooklistReviewMutation();
  const [adminHideReview] = useAdminHideReviewMutation();

  useEffect(() => {
    const updateBook = () => {
      const updatedBook =
        booklists.find((b) => b._id === initialBook._id) || initialBook;
      setBook(updatedBook);
    };

    updateBook();
    const intervalId = setInterval(updateBook, 1000);

    return () => clearInterval(intervalId);
  }, [initialBook, booklists]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(setPublicBookslist(data));
    }
  }, [isSuccess, data, dispatch]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleHideReview = async (reviewId: string) => {
    if (book) {
      await adminHideReview({
        booklist_id: book._id,
        review_id: reviewId,
        access_token,
      });
      await refetch();
      toast.success("Review visibility toggled");
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) {
      toast.error("Review text cannot be empty");
      return;
    }
    if (book) {
      await addBooklistReview({
        body: { booklist_id: book._id, reviewText },
        access_token,
      });
      setReviewText("");
      await refetch();
      toast.success("Review added successfully");
    }
  };

  const sortedReviews = book?.reviews?.filter(
    (review) => review.reviewText && (!review.isHidden || user.isAdmin),
  );

  if (!book) return null;

  return (
    <Modal title={book.name} description={`Created by ${book.authorName}`}>
      <div className="space-y-8">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Books in this list</h2>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {book.books.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No books added to this list yet
                </p>
              ) : (
                book.books.map((bookId) => (
                  <BookComponentList key={bookId} book_id={bookId} />
                ))
              )}
            </div>
          )}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <MessageCircle className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Reviews</h2>
            <span className="text-sm text-gray-500">
              ({sortedReviews?.length || 0})
            </span>
          </div>

          <div className="space-y-4 max-h-[32rem] overflow-y-auto mb-6 pr-2 custom-scrollbar">
            <AnimatePresence>
              {sortedReviews?.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <MessageCircle className="w-12 h-12 mx-auto text-gray-400" />
                  <p className="text-gray-500">
                    No reviews yet. Be the first to share your thoughts!
                  </p>
                </div>
              ) : (
                sortedReviews?.map((review) => (
                  <motion.div
                    key={review.reviewId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                        {review.reviewerName[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-800 dark:text-gray-200">
                            {review.reviewerName}
                          </span>
                          {user.isAdmin && (
                            <Button
                              variant={review.isHidden ? "outline" : "danger"}
                              size="sm"
                              onClick={() => handleHideReview(review.reviewId)}
                            >
                              {review.isHidden ? "Unhide" : "Hide"}
                            </Button>
                          )}
                        </div>
                        <p className="mt-2 text-gray-600 dark:text-gray-300 leading-relaxed">
                          {review.reviewText}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {access_token ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 relative"
            >
              <div className="flex flex-col gap-2">
                <textarea
                  placeholder="Share your thoughts about this book list..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  maxLength={MAX_REVIEW_LENGTH}
                  className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 resize-none min-h-[100px]"
                />
                <div className="flex items-center justify-between px-2">
                  <span className="text-sm text-gray-500">
                    {reviewText.length}/{MAX_REVIEW_LENGTH}
                  </span>
                  <Button
                    onClick={handleSubmitReview}
                    disabled={!reviewText.trim()}
                    className="flex items-center gap-2"
                  >
                    Post Review
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <MessageCircle className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">Please log in to add a review</p>
            </div>
          )}
        </motion.section>
      </div>
    </Modal>
  );
};

export default PublicBookPage;
