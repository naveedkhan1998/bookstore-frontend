import { X } from "lucide-react";
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
      <div ref={wrapper} className="modal_wrapper">
        {children}
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={onDismiss}
          className="absolute bottom-10 bg-opacity-50"
        >
          <X className="w-17 h-17" />
        </Button>
      </div>
    </div>
  );
};

export default Modal;
