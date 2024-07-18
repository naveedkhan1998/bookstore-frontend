// CheckoutPage.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { getCurrentToken } from "../features/authSlice";
import { useAddToTransactionsMutation } from "../services/transactionsServices";
import { Button, TextInput, Label } from "flowbite-react";
import { unSetUserCart } from "../features/cartSlice";
import { toast } from "react-toastify";
import { unsetLoadedBook } from "../features/loadBookSlice";

interface FormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { to } = location.state as { to: { items: Record<string, number>; price: number } };
  const access_token = useAppSelector(getCurrentToken);
  const [addToTransactions, { isSuccess: checkoutDone }] = useAddToTransactionsMutation();

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
      newErrors.cardNumber = "Invalid card number. Please enter a 16-digit number.";
    }

    if (!/^(0[1-9]|1[0-2])\/\d{4}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = "Invalid expiry date. Please enter MM/YYYY format.";
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
      } catch (error) {
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white shadow-lg dark:bg-gray-800 rounded-xl">
        <h1 className="mb-6 text-3xl font-bold text-center text-gray-800 dark:text-white">Checkout</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="cardNumber" value="Card Number" />
            <TextInput
              id="cardNumber"
              name="cardNumber"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={handleChange}
              color={errors.cardNumber ? "failure" : undefined}
              helperText={errors.cardNumber}
            />
          </div>
          <div>
            <Label htmlFor="expiryDate" value="Expiry Date" />
            <TextInput
              id="expiryDate"
              name="expiryDate"
              type="text"
              placeholder="MM/YYYY"
              value={formData.expiryDate}
              onChange={handleChange}
              color={errors.expiryDate ? "failure" : undefined}
              helperText={errors.expiryDate}
            />
          </div>
          <div>
            <Label htmlFor="cvv" value="CVV" />
            <TextInput id="cvv" name="cvv" type="text" placeholder="123" value={formData.cvv} onChange={handleChange} color={errors.cvv ? "failure" : undefined} helperText={errors.cvv} />
          </div>
          <Button type="submit" className="w-full">
            Pay ${to.price.toFixed(2)}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
