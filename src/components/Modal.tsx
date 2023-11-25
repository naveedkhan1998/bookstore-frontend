import { Minus } from "lucide-react";
import { useCallback, useRef, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

const Modal = ({ children }: { children: ReactNode }) => {
  const overlay = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const onDismiss = useCallback(() => {
    navigate("/");
  }, [navigate]);

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
      className="flex flex-col fixed z-10 left-0 right-0 top-0 bottom-0 mx-auto bg-black/80"
      onClick={handleClick}
    >
      <div className="flex flex-col items-center justify-center bg-zinc-400 w-full z-50 absolute h-[10%] mt-24 rounded-t-3xl shadow-2xl">
        <Button
          variant={"default"}
          size={"default"}
          onClick={onDismiss}
          className="p-2 bg-gray-200 rounded-full"
        >
          <Minus className="w-6 h-6 text-gray-700" />
        </Button>
      </div>
      <div
        ref={wrapper}
        className="flex flex-col justify-start items-center absolute h-[80%] w-full bottom-0 bg-zinc-400 rounded-b-3xl lg:px-40 px-8 pt-14 pb-72 overflow-auto"
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
