import type { FC, ReactNode } from "react";
import { Minus, Plus } from "lucide-react";

interface QuantityButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}

export const QuantityButton: FC<QuantityButtonProps> = ({
  onClick,
  disabled,
  children,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="flex items-center justify-center w-8 h-8 transition-all rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-50"
  >
    {children}
  </button>
);

interface QuantityControlProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const QuantityControl: FC<QuantityControlProps> = ({
  quantity,
  onIncrement,
  onDecrement,
}) => (
  <div className="flex items-center gap-3">
    <QuantityButton onClick={onDecrement}>
      <Minus size={16} />
    </QuantityButton>
    <span className="w-8 text-center">{quantity}</span>
    <QuantityButton onClick={onIncrement}>
      <Plus size={16} />
    </QuantityButton>
  </div>
);

export default QuantityControl;
