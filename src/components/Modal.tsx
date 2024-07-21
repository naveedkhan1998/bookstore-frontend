import { X } from "lucide-react";
import { useCallback, useRef, ReactNode } from "react";
import Button from "./Button";

const Modal = ({ children }: { children: ReactNode }) => {
  const overlay = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);

  const onDismiss = useCallback(() => {
    window.history.back();
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlay.current && onDismiss) {
        onDismiss();
      }
    },
    [onDismiss, overlay]
  );

  return (
    <div ref={overlay} className="fixed top-0 bottom-0 left-0 right-0 z-10 flex flex-col items-center justify-center max-h-screen mx-auto bg-black/80" onClick={handleClick}>
      <div className="z-50 flex flex-col items-end justify-center w-full p-1 mt-16 border-b rounded-t-lg shadow-2xl bg-main-secondary dark:bg-dark-secondary lg:max-w-7xl">
        <Button onClick={onDismiss} className="p-2 mr-3 rounded-full">
          <X />
        </Button>
      </div>
      <div
        ref={wrapper}
        className="flex flex-col items-center justify-center flex-grow w-full overflow-auto lg:max-w-7xl bg-main-secondary dark:bg-dark-secondary " /////// Fixxxxxxxxxxxxxxxxxxxxxxxxxxxx
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
