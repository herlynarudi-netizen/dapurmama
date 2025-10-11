import { useState } from "react";
import { Header } from "@/components/Header";
import { MenuSection } from "@/components/MenuSection";
import { FloatingCart } from "@/components/FloatingCart";
import { Footer } from "@/components/Footer";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = (item: any) => {
    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      
      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <MenuSection onAddToCart={handleAddToCart} />
      <FloatingCart items={cartItems} onUpdateQuantity={handleUpdateQuantity} />
      <Footer />
    </div>
  );
};

export default Index;