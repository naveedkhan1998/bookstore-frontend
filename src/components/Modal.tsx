import { Minus, X } from "lucide-react";
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
    <div ref={overlay} className="modal" onClick={handleClick}>
      <Button
        variant={"default"}
        size={"default"}
        onClick={onDismiss}
        className="absolute top-1/4 right-1/2 bg-opacity-50 z-50"
      >
        <Minus className="w-17 h-17" />
      </Button>
      <div ref={wrapper} className="modal_wrapper">
        {children}
      </div>
    </div>
  );
};

export default Modal;
