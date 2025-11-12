import { useOnboarding } from "@/contexts/OnboardingContext";

export const OnboardingWelcome = () => {
  const { setCurrentStep, skipOnboarding } = useOnboarding();

  const features = [
    {
      emoji: "👨‍🍳",
      bgColor: "bg-gradient-to-br from-orange-100 to-orange-200",
      title: "Chef-Curated Recipes",
      description: "Professionally tested recipes at your fingertips",
    },
    {
      emoji: "📅",
      bgColor: "bg-gradient-to-br from-pink-100 to-pink-200",
      title: "Smart Meal Planning",
      description: "Plan your entire week in just 5 minutes",
    },
    {
      emoji: "🛒",
      bgColor: "bg-gradient-to-br from-amber-100 to-yellow-200",
      title: "Automated Shopping Lists",
      description: "With smart pantry tracking - never buy duplicates again",
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-[#FAF9F6] flex items-start justify-center p-6 overflow-y-auto pt-20">
      <div className="max-w-md w-full py-8">
        {/* Top Section */}
        <div className="text-center mb-8 animate-fade-in">
          {/* Logo */}
          <div className="mb-6 flex justify-center mt-10">
            <div className="w-[100px] h-[100px] rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF4500] flex items-center justify-center shadow-2xl">
              <img 
                src="/logo.svg" 
                alt="QuickDish Logo" 
                className="w-16 h-16 object-contain"
                loading="eager"
                fetchPriority="high"
                decoding="sync"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-[32px] font-bold mb-3 bg-gradient-to-r from-[#FF6B35] to-[#FF4500] bg-clip-text text-transparent">
            Welcome to Quick Dish
          </h1>

          {/* Tagline */}
          <p className="text-[16px] text-[#5A6C7D] font-medium">
            Cook smarter, not harder. QuickDish helps you turn everyday ingredients into delicious meals.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-5 p-5 bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${(index + 1) * 150}ms` }}
            >
              {/* Icon */}
              <div className={`${feature.bgColor} w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0`}>
                <span className="text-3xl">{feature.emoji}</span>
              </div>

              {/* Content */}
              <div className="text-left flex-1">
                <h3 className="text-[18px] font-bold text-[#2C3E50] mb-1">
                  {feature.title}
                </h3>
                <p className="text-[14px] text-[#7F8C8D] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="text-center animate-fade-in" style={{ animationDelay: "600ms" }}>
          {/* Primary Button */}
          <button
            onClick={() => setCurrentStep(1)}
            className="w-full py-[18px] text-[18px] font-bold text-white bg-gradient-to-r from-[#FF6B35] to-[#FF4500] rounded-xl shadow-[0_8px_20px_rgba(255,69,0,0.3)] hover:shadow-[0_12px_28px_rgba(255,69,0,0.4)] hover:-translate-y-0.5 transition-all duration-300 mb-4"
          >
            Get Started
          </button>

          {/* Secondary Link */}
          <button
            onClick={skipOnboarding}
            className="text-[15px] text-[#5A6C7D] hover:text-[#FF6B35] hover:underline transition-colors duration-200 font-medium"
          >
            Skip Tutorial
          </button>
        </div>
      </div>
    </div>
  );
};
