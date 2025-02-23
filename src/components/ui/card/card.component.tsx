import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  image?: {
    src: string;
    alt: string;
  };
}

const Card = ({ children, className, onClick, image }: CardProps) => {
  return (
    <div
      onClick={onClick}
      className={twMerge(
        "overflow-hidden rounded-lg bg-main-secondary dark:bg-dark-secondary",
        "transition-all duration-300 ease-in-out",
        "hover:shadow-lg hover:scale-[1.02]",
        "cursor-pointer",
        "border border-gray-200 dark:border-gray-700",
        className,
      )}
    >
      {image && (
        <div className="aspect-[3/4] relative overflow-hidden">
          <img
            src={image.src}
            alt={image.alt}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
};

export default Card;
