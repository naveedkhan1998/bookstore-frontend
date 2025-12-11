import type { FC } from "react";

interface PriceTagProps {
  amount: number;
  currencyCode: string;
  isRetail?: boolean;
}

const PriceTag: FC<PriceTagProps> = ({
  amount,
  currencyCode,
  isRetail = false,
}) => (
  <div
    className={`flex items-center gap-2 ${isRetail ? "text-gray-500 text-sm line-through" : "text-2xl font-bold"}`}
  >
    <span>{currencyCode}</span>
    <span>{amount}</span>
  </div>
);

export default PriceTag;
