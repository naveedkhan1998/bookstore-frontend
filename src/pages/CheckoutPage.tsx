import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CreditCard, Calendar, Lock, Loader2 } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { getCurrentToken } from "../features/authSlice";
import { useAddToTransactionsMutation } from "../services/transactionsServices";
import { unSetUserCart } from "../features/cartSlice";
import { unsetLoadedBook } from "../features/loadBookSlice";

interface FormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

// Custom Input Component
const FormInput = ({
  label,
  icon: Icon,
  error,
  ...props
}: {
  label: string;
  icon: any;
  error?: string;
  [key: string]: any;
}) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
      <Icon className="w-4 h-4" />
      {label}
    </label>
    <input
      {...props}
      className={`
        w-full px-4 py-2.5 
        bg-white dark:bg-gray-800 
        border rounded-lg 
        transition-colors duration-200
        placeholder:text-gray-400 dark:placeholder:text-gray-500
        ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
            : "border-gray-200 dark:border-gray-700 focus:border-secondary focus:ring-secondary/20"
        }
        focus:outline-none focus:ring-2
      `}
    />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

// Credit Card Preview Component
const CreditCardPreview = ({ cardNumber, expiryDate }: Partial<FormData>) => (
  <div className="relative w-full aspect-[1.586/1] perspective-1000">
    <div className="absolute inset-0 p-6 rounded-2xl bg-gradient-to-br from-secondary via-secondary-hover to-secondary-dark shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
      <div className="h-full flex flex-col justify-between text-white">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-xs uppercase opacity-80">Card Number</p>
            <p className="font-mono text-lg tracking-wider">
              {cardNumber?.replace(/(.{4})/g, "$1 ").trim() ||
                "•••• •••• •••• ••••"}
            </p>
          </div>
          <CreditCard className="w-8 h-8 opacity-80" />
        </div>
        <div>
          <p className="text-xs uppercase opacity-80">Expires</p>
          <p className="font-mono">{expiryDate || "MM/YYYY"}</p>
        </div>
      </div>
    </div>
  </div>
);

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { to } = location.state as {
    to: { items: Record<string, number>; price: number };
  };

  const access_token = useAppSelector(getCurrentToken);
  const [addToTransactions, { isLoading, isSuccess: checkoutDone }] =
    useAddToTransactionsMutation();

  const [formData, setFormData] = useState<FormData>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number
    if (name === "cardNumber") {
      formattedValue = value.replace(/\D/g, "").slice(0, 16);
    }

    // Format expiry date
    if (name === "expiryDate") {
      formattedValue = value
        .replace(/\D/g, "")
        .slice(0, 6)
        .replace(/(\d{2})(\d)/, "$1/$2");
    }

    // Format CVV
    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!/^[0-9]{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
      newErrors.cardNumber = "Please enter a valid 16-digit card number";
    }

    if (!/^(0[1-9]|1[0-2])\/\d{4}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = "Please enter a valid expiry date (MM/YYYY)";
    } else {
      const [month, year] = formData.expiryDate.split("/");
      const expiryDate = new Date(parseInt(year), parseInt(month) - 1);
      if (expiryDate < new Date()) {
        newErrors.expiryDate = "This card has expired";
      }
    }

    if (!/^[0-9]{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = "Please enter a valid CVV";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await addToTransactions({ data: to, access_token });
      } catch {
        toast.error("Payment failed. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (checkoutDone) {
      dispatch(unSetUserCart());
      dispatch(unsetLoadedBook());
      toast.success("Payment successful!");
      navigate("/");
    }
  }, [checkoutDone, dispatch, navigate]);

  return (
    <div className="container max-w-4xl px-4 py-8 mx-auto">
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold text-center">Secure Checkout</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Credit Card Preview */}
          <div className="order-1 lg:order-none">
            <CreditCardPreview {...formData} />

            <div className="mt-8 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <h2 className="text-lg font-semibold">Order Summary</h2>
              <div className="mt-4 flex justify-between items-center text-lg">
                <span>Total Amount:</span>
                <span className="font-bold">${to.price.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              label="Card Number"
              icon={CreditCard}
              name="cardNumber"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={handleChange}
              error={errors.cardNumber}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Expiry Date"
                icon={Calendar}
                name="expiryDate"
                type="text"
                placeholder="MM/YYYY"
                value={formData.expiryDate}
                onChange={handleChange}
                error={errors.expiryDate}
              />

              <FormInput
                label="CVV"
                icon={Lock}
                name="cvv"
                type="password"
                placeholder="•••"
                value={formData.cvv}
                onChange={handleChange}
                error={errors.cvv}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full px-6 py-3 
                text-white font-medium
                bg-secondary hover:bg-secondary-hover
                rounded-lg shadow-lg
                transform transition-all duration-200
                flex items-center justify-center gap-2
                disabled:opacity-50 disabled:cursor-not-allowed
                ${!isLoading && "hover:scale-[1.02] active:scale-[0.98]"}
              `}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>Pay ${to.price.toFixed(2)}</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
