import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Trash2, Plus, Minus, ShoppingCart, PackageOpen } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getCurrentToken } from "../features/authSlice";
import { getUserCart, setUserCart } from "../features/cartSlice";
import { getLoadedBooks } from "../features/loadBookSlice";
import {
  useAddToCartMutation,
  useGetCartQuery,
  useRemoveFromCartMutation,
  useRemoveWholeItemFromCartMutation,
} from "../services/cartServices";
import { BookVolume } from "../comman-types";
import BookLoaderComponent from "../components/BookLoaderComponent";
import DefaultPic from "../assets/pp.jpg";

const ActionButton = ({
  onClick,
  variant = "primary",
  disabled = false,
  children,
  className = "",
}: {
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg transition-all duration-200 p-2";
  const variants = {
    primary: "bg-secondary hover:bg-secondary-hover text-white",
    secondary:
      "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700",
    danger: "bg-red-500 hover:bg-red-600 text-white",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {children}
    </button>
  );
};

// Summary Section Component
const OrderSummary = ({
  subTotal,
  tax,
  total,
  currency,
  onCheckout,
  disabled,
}: {
  subTotal: number;
  tax: number;
  total: number;
  currency: string;
  onCheckout: () => void;
  disabled: boolean;
}) => (
  <div className="p-6 transition-shadow duration-200 rounded-lg shadow-md bg-main-secondary dark:bg-dark-secondary hover:shadow-lg">
    <h2 className="mb-6 text-2xl font-semibold">Order Summary</h2>

    <div className="space-y-4">
      <div className="flex justify-between">
        <span className="text-gray-600 dark:text-gray-300">Subtotal:</span>
        <span>
          {subTotal.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          {currency}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-600 dark:text-gray-300">Tax (10%):</span>
        <span>
          {tax.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          {currency}
        </span>
      </div>

      <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold">Total:</span>
          <span className="text-xl font-semibold">
            {total.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            {currency}
          </span>
        </div>
      </div>
    </div>

    <button
      onClick={onCheckout}
      disabled={disabled}
      className={`
        w-full px-6 py-3 mt-6 text-white transition-all duration-200 rounded-lg
        flex items-center justify-center gap-2
        ${
          disabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-secondary hover:bg-secondary-hover active:transform active:scale-[0.98]"
        }
      `}
    >
      <ShoppingCart size={20} />
      {disabled ? "Cart is Empty" : "Proceed to Checkout"}
    </button>
  </div>
);

const CartItem = ({
  book,
  quantity,
  onIncrement,
  onDecrement,
  onRemove,
  onClick,
}: {
  book: BookVolume;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
  onClick: () => void;
}) => {
  const price = book.saleInfo.listPrice;
  const total = price ? price.amount * quantity : 0;

  return (
    <div className="flex flex-col overflow-hidden transition-shadow duration-200 rounded-lg shadow-md bg-main-secondary dark:bg-dark-secondary hover:shadow-lg">
      <div className="flex flex-col sm:flex-row">
        <div
          className="relative w-full sm:w-32 aspect-[3/4] cursor-pointer overflow-hidden"
          onClick={onClick}
        >
          <img
            src={book.volumeInfo.imageLinks?.thumbnail || DefaultPic}
            alt={book.volumeInfo.title}
            className="object-cover w-full h-full transition-transform duration-200 hover:scale-105"
          />
        </div>

        <div className="flex flex-col flex-grow p-4">
          <h2
            className="mb-2 text-xl font-semibold cursor-pointer hover:text-secondary"
            onClick={onClick}
          >
            {book.volumeInfo.title}
          </h2>

          <div className="grid gap-2 mt-auto">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>Price:</span>
              <span>
                {price
                  ? `${price.amount} ${price.currencyCode}`
                  : "Not available"}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>Quantity:</span>
              <span>{quantity}</span>
            </div>

            <div className="flex items-center justify-between font-medium">
              <span>Total:</span>
              <span>
                {price
                  ? `${total.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })} ${price.currencyCode}`
                  : "Not available"}
              </span>
            </div>

            <div className="flex gap-2 mt-2">
              <ActionButton onClick={onIncrement} variant="primary">
                <Plus size={16} />
              </ActionButton>
              <ActionButton onClick={onDecrement} variant="secondary">
                <Minus size={16} />
              </ActionButton>
              <ActionButton onClick={onRemove} variant="danger">
                <Trash2 size={16} />
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ... Keep the OrderSummary component same as before ...

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const access_token = useAppSelector(getCurrentToken);
  const cart = useAppSelector(getUserCart);
  const books = useAppSelector(getLoadedBooks);

  const [total, setTotal] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [currency, setCurrency] = useState("");
  const [loadedBookIds, setLoadedBookIds] = useState<string[]>([]);

  // API hooks
  const [addToCart] = useAddToCartMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [removeWholeItemFromCart] = useRemoveWholeItemFromCartMutation();
  const {
    data: cartData,
    isFetching,
    refetch: refetchCart,
  } = useGetCartQuery(access_token);

  // Cart actions
  const handleIncrement = async (id: string) => {
    try {
      await addToCart({ book_id: { book_id: id }, access_token });
      toast.success("Quantity increased");
      refetchCart();
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const handleDecrement = async (id: string) => {
    try {
      await removeFromCart({ book_id: { book_id: id }, access_token });
      toast.success("Quantity decreased");
      refetchCart();
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await removeWholeItemFromCart({ book_id: { book_id: id }, access_token });
      setLoadedBookIds((prev) => prev.filter((bookId) => bookId !== id));
      toast.success("Item removed from cart");
      refetchCart();
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const handleBookClick = (id: string) => {
    navigate(`/book/${id}`);
  };

  // Load book data
  useEffect(() => {
    if (cart && cart.books) {
      const bookIds = Object.keys(cart.books);
      setLoadedBookIds(bookIds);
    }
  }, [cart]);

  // Calculate totals
  useEffect(() => {
    if (!isFetching && cartData && books.length > 0) {
      dispatch(setUserCart(cartData));

      let newSubtotal = 0;
      let currencyCode = "";

      books.forEach((book: BookVolume) => {
        if (book.saleInfo.listPrice && cartData.books[book.id]) {
          newSubtotal +=
            book.saleInfo.listPrice.amount * cartData.books[book.id];
          currencyCode = book.saleInfo.listPrice.currencyCode;
        }
      });

      const taxRate = 0.1;
      const newTax = newSubtotal * taxRate;
      const newTotal = newSubtotal + newTax;

      setTax(newTax);
      setSubTotal(newSubtotal);
      setTotal(newTotal);
      setCurrency(currencyCode);
    }
  }, [isFetching, books, cartData, dispatch]);

  // Render book loaders
  const bookLoaders = loadedBookIds.map((id) => (
    <BookLoaderComponent key={id} book_id={id} />
  ));

  const validBooks = books.filter((book) => cart.books && cart.books[book.id]);

  const isCartEmpty = !validBooks.length;

  return (
    <div className="container px-4 py-8 mx-auto">
      {bookLoaders}

      <h1 className="mb-8 text-3xl font-bold text-center">Shopping Cart</h1>

      {isCartEmpty ? (
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <PackageOpen className="w-16 h-16 text-gray-400" />
          <p className="text-xl text-gray-500">Your cart is empty</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Cart Items */}
          <div className="flex-grow lg:w-2/3 space-y-6">
            {validBooks.map((book: BookVolume) => (
              <CartItem
                key={book.id}
                book={book}
                quantity={cart.books[book.id]}
                onIncrement={() => handleIncrement(book.id)}
                onDecrement={() => handleDecrement(book.id)}
                onRemove={() => handleRemove(book.id)}
                onClick={() => handleBookClick(book.id)}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="sticky top-24">
              <OrderSummary
                subTotal={subTotal}
                tax={tax}
                total={total}
                currency={currency}
                onCheckout={() =>
                  navigate("/checkout", {
                    state: { to: { items: cart.books, price: total } },
                  })
                }
                disabled={total <= 0}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
