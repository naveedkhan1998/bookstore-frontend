import Modal from "../components/Modal";
import { useParams } from "react-router-dom";
import { getBooks } from "../features/booksSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { BookVolume } from "../comman-types";
import { useGetVolumeQuery } from "../services/googleBooksServices";
import DefaultPic from "../assets/pp.jpg";
import { getCurrentToken } from "../features/authSlice";
import { Button } from "flowbite-react";
import { toast } from "react-toastify";
import { getUserBooklists } from "../features/booklistSlice";
import { useState, useEffect } from "react";
import {
  useAddBookToBooklistMutation,
  useGetUserBooklistsQuery,
} from "../services/booklistsServices";
import {
  useAddToCartMutation,
  useGetCartQuery,
} from "../services/cartServices";
import { setUserCart } from "../features/cartSlice";

const BookPage = () => {
  const access_token = useAppSelector(getCurrentToken);
  const userBooklists = useAppSelector(getUserBooklists);
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const books = useAppSelector(getBooks);
  const { refetch } = useGetUserBooklistsQuery(access_token);
  const [addBookToBooklist, { isSuccess: bookAdded }] =
    useAddBookToBooklistMutation();

  const [addToCart, { isLoading: addedToCart }] = useAddToCartMutation();

  const {
    data: cartData,
    isSuccess: CartSuccess,
    isFetching,
    refetch: refetchCart,
  } = useGetCartQuery(access_token);
  // Find the selected book based on the id parameter
  const { data, isSuccess } = useGetVolumeQuery(id);

  const selectedBook = isSuccess
    ? data
    : books.find((obj: BookVolume) => obj.id === id);

  const removeHtmlTags = (input: string) => {
    return input.replace(/<[^>]*>/g, "");
  };

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
    const booklist = userBooklists.bookLists?.find(
      (obj) => obj._id === selectedBooklistID
    );
    if (booklist) {
      if ("books" in booklist) {
        const books = [...booklist.books, id];
        const booklist_id = booklist?._id;
        //console.log(books);
        const data = { books, booklist_id };
        addBookToBooklist({ data, access_token });
      }
    } else {
      toast.error("Please Select a Booklist");
    }
  };

  useEffect(() => {
    if (bookAdded) {
      toast(
        `Book Added to ${
          userBooklists.bookLists?.find((obj) => obj._id === selectedBooklistID)
            ?.name
        } Booklist`
      );
      refetch();
    }
  }, [bookAdded]);

  return (
    <Modal>
      {selectedBook && (
        <>
          <div className="flex flex-col p-12 w-full overflow-auto text-gray-800 ">
            <img
              src={selectedBook.volumeInfo.imageLinks?.thumbnail || DefaultPic}
              alt="Book Thumbnail"
              className="rounded-md shadow-lg mb-6"
              height={300}
              width={300}
            />
            <h2 className="text-3xl font-bold mb-4">
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
                    : "Out of Stock"}
                </p>
                <p>
                  <span className="font-semibold">Retail Price:</span>{" "}
                  {selectedBook.saleInfo.retailPrice
                    ? `${selectedBook.saleInfo.retailPrice.amount} ${selectedBook.saleInfo.retailPrice.currencyCode}`
                    : "Out of Stock"}
                </p>
              </div>
            )}
            <p className="text-gray-700">
              <span className="font-semibold">Authors:</span>{" "}
              {selectedBook.volumeInfo.authors?.join(" , ") || "N/A"}
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
              <span className="font-semibold">Page Count:</span>{" "}
              {selectedBook.volumeInfo.pageCount || "N/A"}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Description:</span>{" "}
              {removeHtmlTags(selectedBook.volumeInfo.description || "N/A")}
            </p>
          </div>
          {access_token && (
            <>
              <div className="flex flex-row items-center justify-between px-12 py-2 w-full shadow-2xl">
                {selectedBook.saleInfo.listPrice ? (
                  <Button
                    onClick={handleAddToCart}
                    gradientDuoTone="cyanToBlue"
                  >
                    Add To Cart
                  </Button>
                ) : (
                  <Button gradientDuoTone="pinkToOrange">Sold Out</Button>
                )}
                <div className="flex flex-wrap gap-2">
                  <Button.Group>
                    <select
                      value={selectedBooklistID}
                      onChange={(e) => setSelectedBooklistID(e.target.value)}
                      className=" bg-black/30 text-grey  dark:text-slate-400 p-2 rounded-l-md  "
                    >
                      <option
                        className="text-grey dark:text-slate-400"
                        value=""
                        disabled
                      >
                        Name | Type
                      </option>
                      {userBooklists.bookLists?.map((booklist) => (
                        <option key={booklist.name} value={booklist._id}>
                          {booklist.name} |{" "}
                          {booklist.isPrivate ? "Private" : "Public"}
                        </option>
                      ))}
                    </select>
                    <Button
                      onClick={handleAddToBooklist}
                      className="text-gray"
                    >
                      Add To Selected Booklist
                    </Button>
                  </Button.Group>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </Modal>
  );
};

export default BookPage;
