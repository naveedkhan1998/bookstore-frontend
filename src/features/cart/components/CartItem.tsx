import type { FC } from "react";
import { Trash2 } from "lucide-react";
import type { BookVolume } from "@/shared/types/api";
import DefaultPic from "@/assets/pp.jpg";
import { QuantityControl } from "./QuantityControl";

interface CartItemProps {
  book: BookVolume;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
  onClick: () => void;
}

const CartItem: FC<CartItemProps> = ({
  book,
  quantity,
  onIncrement,
  onDecrement,
  onRemove,
  onClick,
}) => {
  const price = book.saleInfo.listPrice;
  const total = price ? price.amount * quantity : 0;

  return (
    <div className="flex gap-6 p-4 transition-all rounded-lg bg-white dark:bg-gray-800 hover:shadow-lg">
      <div
        className="relative w-24 cursor-pointer aspect-[3/4] overflow-hidden rounded-lg"
        onClick={onClick}
      >
        <img
          src={book.volumeInfo.imageLinks?.thumbnail || DefaultPic}
          alt={book.volumeInfo.title}
          className="object-cover w-full h-full transition-transform duration-200 hover:scale-105"
        />
      </div>

      <div className="flex flex-col flex-grow gap-2">
        <div className="flex items-start justify-between">
          <div>
            <h2
              className="text-lg font-medium cursor-pointer truncate max-w-[200px] md:max-w-fit hover:text-secondary"
              onClick={onClick}
            >
              {book.volumeInfo.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {book.volumeInfo.authors?.join(", ")}
            </p>
          </div>
          <button
            onClick={onRemove}
            className="p-2 text-gray-400 transition-colors rounded-full hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="flex items-end justify-between mt-auto">
          <QuantityControl
            quantity={quantity}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
          />

          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {price
                ? `${price.amount} ${price.currencyCode} each`
                : "Not available"}
            </div>
            <div className="text-lg font-medium">
              {price
                ? `${total.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })} ${price.currencyCode}`
                : "Not available"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
