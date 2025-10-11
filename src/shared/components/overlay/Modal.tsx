import { X } from "lucide-react";
import {
  useCallback,
  useRef,
  ReactNode,
  useEffect,
  forwardRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import Button from "@/shared/ui/button/Button";

const modalVariants = cva(
  [
    "relative",
    "w-[min(90vw,56rem)]",
    "mx-auto",
    "bg-main-primary",
    "dark:bg-dark-primary",
    "text-main-text",
    "dark:text-dark-text",
    "rounded-2xl",
    "shadow-2xl",
    "flex",
    "flex-col",
    "max-h-[calc(100vh-6rem)]",
    "overflow-hidden",
  ],
  {
    variants: {
      size: {
        default: [],
        sm: ["w-[min(90vw,28rem)]"],
        lg: ["w-[min(92vw,72rem)]"],
        xl: ["w-[min(94vw,90rem)]"],
        full: ["w-[min(96vw,102rem)]", "max-h-[calc(100vh-4rem)]"],
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
  (
    {
      children,
      onClose,
      title,
      description,
      showCloseButton = true,
      closeOnClickOutside = true,
      closeOnEsc = true,
      size,
      className,
    },
    ref,
  ) => {
    const overlay = useRef<HTMLDivElement>(null);
    const wrapper = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

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
      setMounted(true);
      return () => setMounted(false);
    }, []);

    useEffect(() => {
      if (!mounted) return;
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }, [mounted]);

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

    if (!mounted) {
      return null;
    }

    const modalMarkup = (
      <div
        ref={overlay}
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4"
        onClick={handleClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        aria-describedby={description ? "modal-description" : undefined}
      >
        <div
          className={twMerge(modalVariants({ size }), className)}
          ref={(node) => {
            (wrapper as React.MutableRefObject<HTMLDivElement | null>).current =
              node;
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              (ref as React.MutableRefObject<HTMLDivElement | null>).current =
                node;
            }
          }}
        >
          <div className="flex items-start justify-between gap-3 border-b border-gray-200/70 bg-main-secondary/80 px-6 py-4 dark:border-gray-700/60 dark:bg-dark-secondary/80">
            <div className="flex-1 min-w-0">
              {title && (
                <h2
                  id="modal-title"
                  className="text-lg font-semibold leading-tight"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id="modal-description"
                  className="mt-1 text-sm text-gray-500 dark:text-gray-400"
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
                className="flex-shrink-0"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        </div>
      </div>
    );

    return createPortal(modalMarkup, document.body);
  },
);

Modal.displayName = "Modal";

export default Modal;
