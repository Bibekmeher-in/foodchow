"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, Tag, Plus } from "lucide-react";
import { DealItem } from "@/types/foodchow";
import { formatPrice, getDealImageUrl } from "@/services/api";
import { useCart } from "@/context/CartContext";

interface DealsSectionProps {
  deals: DealItem[];
}

export const DealsSection: React.FC<DealsSectionProps> = ({ deals }) => {
  const { addToCart } = useCart();

  if (!deals || deals.length === 0) return null;

  return (
    <div className="mb-8 space-y-3">
      <div className="flex items-center gap-2 pb-1 border-b border-gray-200">
        <span className="w-1.5 h-6 bg-orange-500 rounded-full shrink-0" />
        <h2 className="font-bold text-gray-900 text-lg sm:text-xl tracking-tight flex items-center gap-2">
          <span>Special Deals & Combos</span>
          <Sparkles className="w-4 h-4 text-orange-500" />
        </h2>
        <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
          {deals.length} Active
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
        {deals.map((deal) => {
          const dealImage = getDealImageUrl(deal.DealImage);
          return (
            <div
              key={deal.DealId}
              className="bg-gradient-to-br from-white to-orange-50/30 rounded-2xl p-4 border border-orange-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="inline-flex items-center gap-1 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-2">
                    <Tag className="w-2.5 h-2.5" /> Deal
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-primary transition-colors">
                    {deal.DealName}
                  </h3>
                  {deal.DealDesc && (
                    <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                      {deal.DealDesc}
                    </p>
                  )}
                </div>

                {dealImage && (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-orange-100">
                    <Image
                      src={dealImage}
                      alt={deal.DealName}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-orange-100">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs text-gray-400 font-normal">Deal Price</span>
                  <span className="text-base sm:text-lg font-extrabold text-orange-600">
                    {formatPrice(deal.DealPrice)}
                  </span>
                  {deal.DealMRP !== undefined && deal.DealMRP > deal.DealPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      {formatPrice(deal.DealMRP)}
                    </span>
                  )}
                </div>

                <button
                  onClick={() =>
                    addToCart({
                      ItemId: deal.DealId,
                      ItemName: deal.DealName,
                      Description: deal.DealDesc,
                      Price: deal.DealPrice,
                      basePrice: deal.DealPrice,
                      IsVeg: 1,
                      IsCustom: 0,
                      IsPreference: 0,
                      IsSizeAvailable: 0,
                      SizeListWidget: [],
                    })
                  }
                  className="inline-flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
