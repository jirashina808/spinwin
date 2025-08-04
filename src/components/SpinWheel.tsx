import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Gift, Sparkles, Star } from "lucide-react";

interface Prize {
  id: number;
  text: string;
  probability: number;
  color: string;
  icon: string;
}

const prizes: Prize[] = [
  { id: 1, text: "20% OFF", probability: 15, color: "hsl(280 100% 60%)", icon: "🎉" },
  { id: 2, text: "FREE ITEM", probability: 5, color: "hsl(145 100% 45%)", icon: "🎁" },
  { id: 3, text: "25% OFF", probability: 10, color: "hsl(30 100% 60%)", icon: "💎" },
  { id: 4, text: "15% OFF", probability: 20, color: "hsl(200 100% 60%)", icon: "✨" },
  { id: 5, text: "FREE SHIPPING", probability: 20, color: "hsl(320 100% 70%)", icon: "🚚" },
  { id: 6, text: "30% OFF", probability: 8, color: "hsl(45 100% 65%)", icon: "🔥" },
  { id: 7, text: "10% OFF", probability: 15, color: "hsl(350 100% 65%)", icon: "⭐" },
  { id: 8, text: "TRY AGAIN", probability: 7, color: "hsl(0 60% 60%)", icon: "🔄" },
];

export const SpinWheel = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<Prize | null>(null);
  const [hasSpun, setHasSpun] = useState(false);

  const spinWheel = () => {
    if (isSpinning || hasSpun) return;

    setIsSpinning(true);
    setWinner(null);

    // Generate random outcome based on probabilities
    const random = Math.random() * 100;
    let cumulative = 0;
    let selectedPrize = prizes[0];

    for (const prize of prizes) {
      cumulative += prize.probability;
      if (random <= cumulative) {
        selectedPrize = prize;
        break;
      }
    }

    // Calculate rotation to land on selected prize
    const segmentAngle = 360 / prizes.length;
    const prizeIndex = prizes.findIndex(p => p.id === selectedPrize.id);
    const targetAngle = prizeIndex * segmentAngle + segmentAngle / 2;
    const spinAmount = 1440 + (360 - targetAngle); // 4 full rotations + adjustment

    setRotation(prev => prev + spinAmount);

    // Show result after animation
    setTimeout(() => {
      setIsSpinning(false);
      setWinner(selectedPrize);
      setHasSpun(true);
      toast.success(`🎉 You won: ${selectedPrize.text}!`);
    }, 3000);
  };

  const resetWheel = () => {
    setHasSpun(false);
    setWinner(null);
    setRotation(0);
  };

  return (
    <div className="flex flex-col items-center gap-8 p-6">
      {/* Wheel Container */}
      <div className="relative">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
          <div className="w-6 h-8 bg-foreground clip-triangle drop-shadow-lg"></div>
        </div>

        {/* Wheel */}
        <div 
          className="relative w-80 h-80 rounded-full border-8 border-foreground shadow-glow overflow-hidden"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
          }}
        >
          {prizes.map((prize, index) => {
            const angle = (360 / prizes.length) * index;
            const nextAngle = (360 / prizes.length) * (index + 1);
            
            return (
              <div
                key={prize.id}
                className="absolute w-full h-full"
                style={{
                  clipPath: `polygon(50% 50%, 
                    ${50 + 50 * Math.sin((angle * Math.PI) / 180)}% ${50 - 50 * Math.cos((angle * Math.PI) / 180)}%, 
                    ${50 + 50 * Math.sin((nextAngle * Math.PI) / 180)}% ${50 - 50 * Math.cos((nextAngle * Math.PI) / 180)}%)`,
                  backgroundColor: prize.color,
                }}
              >
                <div 
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ 
                    transform: `rotate(${angle + (360 / prizes.length) / 2}deg)`,
                    transformOrigin: 'center center'
                  }}
                >
                  <div className="text-center text-white font-bold transform -translate-y-16">
                    {prize.text.includes('%') ? (
                      <div>
                        <div className="text-4xl font-black filter drop-shadow-lg leading-none">
                          {prize.text.split(' ')[0]}
                        </div>
                        <div className="text-lg font-bold filter drop-shadow-lg mt-1">
                          {prize.text.split(' ')[1]}
                        </div>
                      </div>
                    ) : (
                      <div className="text-lg font-bold filter drop-shadow-lg max-w-20 mx-auto leading-tight">
                        {prize.text}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Center Circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center shadow-lg border-4 border-white">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Spin Button */}
      <Button
        onClick={spinWheel}
        disabled={isSpinning || hasSpun}
        size="lg"
        className="bg-gradient-primary hover:opacity-90 text-xl px-8 py-4 rounded-full shadow-card animate-glow-pulse disabled:opacity-50 disabled:animate-none"
      >
        {isSpinning ? "Spinning..." : hasSpun ? "Spin Complete!" : "SPIN TO WIN!"}
      </Button>

      {/* Winner Display */}
      {winner && (
        <Card className="p-6 text-center bg-gradient-secondary animate-bounce-prize">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gift className="w-8 h-8 text-accent-foreground" />
            <h3 className="text-2xl font-bold text-accent-foreground">Congratulations!</h3>
            <Star className="w-8 h-8 text-accent-foreground" />
          </div>
          <div className="text-6xl mb-4">{winner.icon}</div>
          <Badge variant="secondary" className="text-xl px-4 py-2 mb-4">
            {winner.text}
          </Badge>
          <p className="text-accent-foreground mb-4">
            {winner.text === "TRY AGAIN" 
              ? "Better luck next time! Try spinning again."
              : "Show this screen to a staff member to claim your prize!"
            }
          </p>
          <Button onClick={resetWheel} variant="outline" className="mt-4">
            Spin Again
          </Button>
        </Card>
      )}

      {/* Instructions */}
      {!hasSpun && (
        <Card className="p-4 max-w-md text-center bg-muted">
          <p className="text-muted-foreground">
            🎯 Spin the wheel for a chance to win amazing prizes! 
            Each customer gets one free spin per visit.
          </p>
        </Card>
      )}
    </div>
  );
};