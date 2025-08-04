import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const navButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#606c38]/20 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-[#606c38] text-white shadow-sm hover:bg-[#606c38]/90 hover:scale-105",
        outline:
          "border border-[#606c38]/20 text-[#606c38] hover:bg-[#606c38] hover:text-white hover:border-[#606c38] hover:scale-105",
        ghost:
          "text-[#606c38] hover:bg-[#606c38]/10 hover:scale-105",
        secondary:
          "bg-[#606c38]/10 text-[#606c38] hover:bg-[#606c38]/20 hover:scale-105",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 px-4 py-2",
        lg: "h-12 px-8 py-3",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface NavButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof navButtonVariants> {
  asChild?: boolean;
}

const NavButton = React.forwardRef<HTMLButtonElement, NavButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(navButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
NavButton.displayName = "NavButton";

export { NavButton, navButtonVariants }; 