import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, Gift } from "lucide-react";

interface EmailCaptureProps {
  onEmailSubmit: (email: string) => void;
}

export const EmailCapture = ({ onEmailSubmit }: EmailCaptureProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onEmailSubmit(email);
      toast.success("Email registered! You can now spin the wheel!");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Card className="p-8 max-w-md mx-auto text-center bg-gradient-background border-2 border-primary/20">
      <div className="mb-6">
        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-glow-pulse">
          <Gift className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Win Amazing Prizes!
        </h2>
        <p className="text-muted-foreground">
          Enter your email to spin our wheel of fortune and unlock exclusive deals!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 h-12 text-center border-2 border-primary/30 focus:border-primary"
            required
          />
        </div>
        
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-gradient-primary hover:opacity-90 text-white font-bold rounded-full shadow-card"
        >
          {isSubmitting ? "Registering..." : "SPIN TO WIN!"}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground mt-4">
        By entering your email, you agree to receive promotional offers from our store.
        You can unsubscribe at any time.
      </p>
    </Card>
  );
};