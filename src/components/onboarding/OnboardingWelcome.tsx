import { useOnboarding } from "@/contexts/OnboardingContext";

export const OnboardingWelcome = () => {
  const { setCurrentStep, skipOnboarding } = useOnboarding();

  const features = [
    {
      emoji: "🍳",
      title: "Chef-Curated Recipes",
      description: "Professionally tested recipes at your fingertips",
    },
    {
      emoji: "🎤",
      title: "Voice-Controlled Cooking",
      description: "Hands-free cooking with Quick Dish commands",
    },
    {
      emoji: "📅",
      title: "Smart Meal Planning",
      description: "Plan your entire week in 5 minutes",
    },
    {
      emoji: "🛒",
      title: "Automated Shopping Lists",
      description: "Smart pantry tracking - never buy duplicates",
    },
    {
      emoji: "🤖",
      title: "AI Recipe Generator",
      description: "Turn your ingredients into magic meals",
    },
    {
      emoji: "💾",
      title: "Save & Organize",
      description: "Save favorites and build your custom cookbook",
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-gray-50 flex items-start justify-center p-6 overflow-y-auto pt-12">
      <div className="max-w-5xl w-full px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-8">
          {/* Orange bell icon in circle */}
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Cook smarter, not harder.
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Turn everyday ingredients into delicious meals.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 opacity-0"
              style={{
                animation: `fadeIn 0.6s ease-out forwards`,
                animationDelay: `${(index + 1) * 100}ms`,
              }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center text-2xl mb-3">
                {feature.emoji}
              </div>
              <h3 className="text-gray-900 font-semibold text-base mb-1">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-center gap-3 mt-8">
          {/* Get Started Button */}
          <button
            onClick={() => setCurrentStep(1)}
            className="w-full max-w-md bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-4 rounded-full text-lg font-semibold"
          >
            Get Started
          </button>

          {/* Skip Tutorial Link */}
          <button
            onClick={skipOnboarding}
            className="text-gray-500 text-sm hover:text-gray-700 underline"
          >
            Skip Tutorial
          </button>
        </div>
      </div>
    </div>
  );
};
