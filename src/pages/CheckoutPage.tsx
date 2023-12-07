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

  const handleSubmit = async () => {
    const data = { ...to };
    await addToTransactions({ data, access_token });
  };

  useEffect(() => {
    if (CheckoutDone) {
      dispatch(unSetUserCart());
      dispatch(unsetLoadedBook());
      toast.success("Items Bought");
      navigate('/')
    }
  }, [CheckoutDone]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <form>
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
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
          >
            Pay Now
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
