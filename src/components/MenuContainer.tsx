"use client";

import React, { useMemo, useEffect } from "react";
import { Category, DealItem, RestaurantInfo } from "@/types/foodchow";
import { useCart } from "@/context/CartContext";
import { SearchBar } from "@/components/SearchBar";
import { MenuItemCard } from "@/components/MenuItemCard";
import { CartSidebar } from "@/components/CartSidebar";
import { DealsSection } from "@/components/DealsSection";
import { Utensils } from "lucide-react";

interface MenuContainerProps {
  categories: Category[];
  restaurant: RestaurantInfo;
  deals?: DealItem[];
}

export const MenuContainer: React.FC<MenuContainerProps> = ({ categories, deals = [] }) => {
  const { searchQuery, vegFilter, activeCategoryId, setActiveCategoryId } = useCart();

  useEffect(() => {
    if (categories.length > 0 && !activeCategoryId) {
      setActiveCategoryId(categories[0].CategryId);
    }
  }, [categories, activeCategoryId, setActiveCategoryId]);

  const filteredCategories = useMemo(() => {
    return categories
      .map((cat) => {
        const filteredItems = (cat.ItemListWidget || []).filter((item) => {
          if (vegFilter === "veg" && item.IsVeg !== 1) return false;
          if (vegFilter === "non_veg" && item.IsVeg === 1) return false;

          if (searchQuery.trim() !== "") {
            const query = searchQuery.toLowerCase();
            const matchName = item.ItemName.toLowerCase().includes(query);
            const matchDesc = (item.Description || "").toLowerCase().includes(query);
            return matchName || matchDesc;
          }

          return true;
        });

        return {
          ...cat,
          ItemListWidget: filteredItems,
        };
      })
      .filter((cat) => cat.ItemListWidget.length > 0);
  }, [categories, searchQuery, vegFilter]);

  const totalFilteredItems = filteredCategories.reduce(
    (sum, cat) => sum + cat.ItemListWidget.length,
    0
  );

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-6 flex-1 w-full">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 w-full min-w-0">
          <SearchBar />

          {searchQuery.trim() === "" && deals.length > 0 && (
            <DealsSection deals={deals} />
          )}

          {totalFilteredItems === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-xs">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-800 text-base mb-1">No food items found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                We couldn&apos;t find any dishes matching &ldquo;{searchQuery}&rdquo;. Try searching for another dish or clearing filters.
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {filteredCategories.map((category) => (
                <section
                  key={category.CategryId}
                  id={`category-${category.CategryId}`}
                  className="scroll-mt-36"
                >
                  <div className="flex items-center gap-2.5 mb-4 pb-2 border-b border-gray-200/80">
                    <span className="w-1.5 h-6 bg-primary rounded-full shrink-0" />
                    <h2 className="font-bold text-gray-900 text-lg sm:text-xl tracking-tight">
                      {category.CategryName}
                    </h2>
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {category.ItemListWidget.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
                    {category.ItemListWidget.map((item) => (
                      <MenuItemCard key={item.ItemId} item={item} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        <div className="hidden lg:block w-80 xl:w-96 sticky top-[135px] shrink-0">
          <CartSidebar />
        </div>
      </div>
    </div>
  );
};
