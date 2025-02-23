import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2, Bookmark, ShoppingCart, AlertTriangle } from "lucide-react";
import Modal from "../components/Modal";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getBooks } from "../features/booksSlice";
import { getCurrentToken } from "../features/authSlice";
import { getUserBooklists } from "../features/booklistSlice";
import { BookVolume } from "../comman-types";
import { useGetVolumeQuery } from "../services/googleBooksServices";
import {
  useAddBookToBooklistMutation,
  useGetUserBooklistsQuery,
} from "../services/booklistsServices";
import {
  useAddToCartMutation,
  useGetCartQuery,
} from "../services/cartServices";
import { setUserCart } from "../features/cartSlice";
import DefaultPic from "../assets/pp.jpg";

// Price Tag Component
const PriceTag = ({
  amount,
  currencyCode,
}: {
  amount: number;
  currencyCode: string;
}) => (
  <div className="flex items-center justify-center px-4 py-2 text-lg font-bold text-white bg-secondary rounded-full">
    {amount} {currencyCode}
  </div>
);

// Book Info Row Component
const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="flex flex-col space-y-1">
    <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
    <span className="font-medium">{value || "N/A"}</span>
  </div>
);

// Action Button Component
const ActionButton = ({
  onClick,
  isLoading,
  icon: Icon,
  label,
  variant = "primary",
  disabled = false,
}: {
  onClick: () => void;
  isLoading?: boolean;
  icon: any;
  label: string;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}) => {
  const baseStyles =
    "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200";
  const variants = {
    primary: "bg-secondary hover:bg-secondary-hover text-white",
    secondary:
      "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700",
    danger: "bg-red-500 hover:bg-red-600 text-white",
  };

  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`${baseStyles} ${variants[variant]} ${
        (isLoading || disabled) && "opacity-50 cursor-not-allowed"
      }`}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Icon className="w-5 h-5" />
      )}
      {label}
    </button>
  );
};

const BookPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const access_token = useAppSelector(getCurrentToken);
  const userBooklists = useAppSelector(getUserBooklists);
  const books = useAppSelector(getBooks);
  const [selectedBooklistID, setSelectedBooklistID] = useState("");

  // Queries
  const { data: bookData, isSuccess } = useGetVolumeQuery(id);
  const { refetch: refetchBooklists } = useGetUserBooklistsQuery(access_token);
  const {
    data: cartData,
    isSuccess: cartSuccess,
    isFetching,
    refetch: refetchCart,
  } = useGetCartQuery(access_token);

  // Mutations
  const [addBookToBooklist, { isLoading: addingToBooklist }] =
    useAddBookToBooklistMutation();
  const [addToCart, { isLoading: addingToCart }] = useAddToCartMutation();

  // Get book data
  const selectedBook = isSuccess
    ? bookData
    : books.find((obj: BookVolume) => obj.id === id);

  useEffect(() => {
    if (!isFetching && cartSuccess) {
      dispatch(setUserCart(cartData));
    }
  }, [isFetching, cartSuccess, cartData, dispatch]);

  const handleAddToCart = async () => {
    try {
      await addToCart({ book_id: { book_id: id }, access_token }).unwrap();
      toast.success("Book added to cart");
      refetchCart();
    } catch (error) {
      toast.error("Failed to add book to cart");
    }
  };

  const handleAddToBooklist = async () => {
    if (!selectedBooklistID) {
      toast.error("Please select a booklist");
      return;
    }

    const booklist = userBooklists.bookLists?.find(
      (list) => list._id === selectedBooklistID,
    );
    if (!booklist) return;

    try {
      const books = [...(booklist.books || []), id];
      await addBookToBooklist({
        data: { books, booklist_id: selectedBooklistID },
        access_token,
      }).unwrap();
      toast.success(`Added to ${booklist.name}`);
      refetchBooklists();
    } catch (error) {
      toast.error("Failed to add book to booklist");
    }
  };

  if (!selectedBook) return null;

  const { volumeInfo, saleInfo } = selectedBook;

  return (
    <Modal title={volumeInfo.title}>
      <div className="flex flex-col gap-8">
        {/* Top Actions */}
        {access_token && (
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex gap-2">
              {saleInfo.listPrice ? (
                <ActionButton
                  onClick={handleAddToCart}
                  isLoading={addingToCart}
                  icon={ShoppingCart}
                  label="Add to Cart"
                />
              ) : (
                <ActionButton
                  onClick={() => {}}
                  icon={AlertTriangle}
                  label="Sold Out"
                  variant="danger"
                  disabled
                />
              )}
            </div>

            <div className="flex gap-2 items-center">
              <select
                value={selectedBooklistID}
                onChange={(e) => setSelectedBooklistID(e.target.value)}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-secondary"
              >
                <option value="">Select Booklist</option>
                {userBooklists.bookLists?.map((list) => (
                  <option key={list._id} value={list._id}>
                    {list.name} ({list.isPrivate ? "Private" : "Public"})
                  </option>
                ))}
              </select>
              <ActionButton
                onClick={handleAddToBooklist}
                isLoading={addingToBooklist}
                icon={Bookmark}
                label="Add to List"
                variant="secondary"
              />
            </div>
          </div>
        )}

        {/* Book Details */}
        <div className="grid grid-cols-1 md:grid-cols-[300px,1fr] gap-8">
          {/* Left Column - Image and Price */}
          <div className="space-y-4">
            <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
              <img
                src={volumeInfo.imageLinks?.thumbnail || DefaultPic}
                alt={volumeInfo.title}
                className="w-full h-full object-cover"
              />
            </div>
            {saleInfo.listPrice && (
              <div className="space-y-2">
                <PriceTag
                  amount={saleInfo.listPrice.amount}
                  currencyCode={saleInfo.listPrice.currencyCode}
                />
                {saleInfo.retailPrice &&
                  saleInfo.retailPrice.amount !== saleInfo.listPrice.amount && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      Retail: {saleInfo.retailPrice.amount}{" "}
                      {saleInfo.retailPrice.currencyCode}
                    </div>
                  )}
              </div>
            )}
          </div>

          {/* Right Column - Book Information */}
          <div className="space-y-6">
            {volumeInfo.subtitle && (
              <h2 className="text-xl text-gray-600 dark:text-gray-400">
                {volumeInfo.subtitle}
              </h2>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow
                label="Authors"
                value={volumeInfo.authors?.join(", ") || "N/A"}
              />
              <InfoRow
                label="Publisher"
                value={volumeInfo.publisher || "N/A"}
              />
              <InfoRow
                label="Published Date"
                value={volumeInfo.publishedDate || "N/A"}
              />
              <InfoRow
                label="Page Count"
                value={volumeInfo.pageCount || "N/A"}
              />
            </div>

            {volumeInfo.description && (
              <div className="space-y-2">
                <h3 className="font-semibold">Description</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {volumeInfo.description.replace(/<[^>]*>/g, "")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BookPage;
