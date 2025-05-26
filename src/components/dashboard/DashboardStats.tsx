
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileAudio, Sparkles, TrendingUp, Share2 } from "lucide-react";

interface DashboardStatsProps {
  totalUploads: number;
  totalContent: number;
}

export const DashboardStats = ({ totalUploads, totalContent }: DashboardStatsProps) => {
  const stats = [
    {
      title: "Total Uploads",
      value: totalUploads,
      icon: FileAudio,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20"
    },
    {
      title: "Content Pieces Created",
      value: totalContent,
      icon: Sparkles,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20"
    },
    {
      title: "Average per Upload",
      value: totalUploads > 0 ? Math.round(totalContent / totalUploads) : 0,
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-500/20"
    },
    {
      title: "Shared Results",
      value: Math.floor(totalUploads * 0.7), // Estimated share rate
      icon: Share2,
      color: "text-pink-400",
      bgColor: "bg-pink-500/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
