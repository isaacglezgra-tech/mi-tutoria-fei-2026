import { cn } from "@/lib/utils";

export function UachShield({ className }: { className?: string }) {
  return (
    <img
      src="/brand/uach-escudo.png"
      alt="Escudo de la Universidad Autónoma de Chihuahua"
      className={cn("h-12 w-12 object-contain", className)}
    />
  );
}

export function FeiLogo({ className }: { className?: string }) {
  return (
    <img
      src="/brand/fei-escudo.svg"
      alt="Facultad de Economía Internacional"
      className={cn("h-10 w-auto max-w-[240px] object-contain object-left", className)}
    />
  );
}

/** Official UACH shield + FEI wordmark. Colors are not altered. */
export function BrandLockup({
  variant = "light",
  stacked,
  className,
}: {
  variant?: "light" | "dark";
  stacked?: boolean;
  className?: string;
}) {
  const dark = variant === "dark";
  const chip = dark ? "bg-cream rounded-md px-2 py-1.5" : "";
  if (stacked) {
    return (
      <div className={cn("flex flex-col items-start gap-3", className)}>
        <UachShield className="h-14 w-14" />
        <div className={cn("w-full", chip)}>
          <FeiLogo className="h-10 w-full max-w-full" />
        </div>
      </div>
    );
  }
  return (
    <div className={cn("flex items-center gap-2.5 min-w-0", className)}>
      <UachShield className="h-12 w-12 shrink-0" />
      <div className={cn("min-w-0", chip)}>
        <FeiLogo className="h-10" />
      </div>
    </div>
  );
}

export function FeiMark({ className = "size-10" }: { className?: string }) {
  return <UachShield className={className} />;
}
