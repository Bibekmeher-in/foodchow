import { Category, DealItem, FoodChowData, FoodChowResponse, MenuItem, SizeItem } from "@/types/menu";

export function parseMenuResponse(response: FoodChowResponse | any): FoodChowData | null {
  if (!response || !response.data) {
    return null;
  }

  if (typeof response.data === "string") {
    try {
      return JSON.parse(response.data);
    } catch (e) {
      console.error("[FoodChow Parser] Failed to parse response.data JSON string:", e);
      return null;
    }
  }

  if (typeof response.data === "object") {
    return response.data;
  }

  return null;
}

export function isUsableMenuData(data: any): boolean {
  if (!data || typeof data !== "object") return false;
  if (!Array.isArray(data.CategoryList) || data.CategoryList.length === 0) return false;

  const hasItems = data.CategoryList.some(
    (cat: any) =>
      cat &&
      ((Array.isArray(cat.ItemListWidget) && cat.ItemListWidget.length > 0) ||
        (Array.isArray(cat.ItemList) && cat.ItemList.length > 0))
  );

  return hasItems;
}

export function normalizeMenuData(
  parsed: any,
  defaultShopId: number = 3161
): {
  categories: Category[];
  deals: DealItem[];
} {
  if (!parsed || typeof parsed !== "object") {
    return { categories: [], deals: [] };
  }

  const rawCategories: any[] = Array.isArray(parsed.CategoryList) ? parsed.CategoryList : [];
  const rawDeals: any[] = Array.isArray(parsed.DealList) ? parsed.DealList : [];

  const categories: Category[] = rawCategories.map((cat: any) => {
    const rawItems: any[] =
      Array.isArray(cat.ItemListWidget) && cat.ItemListWidget.length > 0
        ? cat.ItemListWidget
        : Array.isArray(cat.ItemList)
        ? cat.ItemList
        : [];

    const items: MenuItem[] = rawItems.map((item: any) => {
      const rawSizes: any[] = Array.isArray(item.SizeListWidget) ? item.SizeListWidget : [];
      const sizes: SizeItem[] = rawSizes.map((s: any) => ({
        SizeId: String(s.SizeId ?? ""),
        food_item_size: String(s.food_item_size || ""),
        SizeName: String(s.SizeName || ""),
        Price: Number(s.Price || 0),
        basePrice: Number(s.basePrice || s.Price || 0),
        Weight: s.Weight ? String(s.Weight) : undefined,
        Unit: s.Unit ? String(s.Unit) : undefined,
        available_stock: s.available_stock !== undefined ? Number(s.available_stock) : undefined,
        status: s.status !== undefined ? Number(s.status) : undefined,
        sold_out_flag: s.sold_out_flag !== undefined ? Number(s.sold_out_flag) : undefined,
        PriceV: s.PriceV !== undefined ? Number(s.PriceV) : undefined,
      }));

      const itemPrice =
        item.Price !== null && item.Price !== undefined ? Number(item.Price) : null;
      const basePrice =
        item.basePrice !== null && item.basePrice !== undefined
          ? Number(item.basePrice)
          : null;

      return {
        ItemId: Number(item.ItemId),
        MenuItemId: item.MenuItemId ?? null,
        ItemName: String(item.ItemName || ""),
        ItemImage: item.ItemImage ? String(item.ItemImage).trim() : "",
        Description: item.Description ? String(item.Description).trim() : "",
        IsSizeAvailable: item.IsSizeAvailable !== undefined ? Number(item.IsSizeAvailable) : sizes.length > 1 ? 1 : 0,
        Price: itemPrice,
        basePrice: basePrice,
        SizeId: item.SizeId ? String(item.SizeId) : null,
        SizeListWidget: sizes,
        IsVeg: item.IsVeg !== undefined ? Number(item.IsVeg) : 1,
        NonVegType: item.NonVegType !== undefined ? Number(item.NonVegType) : undefined,
        IsAlcohol: item.IsAlcohol !== undefined ? Number(item.IsAlcohol) : undefined,
        IsBase: item.IsBase !== undefined ? Number(item.IsBase) : undefined,
        IsCustom: Number(item.IsCustom || 0),
        IsPreference: Number(item.IsPreference || 0),
        IsUpsell: item.IsUpsell !== undefined ? Number(item.IsUpsell) : undefined,
        IsNoteAvailable: Number(item.IsNoteAvailable || 0),
        Note: item.Note || "",
        item_category_id: item.item_category_id !== undefined ? Number(item.item_category_id) : undefined,
        status: item.status !== undefined ? Number(item.status) : undefined,
        sold_out_flag: item.sold_out_flag !== undefined ? Number(item.sold_out_flag) : undefined,
      };
    });

    return {
      CategryId: Number(cat.CategryId),
      CategryName: String(cat.CategryName || "").trim(),
      CategryImage: cat.CategryImage ? String(cat.CategryImage).trim() : "",
      Description: cat.Description ? String(cat.Description).trim() : "",
      ItemList: items,
      ItemListWidget: items,
      FoodCategorylanList: cat.FoodCategorylanList,
    };
  });

  const deals: DealItem[] = rawDeals.map((deal: any) => ({
    DealId: Number(deal.DealId),
    DealName: String(deal.DealName || "").trim(),
    DealDesc: deal.DealDesc ? String(deal.DealDesc).trim() : "",
    DealImage: deal.DealImage ? String(deal.DealImage).trim() : "",
    DealPrice: Number(deal.DealPrice || 0),
    DealMRP: deal.DealMRP !== undefined ? Number(deal.DealMRP) : undefined,
    ShopId: Number(deal.ShopId || defaultShopId),
    DealTypeId: deal.DealTypeId,
    DealStatus: deal.DealStatus,
    OrderMethod: deal.OrderMethod,
    PaymentMethod: deal.PaymentMethod,
    applyDiscount: deal.applyDiscount,
    ContainFoodItem: deal.ContainFoodItem,
  }));

  return { categories, deals };
}
