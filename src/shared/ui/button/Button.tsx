import { ComponentProps, forwardRef } from "react";
import { VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { buttonStyles } from "./button.styles";

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
