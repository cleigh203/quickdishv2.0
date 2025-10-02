import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "h-12 px-6 bg-primary text-primary-foreground rounded-lg font-semibold text-base shadow-md hover:shadow-lg hover:scale-[0.98] active:scale-95",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "h-10 px-5 bg-card text-foreground border-2 border-border rounded-lg font-medium text-sm hover:bg-accent hover:border-muted-foreground",
        secondary: "h-10 px-5 bg-card text-foreground border-2 border-border rounded-lg font-medium text-sm hover:bg-accent hover:border-muted-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        icon: "w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm shadow-md hover:bg-card",
      },
      size: {
        default: "h-12 px-6",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
