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
  { id: 1, text: "$500", probability: 5, color: "hsl(280 100% 60%)", icon: "🎉" },
  { id: 2, text: "$1000", probability: 3, color: "hsl(145 100% 45%)", icon: "🎁" },
  { id: 3, text: "$200", probability: 10, color: "hsl(30 100% 60%)", icon: "💎" },
  { id: 4, text: "$100", probability: 20, color: "hsl(200 100% 60%)", icon: "✨" },
  { id: 5, text: "$50", probability: 25, color: "hsl(320 100% 70%)", icon: "🚚" },
  { id: 6, text: "$300", probability: 8, color: "hsl(45 100% 65%)", icon: "🔥" },
  { id: 7, text: "$25", probability: 22, color: "hsl(350 100% 65%)", icon: "⭐" },
  { id: 8, text: "TRY AGAIN", probability: 7, color: "hsl(0 60% 60%)", icon: "🔄" },
];

interface Balloon {
  id: number;
  prize: Prize;
  popped: boolean;
  position: { x: number; y: number };
}

export const BalloonPop = () => {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState<Prize | null>(null);
  const [hasPlayed, setHasPlayed] = useState(false);

  const generateBalloons = () => {
    const newBalloons: Balloon[] = [];
    const shuffledPrizes = [...prizes].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < 12; i++) {
      const prize = shuffledPrizes[i % prizes.length];
      newBalloons.push({
        id: i,
        prize,
        popped: false,
        position: {
          x: 10 + (i % 4) * 22.5, // 4 columns
          y: 10 + Math.floor(i / 4) * 25, // 3 rows
        },
      });
    }
    
    setBalloons(newBalloons);
    setGameStarted(true);
    setWinner(null);
  };

  const popBalloon = (balloonId: number) => {
    if (hasPlayed || winner) return;

    const balloon = balloons.find(b => b.id === balloonId);
    if (!balloon || balloon.popped) return;

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

    setBalloons(prev => prev.map(b => 
      b.id === balloonId ? { ...b, popped: true } : b
    ));

    setTimeout(() => {
      setWinner(selectedPrize);
      setHasPlayed(true);
      toast.success(`🎈 You found: ${selectedPrize.text}!`);
    }, 500);
  };

  const resetGame = () => {
    setBalloons([]);
    setGameStarted(false);
    setWinner(null);
    setHasPlayed(false);
  };

  return (
    <div className="flex flex-col items-center gap-8 p-6">
      {/* Game Area */}
      {!gameStarted ? (
        <div className="text-center">
          <div className="mb-8">
            <div className="text-8xl mb-4">🎈</div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Balloon Pop Game</h2>
            <p className="text-muted-foreground max-w-md">
              Pop a balloon to reveal your prize! Each balloon contains a mystery reward.
            </p>
          </div>
          
          <Button
            onClick={generateBalloons}
            size="lg"
            className="bg-gradient-primary hover:opacity-90 text-xl px-8 py-4 rounded-full shadow-card animate-glow-pulse"
          >
            🎈 Start Popping!
          </Button>
        </div>
      ) : (
        <div className="w-full max-w-2xl">
          <h3 className="text-2xl font-bold text-center text-foreground mb-6">
            Choose a balloon to pop! 🎯
          </h3>
          
          {/* Balloons Grid */}
          <div className="relative h-96 bg-gradient-to-b from-sky-200 to-sky-100 rounded-lg border-4 border-sky-300 overflow-hidden">
            {balloons.map((balloon) => (
              <div
                key={balloon.id}
                className={`absolute cursor-pointer transition-all duration-300 ${
                  balloon.popped ? 'animate-bounce scale-0' : 'hover:scale-110'
                }`}
                style={{
                  left: `${balloon.position.x}%`,
                  top: `${balloon.position.y}%`,
                }}
                onClick={() => popBalloon(balloon.id)}
              >
                {!balloon.popped ? (
                  <div 
                    className="w-16 h-20 rounded-full shadow-lg transform hover:rotate-12 transition-transform duration-200"
                    style={{ backgroundColor: balloon.prize.color }}
                  >
                    <div className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-sm relative">
                      🎈
                      <div className="absolute top-full w-0.5 h-4 bg-gray-600"></div>
                    </div>
                  </div>
                ) : (
                  <div className="text-4xl animate-pulse">💥</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Winner Display */}
      {winner && (
        <Card className="p-6 text-center bg-gradient-secondary animate-bounce-prize">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gift className="w-8 h-8 text-accent-foreground" />
            <h3 className="text-2xl font-bold text-accent-foreground">Balloon Popped!</h3>
            <Star className="w-8 h-8 text-accent-foreground" />
          </div>
          <div className="text-6xl mb-4">{winner.icon}</div>
          <Badge variant="secondary" className="text-xl px-4 py-2 mb-4">
            {winner.text}
          </Badge>
          <p className="text-accent-foreground mb-4">
            {winner.text === "TRY AGAIN" 
              ? "Better luck next time! Try popping another balloon."
              : "Show this screen to a staff member to claim your prize!"
            }
          </p>
          <Button onClick={resetGame} variant="outline" className="mt-4">
            Play Again
          </Button>
        </Card>
      )}

      {/* Instructions */}
      {gameStarted && !hasPlayed && (
        <Card className="p-4 max-w-md text-center bg-muted">
          <p className="text-muted-foreground">
            🎯 Click on any balloon to pop it and reveal your prize! 
            Each customer gets one free balloon pop per visit.
          </p>
        </Card>
      )}
    </div>
  );
};