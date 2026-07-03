"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

/**
 * Radix Dialog plumbing shared by every modal: portal, overlay, focus trap,
 * Escape-to-close, outside-click-to-close, focus restore, aria-modal.
 * Purely behavioral — each modal keeps its own card markup/styles as children.
 *
 * Children note: the card root should include `pointer-events-auto` (the
 * full-screen Content wrapper is pointer-events-none so backdrop clicks
 * register as "outside" and close the dialog).
 */
interface ModalShellProps {
  open: boolean;
  onClose: () => void;
  /** Accessible dialog name (rendered visually hidden; modals draw their own headings) */
  label: string;
  /** Backdrop classes, e.g. "bg-black/60 backdrop-blur-sm" */
  overlayClassName?: string;
  /** Vertical alignment of the card, e.g. "items-center" or "items-end sm:items-center" */
  align?: string;
  /** Stacking context, e.g. "z-50" | "z-[100]" | "z-[200]" */
  zIndex?: string;
  children: React.ReactNode;
}

export default function ModalShell({
  open,
  onClose,
  label,
  overlayClassName = "bg-black/60 backdrop-blur-sm",
  align = "items-center",
  zIndex = "z-50",
  children,
}: ModalShellProps) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className={cn("fixed inset-0", zIndex, overlayClassName)} />
        <Dialog.Content
          aria-describedby={undefined}
          className={cn(
            "fixed inset-0 flex justify-center p-4 pointer-events-none",
            align,
            zIndex
          )}
        >
          <Dialog.Title className="sr-only">{label}</Dialog.Title>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
