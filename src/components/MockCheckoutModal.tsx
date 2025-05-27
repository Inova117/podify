
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, CreditCard, Shield, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
}

interface MockCheckoutModalProps {
  plan: Plan;
  onClose: () => void;
}

export const MockCheckoutModal = ({ plan, onClose }: MockCheckoutModalProps) => {
  const [step, setStep] = useState<"payment" | "processing" | "success" | "error">("payment");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePayment = () => {
    if (!cardNumber || !expiryDate || !cvc || !email) {
      toast({
        title: "Please fill in all fields",
        description: "All payment fields are required",
        variant: "destructive",
      });
      return;
    }

    setStep("processing");
    
    // Simulate payment processing
    setTimeout(() => {
      // 80% success rate for demo
      const success = Math.random() > 0.2;
      setStep(success ? "success" : "error");
      
      if (success) {
        // Store mock subscription in localStorage
        const subscription = {
          planId: plan.id,
          planName: plan.name,
          price: plan.price,
          period: plan.period,
          status: "active",
          subscribedAt: new Date().toISOString(),
        };
        localStorage.setItem("mockSubscription", JSON.stringify(subscription));
        
        toast({
          title: "Payment Successful!",
          description: `You're now subscribed to the ${plan.name} plan`,
        });
      } else {
        toast({
          title: "Payment Failed",
          description: "Please try again or use a different payment method",
          variant: "destructive",
        });
      }
    }, 3000);
  };

  const handleRetry = () => {
    setStep("payment");
  };

  const handleGoToDashboard = () => {
    onClose();
    navigate("/dashboard");
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            {step === "payment" ? "Complete Your Purchase" : 
             step === "processing" ? "Processing Payment" :
             step === "success" ? "Payment Successful!" : "Payment Failed"}
          </DialogTitle>
          <DialogDescription>
            {step === "payment" ? `Subscribe to ${plan.name} plan for ${plan.price}${plan.period}` :
             step === "processing" ? "Please wait while we process your payment..." :
             step === "success" ? "Welcome to your new subscription!" : "Something went wrong with your payment"}
          </DialogDescription>
        </DialogHeader>

        {step === "payment" && (
          <div className="space-y-6">
            {/* Plan Summary */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{plan.name} Plan</h3>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">{plan.price}</div>
                    <div className="text-sm text-gray-600">{plan.period}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                    maxLength={4}
                  />
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              <span>Your payment information is secure and encrypted</span>
            </div>

            <Button onClick={handlePayment} className="w-full">
              Subscribe Now - {plan.price}{plan.period}
            </Button>
          </div>
        )}

        {step === "processing" && (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-600" />
            <p className="text-lg">Processing your payment...</p>
            <p className="text-sm text-gray-600 mt-2">This may take a few moments</p>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
            <h3 className="text-lg font-semibold mb-2">Welcome to {plan.name}!</h3>
            <p className="text-gray-600 mb-6">
              Your subscription is now active. You can start using all the features right away.
            </p>
            <Badge className="mb-6">Subscription Active</Badge>
            <div className="space-y-3">
              <Button onClick={handleGoToDashboard} className="w-full">
                Go to Dashboard
              </Button>
              <Button variant="outline" onClick={onClose} className="w-full">
                Close
              </Button>
            </div>
          </div>
        )}

        {step === "error" && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-2xl">❌</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Payment Failed</h3>
            <p className="text-gray-600 mb-6">
              We couldn't process your payment. Please check your card details and try again.
            </p>
            <div className="space-y-3">
              <Button onClick={handleRetry} className="w-full">
                Try Again
              </Button>
              <Button variant="outline" onClick={onClose} className="w-full">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
