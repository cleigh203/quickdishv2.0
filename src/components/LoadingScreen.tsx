import { useState, useEffect } from "react";
import { Flame } from "lucide-react";

const COOKING_TIPS = [
  "🔥 Pro tip: Let meat rest 5 minutes after cooking for juicier results",
  "🧂 Salt pasta water like the sea - it's your only chance to season the pasta!",
  "🥑 Keep avocados fresh by storing them with onions",
  "🍳 Room temperature eggs make fluffier scrambles",
  "🌿 Freeze leftover herbs in olive oil using ice cube trays",
  "🥕 Store carrots in water to keep them crispy for weeks",
  "🍞 Revive stale bread by sprinkling with water and heating in oven",
  "🧄 Remove garlic smell from hands by rubbing them on stainless steel",
  "🍋 Microwave citrus for 10 seconds to get more juice",
  "🥩 Pat meat dry before cooking for better browning",
  "🧈 Butter should be cold for flaky pie crust, room temp for cakes",
  "🥔 Salt potatoes in cold water, not boiling, for creamier mash",
  "🌶️ Add a pinch of sugar to balance spicy or acidic dishes",
  "🍝 Save pasta water - it's liquid gold for silky sauces!",
  "🥞 Let pancake batter rest 10 minutes for fluffier pancakes",
  "🍪 Chill cookie dough for thicker, chewier cookies",
  "🥗 Spin lettuce dry or your salad will be watery",
  "🍕 Pizza stone should heat for 45 minutes minimum",
  "🥚 Add vinegar to poaching water for perfect eggs",
  "☕ Coffee tastes best between 195-205°F, not boiling!"
];

interface LoadingScreenProps {
  message?: string;
  delay?: number;
}

export const LoadingScreen = ({ message = "Loading recipes...", delay = 500 }: LoadingScreenProps) => {
  const [showLoading, setShowLoading] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoading(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!showLoading) return;

    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentTip((prev) => (prev + 1) % COOKING_TIPS.length);
        setFadeIn(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [showLoading]);

  if (!showLoading) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center z-50">
      <div className="text-center px-6 max-w-md">
        {/* Animated Logo */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <Flame 
              className="w-20 h-20 text-primary animate-[pulse_2s_ease-in-out_infinite]" 
              fill="currentColor"
            />
            <div className="absolute inset-0 animate-[ping_2s_ease-in-out_infinite] opacity-75">
              <Flame className="w-20 h-20 text-primary/40" />
            </div>
          </div>
        </div>

        {/* Loading Message */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          {message}
        </h2>
        
        {/* Animated Dots */}
        <div className="flex justify-center gap-1 mb-8">
          <span className="w-2 h-2 rounded-full bg-primary animate-[bounce_1s_ease-in-out_infinite]" />
          <span className="w-2 h-2 rounded-full bg-primary animate-[bounce_1s_ease-in-out_0.1s_infinite]" />
          <span className="w-2 h-2 rounded-full bg-primary animate-[bounce_1s_ease-in-out_0.2s_infinite]" />
        </div>

        {/* Rotating Cooking Tip */}
        <div 
          className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg transition-opacity duration-300 ${
            fadeIn ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            💡 {COOKING_TIPS[currentTip]}
          </p>
        </div>
      </div>
    </div>
  );
};
