import { useEffect, useState } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { supabase } from '@/integrations/supabase/client';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [defaultTheme, setDefaultTheme] = useState<string>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const loadThemePreference = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('theme_preference')
          .eq('id', user.id)
          .single();
        
        if (!error && data?.theme_preference) {
          setDefaultTheme(data.theme_preference);
        }
      }
      
      setMounted(true);
    };

    loadThemePreference();
  }, []);

  // Prevent flash of unstyled content
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}
