"use client";

import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getItems } from "@/server/db";
import { DbMetalItem } from "@/types";
import { cx } from "class-variance-authority";
import debounce from "lodash.debounce";
import { X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface SearchInputProps {
  classNames?: string;
  onClose?: () => void;
}

export function SearchInput({ classNames, onClose }: SearchInputProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<DbMetalItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchResults = useCallback(
    async (query: string) => {
      if (!query || query.length <= 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const {items} = await getItems({ search: query });
        setResults(items);
        setIsOpen(items.length > 0);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const debouncedFetchResults = useMemo(
    () => debounce((query: string) => {
      fetchResults(query);
    }, 300),
    [fetchResults],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedFetchResults(value);
  };

  useEffect(() => {
    return () => {
      debouncedFetchResults.cancel();
    };
  }, [debouncedFetchResults]);

  // Ensure input stays focused when popover opens/closes
  useEffect(() => {
    if (inputRef.current && isOpen) {
      inputRef.current.focus();
    }
  }, [isOpen, results]);

  return (
    <div className={cx("relative w-full max-w-md", classNames)}>
      <Popover open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        // Maintain focus when popover state changes
        if (inputRef.current) {
          setTimeout(() => {
            inputRef.current?.focus();
          }, 0);
        }
      }}>
        <PopoverTrigger asChild>
          <div className="relative w-full">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Поиск"
              className="pr-10 border-blue4 text-blue4 placeholder:text-blue5"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => {
                if (results.length > 0) {
                  setIsOpen(true);
                }
              }}
            />
            <X
              className="absolute text-blue5 right-3 top-1/2 transform -translate-y-1/2"
              size={20}
              onClick={() => {
                setIsOpen(false);
                onClose?.();
              }}
            />
            {isLoading && (
              <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin h-4 w-4 border-2 border-blue5 rounded-full border-t-transparent" />
              </div>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 max-h-80 overflow-y-auto"
          align="start"
          sideOffset={5}
        >
          {results.length > 0 ? (
            <div className="py-1">
              {results.map((item, index) => (
                <Link
                  key={index}
                  href={`/product/${encodeURIComponent(item.translitTitle)}`}
                  prefetch={false}
                  className="block"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="px-4 py-2 text-sm hover:bg-slate-100 cursor-pointer">
                    {item["Наименование"]}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">Нет результатов</div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
