import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Dialog({
  open,
  onOpenChange,
  title,
  children,
  wide,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-navy-deep/50 data-[state=open]:animate-in" />
        <DialogPrimitive.Content
          className={cn(
            "fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
            "w-[min(100%-1.5rem,28rem)] max-h-[min(88vh,720px)] overflow-y-auto",
            "rounded-xl bg-paper p-5 fei-shadow",
            wide && "w-[min(100%-1.5rem,36rem)]",
          )}
        >
          <div className="flex items-start justify-between gap-3 mb-4">
            <DialogPrimitive.Title className="font-display text-xl text-navy">
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close className="size-10 rounded-md hover:bg-paper-2 grid place-items-center text-muted">
              <X className="size-5" />
            </DialogPrimitive.Close>
          </div>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
