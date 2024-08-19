import Modal from "../components/Modal";
import { useParams } from "react-router-dom";
import { getBooks } from "../features/booksSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { BookVolume } from "../comman-types";
import { useGetVolumeQuery } from "../services/googleBooksServices";
import DefaultPic from "../assets/pp.jpg";
import { getCurrentToken } from "../features/authSlice";
import { Button, Spinner } from "flowbite-react";
import { toast } from "react-toastify";
import { getUserBooklists } from "../features/booklistSlice";
import { useState, useEffect } from "react";
import { useAddBookToBooklistMutation, useGetUserBooklistsQuery } from "../services/booklistsServices";
import { useAddToCartMutation, useGetCartQuery } from "../services/cartServices";
import { setUserCart } from "../features/cartSlice";

const BookPage = () => {
  const access_token = useAppSelector(getCurrentToken);
  const userBooklists = useAppSelector(getUserBooklists);
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const books = useAppSelector(getBooks);
  const { refetch } = useGetUserBooklistsQuery(access_token);
  const [addBookToBooklist, { isLoading: addingToBooklist, isSuccess: bookAdded }] = useAddBookToBooklistMutation();
  const [addToCart, { isLoading: addingToCart, isSuccess: addedToCart }] = useAddToCartMutation();
  const { data: cartData, isSuccess: CartSuccess, isFetching, refetch: refetchCart } = useGetCartQuery(access_token);
  const { data, isSuccess } = useGetVolumeQuery(id);

  const selectedBook = isSuccess ? data : books.find((obj: BookVolume) => obj.id === id);

  const removeHtmlTags = (input: string) => input.replace(/<[^>]*>/g, "");

  const handleAddToCart = () => {
    const book_id = { book_id: id };
    addToCart({ book_id, access_token });
  };

  useEffect(() => {
    if (addedToCart) {
      toast.success("Book Added To Cart");
    }
    refetchCart();
  }, [addedToCart]);

  useEffect(() => {
    if (!isFetching) {
      dispatch(setUserCart(cartData));
    }
  }, [isFetching]);

  const [selectedBooklistID, setSelectedBooklistID] = useState("");

  const handleAddToBooklist = () => {
    const booklist = userBooklists.bookLists?.find((obj) => obj._id === selectedBooklistID);
    if (booklist) {
      if ("books" in booklist) {
        const books = [...booklist.books, id];
        const booklist_id = booklist?._id;
        const data = { books, booklist_id };
        addBookToBooklist({ data, access_token });
      }
    } else {
      toast.error("Please Select a Booklist");
    }
  };

  useEffect(() => {
    if (bookAdded) {
      toast(`Book Added to ${userBooklists.bookLists?.find((obj) => obj._id === selectedBooklistID)?.name} Booklist`);
      refetch();
    }
  }, [bookAdded, refetch, selectedBooklistID, userBooklists.bookLists]);

  return (
    <Modal>
      {selectedBook && (
        <div className="flex flex-col gap-6">
          {access_token && (
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                {selectedBook.saleInfo.listPrice ? (
                  <Button onClick={handleAddToCart} gradientDuoTone="cyanToBlue" className="w-full md:w-auto">
                    {addingToCart ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Adding...
                      </>
                    ) : (
                      "Add To Cart"
                    )}
                  </Button>
                ) : (
                  <Button gradientDuoTone="pinkToOrange" className="w-full md:w-auto">
                    Sold Out
                  </Button>
                )}
              </div>
              <div className="flex flex-col gap-2 md:flex-row">
                <select
                  value={selectedBooklistID}
                  onChange={(e) => setSelectedBooklistID(e.target.value)}
                  className="p-2 border rounded-md dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-dark-text dark:bg-dark-primary bg-main-primary"
                >
                  <option value="" disabled>
                    Name | Type
                  </option>
                  {userBooklists.bookLists?.map((booklist) => (
                    <option key={booklist._id} value={booklist._id}>
                      {booklist.name} | {booklist.isPrivate ? "Private" : "Public"}
                    </option>
                  ))}
                </select>
                <Button onClick={handleAddToBooklist} className="w-full md:w-auto">
                  {addingToBooklist ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Adding...
                    </>
                  ) : (
                    "Add To Selected Booklist"
                  )}
                </Button>
              </div>
            </div>
          )}
          <div className="flex flex-col items-center gap-4 p-4 rounded-lg shadow-lg ">
            <img src={selectedBook.volumeInfo.imageLinks?.thumbnail || DefaultPic} alt="Book Thumbnail" className="rounded-md shadow-lg" style={{ maxWidth: "300px", maxHeight: "300px" }} />
            <div className="text-center">
              <h2 className="text-2xl font-bold">{selectedBook.volumeInfo.title}</h2>
              {selectedBook.volumeInfo.subtitle && <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">{selectedBook.volumeInfo.subtitle}</p>}
            </div>
            {selectedBook.saleInfo && (
              <div className="space-y-1 text-left">
                <p>
                  <span className="font-semibold">List Price:</span>{" "}
                  {selectedBook.saleInfo.listPrice ? `${selectedBook.saleInfo.listPrice.amount} ${selectedBook.saleInfo.listPrice.currencyCode}` : "Out of Stock"}
                </p>
                <p>
                  <span className="font-semibold">Retail Price:</span>{" "}
                  {selectedBook.saleInfo.retailPrice ? `${selectedBook.saleInfo.retailPrice.amount} ${selectedBook.saleInfo.retailPrice.currencyCode}` : "Out of Stock"}
                </p>
              </div>
            )}
            <div className="space-y-1 text-left">
              <p>
                <span className="font-semibold">Authors:</span> {selectedBook.volumeInfo.authors?.join(", ") || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Publisher:</span> {selectedBook.volumeInfo.publisher || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Published Date:</span> {selectedBook.volumeInfo.publishedDate || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Page Count:</span> {selectedBook.volumeInfo.pageCount || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Description:</span> {removeHtmlTags(selectedBook.volumeInfo.description || "N/A")}
              </p>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default BookPage;
