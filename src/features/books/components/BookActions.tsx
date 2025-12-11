import type { FC } from "react";
import { ShoppingCart, AlertTriangle, Bookmark } from "lucide-react";
import ActionButton from "./ActionButton";

interface BookList {
  _id: string;
  name: string;
  isPrivate: boolean;
}

interface BookActionsProps {
  hasPrice: boolean;
  addingToCart: boolean;
  addingToBooklist: boolean;
  selectedBooklistID: string;
  booklists?: BookList[];
  onAddToCart: () => void;
  onAddToBooklist: () => void;
  onBooklistSelect: (id: string) => void;
}

const BookActions: FC<BookActionsProps> = ({
  hasPrice,
  addingToCart,
  addingToBooklist,
  selectedBooklistID,
  booklists,
  onAddToCart,
  onAddToBooklist,
  onBooklistSelect,
}) => (
  <div className="flex flex-col gap-4">
    {hasPrice ? (
      <ActionButton
        onClick={onAddToCart}
        isLoading={addingToCart}
        icon={ShoppingCart}
        label="Add to Cart"
      />
    ) : (
      <ActionButton
        onClick={() => {}}
        icon={AlertTriangle}
        label="Sold Out"
        variant="danger"
        disabled
      />
    )}

    <div className="flex gap-3">
      <select
        value={selectedBooklistID}
        onChange={(e) => onBooklistSelect(e.target.value)}
        className="flex-1 p-3 rounded-full border border-gray-200 dark:border-gray-700 
                   bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Booklist</option>
        {booklists?.map((list) => (
          <option key={list._id} value={list._id}>
            {list.name} ({list.isPrivate ? "Private" : "Public"})
          </option>
        ))}
      </select>
      <ActionButton
        onClick={onAddToBooklist}
        isLoading={addingToBooklist}
        icon={Bookmark}
        variant="secondary"
        label=""
      />
    </div>
  </div>
);

export default BookActions;
