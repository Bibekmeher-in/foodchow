"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Minus, SlidersHorizontal } from "lucide-react";
import { MenuItem } from "@/types/foodchow";
import { getItemImageUrl, getItemDisplayPrice } from "@/services/api";
import { useCart } from "@/context/CartContext";

interface MenuItemCardProps {
  item: MenuItem;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  const { addToCart, updateQuantity, cart, setCustomizingItem } = useCart();
  const [imageError, setImageError] = useState(false);

  const imageUrl = getItemImageUrl(item.ItemImage);
  const displayPrice = getItemDisplayPrice(item);
  const hasMultipleSizes = Boolean(item.IsSizeAvailable && item.SizeListWidget && item.SizeListWidget.length > 0);
  const isCustomizable = hasMultipleSizes || item.IsCustom === 1 || item.IsPreference === 1;

  const cartItemsForThis = cart.filter((c) => c.item.ItemId === item.ItemId);
  const totalQtyInCart = cartItemsForThis.reduce((sum, c) => sum + c.quantity, 0);

  const handleAddClick = () => {
    if (isCustomizable) {
      setCustomizingItem(item);
    } else {
      addToCart(item);
    }
  };

  const handleIncrement = () => {
    if (cartItemsForThis.length === 1 && !isCustomizable) {
      updateQuantity(cartItemsForThis[0].cartItemId, cartItemsForThis[0].quantity + 1);
    } else {
      setCustomizingItem(item);
    }
  };

  const handleDecrement = () => {
    if (cartItemsForThis.length === 1 && !isCustomizable) {
      updateQuantity(cartItemsForThis[0].cartItemId, cartItemsForThis[0].quantity - 1);
    } else if (cartItemsForThis.length > 0) {
      updateQuantity(cartItemsForThis[cartItemsForThis.length - 1].cartItemId, cartItemsForThis[cartItemsForThis.length - 1].quantity - 1);
    }
  };

  const VegIndicator = () => (
    <div
      className={`inline-flex items-center justify-center w-4 h-4 rounded-xs border p-0.5 shrink-0 ${
        item.IsVeg === 1 ? "border-emerald-600 bg-emerald-50" : "border-red-600 bg-red-50"
      }`}
      title={item.IsVeg === 1 ? "Vegetarian" : "Non-Vegetarian"}
    >
      <div
        className={`w-2 h-2 rounded-full ${
          item.IsVeg === 1 ? "bg-emerald-600" : "bg-red-600"
        }`}
      />
    </div>
  );

  if (imageUrl && !imageError) {
    return (
      <div className="group flex flex-col bg-white rounded-xl shadow-xs border border-gray-200/80 overflow-hidden hover:shadow-md transition-all duration-200 h-full">
        <div className="relative w-full h-36 sm:h-40 bg-gray-100 overflow-hidden shrink-0">
          <Image
            src={imageUrl}
            alt={item.ItemName}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
          <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs p-1 rounded shadow-xs">
            <VegIndicator />
          </div>
          {hasMultipleSizes && (
            <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
              {item.SizeListWidget.length} Sizes
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 p-3 sm:p-3.5">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {item.ItemName}
          </h3>

          {item.Description && (
            <p className="text-xs text-gray-500 line-clamp-2 mt-1 mb-2 leading-relaxed">
              {item.Description}
            </p>
          )}

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 font-normal">Price</span>
              <span className="text-primary font-bold text-sm sm:text-base">
                {displayPrice}
              </span>
            </div>

            {totalQtyInCart > 0 && !hasMultipleSizes ? (
              <div className="flex items-center bg-primary text-white rounded-full px-1 py-0.5 shadow-xs">
                <button
                  onClick={handleDecrement}
                  className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-bold px-2">{totalQtyInCart}</span>
                <button
                  onClick={handleIncrement}
                  className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddClick}
                className="inline-flex items-center gap-1 border border-primary text-primary hover:bg-primary hover:text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer active:scale-95 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD</span>
                {isCustomizable && (
                  <SlidersHorizontal className="w-3 h-3 ml-0.5 opacity-70" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col bg-white rounded-xl shadow-xs border border-gray-200/80 p-3.5 sm:p-4 hover:shadow-md transition-all duration-200 h-full">
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2">
          <VegIndicator />
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {item.ItemName}
          </h3>
        </div>
        {hasMultipleSizes && (
          <span className="shrink-0 bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full">
            {item.SizeListWidget.length} Sizes
          </span>
        )}
      </div>

      {item.Description && (
        <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
          {item.Description}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 font-normal">Price</span>
          <span className="text-primary font-bold text-sm sm:text-base">
            {displayPrice}
          </span>
        </div>

        {totalQtyInCart > 0 && !hasMultipleSizes ? (
          <div className="flex items-center bg-primary text-white rounded-full px-1 py-0.5 shadow-xs">
            <button
              onClick={handleDecrement}
              className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-bold px-2">{totalQtyInCart}</span>
            <button
              onClick={handleIncrement}
              className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddClick}
            className="inline-flex items-center gap-1 border border-primary text-primary hover:bg-primary hover:text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer active:scale-95 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ADD</span>
            {isCustomizable && (
              <SlidersHorizontal className="w-3 h-3 ml-0.5 opacity-70" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};
