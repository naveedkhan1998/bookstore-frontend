import { Minus, X } from "lucide-react";
import { useCallback, useRef, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "./Button";

const Modal = ({ children }: { children: ReactNode }) => {
  const overlay = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

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
    <div
      ref={overlay}
      className="flex flex-col fixed z-10 left-0 right-0 top-0 bottom-0 mx-auto bg-black/80  max-h-screen items-center justify-center"
      onClick={handleClick}
    >
      <div className="flex flex-col items-center justify-center bg-zinc-400 w-full lg:w-[60dvw] z-50 p-5 mt-24 rounded-t-3xl shadow-2xl">
        <Button
          variant={"default"}
          size={"default"}
          onClick={onDismiss}
          className="p-2 bg-gray-200 rounded-full "
        >
          <X className="w-6 h-6 text-gray-700" />
        </Button>
      </div>
      <div
        ref={wrapper}
        className="flex flex-col justify-center items-center w-full lg:w-[60dvw] flex-grow bg-zinc-400 overflow-auto " /////// Fixxxxxxxxxxxxxxxxxxxxxxxxxxxx
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
