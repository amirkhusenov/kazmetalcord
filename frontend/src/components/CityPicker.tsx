"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useGlobalStore } from "@/hooks/useGlobalStore";
import { getCityFromGeo, KZCityList } from "@/lib/utils";
import { ChevronDown, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export function CityPicker() {
  const city = useGlobalStore((state) => state.city);
  const setCity = useGlobalStore((state) => state.setCity);
  const [open, setOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const visits = useGlobalStore((state) => state.visits);

  useEffect(() => {
    if (visits === 1) {
      const geo = Cookies.get("geo-city");
      const city = getCityFromGeo(geo);
      setCity(city);
      setShowConfirmation(true);
    } else {
      setShowConfirmation(false);
    }
  }, [visits, setCity]);

  return (
    <>
      <Popover open={showConfirmation} onOpenChange={setShowConfirmation}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 box-border border-b-2 border-white rounded-none"
            onClick={() => setOpen(true)}
          >
            <MapPin className="w-5 h-5" />
            {city}
            <ChevronDown className="w-5 h-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <h4 className="font-medium leading-none">Подтвердите ваш город</h4>
            </div>
            <p className="text-sm text-muted-foreground">Ваш город: {city}?</p>
            <div className="flex flex-col gap-2">
              <Button variant="custom" className="w-full" onClick={() => setShowConfirmation(false)}>
                Да, это мой город
              </Button>
              <Button
                variant="custom-outline"
                className="w-full"
                onClick={() => {
                  setShowConfirmation(false);
                  setOpen(true);
                }}
              >
                Нет, выбрать другой
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Выберите город</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {KZCityList.map((cityOption) => (
              <Button
                key={cityOption}
                variant={city === cityOption ? "custom" : "custom-outline"}
                className="w-full justify-start"
                onClick={() => {
                  setCity(cityOption);
                  setOpen(false);
                }}
              >
                {cityOption}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
