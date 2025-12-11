import type { FC } from "react";
import { ShoppingCart, ArrowRight, Shield, Clock, CreditCard } from "lucide-react";
import CartFeature from "./CartFeature";

interface OrderSummaryProps {
  subTotal: number;
  tax: number;
  total: number;
  currency: string;
  onCheckout: () => void;
  disabled: boolean;
}

const OrderSummary: FC<OrderSummaryProps> = ({
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
        w-full py-4 transition-all bg-main-primary dark:bg-dark-primary cursor-pointer hover:scale-[1.02] rounded-lg
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

export default OrderSummary;
