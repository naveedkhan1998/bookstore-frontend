import { X } from "lucide-react";
import { useCallback, useRef, ReactNode, useEffect } from "react";
import Button from "./Button";

const Modal = ({ children, onClose }: { children: ReactNode; onClose?: () => void }) => {
  const overlay = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);

  const handleDismiss = useCallback(() => {
    onClose ? onClose() : window.history.back();
  }, [onClose]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlay.current) {
        handleDismiss();
      }
    },
    [handleDismiss]
  );

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleDismiss();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [handleDismiss]);

  return (
    <div ref={overlay} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 dark:bg-black/20 backdrop-blur-sm" onClick={handleClick}>
      <div className="relative w-full max-w-4xl max-h-[90vh]  rounded-lg shadow-xl overflow-auto bg-main-primary dark:bg-dark-primary text-main-text dark:text-dark-text" ref={wrapper}>
        <nav className="sticky top-0 z-50 flex justify-end p-4 bg-main-secondary dark:bg-dark-secondary">
          <Button onClick={handleDismiss} className="p-1 transition-colors " aria-label="Close modal">
            <X size={24} />
          </Button>
        </nav>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
