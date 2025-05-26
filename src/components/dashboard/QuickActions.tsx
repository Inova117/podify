
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileAudio, Zap, BookOpen, Settings } from "lucide-react";

export const QuickActions = () => {
  const actions = [
    {
      title: "Upload New Podcast",
      description: "Transform your latest episode into viral content",
      icon: FileAudio,
      action: () => window.location.href = '/',
      color: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
    },
    {
      title: "Quick Generate",
      description: "Fast-track content creation",
      icon: Zap,
      action: () => window.location.href = '/#upload-section',
      color: "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
    },
    {
      title: "Browse Templates",
      description: "Explore content templates and examples",
      icon: BookOpen,
      action: () => window.location.href = '/#faq-section',
      color: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
    },
    {
      title: "Account Settings",
      description: "Customize your preferences",
      icon: Settings,
      action: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
      color: "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
    }
  ];

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                onClick={action.action}
                className={`${action.color} text-white p-4 h-auto flex flex-col items-start gap-2 transition-all duration-300 transform hover:scale-105`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="font-semibold">{action.title}</span>
                </div>
                <span className="text-xs text-white/80 text-left">{action.description}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
