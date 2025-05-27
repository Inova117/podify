
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Building2, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { MockCheckoutModal } from "@/components/MockCheckoutModal";

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const plans = [
    {
      id: "hobby",
      name: "Hobby",
      price: "$9",
      period: "/month",
      description: "Perfect for content creators getting started",
      icon: Zap,
      features: [
        "5 audio uploads per month",
        "Basic content generation",
        "Email support",
        "Standard processing speed",
        "Basic analytics"
      ],
      popular: false,
      color: "from-blue-600 to-purple-600"
    },
    {
      id: "pro",
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "For serious content creators and small teams",
      icon: Crown,
      features: [
        "50 audio uploads per month",
        "Advanced content generation",
        "Priority support",
        "Fast processing speed",
        "Advanced analytics",
        "Custom templates",
        "Brand customization"
      ],
      popular: true,
      color: "from-purple-600 to-pink-600"
    },
    {
      id: "agency",
      name: "Agency",
      price: "$99",
      period: "/month",
      description: "For agencies and large content teams",
      icon: Building2,
      features: [
        "Unlimited audio uploads",
        "Premium content generation",
        "24/7 dedicated support",
        "Instant processing",
        "Enterprise analytics",
        "White-label solution",
        "API access",
        "Team collaboration",
        "Custom integrations"
      ],
      popular: false,
      color: "from-pink-600 to-red-600"
    }
  ];

  const handleSubscribe = (planId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setSelectedPlan(planId);
    setShowCheckout(true);
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className="text-white hover:bg-white/10 mb-8"
          >
            ← Back to Home
          </Button>
          <h1 className="text-5xl font-bold text-white mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Transform your audio content into viral social media posts with AI-powered tools
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card 
                key={plan.id}
                className={`relative bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 ${
                  plan.popular ? 'scale-105 border-2 border-purple-400' : ''
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white">
                    {plan.name}
                  </CardTitle>
                  <div className="text-white/80 mb-2">
                    {plan.description}
                  </div>
                  <div className="text-4xl font-bold text-white">
                    {plan.price}
                    <span className="text-lg text-white/60">{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3 text-white/90">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white font-semibold py-3`}
                  >
                    Subscribe Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h3 className="text-lg font-semibold text-white mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-white/70">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-white mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-white/70">
                We accept all major credit cards, PayPal, and bank transfers for enterprise plans.
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-white mb-2">
                Is there a free trial?
              </h3>
              <p className="text-white/70">
                Yes, all plans come with a 7-day free trial. No credit card required to start.
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-white mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-white/70">
                We offer a 30-day money-back guarantee if you're not satisfied with our service.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mock Checkout Modal */}
      {showCheckout && selectedPlan && (
        <MockCheckoutModal
          plan={plans.find(p => p.id === selectedPlan)!}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
};

export default Pricing;
