"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { useCardStore } from "@/hooks/useCardStore";
import { DbMetalItem } from "@/types";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  item: DbMetalItem;
  className?: string;
}

export function AddToCartButton({ item, className }: AddToCartButtonProps) {
  const { addItem } = useCardStore();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(item);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <Button
      onClick={handleAddToCart}
      className={cn(
        "flex items-center justify-center gap-2 transition-all duration-300",
        isAdded && "bg-green-500 hover:bg-green-600",
        className,
      )}
      variant={"custom"}
      disabled={isAdded}
    >
      {isAdded ? (
        <>
          <Check className="w-4 h-4" />
          Добавлено
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4" />
          В корзину
        </>
      )}
    </Button>
  );
}
