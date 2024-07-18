import React, { useEffect, useState } from "react";
import { useAddToCartMutation, useGetCartQuery, useRemoveFromCartMutation, useRemoveWholeItemFromCartMutation } from "../services/cartServices";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getCurrentToken } from "../features/authSlice";
import { getUserCart, setUserCart } from "../features/cartSlice";
import BookLoaderComponent from "../components/BookLoaderComponent";
import { getLoadedBooks, unsetLoadedBook } from "../features/loadBookSlice";
import DefaultPic from "../assets/pp.jpg";

import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useAddToTransactionsMutation } from "../services/transactionsServices";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { Button } from "flowbite-react";
import { BookVolume } from "../comman-types";

interface Book {
  id: string;
  volumeInfo: {
    title: string;
    imageLinks?: {
      thumbnail: string;
    };
  };
  saleInfo: {
    listPrice?: {
      amount: number;
      currencyCode: string;
    };
  };
}

interface Cart {
  books: {
    [key: string]: number;
  };
}

const CartPage: React.FC = () => {
  const access_token = useAppSelector(getCurrentToken);
  const cart = useAppSelector(getUserCart);
  const books = useAppSelector(getLoadedBooks);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [addToCart] = useAddToCartMutation();
  const { data: cartData, isSuccess: CartSuccess, isFetching, refetch: refetchCart } = useGetCartQuery(access_token);

  const [removeFromCart] = useRemoveFromCartMutation();
  const [removeWholeItemFromCart] = useRemoveWholeItemFromCartMutation();

  const [total, setTotal] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [currency, setCurrency] = useState("");

  const handleClick = async (id: string) => {
    const book_id = { book_id: id };
    await addToCart({ book_id, access_token });
    toast.success("Book Added To Cart");
    refetchCart();
  };

  const handleDecrementClick = async (id: string) => {
    const book_id = { book_id: id };
    await removeFromCart({ book_id, access_token });
    toast.success("Book Decremented From Cart");
    refetchCart();
  };

  const handleRemoveClick = async (id: string) => {
    const book_id = { book_id: id };
    await removeWholeItemFromCart({ book_id, access_token });
    dispatch(unsetLoadedBook());
    toast.success("Book Removed From Cart");
    refetchCart();
  };

  const handleDivClick = (id: string) => {
    navigate(`/book/${id}`);
  };

  useEffect(() => {
    if (!isFetching && cartData) {
      dispatch(setUserCart(cartData));

      let newSubtotal = 0;
      let currencyCode = "";

      books.forEach((book: BookVolume) => {
        if (book.saleInfo.listPrice) {
          newSubtotal += book.saleInfo.listPrice.amount * cartData.books[book.id];
        }
        if (book.saleInfo.listPrice?.currencyCode) {
          currencyCode = book.saleInfo.listPrice?.currencyCode;
        }
      });

      const taxRate = 0.1;
      const newTax = newSubtotal * taxRate;
      const newestSubtotal = newSubtotal;
      const newTotal = newSubtotal + newTax;

      setTax(newTax);
      setSubTotal(newestSubtotal);
      setTotal(newTotal);
      setCurrency(currencyCode);

      if (isNaN(newTotal)) {
        setTax(0);
        setSubTotal(0);
        setTotal(0);
        dispatch(unsetLoadedBook());
      }
    }
  }, [isFetching, books, cartData, dispatch]);

  return (
    <div className="container px-4 py-8 mx-auto">
      {cart && Object.keys(cart.books).map((obj) => <BookLoaderComponent key={obj} book_id={obj} />)}
      <h1 className="mb-8 text-3xl font-bold text-center">Your Shopping Cart</h1>
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="lg:w-2/3">
          {books && books.length > 0 ? (
            books.map(
              (book: BookVolume) =>
                cart.books[book.id] && (
                  <div key={book.id} className="mb-6 overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
                    <div className="flex flex-col sm:flex-row">
                      <img src={book.volumeInfo.imageLinks?.thumbnail || DefaultPic} alt="Book Thumbnail" className="object-cover w-full h-48 sm:w-32 sm:h-auto" />
                      <div className="flex-grow p-4">
                        <h2 className="mb-2 text-xl font-semibold">{book.volumeInfo.title}</h2>
                        <p className="mb-2 text-gray-600 dark:text-gray-300">Quantity: {cart.books[book.id]}</p>
                        <p className="mb-2 text-gray-600 dark:text-gray-300">
                          Price: {book.saleInfo.listPrice ? `${book.saleInfo.listPrice.amount} ${book.saleInfo.listPrice.currencyCode}` : "Not available"}
                        </p>
                        <p className="mb-4 text-gray-600 dark:text-gray-300">
                          Total:{" "}
                          {book.saleInfo.listPrice
                            ? `${(book.saleInfo.listPrice.amount * cart.books[book.id]).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })} ${book.saleInfo.listPrice.currencyCode}`
                            : "Not available"}
                        </p>
                        <div className="flex space-x-2">
                          <Button size="sm" color="blue" onClick={() => handleClick(book.id)}>
                            <Plus size={16} />
                          </Button>
                          <Button size="sm" color="gray" onClick={() => handleDecrementClick(book.id)}>
                            <Minus size={16} />
                          </Button>
                          <Button size="sm" color="red" onClick={() => handleRemoveClick(book.id)}>
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
            )
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">Your cart is empty</p>
          )}
        </div>
        <div className="lg:w-1/3">
          <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <h2 className="mb-6 text-2xl font-semibold">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Subtotal:</span>
                <span>
                  {subTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Tax (10%):</span>
                <span>
                  {tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
                </span>
              </div>
              <div className="pt-4 mt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-semibold">Total:</span>
                  <span className="text-xl font-semibold">
                    {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
                  </span>
                </div>
              </div>
            </div>
            {total > 0 ? (
              <Link to="/checkout" state={{ to: { items: cart.books, price: total } }}>
                <Button color="blue" className="w-full mt-6">
                  <ShoppingCart className="mr-2" size={20} />
                  Proceed to Checkout
                </Button>
              </Link>
            ) : (
              <Button disabled color="blue" className="w-full mt-6">
                <ShoppingCart className="mr-2" size={20} />
                Checkout
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
