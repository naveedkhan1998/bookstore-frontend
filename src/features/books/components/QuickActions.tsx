import type { FC } from "react";
import { Heart, Share2 } from "lucide-react";

interface QuickActionsProps {
  isLiked: boolean;
  onLikeToggle: () => void;
  onShare?: () => void;
}

const QuickActions: FC<QuickActionsProps> = ({
  isLiked,
  onLikeToggle,
  onShare,
}) => (
  <div className="flex justify-around py-4 border-t border-b border-gray-200 dark:border-gray-700">
    <button
      onClick={onLikeToggle}
      className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-red-500"
    >
      <Heart
        className={`w-6 h-6 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
      />
      <span className="text-sm">Like</span>
    </button>
    <button
      onClick={onShare}
      className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-blue-500"
    >
      <Share2 className="w-6 h-6" />
      <span className="text-sm">Share</span>
    </button>
  </div>
);

export default QuickActions;
