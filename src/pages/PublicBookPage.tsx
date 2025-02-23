import { useState, useEffect } from "react";
import { BookCategory } from "../comman-types";
import { useLocation } from "react-router-dom";
import Modal from "../components/Modal";
import BookComponent from "../components/BookComponent";
import Button from "../components/ui/button/Button";
import Input from "../components/ui/input/input.component";
import { Plus } from "lucide-react";
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

const PublicBookPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const access_token = useAppSelector(getCurrentToken);
  const user = useAppSelector(getCurrentUserDetails);
  const [inputValue, setInputValue] = useState("");
  const booklists = useAppSelector(getPublicBooklists);
  const { from } = location.state;
  const book2: BookCategory = from;

  const { data, isSuccess, refetch } = useGetALLBooklistsQuery(access_token);
  const [addBooklistReview, { isSuccess: ReviewAdded }] =
    useAddBooklistReviewMutation();
  const [adminHideReview, { isSuccess: ReviewHidden }] =
    useAdminHideReviewMutation();

  const handleHide = async (booklist_id: string, review_id: string) => {
    await adminHideReview({ booklist_id, review_id, access_token });
  };

  const handleSubmitReview = async (id: string) => {
    if (!inputValue.trim()) {
      toast.error("Review text cannot be empty");
      return;
    }
    await addBooklistReview({
      body: { booklist_id: id, reviewText: inputValue },
      access_token,
    });
  };

  const handleRefresh = async () => {
    await refetch();
    if (isSuccess) {
      dispatch(setPublicBookslist(data));
    }
  };

  const handleChange = async () => {
    try {
      if (ReviewAdded) {
        toast.success("Review Added");
        setInputValue("");
      }

      if (ReviewHidden) {
        toast.success("Review Toggled");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error as needed
    }
  };

  const [book, setBook] = useState<BookCategory | null>(null);

  // Set initial value
  useEffect(() => {
    const initialBook =
      booklists.find((booklist) => booklist._id === book2._id) || book2;
    setBook(initialBook);

    const intervalId = setInterval(() => {
      const updatedBook =
        booklists.find((booklist) => booklist._id === book2._id) || book2;
      setBook(updatedBook);
      handleRefresh();
    }, 1000);
    return () => clearInterval(intervalId);
  }, [book2, booklists]);

  useEffect(() => {
    handleChange();
    handleRefresh();
    const foundBook =
      booklists.find((booklist) => booklist._id === book2._id) || book2;
    setBook(foundBook);
  }, [ReviewAdded, ReviewHidden]);

  return (
    <Modal>
      <div className="flex flex-col w-full gap-6 p-6 overflow-auto text-gray-800 dark:text-gray-200">
        {/* Booklist Header */}
        <div className="p-6 rounded-lg shadow-lg bg-main-primary dark:bg-dark-primary">
          <h1 className="mb-2 text-2xl font-bold">{book?.name}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Created by {book?.authorName}
          </p>
        </div>

        {/* Books Grid */}
        <div className="p-6 rounded-lg shadow-lg bg-main-primary dark:bg-dark-primary">
          <h2 className="mb-4 text-xl font-bold">Books in this list</h2>
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
            {book?.books.map((book_id) => (
              <BookComponent key={book_id} book_id={book_id} />
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="p-6 rounded-lg shadow-lg bg-main-primary dark:bg-dark-primary">
          <h2 className="mb-6 text-xl font-bold">Reviews</h2>

          <div className="space-y-4">
            {/* Reviews List */}
            {book?.reviews
              ?.filter(
                (review) =>
                  review.reviewText && (!review.isHidden || user.isAdmin),
              )
              .map((review) => (
                <div
                  key={review.reviewId}
                  className="flex items-start gap-4 p-4 rounded-lg bg-main-secondary dark:bg-dark-secondary"
                >
                  <div className="flex-grow">
                    <p className="font-semibold">{review.reviewerName}</p>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                      {review.reviewText}
                    </p>
                    {user.isAdmin && (
                      <p className="mt-1 text-sm text-gray-500">
                        Status: {review.isHidden ? "Hidden" : "Visible"}
                      </p>
                    )}
                  </div>
                  {user.isAdmin && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleHide(book2._id, review.reviewId)}
                    >
                      {review.isHidden ? "Unhide" : "Hide"}
                    </Button>
                  )}
                </div>
              ))}
          </div>

          {/* Add Review Form */}
          {access_token && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">Add a Review</h3>
              <div className="flex gap-2">
                <Input
                  label=""
                  placeholder="Write your review..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-grow"
                />
                <Button
                  onClick={() => handleSubmitReview(book2._id)}
                  className="flex-shrink-0"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PublicBookPage;
