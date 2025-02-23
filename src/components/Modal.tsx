import { X } from "lucide-react";
import { useCallback, useRef, ReactNode, useEffect, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import Button from "./ui/button/Button";

const modalVariants = cva(
  [
    "relative",
    "w-[calc(100%-2rem)]",
    "mx-auto",
    "bg-main-primary",
    "dark:bg-dark-primary",
    "text-main-text",
    "dark:text-dark-text",
    "rounded-lg",
    "shadow-xl",
    "flex",
    "flex-col",
    "max-h-[90vh]",
  ],
  {
    variants: {
      size: {
        default: ["max-w-2xl"],
        sm: ["max-w-sm"],
        lg: ["max-w-4xl"],
        xl: ["max-w-6xl"],
        full: ["max-w-[calc(100%-2rem)]"],
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

interface ModalProps extends VariantProps<typeof modalVariants> {
  children: ReactNode;
  onClose?: () => void;
  title?: string;
  description?: string;
  showCloseButton?: boolean;
  closeOnClickOutside?: boolean;
  closeOnEsc?: boolean;
  className?: string;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({
    children,
    onClose,
    title,
    description,
    showCloseButton = true,
    closeOnClickOutside = true,
    closeOnEsc = true,
    size,
    className,
  }) => {
    const overlay = useRef<HTMLDivElement>(null);
    const wrapper = useRef<HTMLDivElement>(null);

    const handleDismiss = useCallback(() => {
      onClose ? onClose() : window.history.back();
    }, [onClose]);

    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        if (e.target === overlay.current && closeOnClickOutside) {
          handleDismiss();
        }
      },
      [handleDismiss, closeOnClickOutside],
    );

    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape" && closeOnEsc) {
          handleDismiss();
        }
      };

      if (closeOnEsc) {
        document.addEventListener("keydown", handleEscape);
      }
      return () => document.removeEventListener("keydown", handleEscape);
    }, [handleDismiss, closeOnEsc]);

    useEffect(() => {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "auto";
      };
    }, []);

    return (
      <div
        ref={overlay}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm p-4"
        onClick={handleClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        aria-describedby={description ? "modal-description" : undefined}
      >
        <div
          className={twMerge(modalVariants({ size }), className)}
          ref={wrapper}
        >
          {/* Fixed Header */}
          <div className="flex items-center justify-between p-4 border-b bg-main-secondary dark:bg-dark-secondary border-gray-200 dark:border-gray-700 rounded-t-lg">
            <div className="flex-1 min-w-0">
              {title && (
                <h2 id="modal-title" className="text-lg font-semibold truncate">
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id="modal-description"
                  className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2"
                >
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <Button
                onClick={handleDismiss}
                variant="ghost"
                size="icon"
                className="flex-shrink-0 -mr-2"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 min-h-0">{children}</div>
        </div>
      </div>
    );
  },
);

Modal.displayName = "Modal";

export default Modal;
