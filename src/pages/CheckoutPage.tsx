// CheckoutPage.tsx
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { getCurrentToken } from "../features/authSlice";
import { useAddToTransactionsMutation } from "../services/transactionsServices";
import { useGetCartQuery } from "../services/cartServices";
import { Button } from "flowbite-react";
import { useDispatch } from "react-redux";
import { unSetUserCart } from "../features/cartSlice";
import { toast } from "react-toastify";
import { unsetLoadedBook } from "../features/loadBookSlice";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { to } = location.state;
  const access_token = useAppSelector(getCurrentToken);
  const [
    addToTransactions,
    { isSuccess: CheckoutDone },
  ] = useAddToTransactionsMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cardNumber = event.currentTarget.cardNumber.value;
    const expiryDate = event.currentTarget.expiryDate.value;
    const cvv = event.currentTarget.cvv.value;

    if (!/^[0-9]+$/.test(cardNumber)) {
      toast.error("Invalid card number. Please enter a valid card number.");
      return;
    }

    if (!/^(0[1-9]|1[0-2])\/\d{4}$/.test(expiryDate)) {
      toast.error(
        "Invalid expiry date. Please enter a valid MM/YYYY expiry date."
      );
      return;
    }

    if (!/^[0-9]+$/.test(cvv)) {
      toast.error("Invalid CVV. Please enter a valid CVV.");
      return;
    }

    const data = { ...to };

    // Call the API only if the form is valid
    await addToTransactions({ data, access_token });
  };

  useEffect(() => {
    if (CheckoutDone) {
      dispatch(unSetUserCart());
      dispatch(unsetLoadedBook());
      toast.success("Items Bought");
      navigate("/");
    }
  }, [CheckoutDone]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="cardNumber"
              className="block text-sm font-medium text-gray-600"
            >
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Enter your card number"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="expiryDate"
              className="block text-sm font-medium text-gray-600"
            >
              Expiry Date
            </label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="MM/YYYY"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="cvv"
              className="block text-sm font-medium text-gray-600"
            >
              CVV
            </label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              className="mt-1 p-2 w-full border rounded-md"
              placeholder="Enter CVV"
              required
            />
          </div>
          <Button
            type="submit"
            className="bg-blue-500 text-gray py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
          >
            Pay Now
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
