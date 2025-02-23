import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  id,
  className,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className={`
          text-sm font-medium
          ${error ? "text-red-500" : "text-gray-700 dark:text-gray-200"}
        `}
      >
        {label}
      </label>
      <input
        {...props}
        id={id}
        className={`
          w-full px-4 py-2.5
          text-gray-900 dark:text-white
          bg-white dark:bg-dark-secondary
          border rounded-lg
          transition-colors duration-200
          ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              : "border-gray-300 dark:border-gray-600 focus:border-accent-DEFAULT dark:focus:border-accent-DEFAULT focus:ring-accent-DEFAULT/20"
          }
          focus:outline-none focus:ring-2
          ${className || ""}
        `}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
