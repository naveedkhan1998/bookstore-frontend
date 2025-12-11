import type { FC } from "react";
import { Loader2 } from "lucide-react";

interface ActionButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  icon: React.ElementType;
  label: string;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}

const ActionButton: FC<ActionButtonProps> = ({
  onClick,
  isLoading = false,
  icon: Icon,
  label,
  variant = "primary",
  disabled = false,
}) => {
  const baseStyles =
    "flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300";
  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl",
    secondary:
      "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 shadow hover:shadow-md",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl",
  };

  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`${baseStyles} ${variants[variant]} ${
        isLoading || disabled
          ? "opacity-50 cursor-not-allowed"
          : "transform hover:scale-105"
      }`}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Icon className="w-5 h-5" />
      )}
      {label}
    </button>
  );
};

export default ActionButton;
