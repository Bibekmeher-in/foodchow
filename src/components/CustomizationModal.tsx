"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { X, Plus, Minus, Check, Loader2 } from "lucide-react";
import {
  CustomizationCategory,
  CustomizationDetails,
  CustomizationIngredient,
  PreferenceItem,
  PreferenceOption,
  SizeItem,
} from "@/types/foodchow";
import { formatPrice, getItemCustomizations, getItemImageUrl } from "@/services/api";
import { useCart } from "@/context/CartContext";

export const CustomizationModal: React.FC = () => {
  const { customizingItem, setCustomizingItem, addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState<SizeItem | null>(null);
  const [selectedCustomizations, setSelectedCustomizations] = useState<
    Record<number, CustomizationIngredient[]>
  >({});
  const [selectedPreferences, setSelectedPreferences] = useState<
    Record<number, PreferenceOption[]>
  >({});
  const [specialNotes, setSpecialNotes] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loadingCustomizations, setLoadingCustomizations] = useState(false);
  const [customizationData, setCustomizationData] = useState<CustomizationDetails | null>(null);

  useEffect(() => {
    if (!customizingItem) return;

    if (customizingItem.SizeListWidget && customizingItem.SizeListWidget.length > 0) {
      setSelectedSize(customizingItem.SizeListWidget[0]);
    } else {
      setSelectedSize(null);
    }

    setSelectedCustomizations({});
    setSelectedPreferences({});
    setSpecialNotes("");
    setQuantity(1);

    if (customizingItem.IsCustom === 1 || customizingItem.IsPreference === 1) {
      setLoadingCustomizations(true);
      getItemCustomizations(customizingItem.ItemId)
        .then((data) => {
          setCustomizationData(data);
        })
        .finally(() => {
          setLoadingCustomizations(false);
        });
    } else {
      setCustomizationData(null);
      setLoadingCustomizations(false);
    }
  }, [customizingItem]);

  if (!customizingItem) return null;

  const imageUrl = getItemImageUrl(customizingItem.ItemImage);

  let basePrice = 0;
  if (selectedSize) {
    basePrice = Number(selectedSize.Price);
  } else if (customizingItem.Price !== null && customizingItem.Price !== undefined) {
    basePrice = Number(customizingItem.Price);
  } else if (customizingItem.basePrice !== null && customizingItem.basePrice !== undefined) {
    basePrice = Number(customizingItem.basePrice);
  } else if (customizingItem.SizeListWidget && customizingItem.SizeListWidget.length > 0) {
    basePrice = Number(customizingItem.SizeListWidget[0].Price);
  }

  let extraPrice = 0;
  Object.values(selectedCustomizations).forEach((list) => {
    list.forEach((ing) => {
      extraPrice += Number(ing.Price || 0);
    });
  });

  const unitPrice = basePrice + extraPrice;
  const totalPrice = unitPrice * quantity;

  const handleToggleIngredient = (
    category: CustomizationCategory,
    ingredient: CustomizationIngredient
  ) => {
    setSelectedCustomizations((prev) => {
      const currentList = prev[category.CustomCatId] || [];
      const isAlreadySelected = currentList.some((i) => i.IngredientId === ingredient.IngredientId);

      if (category.SelectionType === 1) {
        if (isAlreadySelected) {
          if (category.IsMandatory !== 1) {
            const copy = { ...prev };
            delete copy[category.CustomCatId];
            return copy;
          }
          return prev;
        }
        return { ...prev, [category.CustomCatId]: [ingredient] };
      }

      if (isAlreadySelected) {
        return {
          ...prev,
          [category.CustomCatId]: currentList.filter(
            (i) => i.IngredientId !== ingredient.IngredientId
          ),
        };
      } else {
        const max = category.MaxVal || 999;
        if (currentList.length >= max) return prev;
        return {
          ...prev,
          [category.CustomCatId]: [...currentList, ingredient],
        };
      }
    });
  };

  const handleTogglePreference = (pref: PreferenceItem, option: PreferenceOption) => {
    setSelectedPreferences((prev) => {
      const current = prev[pref.Id] || [];
      const isSelected = current.some((o) => o.option_id === option.option_id);
      if (isSelected) {
        const copy = { ...prev };
        delete copy[pref.Id];
        return copy;
      }
      return { ...prev, [pref.Id]: [option] };
    });
  };

  const handleAddToCart = () => {
    addToCart(
      customizingItem,
      selectedSize,
      selectedCustomizations,
      selectedPreferences,
      specialNotes,
      quantity
    );
    setCustomizingItem(null);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <div
              className={`inline-flex items-center justify-center w-4 h-4 rounded-xs border p-0.5 shrink-0 ${
                customizingItem.IsVeg === 1 ? "border-emerald-600 bg-emerald-50" : "border-red-600 bg-red-50"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  customizingItem.IsVeg === 1 ? "bg-emerald-600" : "bg-red-600"
                }`}
              />
            </div>
            <h2 className="font-bold text-gray-900 text-base sm:text-lg truncate">
              {customizingItem.ItemName}
            </h2>
          </div>
          <button
            onClick={() => setCustomizingItem(null)}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
          {imageUrl && (
            <div className="relative w-full h-44 rounded-xl overflow-hidden bg-gray-100 shrink-0">
              <Image
                src={imageUrl}
                alt={customizingItem.ItemName}
                fill
                className="object-cover"
              />
            </div>
          )}

          {customizingItem.Description && (
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
              {customizingItem.Description}
            </p>
          )}

          {customizingItem.SizeListWidget && customizingItem.SizeListWidget.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 text-sm">Select Size</h3>
                <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Required
                </span>
              </div>
              <div className="space-y-2">
                {customizingItem.SizeListWidget.map((size) => {
                  const isSelected = selectedSize?.SizeId === size.SizeId;
                  return (
                    <label
                      key={size.SizeId}
                      onClick={() => setSelectedSize(size)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/5 text-gray-900 shadow-2xs"
                          : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? "border-primary bg-primary" : "border-gray-300"
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="text-sm font-medium">{size.SizeName}</span>
                      </div>
                      <span className="text-sm font-bold text-primary">
                        {formatPrice(size.Price)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {loadingCustomizations && (
            <div className="flex items-center justify-center py-4 text-primary text-xs gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading add-on options...</span>
            </div>
          )}

          {customizationData?.FoodItemCustomizationwidgetList &&
            customizationData.FoodItemCustomizationwidgetList.map((cat) => (
              <div key={cat.CustomCatId} className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 text-sm">{cat.CustomCatName}</h3>
                  {cat.IsMandatory === 1 ? (
                    <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Required
                    </span>
                  ) : (
                    <span className="text-[11px] text-gray-400">Optional</span>
                  )}
                </div>
                <div className="space-y-2">
                  {cat.ingredientwidgetList.map((ing) => {
                    const isSelected = (selectedCustomizations[cat.CustomCatId] || []).some(
                      (i) => i.IngredientId === ing.IngredientId
                    );
                    return (
                      <label
                        key={ing.IngredientId}
                        onClick={() => handleToggleIngredient(cat, ing)}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/5 text-gray-900 shadow-2xs"
                            : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-sm border flex items-center justify-center ${
                              isSelected
                                ? "border-primary bg-primary text-white"
                                : "border-gray-300"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="text-sm font-medium">{ing.IngredientName}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-600">
                          {ing.Price > 0 ? `+${formatPrice(ing.Price)}` : "Free"}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}

          {customizationData?.FooditemprefrencewidgetList &&
            customizationData.FooditemprefrencewidgetList.map((pref) => (
              <div key={pref.Id} className="space-y-2.5">
                <h3 className="font-semibold text-gray-900 text-sm">{pref.prefrence_name}</h3>
                <div className="space-y-2">
                  {pref.options.map((opt) => {
                    const isSelected = (selectedPreferences[pref.Id] || []).some(
                      (o) => o.option_id === opt.option_id
                    );
                    return (
                      <label
                        key={opt.option_id}
                        onClick={() => handleTogglePreference(pref, opt)}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/5 text-gray-900"
                            : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
                        }`}
                      >
                        <span className="text-sm font-medium">{opt.option_name}</span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? "border-primary bg-primary" : "border-gray-300"
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}

          <div className="space-y-1.5">
            <label className="font-semibold text-gray-900 text-sm block">
              Special Instructions
            </label>
            <textarea
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="Any suggestions for us? We will keep in mind."
              rows={2}
              className="w-full text-xs sm:text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-primary transition-colors resize-none placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/70 shrink-0 gap-3">
          <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 shadow-2xs">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center text-sm font-bold text-gray-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-between bg-primary hover:bg-primary-hover text-white px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-150 cursor-pointer active:scale-[0.99] shadow-md shadow-primary/20"
          >
            <span>Add to Cart</span>
            <span>{formatPrice(totalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
