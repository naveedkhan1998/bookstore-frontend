import { ComponentProps, forwardRef } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

export const buttonStyles = cva(
  [
    "relative",
    "inline-flex",
    "items-center",
    "justify-center",
    "font-medium",
    "rounded-lg",
    "transition-all",
    "duration-200",
    "select-none",
    "shadow-sm",
    "hover:shadow-md",
    "active:scale-[0.98]",
    "disabled:opacity-50",
    "disabled:pointer-events-none",
    "disabled:shadow-none",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-secondary",
          "text-white",
          "hover:bg-secondary-hover",
          "active:bg-secondary-border",
          "border",
          "border-secondary/20",
        ],
        ghost: [
          "bg-transparent",
          "hover:bg-gray-100",
          "dark:hover:bg-gray-800",
          "text-gray-700",
          "dark:text-gray-300",
        ],
        dark: [
          "bg-gray-900",
          "dark:bg-gray-100",
          "text-white",
          "dark:text-gray-900",
          "hover:bg-gray-800",
          "dark:hover:bg-gray-200",
          "border",
          "border-gray-700/20",
          "dark:border-gray-300/20",
        ],
        outline: [
          "border-2",
          "border-secondary",
          "text-secondary",
          "dark:text-secondary-hover",
          "bg-transparent",
          "hover:bg-secondary",
          "hover:text-white",
          "dark:hover:text-white",
        ],
        soft: [
          "bg-secondary/10",
          "text-secondary-dark",
          "dark:text-secondary-hover",
          "hover:bg-secondary/20",
          "active:bg-secondary/30",
        ],
        danger: [
          "bg-red-500",
          "text-white",
          "hover:bg-red-600",
          "active:bg-red-700",
          "border",
          "border-red-400/20",
        ],
        success: [
          "bg-emerald-500",
          "text-white",
          "hover:bg-emerald-600",
          "active:bg-emerald-700",
          "border",
          "border-emerald-400/20",
        ],
      },
      size: {
        default: ["text-sm", "px-4", "py-2", "h-10"],
        sm: ["text-xs", "px-3", "py-1.5", "h-8"],
        lg: ["text-base", "px-6", "py-3", "h-12"],
        icon: ["w-10", "h-10", "p-2", "rounded-full", "aspect-square"],
        "icon-sm": ["w-8", "h-8", "p-1.5", "rounded-full", "aspect-square"],
        "icon-lg": ["w-12", "h-12", "p-2.5", "rounded-full", "aspect-square"],
      },
      isLoading: {
        true: ["opacity-70", "cursor-wait"],
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      isLoading: false,
    },
  },
);

type ButtonProps = VariantProps<typeof buttonStyles> &
  ComponentProps<"button"> & {
    number?: number;
  };

const BaseButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className={twMerge(buttonStyles({ variant, size }), className)}
      >
        {children}
      </button>
    );
  },
);
BaseButton.displayName = "BaseButton";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ number = 0, ...buttonProps }, ref) => {
    return (
      <BaseButton ref={ref} {...buttonProps}>
        <div className="relative inline-flex items-center gap-2">
          <span>{buttonProps.children}</span>
          {number > 0 && (
            <span
              className="absolute -top-2.5 -right-2.5 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold text-white bg-red-500 rounded-full animate-in fade-in duration-200"
              aria-label={`${number} items`}
            >
              {number}
            </span>
          )}
        </div>
      </BaseButton>
    );
  },
);
Button.displayName = "Button";

export default Button;
