import type { FC } from "react";
import { ContentCard } from "@/shared/layouts/ContentComponents";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
}

const StatCard: FC<StatCardProps> = ({ title, value, icon: Icon, color }) => (
  <ContentCard className="p-6">
    <div className="flex items-center space-x-4">
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </ContentCard>
);

export default StatCard;
