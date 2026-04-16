"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import contacts from "@/contacts.json";
import { cn } from "@/lib/utils";
import { sendContactEmail } from "@/server/email";
import { contactFormSchema } from "@/types";
import { Phone, Send } from "lucide-react";
import { useState } from "react";
import { WhatsApp } from "./Whatsapp";
import { useCardStore } from "@/hooks/useCardStore";

interface ContactFormProps {
  className?: string;
  closeDialog?: (open: boolean) => void;
  showQuickActions?: boolean;
}

export function ContactForm({ className, closeDialog, showQuickActions = true }: ContactFormProps) {
  const items = useCardStore((store) => store.items);
  const [formStartTime, setFormStartTime] = useState(Date.now());

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const duration = Date.now() - formStartTime;
    if (duration < 3000) {
      alert("Пожалуйста, не спешите с отправкой формы 😊");
      return;
    }

    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      extraInfo: formData.get("extraInfo"),
      items,
    };

    const parseResult = contactFormSchema.safeParse(data);

    if (!parseResult.success) {
      return alert(parseResult.error.message);
    }

    sendContactEmail(parseResult.data);
    e.currentTarget.reset();
    setFormStartTime(Date.now());
    closeDialog?.(false);
  };

  return (
    <div className="space-y-4">
      {showQuickActions ? (
        <>
          <Button variant="custom-outline" className="w-full" asChild>
            <a href={contacts.phone.link} target="_blank" rel="noopener noreferrer">
              <Phone className="h-4 w-4" />
              Позвонить
            </a>
          </Button>
          <Button variant="custom-outline" className="w-full" asChild>
            <a href={contacts.phone.whatsapp} target="_blank" rel="noopener noreferrer">
              <WhatsApp />
              Написать в WhatsApp
            </a>
          </Button>
          <div className="flex items-center justify-center gap-2">
            <div className="h-0.5 w-10 flex-grow rounded-full bg-gray-300"></div>
            <p className="text-lg font-bold">ИЛИ</p>
            <div className="h-0.5 w-10 flex-grow rounded-full bg-gray-300"></div>
          </div>
        </>
      ) : null}
      <form className={cn("space-y-4", className)} onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Ваше имя
            </label>
            <Input required id="name" name="name" placeholder="Иван Иванов" />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Телефон
          </label>
          <Input required id="phone" name="phone" type="tel" placeholder="Ваш номер телефона" />
        </div>
        {/* Honeypot field - hidden from regular users */}
        <div className="space-y-2" style={{ display: "none" }}>
          <label htmlFor="extraInfo" className="text-sm font-medium">
            Дополнительная информация
          </label>
          <Input id="extraInfo" name="extraInfo" tabIndex={-1} defaultValue="" autoComplete="off" />
        </div>
        <Button variant="custom" className="w-full">
          <Send className="h-4 w-4" />
          Отправить сообщение
        </Button>
      </form>
    </div>
  );
}
