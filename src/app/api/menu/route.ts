import { NextResponse } from "next/server";
import { getRestaurantMenu, DEFAULT_SHOP_ID } from "@/lib/menu-api";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const shopIdParam = searchParams.get("ShopId") || searchParams.get("shopId");
    const shopId = shopIdParam ? parseInt(shopIdParam, 10) : DEFAULT_SHOP_ID;

    const data = await getRestaurantMenu(shopId);

    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (error: any) {
    console.error("[API Menu Route Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to load menu data",
      },
      { status: 500 }
    );
  }
}
