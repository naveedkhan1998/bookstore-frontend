import { useEffect, type FC, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CreditCard, Calendar, Lock, Loader2 } from "lucide-react";
import { useAppSelector } from "@/app/store/hooks";
import { getCurrentToken } from "@/features/auth/authSlice";
import { useAddToTransactionsMutation } from "@/services/api/transactions";
import PageContent from "@/shared/layouts/PageContent";
import { Grid } from "@/shared/layouts/ContentComponents";
import {
  FormInput,
  CreditCardPreview,
  OrderSummaryCard,
} from "@/features/checkout/components";
import { useCheckoutForm } from "@/features/checkout/hooks/useCheckoutForm";

const CheckoutPage: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { to } = location.state as {
    to: { items: Record<string, number>; price: number };
  };

  const access_token = useAppSelector(getCurrentToken);
  const [addToTransactions, { isLoading, isSuccess: checkoutDone }] =
    useAddToTransactionsMutation();

  const { formData, errors, handleChange, validateForm } = useCheckoutForm();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
      toast.success("Payment successful!");
      navigate("/");
    }
  }, [checkoutDone, navigate]);

  return (
    <PageContent
      title="Secure Checkout"
      subtitle="Complete your purchase securely"
      icon={CreditCard}
    >
      <Grid cols={{ default: 1, lg: 2 }} className="gap-8">
        {/* Credit Card Preview */}
        <div className="order-1 lg:order-none">
          <CreditCardPreview
            cardNumber={formData.cardNumber}
            expiryDate={formData.expiryDate}
          />
          <OrderSummaryCard totalPrice={to.price} />
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
              bg-main-primary dark:bg-dark-primary cursor-pointer 
              hover:scale-[1.02] font-medium
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
      </Grid>
    </PageContent>
  );
};

export default CheckoutPage;
