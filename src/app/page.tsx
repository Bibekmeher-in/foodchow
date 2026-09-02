import { getRestaurantMenu } from "@/services/api";
import { Header } from "@/components/Header";
import { SubHeader } from "@/components/SubHeader";
import { CategoryNav } from "@/components/CategoryNav";
import { MenuContainer } from "@/components/MenuContainer";
import { Footer } from "@/components/Footer";
import { RestaurantInfoModal } from "@/components/RestaurantInfoModal";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { categories, restaurant, deals, menus } = await getRestaurantMenu(3161);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header restaurant={restaurant} />
      <SubHeader menus={menus} />
      <CategoryNav categories={categories} />
      <main className="flex-1 flex flex-col">
        <MenuContainer categories={categories} restaurant={restaurant} deals={deals} />
      </main>
      <Footer restaurant={restaurant} />
      <RestaurantInfoModal restaurant={restaurant} />
    </div>
  );
}
