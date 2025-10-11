import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MenuCard } from "./MenuCard";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  stock_status: string;
}

interface MenuSectionProps {
  onAddToCart: (item: MenuItem) => void;
}

export const MenuSection = ({ onAddToCart }: MenuSectionProps) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .order("category")
      .order("name");
    
    if (data && !error) {
      setMenuItems(data);
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    onAddToCart(item);
    toast({
      title: "Ditambahkan ke keranjang",
      description: `${item.name} berhasil ditambahkan`,
    });
  };

  const filterByCategory = (category: string) => {
    return menuItems.filter(item => item.category === category);
  };

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <Tabs defaultValue="Makanan" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="Makanan" className="text-lg">Makanan</TabsTrigger>
          <TabsTrigger value="Minuman" className="text-lg">Minuman</TabsTrigger>
          <TabsTrigger value="Lainnya" className="text-lg">Lainnya</TabsTrigger>
        </TabsList>
        
        <TabsContent value="Makanan" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filterByCategory("Makanan").map((item) => (
              <MenuCard
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                imageUrl={item.image_url}
                stockStatus={item.stock_status}
                onAddToCart={() => handleAddToCart(item)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="Minuman" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filterByCategory("Minuman").map((item) => (
              <MenuCard
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                imageUrl={item.image_url}
                stockStatus={item.stock_status}
                onAddToCart={() => handleAddToCart(item)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="Lainnya" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filterByCategory("Lainnya").map((item) => (
              <MenuCard
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                imageUrl={item.image_url}
                stockStatus={item.stock_status}
                onAddToCart={() => handleAddToCart(item)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};