import { useState, type FC } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Calendar, Library, Building2 } from "lucide-react";
import { useAppSelector } from "@/app/store/hooks";
import { getCurrentToken } from "@/features/auth/authSlice";
import {
  useAddBookToBooklistMutation,
  useGetUserBooklistsQuery,
} from "@/services/api/booklists";
import { useGetVolumeQuery } from "@/services/api/googleBooks";
import { useAddToCartMutation, useGetCartQuery } from "@/services/api/cart";
import Modal from "@/shared/components/overlay/Modal";
import DefaultPic from "@/assets/pp.jpg";
import { Grid, LoadingState } from "@/shared/layouts/ContentComponents";
import {
  PriceTag,
  BookMetaItem,
  RatingStars,
  BookActions,
  QuickActions,
} from "@/features/books/components";

const BookPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const access_token = useAppSelector(getCurrentToken);
  const [selectedBooklistID, setSelectedBooklistID] = useState<string>("");
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const { data: bookData, isSuccess } = useGetVolumeQuery(id as string);
  const { data: userBooklists, refetch: refetchBooklists } =
    useGetUserBooklistsQuery(access_token);
  const { refetch: refetchCart } = useGetCartQuery(access_token);

  const [addBookToBooklist, { isLoading: addingToBooklist }] =
    useAddBookToBooklistMutation();
  const [addToCart, { isLoading: addingToCart }] = useAddToCartMutation();

  const selectedBook = isSuccess ? bookData : undefined;

  const handleAddToCart = async () => {
    try {
      await addToCart({ book_id: { book_id: id }, access_token }).unwrap();
      toast.success("Book added to cart");
      refetchCart();
    } catch {
      toast.error("Failed to add book to cart");
    }
  };

  const handleAddToBooklist = async () => {
    if (!selectedBooklistID) {
      toast.error("Please select a booklist");
      return;
    }

    const booklist = userBooklists?.bookLists?.find(
      (list: { _id: string }) => list._id === selectedBooklistID
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
    } catch {
      toast.error("Failed to add book to booklist");
    }
  };

  if (!selectedBook) {
    return <LoadingState message="Loading book details..." />;
  }

  const { volumeInfo, saleInfo } = selectedBook;

  return (
    <Modal title={volumeInfo.title}>
      <Grid cols={{ default: 1, lg: 2 }} className="gap-12">
        {/* Left Column - Cover and Actions */}
        <div className="space-y-8">
          <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-2xl">
            <img
              src={volumeInfo.imageLinks?.thumbnail || DefaultPic}
              alt={volumeInfo.title}
              className="w-full h-full object-cover"
            />
          </div>

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
              <BookActions
                hasPrice={!!saleInfo.listPrice}
                addingToCart={addingToCart}
                addingToBooklist={addingToBooklist}
                selectedBooklistID={selectedBooklistID}
                booklists={userBooklists?.bookLists}
                onAddToCart={handleAddToCart}
                onAddToBooklist={handleAddToBooklist}
                onBooklistSelect={setSelectedBooklistID}
              />
            )}
          </div>

          <QuickActions
            isLiked={isLiked}
            onLikeToggle={() => setIsLiked(!isLiked)}
          />
        </div>

        {/* Right Column - Book Details */}
        <div className="space-y-8">
          {volumeInfo.subtitle && (
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {volumeInfo.subtitle}
            </p>
          )}

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

          <div className="py-6 border-t border-gray-200 dark:border-gray-700">
            <RatingStars />
          </div>

          {volumeInfo.description && (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">About this book</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {volumeInfo.description.replace(/<[^>]*>/g, "")}
              </p>
            </div>
          )}
        </div>
      </Grid>
    </Modal>
  );
};

export default BookPage;
