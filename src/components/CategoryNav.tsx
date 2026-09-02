"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Category } from "@/types/foodchow";
import { useCart } from "@/context/CartContext";

interface CategoryNavProps {
  categories: Category[];
}

export const CategoryNav: React.FC<CategoryNavProps> = ({ categories }) => {
  const { activeCategoryId, setActiveCategoryId } = useCart();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const offset = direction === "left" ? -250 : 250;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const handleCategoryClick = (categoryId: number) => {
    setActiveCategoryId(categoryId);
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      const yOffset = -130;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  if (!categories || categories.length === 0) return null;

  return (
    <div className="sticky top-[61px] sm:top-[69px] z-30 bg-white/95 backdrop-blur-md border-b border-[#dadada] shadow-xs">
      <div className="mx-auto max-w-7xl px-2 sm:px-4 relative flex items-center">
        <button
          onClick={() => handleScroll("left")}
          className="hidden md:flex items-center justify-center w-7 h-7 rounded-full bg-white border border-gray-200 text-gray-600 hover:text-primary hover:border-primary shadow-xs mr-1 shrink-0 z-10 transition-colors cursor-pointer"
          aria-label="Scroll Left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-2.5 hide-scrollbar scroll-smooth flex-1"
        >
          {categories.map((cat) => {
            const isActive = activeCategoryId === cat.CategryId;
            const count = cat.ItemListWidget ? cat.ItemListWidget.length : 0;
            return (
              <button
                key={cat.CategryId}
                onClick={() => handleCategoryClick(cat.CategryId)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-primary text-white shadow-xs font-semibold"
                    : "bg-gray-100/90 text-gray-700 hover:bg-gray-200/80 hover:text-gray-900 border border-gray-200/60"
                }`}
              >
                <span>{cat.CategryName}</span>
                {count > 0 && (
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                      isActive ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => handleScroll("right")}
          className="hidden md:flex items-center justify-center w-7 h-7 rounded-full bg-white border border-gray-200 text-gray-600 hover:text-primary hover:border-primary shadow-xs ml-1 shrink-0 z-10 transition-colors cursor-pointer"
          aria-label="Scroll Right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
