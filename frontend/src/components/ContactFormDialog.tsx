import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ContactForm } from "./ContactForm";

interface ContactFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactFormDialog({ open, onOpenChange }: ContactFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto z-[51]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Получите лучшее предложение!</DialogTitle>
          <DialogDescription className="text-center mt-2">
            Заполните форму сейчас и получите <span className="font-bold text-primary">специальную скидку</span> на ваш заказ
          </DialogDescription>
        </DialogHeader>
        <ContactForm closeDialog={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
}
