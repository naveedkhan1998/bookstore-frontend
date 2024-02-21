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
      <div className="relative">
        <span>{buttonProps.children}</span>
        {number > 0 && (
          <span className="absolute bottom-3 left-5 bg-red-500 text-grey rounded-full w-6 h-6 flex items-center justify-center p-2.5 ">
            {number}
          </span>
        )}
      </div>
    </BaseButton>
  );
};

export default Button;
