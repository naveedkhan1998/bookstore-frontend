import type { FC } from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating?: number;
}

const RatingStars: FC<RatingStarsProps> = ({ rating = 4.5 }) => (
  <div className="flex items-center gap-2">
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
    <span className="text-sm text-gray-600 dark:text-gray-300">{rating}/5</span>
  </div>
);

export default RatingStars;
