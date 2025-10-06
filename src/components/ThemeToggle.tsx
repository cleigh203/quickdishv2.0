import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateThemeInDatabase = async (newTheme: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({ theme_preference: newTheme })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating theme preference:', error);
      }
    } else {
      // Store in localStorage for guests
      localStorage.setItem('theme-preference', newTheme);
    }
  };

  const handleThemeChange = async (newTheme: string) => {
    setTheme(newTheme);
    await updateThemeInDatabase(newTheme);
    
    const themeNames: Record<string, string> = {
      light: '☀️ Light Mode',
      dark: '🌙 Dark Mode',
      system: '💻 System',
    };

    toast({
      title: "Theme updated",
      description: `Switched to ${themeNames[newTheme]}`,
    });
  };

  if (!mounted) {
    return null;
  }

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'Auto', icon: Monitor },
  ];

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {themes.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => handleThemeChange(value)}
            className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
              theme === value
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-card hover:border-primary/50'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
