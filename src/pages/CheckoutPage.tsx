// CheckoutPage.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { getCurrentToken } from "../features/authSlice";
import { useAddToTransactionsMutation } from "../services/transactionsServices";
import { Button, TextInput, Label, Card } from "flowbite-react";
import { unSetUserCart } from "../features/cartSlice";
import { toast } from "react-toastify";
import { unsetLoadedBook } from "../features/loadBookSlice";
import { FaCreditCard, FaCalendarAlt, FaLock } from "react-icons/fa";

interface FormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { to } = location.state as {
    to: { items: Record<string, number>; price: number };
  };
  const access_token = useAppSelector(getCurrentToken);
  const [addToTransactions, { isSuccess: checkoutDone }] =
    useAddToTransactionsMutation();

  const [formData, setFormData] = useState<FormData>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!/^[0-9]{16}$/.test(formData.cardNumber)) {
      newErrors.cardNumber =
        "Invalid card number. Please enter a 16-digit number.";
    }

    if (!/^(0[1-9]|1[0-2])\/\d{4}$/.test(formData.expiryDate)) {
      newErrors.expiryDate =
        "Invalid expiry date. Please enter MM/YYYY format.";
    } else {
      const [month, year] = formData.expiryDate.split("/");
      const expiryDate = new Date(parseInt(year), parseInt(month) - 1);
      if (expiryDate < new Date()) {
        newErrors.expiryDate = "Card has expired. Please use a valid card.";
      }
    }

    if (!/^[0-9]{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = "Invalid CVV. Please enter a 3 or 4 digit number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateForm()) {
      try {
        await addToTransactions({ data: to, access_token });
      } catch {
        toast.error("An error occurred during checkout. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (checkoutDone) {
      dispatch(unSetUserCart());
      dispatch(unsetLoadedBook());
      toast.success("Purchase successful! Thank you for your order.");
      navigate("/");
    }
  }, [checkoutDone, dispatch, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen min-w-[40dvw] m-auto ">
      <Card className="w-full max-w-md p-8 space-y-8 shadow-xl bg-main-secondary dark:bg-dark-secondary rounded-xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
          Checkout
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="cardNumber"
              value="Card Number"
              className="flex items-center space-x-2"
            >
              <FaCreditCard className="text-gray-500" />
              <span>Card Number</span>
            </Label>
            <TextInput
              id="cardNumber"
              name="cardNumber"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={handleChange}
              color={errors.cardNumber ? "failure" : undefined}
              helperText={errors.cardNumber}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="expiryDate"
                value="Expiry Date"
                className="flex items-center space-x-2"
              >
                <FaCalendarAlt className="text-gray-500" />
                <span>Expiry Date</span>
              </Label>
              <TextInput
                id="expiryDate"
                name="expiryDate"
                type="text"
                placeholder="MM/YYYY"
                value={formData.expiryDate}
                onChange={handleChange}
                color={errors.expiryDate ? "failure" : undefined}
                helperText={errors.expiryDate}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="cvv"
                value="CVV"
                className="flex items-center space-x-2"
              >
                <FaLock className="text-gray-500" />
                <span>CVV</span>
              </Label>
              <TextInput
                id="cvv"
                name="cvv"
                type="text"
                placeholder="123"
                value={formData.cvv}
                onChange={handleChange}
                color={errors.cvv ? "failure" : undefined}
                helperText={errors.cvv}
                className="w-full"
              />
            </div>
          </div>
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full py-3 font-bold text-white transition duration-300 bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Pay ${to.price.toFixed(2)}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CheckoutPage;
