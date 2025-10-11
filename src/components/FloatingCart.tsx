import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Minus, Plus, MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface FloatingCartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export const FloatingCart = ({ items, onUpdateQuantity }: FloatingCartProps) => {
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCustomerAddress(`Lokasi: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          toast({
            title: "Lokasi berhasil didapat",
            description: "Alamat Anda telah diisi dengan koordinat lokasi",
          });
        },
        (error) => {
          toast({
            title: "Gagal mendapatkan lokasi",
            description: "Pastikan Anda memberikan izin akses lokasi",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Geolocation tidak didukung",
        description: "Browser Anda tidak mendukung fitur geolocation",
        variant: "destructive",
      });
    }
  };

  const handleSendWhatsApp = () => {
    if (!customerName || !customerAddress) {
      toast({
        title: "Data tidak lengkap",
        description: "Mohon isi nama dan alamat terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Keranjang kosong",
        description: "Tambahkan menu terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    const orderDetails = items
      .map(item => `${item.quantity}x ${item.name} - Rp ${(item.price * item.quantity).toLocaleString("id-ID")}`)
      .join("\n");

    const message = `*Pesanan Baru dari Dapur Mama*\n\n*Nama:* ${customerName}\n*Alamat:* ${customerAddress}\n\n*Pesanan:*\n${orderDetails}\n\n*Total:* Rp ${totalPrice.toLocaleString("id-ID")}`;
    
    const whatsappUrl = `https://wa.me/6281312357574?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    
    setIsOpen(false);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="fixed bottom-6 left-6 rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-all bg-primary hover:bg-primary/90"
          >
            <ShoppingCart className="h-6 w-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">
                {totalItems}
              </span>
            )}
          </Button>
        </SheetTrigger>
        
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-2xl">Keranjang Belanja</SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 space-y-4">
            {items.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Keranjang masih kosong
              </p>
            ) : (
              <>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border">
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-primary font-bold">
                          Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-xl font-bold mb-6">
                    <span>Total:</span>
                    <span className="text-primary">Rp {totalPrice.toLocaleString("id-ID")}</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Nama Konsumen</label>
                      <Input
                        placeholder="Masukkan nama Anda"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Alamat Konsumen</label>
                      <Input
                        placeholder="Masukkan alamat Anda"
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                      />
                      <Button
                        variant="outline"
                        className="w-full mt-2"
                        onClick={handleGetLocation}
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        Bagikan Lokasi
                      </Button>
                    </div>
                    
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      size="lg"
                      onClick={handleSendWhatsApp}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Kirim Pesanan via WhatsApp
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};