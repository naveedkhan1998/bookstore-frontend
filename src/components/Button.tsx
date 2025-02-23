import React, { ComponentProps } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

export const buttonStyles = cva(["transitions-colors"], {
  variants: {
    variant: {
      default: ["bg-black/30", "hover:bg-black/20"],
      ghost: ["hover:bg-black/30"],
      dark: ["bg-dark-primary", "hover:bg-dark-secondary", "text-gray"],
    },
    size: {
      default: ["rounded", "p-2"],
      icon: [
        "rounded-full",
        "w-10",
        "h-10",
        "flex",
        "items-center",
        "justify-center",
        "p-2.5",
      ],
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type ButtonProps = VariantProps<typeof buttonStyles> & ComponentProps<"button">;

const BaseButton = ({
  variant,
  size,
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      className={twMerge(buttonStyles({ variant, size }), className)}
    >
      {children}
    </button>
  );
};

type NumberButtonProps = ButtonProps & {
  number?: number;
};

const Button = ({ number = 0, ...buttonProps }: NumberButtonProps) => {
  return (
    <BaseButton {...buttonProps}>
      <div className="relative inline-flex items-center">
        <span>{buttonProps.children}</span>
        {number > 0 && (
          <span className="absolute -top-4 -right-4 bg-red-600/75 text-xs font-bold rounded-full min-w-[1.5rem] h-6 flex items-center justify-center px-1 hover:animate-pulse">
            {number}
          </span>
        )}
      </div>
    </BaseButton>
  );
};

export default Button;
