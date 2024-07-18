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
      <div className="flex flex-col items-end justify-center bg-main-secondary dark:bg-dark-secondary w-full lg:w-[80dvw] z-50 p-1 border-b mt-16 rounded-t-3xl shadow-2xl">
        <Button variant={"default"} size={"default"} onClick={onDismiss} className="p-2 mr-3 bg-gray-200 rounded-full">
          <X />
        </Button>
      </div>
      <div
        ref={wrapper}
        className="flex flex-col justify-center items-center w-full lg:w-[80dvw] flex-grow bg-main-secondary dark:bg-dark-secondary overflow-auto " /////// Fixxxxxxxxxxxxxxxxxxxxxxxxxxxx
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
