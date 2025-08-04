import { useState } from "react";
import { SpinWheel } from "@/components/SpinWheel";
import { EmailCapture } from "@/components/EmailCapture";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Store, Sparkles } from "lucide-react";

const Index = () => {
  const [hasEnteredEmail, setHasEnteredEmail] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");

  const handleEmailSubmit = (email: string) => {
    setCustomerEmail(email);
    setHasEnteredEmail(true);
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <div className="text-center py-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Store className="w-10 h-10 text-primary" />
          <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Lucky Spin
          </h1>
          <Sparkles className="w-10 h-10 text-primary" />
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto px-4">
          Welcome to our store's lucky wheel! Spin to win amazing discounts and prizes.
        </p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        {!hasEnteredEmail ? (
          <EmailCapture onEmailSubmit={handleEmailSubmit} />
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Welcome Message */}
            <Card className="p-6 mb-8 text-center bg-card/80 backdrop-blur">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Welcome back, {customerEmail.split('@')[0]}! 🎉
              </h2>
              <p className="text-muted-foreground">
                You're eligible for one free spin. Good luck!
              </p>
            </Card>

            {/* Spin Wheel */}
            <SpinWheel />
          </div>
        )}
      </div>

      {/* Footer with Prizes */}
      <div className="mt-16 py-8 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-6">Possible Prizes</h3>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="secondary" className="text-lg px-4 py-2">🎁 Free Item</Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">🔥 30% OFF</Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">💎 25% OFF</Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">🎉 20% OFF</Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">✨ 15% OFF</Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">⭐ 10% OFF</Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">🚚 Free Shipping</Badge>
          </div>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            All prizes are valid for today's purchase only. Present your winning screen to any staff member to redeem your prize.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;