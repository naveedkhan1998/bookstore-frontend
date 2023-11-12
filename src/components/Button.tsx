import React, { ComponentProps } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

export const buttonStyles = cva(["transitions-colors"], {
  variants: {
    variant: {
      default: ["bg-secondary", "hover:bg-secondary-hover"],
      ghost: ["hover:bg-gray-100"],
      dark: [
        "bg-secondary-dark",
        "hover:bg-secondary-dark-hover",
        "text-secondary",
      ],
    },
    size: {
      default: ["rounded", "p-2"],
      icon: [
        "rounded-full",
        "w-10",
        "h-10",
        "flex",
        "item-center",
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
      <div className="relative">
        <span>{buttonProps.children}</span>
        {number > 0 && (
          <span className="absolute bottom-3 left-5 bg-slate-800 text-white rounded-full p-1 text-xs">
            {number}
          </span>
        )}
      </div>
    </BaseButton>
  );
};

export default Button;
