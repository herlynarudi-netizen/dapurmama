import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

interface MenuCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  stockStatus: string;
  onAddToCart: () => void;
}

export const MenuCard = ({ name, price, imageUrl, stockStatus, onAddToCart }: MenuCardProps) => {
  const isAvailable = stockStatus === "Tersedia";
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-xl">Habis</span>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{name}</h3>
        <p className="text-2xl font-bold text-primary">
          Rp {price.toLocaleString("id-ID")}
        </p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={onAddToCart}
          disabled={!isAvailable}
          className="w-full bg-primary hover:bg-primary/90 text-white"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Pesan Sekarang
        </Button>
      </CardFooter>
    </Card>
  );
};