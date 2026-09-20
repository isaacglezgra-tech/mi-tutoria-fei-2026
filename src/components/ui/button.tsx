import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-[transform,background-color,color,box-shadow,opacity] duration-150 ease-out active:not-disabled:scale-[0.96] disabled:opacity-50 disabled:pointer-events-none select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-navy text-cream shadow-[0_1px_0_color-mix(in_oklab,white_12%,transparent)_inset] hover:bg-navy-soft",
        gold: "bg-gold text-navy hover:bg-gold-soft",
        outline:
          "bg-cream text-ink fei-shadow hover:bg-paper",
        ghost: "bg-transparent text-ink hover:bg-paper-2",
        danger: "bg-danger text-cream hover:opacity-90",
        soft: "bg-navy/8 text-navy hover:bg-navy/12",
      },
      size: {
        sm: "h-9 px-3 text-sm rounded-[10px]",
        md: "h-11 px-4 text-sm rounded-md",
        lg: "h-12 px-5 text-base rounded-lg",
        icon: "size-11 rounded-md",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
