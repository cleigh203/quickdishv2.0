import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ErrorFallbackProps {
  error?: string;
  onRetry?: () => void;
  title?: string;
  isEmptyState?: boolean;
  emptyMessage?: string;
  emptyAction?: {
    label: string;
    onClick: () => void;
  };
}

export function ErrorFallback({ 
  error = 'Something went wrong. Please try again.',
  onRetry,
  title = 'Oops!',
  isEmptyState = false,
  emptyMessage = 'No items found',
  emptyAction
}: ErrorFallbackProps) {
  if (isEmptyState) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <Card className="w-full max-w-md border-dashed">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="text-6xl mb-2">📭</div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Nothing here yet</h3>
                <p className="text-sm text-muted-foreground">{emptyMessage}</p>
              </div>
              {emptyAction && (
                <Button onClick={emptyAction.onClick} className="w-full">
                  {emptyAction.label}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            {onRetry && (
              <Button onClick={onRetry} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
