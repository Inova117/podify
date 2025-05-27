
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Calendar, CreditCard, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Subscription {
  planId: string;
  planName: string;
  price: string;
  period: string;
  status: string;
  subscribedAt: string;
}

export const SubscriptionStatus = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const mockSub = localStorage.getItem("mockSubscription");
    if (mockSub) {
      setSubscription(JSON.parse(mockSub));
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-300";
      case "canceled":
        return "bg-red-500/20 text-red-300";
      case "past_due":
        return "bg-yellow-500/20 text-yellow-300";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case "pro":
      case "agency":
        return <Crown className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  if (!subscription) {
    return (
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            No Active Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/70 mb-4">
            Upgrade to unlock advanced features and higher limits.
          </p>
          <Button
            onClick={() => navigate("/pricing")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            View Pricing Plans
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          {getPlanIcon(subscription.planId)}
          Current Plan: {subscription.planName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Badge className={getStatusColor(subscription.status)}>
            {subscription.status.toUpperCase()}
          </Badge>
          <span className="text-white font-semibold">
            {subscription.price}{subscription.period}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-white/70">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">
            Subscribed on {new Date(subscription.subscribedAt).toLocaleDateString()}
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/pricing")}
            className="text-white border-white/20 hover:bg-white/10"
          >
            Change Plan
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Mock subscription cancellation
              const updatedSub = { ...subscription, status: "canceled" };
              localStorage.setItem("mockSubscription", JSON.stringify(updatedSub));
              setSubscription(updatedSub);
            }}
            className="text-red-300 hover:bg-red-500/20"
          >
            Cancel Subscription
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
