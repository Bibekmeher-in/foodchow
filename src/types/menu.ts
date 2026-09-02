export interface SizeItem {
  SizeId: string;
  food_item_size?: string;
  SizeName: string;
  Price: number;
  Weight?: string;
  Unit?: string;
  basePrice: number;
  available_stock?: number;
  status?: number;
  sold_out_flag?: number;
  PriceV?: number;
}

export interface MenuItem {
  ItemId: number;
  MenuItemId?: number | null;
  ItemName: string;
  ItemImage?: string;
  Description?: string;
  IsSizeAvailable: number;
  Price: number | null;
  basePrice: number | null;
  SizeId?: string | null;
  SizeListWidget: SizeItem[];
  IsVeg: number;
  NonVegType?: number;
  IsAlcohol?: number;
  IsBase?: number;
  IsCustom: number;
  IsPreference: number;
  IsUpsell?: number;
  IsNoteAvailable?: number;
  Note?: string;
  item_category_id?: number;
  status?: number;
  sold_out_flag?: number;
}

export interface Category {
  CategryId: number;
  CategryName: string;
  CategryImage?: string;
  Description?: string;
  ItemList?: MenuItem[] | null;
  ItemListWidget: MenuItem[];
  FoodCategorylanList?: any;
}

export interface DealItem {
  DealId: number;
  DealName: string;
  DealDesc?: string;
  DealImage?: string;
  DealPrice: number;
  DealMRP?: number;
  ShopId: number;
  DealTypeId?: number;
  DealStatus?: number;
  OrderMethod?: string;
  PaymentMethod?: string;
  applyDiscount?: number;
  ContainFoodItem?: number;
}

export interface MenuTab {
  id: number;
  menu_name: string;
  menu_url: string;
}

export interface TimingDay {
  dayname: string;
  openTime: string;
  closeTime: string;
  is24Hours?: boolean;
}

export interface CustomizationIngredient {
  IngredientId: number;
  IngredientName: string;
  Price: number;
  IsSizeAvalilable?: number;
  SizeId?: string;
}

export interface CustomizationCategory {
  CustomItemId?: number;
  CustomCatId: number;
  CustomCatName: string;
  SelectionType: number;
  MinVal?: number;
  MaxVal?: number;
  IsMandatory?: number;
  ingredientwidgetList: CustomizationIngredient[];
}

export interface PreferenceOption {
  option_id: number;
  option_name: string;
  price?: number;
}

export interface PreferenceItem {
  Id: number;
  prefrence_name: string;
  is_mandatory: number;
  options: PreferenceOption[];
}

export interface CustomizationDetails {
  item_id: number;
  FoodItemCustomizationwidgetList: CustomizationCategory[];
  FooditemprefrencewidgetList: PreferenceItem[];
}

export interface CartItem {
  cartItemId: string;
  item: MenuItem;
  selectedSize: SizeItem | null;
  selectedCustomizations: Record<number, CustomizationIngredient[]>;
  selectedPreferences: Record<number, PreferenceOption[]>;
  notes?: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface RestaurantInfo {
  ShopId: string;
  ShopName: string;
  ShopLogo?: string;
  isOpen: boolean;
  timingText: string;
  ShopAddress?: string;
  PhoneNumber?: string;
  websitename?: string;
  ShopCuisines?: string[];
  fssaiNumber?: string;
}

export interface FoodChowResponse {
  $id?: string;
  message?: string;
  data?: string | FoodChowData | null;
  count?: number;
  response_code?: number;
}

export interface FoodChowData {
  CategoryList?: any[];
  DealList?: any[];
  [key: string]: any;
}

export interface RestaurantMenuResult {
  categories: Category[];
  restaurant: RestaurantInfo;
  deals: DealItem[];
  menus: MenuTab[];
  dataSource: "live" | "fallback";
}

export type OrderType = "delivery" | "pickup" | "dine_in";
export type VegFilterType = "all" | "veg" | "non_veg";
