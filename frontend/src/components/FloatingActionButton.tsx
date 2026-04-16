"use client";

import { PhoneCall } from "lucide-react";
import { useState } from "react";
import { ContactFormDialog } from "./ContactFormDialog";

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#ca8b08] text-white shadow-lg transition hover:bg-[#b87d07] sm:bottom-6 sm:right-6 sm:h-12 sm:w-auto sm:justify-start sm:gap-2 sm:px-5 sm:text-sm sm:font-semibold"
        aria-label="Оставить заявку"
      >
        <PhoneCall className="h-4 w-4" />
        <span className="hidden sm:inline">Оставить заявку</span>
      </button>

      <ContactFormDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
