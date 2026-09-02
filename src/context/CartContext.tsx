"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  CartItem,
  CustomizationIngredient,
  MenuItem,
  OrderType,
  PreferenceOption,
  SizeItem,
  VegFilterType,
} from "@/types/foodchow";

interface CartContextType {
  cart: CartItem[];
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  vegFilter: VegFilterType;
  setVegFilter: (filter: VegFilterType) => void;
  activeCategoryId: number | null;
  setActiveCategoryId: (id: number | null) => void;
  activeMenuUrl: string;
  setActiveMenuUrl: (url: string) => void;

  addToCart: (
    item: MenuItem,
    size?: SizeItem | null,
    customizations?: Record<number, CustomizationIngredient[]>,
    preferences?: Record<number, PreferenceOption[]>,
    notes?: string,
    quantity?: number
  ) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  getItemQuantityInCart: (itemId: number) => number;

  itemCount: number;
  subtotal: number;
  taxAmount: number;
  deliveryFee: number;
  grandTotal: number;

  isCartOpenMobile: boolean;
  setIsCartOpenMobile: (open: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  customizingItem: MenuItem | null;
  setCustomizingItem: (item: MenuItem | null) => void;
  isOrderSuccess: boolean;
  setIsOrderSuccess: (success: boolean) => void;
  isInfoModalOpen: boolean;
  setIsInfoModalOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>("delivery");
  const [searchQuery, setSearchQuery] = useState("");
  const [vegFilter, setVegFilter] = useState<VegFilterType>("all");
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [activeMenuUrl, setActiveMenuUrl] = useState<string>("");

  const [isCartOpenMobile, setIsCartOpenMobile] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("foodchow_cart");
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not load cart from localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("foodchow_cart", JSON.stringify(cart));
    } catch (e) {
      console.warn("Could not save cart to localStorage", e);
    }
  }, [cart]);

  const generateCartItemId = (
    item: MenuItem,
    size: SizeItem | null,
    customizations: Record<number, CustomizationIngredient[]>,
    preferences: Record<number, PreferenceOption[]>,
    notes: string
  ): string => {
    const sizePart = size ? `size_${size.SizeId}` : "default";
    const customPart = Object.entries(customizations)
      .map(([k, v]) => `${k}:${v.map((i) => i.IngredientId).sort().join(",")}`)
      .sort()
      .join("|");
    const prefPart = Object.entries(preferences)
      .map(([k, v]) => `${k}:${v.map((p) => p.option_id).sort().join(",")}`)
      .sort()
      .join("|");
    const notePart = (notes || "").trim().toLowerCase();
    return `${item.ItemId}_${sizePart}_${customPart}_${prefPart}_${notePart}`;
  };

  const addToCart = (
    item: MenuItem,
    size: SizeItem | null = null,
    customizations: Record<number, CustomizationIngredient[]> = {},
    preferences: Record<number, PreferenceOption[]> = {},
    notes: string = "",
    quantity: number = 1
  ) => {
    let baseUnitPrice = 0;
    if (size) {
      baseUnitPrice = Number(size.Price);
    } else if (item.Price !== null && item.Price !== undefined) {
      baseUnitPrice = Number(item.Price);
    } else if (item.basePrice !== null && item.basePrice !== undefined) {
      baseUnitPrice = Number(item.basePrice);
    } else if (item.SizeListWidget && item.SizeListWidget.length > 0) {
      baseUnitPrice = Number(item.SizeListWidget[0].Price);
    }

    let extraPrice = 0;
    Object.values(customizations).forEach((ingList) => {
      ingList.forEach((ing) => {
        extraPrice += Number(ing.Price || 0);
      });
    });

    const unitPrice = baseUnitPrice + extraPrice;
    const cartItemId = generateCartItemId(item, size, customizations, preferences, notes);

    setCart((prev) => {
      const existingIndex = prev.findIndex((i) => i.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const current = updated[existingIndex];
        const newQty = current.quantity + quantity;
        updated[existingIndex] = {
          ...current,
          quantity: newQty,
          totalPrice: newQty * current.unitPrice,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          cartItemId,
          item,
          selectedSize: size,
          selectedCustomizations: customizations,
          selectedPreferences: preferences,
          notes,
          unitPrice,
          quantity,
          totalPrice: quantity * unitPrice,
        };
        return [...prev, newItem];
      }
    });
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCart((prev) =>
      prev.map((i) =>
        i.cartItemId === cartItemId
          ? {
              ...i,
              quantity,
              totalPrice: quantity * i.unitPrice,
            }
          : i
      )
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getItemQuantityInCart = (itemId: number): number => {
    return cart
      .filter((i) => i.item.ItemId === itemId)
      .reduce((sum, i) => sum + i.quantity, 0);
  };

  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = Number(cart.reduce((sum, i) => sum + i.totalPrice, 0).toFixed(2));
  const taxAmount = 0;
  const deliveryFee = 0;
  const grandTotal = subtotal;

  const handleSetCartOpenMobile = (open: boolean) => {
    if (open) {
      setIsCheckoutModalOpen(false);
    }
    setIsCartOpenMobile(open);
  };

  const handleSetCheckoutModalOpen = (open: boolean) => {
    if (open) {
      setIsCartOpenMobile(false);
    }
    setIsCheckoutModalOpen(open);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        orderType,
        setOrderType,
        searchQuery,
        setSearchQuery,
        vegFilter,
        setVegFilter,
        activeCategoryId,
        setActiveCategoryId,
        activeMenuUrl,
        setActiveMenuUrl,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemQuantityInCart,
        itemCount,
        subtotal,
        taxAmount,
        deliveryFee,
        grandTotal,
        isCartOpenMobile,
        setIsCartOpenMobile: handleSetCartOpenMobile,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen: handleSetCheckoutModalOpen,
        customizingItem,
        setCustomizingItem,
        isOrderSuccess,
        setIsOrderSuccess,
        isInfoModalOpen,
        setIsInfoModalOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
