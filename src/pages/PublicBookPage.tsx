import { useState, useEffect } from "react";
import { BookCategory } from "../comman-types";
import { useLocation } from "react-router-dom";
import Modal from "../components/Modal";
import BookComponent from "../components/BookComponent";

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
import { Button, FloatingLabel } from "flowbite-react";

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

  const handleClick = async (id: string) => {
    const body = {
      booklist_id: id,
      reviewText: inputValue,
    };
    await addBooklistReview({ body, access_token });
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
      <>
        <div className="flex flex-col w-full p-6 overflow-auto text-gray-800 ">
          <div className="flex flex-col w-full p-6 mb-4 border rounded-md shadow-2xl">
            <p className="mb-1 text-lg font-bold">
              Booklist Name: {book?.name}
            </p>
            <p className="mb-1 text-lg font-bold">
              Author Name: {book?.authorName}
            </p>
          </div>
          <div className="grid grid-cols-[auto,fr] flex-grow-1  w-full items-center shadow-2xl p-6 rounded-md border">
            <h1 className="mb-2 text-xl font-bold">Books In the Booklist:</h1>
            <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
              {book?.books.map((book_id) => (
                <>
                  <BookComponent book_id={book_id} />
                </>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-[auto,fr] mt-10 w-full items-center shadow-2xl p-6 rounded-md border">
            <h1 className="mb-6 text-xl font-bold">Reviews:</h1>

            {user.isAdmin
              ? book?.reviews &&
                book.reviews
                  .filter((review) => review.reviewText)
                  .map((review, index) => (
                    <div className="flex flex-row items-center justify-between">
                      <Button.Group className="w-full">
                        <div
                          key={index}
                          className="w-full p-6 mb-4 rounded-md shadow-md bg-main-primary dark:bg-dark-primary"
                        >
                          <p className="mb-2 text-xl font-bold text-gray-800">
                            Name: {review.reviewerName}
                          </p>
                          <p className="text-gray-700">
                            Review: {review.reviewText}
                          </p>
                          <p className="text-gray-700">
                            Is Hidden: {review.isHidden ? "Yes" : "No"}
                          </p>
                        </div>
                        {user.isAdmin && (
                          <Button
                            onClick={() =>
                              handleHide(book2._id, review.reviewId)
                            }
                            className="p-6 mb-4 bg-red-600  dark:bg-red-600"
                          >
                            Hide
                          </Button>
                        )}
                      </Button.Group>
                    </div>
                  ))
              : book?.reviews &&
                book.reviews
                  .filter((review) => review.reviewText && !review.isHidden)
                  .map((review, index) => (
                    <div className="flex flex-row items-center justify-between">
                      <div
                        key={index}
                        className="w-full p-6 mb-4 rounded-lg shadow-md bg-main-primary dark:bg-dark-primary"
                      >
                        <p className="mb-2 text-xl font-bold text-gray-800">
                          Name: {review.reviewerName}
                        </p>
                        <p className="text-gray-700">
                          Review: {review.reviewText}
                        </p>
                      </div>
                    </div>
                  ))}

            {access_token && (
              <>
                <div className="flex flex-col p-6 space-y-4 border rounded-md">
                  <h1 className="mb-2 text-xl font-bold">Add a Review: </h1>

                  <FloatingLabel
                    variant="standard"
                    label="Enter Text..."
                    id="text"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    required
                  />

                  <Button
                    type="submit"
                    onClick={() => handleClick(book2._id)}
                    className="flex items-center justify-center p-2 bg-blue-500 rounded-md text-gray hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                  >
                    <Plus />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </>
    </Modal>
  );
};

export default PublicBookPage;
