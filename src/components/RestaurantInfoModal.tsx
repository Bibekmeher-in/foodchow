"use client";

import React from "react";
import Image from "next/image";
import { X, MapPin, Phone, Clock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { RestaurantInfo } from "@/types/foodchow";
import { getLogoImageUrl } from "@/services/api";

interface RestaurantInfoModalProps {
  restaurant: RestaurantInfo;
}

export const RestaurantInfoModal: React.FC<RestaurantInfoModalProps> = ({ restaurant }) => {
  const { isInfoModalOpen, setIsInfoModalOpen } = useCart();

  if (!isInfoModalOpen) return null;

  const logoUrl = getLogoImageUrl(restaurant.ShopLogo);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gray-200 shrink-0 bg-primary/10">
              <Image
                src={logoUrl}
                alt={restaurant.ShopName}
                fill
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base">{restaurant.ShopName}</h2>
              <span className="text-[11px] text-emerald-600 font-medium">Online Ordering Menu</span>
            </div>
          </div>
          <button
            onClick={() => setIsInfoModalOpen(false)}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 custom-scrollbar">
          <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200/80 space-y-2.5 text-xs text-gray-700">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-gray-900 block">Status & Timings</span>
                <span>{restaurant.timingText}</span>
              </div>
            </div>

            {restaurant.ShopAddress && (
              <div className="flex items-start gap-2 pt-2 border-t border-gray-200/60">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-gray-900 block">Address</span>
                  <span>{restaurant.ShopAddress}</span>
                </div>
              </div>
            )}

            {restaurant.PhoneNumber && (
              <div className="flex items-start gap-2 pt-2 border-t border-gray-200/60">
                <Phone className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-gray-900 block">Phone</span>
                  <span>{restaurant.PhoneNumber}</span>
                </div>
              </div>
            )}

          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50/70 flex justify-end shrink-0">
          <button
            onClick={() => setIsInfoModalOpen(false)}
            className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 rounded-xl transition-colors cursor-pointer text-xs sm:text-sm shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
