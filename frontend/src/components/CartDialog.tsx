import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCardStore } from "@/hooks/useCardStore";
import { getImageUrl } from "@/lib/utils";
import { ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ContactFormDialog } from "./ContactFormDialog";

interface CartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDialog({ open, onOpenChange }: CartDialogProps) {
  const { items, removeItem } = useCardStore();
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Корзина</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
              <p className="text-gray-500">Ваша корзина пуста</p>
              <Button variant={"custom"} asChild>
                <Link href="/category" onClick={() => onOpenChange(false)}>
                  Перейти к каталогу
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.uid} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={getImageUrl(item.translitCategoryPath)}
                      alt={item["Наименование"]}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{item["Наименование"]}</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.uid)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        {items.length > 0 && (
          <div className="space-y-4 mt-4">
            <div className="text-sm text-gray-500">
              * Цены на товары уточняйте у менеджера. Наличие и актуальные цены могут отличаться от указанных на сайте.
            </div>
            <div className="flex gap-4">
              <Button className="flex-1" variant={"custom"} onClick={() => setIsContactFormOpen(true)}>
                Оформить заказ
              </Button>
              <Button variant="custom-outline" className="flex-1" onClick={() => onOpenChange(false)}>
                  Продолжить покупки
              </Button>
            </div>
          </div>
        )}
        <ContactFormDialog open={isContactFormOpen} onOpenChange={setIsContactFormOpen} />
      </DialogContent>
    </Dialog>
  );
}
