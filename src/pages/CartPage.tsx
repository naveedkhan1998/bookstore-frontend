import React, { useEffect, useState } from "react";
import {
  useAddToCartMutation,
  useGetCartQuery,
  useRemoveFromCartMutation,
  useRemoveWholeItemFromCartMutation,
} from "../services/cartServices";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getCurrentToken } from "../features/authSlice";
import { getUserCart, setUserCart } from "../features/cartSlice";
import BookLoaderComponent from "../components/BookLoaderComponent";
import { getLoadedBooks, unsetLoadedBook } from "../features/loadBookSlice";
import DefaultPic from "../assets/pp.jpg";
import Button from "../components/Button";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useAddToTransactionsMutation } from "../services/transactionsServices";
import { Trash2 } from "lucide-react";

const CartPage = () => {
  const access_token = useAppSelector(getCurrentToken);
  const cart = useAppSelector(getUserCart);
  const books = useAppSelector(getLoadedBooks);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [addToCart, { isLoading: addedToCart }] = useAddToCartMutation();
  const {
    data: cartData,
    isSuccess: CartSuccess,
    isFetching,
    refetch: refetchCart,
  } = useGetCartQuery(access_token);

  const [
    addToTransactions,
    { isLoading: CheckoutDone },
  ] = useAddToTransactionsMutation();

  const [
    removeFromCart,
    { isLoading: RemovingFromCart },
  ] = useRemoveFromCartMutation();
  const [
    removeWholeItemFromCart,
    { isLoading: RemovingItemFromCart },
  ] = useRemoveWholeItemFromCartMutation();

  const [total, setTotal] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [currency, setCurrency] = useState("");

  const handleClick = async (id: String) => {
    const book_id = { book_id: id };
    await addToCart({ book_id, access_token });
    //toast('book')
  };

  const handleDecrementClick = async (id: String) => {
    const book_id = { book_id: id };
    await removeFromCart({ book_id, access_token });
  };
  const handleRemoveClick = async (id: String) => {
    const book_id = { book_id: id };
    await removeWholeItemFromCart({ book_id, access_token });
  };

  const handleDivClick = (id: String) => {
    navigate(`/book/${id}`);
  };

  useEffect(() => {
    if (addedToCart) {
      toast.success("Book Added To Cart");
    }
    if (RemovingFromCart) {
      toast.success("Book Decremented From Cart");
    }
    if (RemovingItemFromCart) {
      dispatch(unsetLoadedBook());
      toast.success("Book Removed From Cart");
    }
    refetchCart();
  }, [addedToCart, RemovingFromCart, RemovingItemFromCart]);

  useEffect(() => {
    if (!isFetching && cartData) {
      dispatch(setUserCart(cartData));

      let newSubtotal = 0;
      let currencyCode = "";

      books.forEach((book) => {
        if (book.saleInfo.listPrice) {
          newSubtotal +=
            book.saleInfo.listPrice.amount * cartData.books[book.id];
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
    <>
      {cart &&
        Object.keys(cart.books).map((obj) => (
          <BookLoaderComponent book_id={obj} />
        ))}
      <div className="flex md:flex-row flex-col items center justify-center w-full p-6 ">
        <div className="flex flex-col w-[80dvw] md:w-[60dvw] rounded-md shadow-xl p-6  m-3 ">
          <div className="p-6 font-bold text-2xl">Shopping Cart</div>
          {books &&
            books.map((book) => (
              <>
                {cart.books[book.id] && (
                  <div
                    key={book.id}
                    className="flex flex-row justify-start items-start rounded-md hover:bg-zinc-500 bg-zinc-400 p-4"
                  >
                    <img
                      src={book.volumeInfo.imageLinks?.thumbnail || DefaultPic}
                      alt="Book Thumbnail"
                      className="rounded-md shadow-lg m-3 object-cover"
                    />

                    <div
                      onClick={() => handleDivClick(book.id)}
                      className="flex flex-col w-full"
                    >
                      <h2 className="text-lg font-bold mt-3">
                        {book.volumeInfo.title}
                      </h2>
                      <h3 className="text-sm mt-2">
                        Quantity x {cart.books[book.id]}
                      </h3>
                      <h3 className="text-sm mt-2">
                        Price:{" "}
                        {book.saleInfo.listPrice
                          ? `${book.saleInfo.listPrice.amount} ${book.saleInfo.listPrice.currencyCode}`
                          : "Not available"}
                      </h3>
                      <h3 className="text-sm mt-2">
                        Total:{" "}
                        {book.saleInfo.listPrice
                          ? `${(
                              book.saleInfo.listPrice.amount *
                              cart.books[book.id]
                            ).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })} ${book.saleInfo.listPrice.currencyCode}`
                          : "Not available"}
                      </h3>
                    </div>
                    <div className="flex items-center mt-2 flex-shrink">
                      <Button
                        className="ml-2"
                        size={"icon"}
                        onClick={() => handleClick(book.id)}
                      >
                        +
                      </Button>
                      <Button
                        className="ml-2"
                        size={"icon"}
                        onClick={() => handleDecrementClick(book.id)}
                      >
                        -
                      </Button>
                      <Button
                        className="ml-2 bg-red-600 hover:bg-red-500"
                        size={"icon"}
                        onClick={() => handleRemoveClick(book.id)}
                
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ))}
        </div>
        <div className="flex flex-col w-[80dvw] md:w-[40dvw] rounded-md shadow-xl p-6 m-3 space-y-8 h-full">
          <div className="text-2xl font-bold mb-4">Checkout</div>

          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span>
              {subTotal.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              {currency}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Tax (10%):</span>
            <span>
              {tax.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              {currency}
            </span>
          </div>

          <div className="flex justify-between items-center border-t pt-4">
            <span className="text-xl font-bold">Total:</span>
            <span className="text-xl font-bold">
              {total.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              {currency}
            </span>
          </div>

          {total ? (
            <Link
              to="/checkout"
              state={{ to: { items: cart.books, price: total } }}
            >
              <Button className="bg-blue-500 w-full text-white p-2 rounded hover:bg-blue-600 focus:outline-none">
                Checkout
              </Button>
            </Link>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;
