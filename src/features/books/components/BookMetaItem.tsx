import type { FC } from "react";

interface BookMetaItemProps {
  icon: React.ElementType;
  label: string;
  value: string | number | undefined;
}

const BookMetaItem: FC<BookMetaItemProps> = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
    <Icon className="w-5 h-5" />
    <div className="flex flex-col">
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      <span className="font-medium">{value || "N/A"}</span>
    </div>
  </div>
);

export default BookMetaItem;
