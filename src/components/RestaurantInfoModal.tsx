"use client";

import React from "react";
import Image from "next/image";
import { X, MapPin, Phone, Clock, Utensils, ShieldCheck, ExternalLink, Globe } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { RestaurantInfo } from "@/types/foodchow";
import { getLogoImageUrl } from "@/services/api";

interface RestaurantInfoModalProps {
  restaurant: RestaurantInfo;
}

export const RestaurantInfoModal: React.FC<RestaurantInfoModalProps> = ({ restaurant }) => {
  const { isInfoModalOpen, setIsInfoModalOpen, setIsBookingModalOpen } = useCart();

  if (!isInfoModalOpen) return null;

  const logoUrl = getLogoImageUrl(restaurant.ShopLogo);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
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
              <span className="text-[11px] text-emerald-600 font-medium">Open 24/7 • Serving Quality Food</span>
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

        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 custom-scrollbar">
          <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200/80 space-y-2.5 text-xs text-gray-700">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-gray-900 block">Address</span>
                <span>{restaurant.ShopAddress}</span>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2 border-t border-gray-200/60">
              <Phone className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-gray-900 block">Phone Numbers</span>
                <span>{restaurant.PhoneNumber} / {restaurant.MobileNo}</span>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2 border-t border-gray-200/60">
              <Globe className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-gray-900 block">Website</span>
                <a
                  href={`https://${restaurant.websitename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  {restaurant.websitename} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-primary" /> Cuisines & Food Types
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {restaurant.ShopCuisines.map((c) => (
                <span key={c} className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
                  {c}
                </span>
              ))}
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium px-2.5 py-1 rounded-full">
                {restaurant.IsVeg}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" /> Opening Hours
            </h3>
            <div className="bg-gray-50 rounded-xl border border-gray-200/80 divide-y divide-gray-200/60 text-xs">
              {(restaurant.timingList || []).map((t) => (
                <div key={t.dayname} className="flex justify-between items-center px-3.5 py-2">
                  <span className="font-semibold text-gray-800">{t.dayname}</span>
                  <span className="text-gray-600 font-medium">
                    {t.openTime} - {t.closeTime}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="font-semibold">FSSAI License:</span> {restaurant.fssaiNumber}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50/70 flex gap-2.5 shrink-0">
          <button
            onClick={() => {
              setIsInfoModalOpen(false);
              setIsBookingModalOpen(true);
            }}
            className="flex-1 bg-primary hover:bg-primary-hover text-white font-bold py-2.5 rounded-xl transition-all cursor-pointer text-xs sm:text-sm text-center shadow-xs"
          >
            Book a Table
          </button>
          <button
            onClick={() => setIsInfoModalOpen(false)}
            className="px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2.5 rounded-xl transition-colors cursor-pointer text-xs sm:text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
