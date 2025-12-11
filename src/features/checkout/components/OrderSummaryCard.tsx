import type { FC } from "react";

interface OrderSummaryCardProps {
  totalPrice: number;
}

const OrderSummaryCard: FC<OrderSummaryCardProps> = ({ totalPrice }) => (
  <div className="mt-8 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
    <h2 className="text-lg font-semibold">Order Summary</h2>
    <div className="mt-4 flex justify-between items-center text-lg">
      <span>Total Amount:</span>
      <span className="font-bold">${totalPrice.toFixed(2)}</span>
    </div>
  </div>
);

export default OrderSummaryCard;
