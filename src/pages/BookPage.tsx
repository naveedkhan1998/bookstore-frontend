import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Loader2,
  Bookmark,
  ShoppingCart,
  AlertTriangle,
  Calendar,
  Library,
  Building2,
  Share2,
  Heart,
  Star,
} from "lucide-react";
import Modal from "../components/Modal";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getBooks } from "../features/booksSlice";
import { getCurrentToken } from "../features/authSlice";
import { getUserBooklists } from "../features/booklistSlice";
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

interface PriceTagProps {
  amount: number;
  currencyCode: string;
  isRetail?: boolean;
}

interface BookMetaItemProps {
  icon: React.ElementType;
  label: string;
  value: string | number | undefined;
}

interface ActionButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  icon: React.ElementType;
  label: string;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}

interface RatingStarsProps {
  rating?: number;
}

const PriceTag: React.FC<PriceTagProps> = ({
  amount,
  currencyCode,
  isRetail = false,
}) => (
  <div
    className={`flex items-center gap-2 ${isRetail ? "text-gray-500 text-sm line-through" : "text-2xl font-bold"}`}
  >
    <span>{currencyCode}</span>
    <span>{amount}</span>
  </div>
);

const BookMetaItem: React.FC<BookMetaItemProps> = ({
  icon: Icon,
  label,
  value,
}) => (
  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
    <Icon className="w-5 h-5" />
    <div className="flex flex-col">
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      <span className="font-medium">{value || "N/A"}</span>
    </div>
  </div>
);

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  isLoading = false,
  icon: Icon,
  label,
  variant = "primary",
  disabled = false,
}) => {
  const baseStyles =
    "flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300";
  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl",
    secondary:
      "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 shadow hover:shadow-md",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl",
  };

  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`${baseStyles} ${variants[variant]} ${
        isLoading || disabled
          ? "opacity-50 cursor-not-allowed"
          : "transform hover:scale-105"
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

const RatingStars: React.FC<RatingStarsProps> = ({ rating = 4.5 }) => (
  <div className="flex items-center gap-2">
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
    <span className="text-sm text-gray-600 dark:text-gray-300">{rating}/5</span>
  </div>
);

interface SaleInfo {
  listPrice?: {
    amount: number;
    currencyCode: string;
  };
  retailPrice?: {
    amount: number;
    currencyCode: string;
  };
}

interface VolumeInfo {
  title: string;
  subtitle?: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  pageCount?: number;
  imageLinks?: {
    thumbnail?: string;
  };
}

interface Book {
  id: string;
  volumeInfo: VolumeInfo;
  saleInfo: SaleInfo;
}

const BookPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const access_token = useAppSelector(getCurrentToken);
  const userBooklists = useAppSelector(getUserBooklists);
  const books = useAppSelector(getBooks);
  const [selectedBooklistID, setSelectedBooklistID] = useState<string>("");
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const { data: bookData, isSuccess } = useGetVolumeQuery(id as string);
  const { refetch: refetchBooklists } = useGetUserBooklistsQuery(access_token);
  const {
    data: cartData,
    isSuccess: cartSuccess,
    isFetching,
    refetch: refetchCart,
  } = useGetCartQuery(access_token);

  const [addBookToBooklist, { isLoading: addingToBooklist }] =
    useAddBookToBooklistMutation();
  const [addToCart, { isLoading: addingToCart }] = useAddToCartMutation();

  const selectedBook: Book | undefined = isSuccess
    ? bookData
    : books.find((obj: Book) => obj.id === id);

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
      <div className="grid grid-cols-1 lg:grid-cols-[350px,1fr] gap-12">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Book Cover */}
          <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-2xl">
            <img
              src={volumeInfo.imageLinks?.thumbnail || DefaultPic}
              alt={volumeInfo.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Price and Actions */}
          <div className="space-y-6">
            {saleInfo.listPrice && (
              <div className="space-y-2">
                <PriceTag
                  amount={saleInfo.listPrice.amount}
                  currencyCode={saleInfo.listPrice.currencyCode}
                />
                {saleInfo.retailPrice &&
                  saleInfo.retailPrice.amount !== saleInfo.listPrice.amount && (
                    <PriceTag
                      amount={saleInfo.retailPrice.amount}
                      currencyCode={saleInfo.retailPrice.currencyCode}
                      isRetail
                    />
                  )}
              </div>
            )}

            {access_token && (
              <div className="flex flex-col gap-4">
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

                <div className="flex gap-3">
                  <select
                    value={selectedBooklistID}
                    onChange={(e) => setSelectedBooklistID(e.target.value)}
                    className="flex-1 p-3 rounded-full border border-gray-200 dark:border-gray-700 
                             bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
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
                    variant="secondary"
                    label=""
                  />
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex justify-around py-4 border-t border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-red-500"
            >
              <Heart
                className={`w-6 h-6 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
              />
              <span className="text-sm">Like</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-blue-500">
              <Share2 className="w-6 h-6" />
              <span className="text-sm">Share</span>
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {volumeInfo.subtitle && (
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {volumeInfo.subtitle}
            </p>
          )}

          {/* Meta Information */}
          <div className="grid grid-cols-2 gap-6">
            <BookMetaItem
              icon={Library}
              label="Authors"
              value={volumeInfo.authors?.join(", ")}
            />
            <BookMetaItem
              icon={Building2}
              label="Publisher"
              value={volumeInfo.publisher}
            />
            <BookMetaItem
              icon={Calendar}
              label="Published Date"
              value={volumeInfo.publishedDate}
            />
            <BookMetaItem
              icon={Library}
              label="Pages"
              value={volumeInfo.pageCount}
            />
          </div>

          {/* Rating */}
          <div className="py-6 border-t border-gray-200 dark:border-gray-700">
            <RatingStars />
          </div>

          {/* Description */}
          {volumeInfo.description && (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">About this book</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {volumeInfo.description.replace(/<[^>]*>/g, "")}
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default BookPage;
