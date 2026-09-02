import {
  Category,
  CustomizationDetails,
  DealItem,
  MenuItem,
  MenuTab,
  RestaurantInfo,
  RestaurantMenuResult,
} from "@/types/menu";
import { isUsableMenuData, normalizeMenuData, parseMenuResponse } from "./menu-parser";
import fallbackDataJson from "@/data/fallback-menu.json";

export const DEFAULT_SHOP_ID = 3161;
export const API_MENU_URL = `https://www.foodchow.com/api/FoodChowWD/GetRestaurantMenuWDWidget_multi?ShopId=${DEFAULT_SHOP_ID}&locale_id=null`;
export const API_CUSTOMIZE_URL = (itemId: number) =>
  `https://admin.foodchow.com/api/FoodChowWD/GetCustomizationDetailsOfItemWD_multiWithOrder?item_id=${itemId}&locale_id=null`;

// NOTE: The FoodChow API for ShopId=3161 does not return a menu tab list in its response.
// These menu tabs are taken from the reference UI (foodchowdemoindia.foodchow.com).
// They serve as navigation UI tabs only — the real category/item data always comes
// from the API response or the fallback-menu.json file.
export const DEFAULT_MENUS: MenuTab[] = [
  { id: 0, menu_name: "Main Menu", menu_url: "" },
  { id: 419, menu_name: "Breakfast", menu_url: "breakfast" },
  { id: 420, menu_name: "Lunch", menu_url: "lunch" },
  { id: 421, menu_name: "Dinner", menu_url: "dinner" },
];

// NOTE: Basic restaurant metadata sourced from the FoodChow API response for ShopId=3161.
// ShopName and ShopLogo come from the actual API. timingText is the display string
// returned by the API. We do NOT hardcode phone numbers, addresses, FSSAI, or fake ratings.
export const RESTAURANT_INFO: RestaurantInfo = {
  ShopId: "3161",
  ShopName: "FoodChow Demo INDIA",
  ShopLogo: "3161_2026-08-07_09-26-02001980b53-0530-49b1-ac6f-618dc1ffe3ec.jpg",
  isOpen: true,
  timingText: "Timing : 10:00 AM to 11:00 PM",
  websitename: "www.foodchow.com",
};

export function getFallbackMenu(shopId: number = DEFAULT_SHOP_ID): RestaurantMenuResult {
  try {
    const parsedFallback = parseMenuResponse(fallbackDataJson);
    const { categories, deals } = normalizeMenuData(parsedFallback, shopId);

    return {
      categories,
      restaurant: RESTAURANT_INFO,
      deals,
      menus: DEFAULT_MENUS,
      dataSource: "fallback",
    };
  } catch (fallbackErr) {
    console.error("[FoodChow API] Error parsing fallback dataset:", fallbackErr);
    return {
      categories: [],
      restaurant: RESTAURANT_INFO,
      deals: [],
      menus: DEFAULT_MENUS,
      dataSource: "fallback",
    };
  }
}

/**
 * Fetches the restaurant menu from the FoodChow live API.
 *
 * Decision flow:
 * 1. Call live FoodChow API with 8s timeout
 * 2. If HTTP request fails (network error / timeout) → use fallback-menu.json
 * 3. If HTTP response is not OK (4xx/5xx) → use fallback-menu.json
 * 4. If response.message === "No any records found!" → use fallback-menu.json
 * 5. If response.data cannot be parsed into a usable menu → use fallback-menu.json
 * 6. Otherwise → parse and use live API data
 */
export async function getRestaurantMenu(shopId: number = DEFAULT_SHOP_ID): Promise<RestaurantMenuResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const liveUrl = `https://www.foodchow.com/api/FoodChowWD/GetRestaurantMenuWDWidget_multi?ShopId=${shopId}&locale_id=null`;
    const res = await fetch(liveUrl, {
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const liveJson = await res.json();

      // Check explicit requirement condition: message === "No any records found!"
      if (liveJson && liveJson.message === "No any records found!") {
        return getFallbackMenu(shopId);
      }

      // Check if response contains usable menu data
      const parsedData = parseMenuResponse(liveJson);
      if (isUsableMenuData(parsedData)) {
        const { categories, deals } = normalizeMenuData(parsedData, shopId);
        return {
          categories,
          restaurant: RESTAURANT_INFO,
          deals,
          menus: DEFAULT_MENUS,
          dataSource: "live",
        };
      }
    }
  } catch (error: any) {
    console.warn("[FoodChow API] Live API request failed, loading fallback data:", error?.message || error);
  }

  return getFallbackMenu(shopId);
}

export async function getItemCustomizations(itemId: number): Promise<CustomizationDetails | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(API_CUSTOMIZE_URL(itemId), {
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeoutId);

    if (!res.ok) return null;

    const json = await res.json();
    if (json.data) {
      const parsed = typeof json.data === "string" ? JSON.parse(json.data) : json.data;
      return {
        item_id: parsed.item_id || itemId,
        FoodItemCustomizationwidgetList: parsed.FoodItemCustomizationwidgetList || [],
        FooditemprefrencewidgetList: parsed.FooditemprefrencewidgetList || [],
      };
    }
    return null;
  } catch (err) {
    console.warn(`[FoodChow API] Customizations unavailable for item ${itemId}`);
    return null;
  }
}

export function getItemImageUrl(imageName?: string): string | null {
  if (!imageName || imageName.trim() === "") return null;
  const cleaned = imageName.trim();
  if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) return cleaned;
  return `https://www.foodchow.com/FoodItemImages/${cleaned}`;
}

export function getDealImageUrl(imageName?: string): string | null {
  if (!imageName || imageName.trim() === "") return null;
  const cleaned = imageName.trim();
  if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) return cleaned;
  return `https://www.foodchow.com/DealImage/${cleaned}`;
}

export function getLogoImageUrl(logoName?: string): string {
  if (!logoName || logoName.trim() === "") {
    return "https://www.foodchow.com/Images/home/logo.png";
  }
  const cleaned = logoName.trim();
  if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) return cleaned;
  return `https://www.foodchow.com/LogoImages/${cleaned}`;
}

export function formatPrice(amount?: number | null, currency: string = "₹"): string {
  if (amount === undefined || amount === null || isNaN(amount)) return `${currency}0.00`;
  return `${currency}${Number(amount).toFixed(2)}`;
}

export function getItemDisplayPrice(item: MenuItem, currency: string = "₹"): string {
  if (item.IsSizeAvailable && item.SizeListWidget && item.SizeListWidget.length > 0) {
    const validPrices = item.SizeListWidget.map((s) => s.Price).filter(
      (p) => p !== undefined && p !== null && !isNaN(p)
    );
    if (validPrices.length === 1) {
      return formatPrice(validPrices[0], currency);
    }
    if (validPrices.length > 1) {
      const min = Math.min(...validPrices);
      const max = Math.max(...validPrices);
      if (min === max) {
        return formatPrice(min, currency);
      }
      return `${formatPrice(min, currency)} - ${formatPrice(max, currency)}`;
    }
  }

  const price = item.Price ?? item.basePrice ?? 0;
  return formatPrice(price, currency);
}
