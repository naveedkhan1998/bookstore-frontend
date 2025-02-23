import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  PackageOpen,
  ArrowRight,
  Shield,
  Clock,
  CreditCard,
  LucideIcon,
} from "lucide-react";
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

interface CartFeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface QuantityButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

interface CartItemProps {
  book: BookVolume;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
  onClick: () => void;
}

interface OrderSummaryProps {
  subTotal: number;
  tax: number;
  total: number;
  currency: string;
  onCheckout: () => void;
  disabled: boolean;
}

const CartFeature: React.FC<CartFeatureProps> = ({
  icon: Icon,
  title,
  description,
}) => (
  <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
    <Icon className="w-6 h-6 text-secondary" />
    <div>
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  </div>
);

const QuantityButton: React.FC<QuantityButtonProps> = ({
  onClick,
  disabled,
  children,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="flex items-center justify-center w-8 h-8 transition-all rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-50"
  >
    {children}
  </button>
);

const CartItem: React.FC<CartItemProps> = ({
  book,
  quantity,
  onIncrement,
  onDecrement,
  onRemove,
  onClick,
}) => {
  const price = book.saleInfo.listPrice;
  const total = price ? price.amount * quantity : 0;

  return (
    <div className="flex gap-6 p-4 transition-all rounded-lg bg-white dark:bg-gray-800 hover:shadow-lg">
      <div
        className="relative w-24 cursor-pointer aspect-[3/4] overflow-hidden rounded-lg"
        onClick={onClick}
      >
        <img
          src={book.volumeInfo.imageLinks?.thumbnail || DefaultPic}
          alt={book.volumeInfo.title}
          className="object-cover w-full h-full transition-transform duration-200 hover:scale-105"
        />
      </div>

      <div className="flex flex-col flex-grow gap-2">
        <div className="flex items-start justify-between">
          <div>
            <h2
              className="text-lg font-medium cursor-pointer truncate max-w-[200px] md:max-w-fit hover:text-secondary"
              onClick={onClick}
            >
              {book.volumeInfo.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {book.volumeInfo.authors?.join(", ")}
            </p>
          </div>
          <button
            onClick={onRemove}
            className="p-2 text-gray-400 transition-colors rounded-full hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="flex items-end justify-between mt-auto">
          <div className="flex items-center gap-3">
            <QuantityButton onClick={onDecrement}>
              <Minus size={16} />
            </QuantityButton>
            <span className="w-8 text-center">{quantity}</span>
            <QuantityButton onClick={onIncrement}>
              <Plus size={16} />
            </QuantityButton>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {price
                ? `${price.amount} ${price.currencyCode} each`
                : "Not available"}
            </div>
            <div className="text-lg font-medium">
              {price
                ? `${total.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })} ${price.currencyCode}`
                : "Not available"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subTotal,
  tax,
  total,
  currency,
  onCheckout,
  disabled,
}) => (
  <div className="p-6 space-y-6 bg-white rounded-lg dark:bg-gray-800">
    <h2 className="text-xl font-semibold">Order Summary</h2>

    <div className="space-y-4">
      <div className="flex justify-between">
        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
        <span>
          {subTotal.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          {currency}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-600 dark:text-gray-400">Tax (10%)</span>
        <span>
          {tax.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          {currency}
        </span>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">Total</span>
          <span className="text-lg font-medium">
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
        w-full py-4 text-white transition-all rounded-lg
        flex items-center justify-center gap-2
        ${
          disabled
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-secondary hover:bg-secondary-hover active:scale-[0.98]"
        }
      `}
    >
      <ShoppingCart size={20} />
      <span>{disabled ? "Cart is Empty" : "Proceed to Checkout"}</span>
      {!disabled && <ArrowRight size={20} />}
    </button>

    <div className="grid gap-3">
      <CartFeature
        icon={Shield}
        title="Secure Checkout"
        description="Your payment information is encrypted and secure"
      />
      <CartFeature
        icon={Clock}
        title="Instant Access"
        description="Get immediate access to your digital purchases"
      />
      <CartFeature
        icon={CreditCard}
        title="Multiple Payment Options"
        description="Pay with credit card, PayPal, or other methods"
      />
    </div>
  </div>
);

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const access_token = useAppSelector(getCurrentToken);
  const cart = useAppSelector(getUserCart);
  const books = useAppSelector(getLoadedBooks);

  const [total, setTotal] = useState<number>(0);
  const [subTotal, setSubTotal] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [currency, setCurrency] = useState<string>("");
  const [loadedBookIds, setLoadedBookIds] = useState<string[]>([]);

  const [addToCart] = useAddToCartMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [removeWholeItemFromCart] = useRemoveWholeItemFromCartMutation();
  const {
    data: cartData,
    isFetching,
    refetch: refetchCart,
  } = useGetCartQuery(access_token);

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

  useEffect(() => {
    if (cart && cart.books) {
      setLoadedBookIds(Object.keys(cart.books));
    }
  }, [cart]);

  useEffect(() => {
    if (!isFetching && cartData && books.length > 0) {
      dispatch(setUserCart(cartData));

      let newSubtotal = 0;
      let currencyCode = "";

      books.forEach((book) => {
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

  const bookLoaders = loadedBookIds.map((id) => (
    <BookLoaderComponent key={id} book_id={id} />
  ));

  const validBooks = books.filter((book) => cart.books && cart.books[book.id]);
  const isCartEmpty = !validBooks.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {bookLoaders}

      <div className="container px-4 py-8 mx-auto">
        <h1 className="mb-8 text-3xl font-bold">Your Cart</h1>

        {isCartEmpty ? (
          <div className="flex flex-col items-center justify-center gap-4 p-12 bg-white rounded-lg dark:bg-gray-800">
            <PackageOpen className="w-16 h-16 text-gray-400" />
            <p className="text-xl text-gray-500">Your cart is empty</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 text-white transition-all rounded-lg bg-secondary hover:bg-secondary-hover"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {validBooks.map((book) => (
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

            <div className="lg:col-span-1">
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
    </div>
  );
};

export default CartPage;
