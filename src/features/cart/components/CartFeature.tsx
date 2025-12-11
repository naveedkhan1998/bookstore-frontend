import type { FC } from "react";
import type { LucideIcon } from "lucide-react";

interface CartFeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const CartFeature: FC<CartFeatureProps> = ({
  icon: Icon,
  title,
  description,
}) => (
  <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
    <Icon className="w-6 h-6 text-secondary" />
    <div>
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  </div>
);

export default CartFeature;
