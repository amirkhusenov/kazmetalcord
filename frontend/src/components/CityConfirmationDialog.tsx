"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useGlobalStore } from "@/hooks/useGlobalStore";
import { MapPin } from "lucide-react";

interface CityConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onReject: () => void;
}

export function CityConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  onReject,
}: CityConfirmationDialogProps) {
  const { city } = useGlobalStore();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Подтвердите ваш город
          </DialogTitle>
          <DialogDescription>
            Ваш город: {city}?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button
            variant="custom"
            className="w-full"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Да, это мой город
          </Button>
          <Button
            variant="custom-outline"
            className="w-full"
            onClick={() => {
              onReject();
              onOpenChange(false);
            }}
          >
            Нет, выбрать другой
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
