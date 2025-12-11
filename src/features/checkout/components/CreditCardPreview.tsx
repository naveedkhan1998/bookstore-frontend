import type { FC } from "react";
import { CreditCard } from "lucide-react";

interface CreditCardPreviewProps {
  cardNumber?: string;
  expiryDate?: string;
}

const CreditCardPreview: FC<CreditCardPreviewProps> = ({
  cardNumber,
  expiryDate,
}) => (
  <div className="relative w-full aspect-[1.586/1] perspective-1000">
    <div className="absolute inset-0 p-6 rounded-2xl bg-gradient-to-br from-secondary via-secondary-hover to-secondary-dark shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
      <div className="h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-xs uppercase opacity-80">Card Number</p>
            <p className="font-mono text-lg tracking-wider">
              {cardNumber?.replace(/(.{4})/g, "$1 ").trim() ||
                "•••• •••• •••• ••••"}
            </p>
          </div>
          <CreditCard className="w-8 h-8 opacity-80" />
        </div>
        <div>
          <p className="text-xs uppercase opacity-80">Expires</p>
          <p className="font-mono">{expiryDate || "MM/YYYY"}</p>
        </div>
      </div>
    </div>
  </div>
);

export default CreditCardPreview;
