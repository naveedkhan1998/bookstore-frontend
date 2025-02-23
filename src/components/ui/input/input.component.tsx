import React, { forwardRef, InputHTMLAttributes, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { Eye, EyeOff } from "lucide-react";

const inputVariants = cva(
  [
    "w-full",
    "px-4",
    "py-2.5",
    "text-gray-900",
    "dark:text-white",
    "bg-white",
    "dark:bg-dark-secondary",
    "border",
    "rounded-lg",
    "transition-all",
    "duration-200",
    "focus:outline-none",
    "focus:ring-2",
    "disabled:cursor-not-allowed",
    "disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        default: [
          "border-gray-300",
          "dark:border-gray-600",
          "focus:border-accent-DEFAULT",
          "dark:focus:border-accent-DEFAULT",
          "focus:ring-accent-DEFAULT/20",
        ],
        error: [
          "border-red-500",
          "focus:border-red-500",
          "focus:ring-red-500/20",
          "animate-shake",
        ],
      },
      size: {
        default: ["text-base"],
        sm: ["text-sm", "px-3", "py-2"],
        lg: ["text-lg", "px-5", "py-3"],
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const labelVariants = cva(["text-sm", "font-medium", "transition-colors"], {
  variants: {
    variant: {
      default: ["text-gray-700", "dark:text-gray-200"],
      error: ["text-red-500"],
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  label: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  hidePasswordToggle?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      className,
      id,
      type = "text",
      startIcon,
      endIcon,
      size,
      disabled,
      required,
      hidePasswordToggle = false,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, "-")}`;
    const variant = error ? "error" : "default";
    const inputType = type === "password" && showPassword ? "text" : type;

    const togglePassword = () => setShowPassword((prev) => !prev);

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className={labelVariants({ variant })}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {startIcon}
            </div>
          )}
          <input
            {...props}
            ref={ref}
            id={inputId}
            type={inputType}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            className={twMerge(
              inputVariants({ variant, size, className }),
              startIcon && "pl-10",
              (endIcon || (type === "password" && !hidePasswordToggle)) &&
                "pr-10",
            )}
          />
          {endIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {endIcon}
            </div>
          )}
          {type === "password" && !hidePasswordToggle && (
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-sm text-red-500"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
