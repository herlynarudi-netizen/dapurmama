import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  stock_status: string;
}

export const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Makanan",
    stock_status: "Tersedia",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile && !editingItem) {
      toast({
        title: "File gambar kosong",
        description: "Pilih file gambar terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      let imageUrl = editingItem?.image_url || "";

      // Upload file if selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `menu-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, selectedFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
      }

      if (editingItem) {
        const { error } = await supabase
          .from("menu_items")
          .update({
            name: formData.name,
            price: parseFloat(formData.price),
            image_url: imageUrl,
            category: formData.category,
            stock_status: formData.stock_status,
          })
          .eq("id", editingItem.id);

        if (error) throw error;
        
        toast({
          title: "Menu berhasil diupdate",
          description: "Perubahan telah disimpan",
        });
      } else {
        const { error } = await supabase.from("menu_items").insert({
          name: formData.name,
          price: parseFloat(formData.price),
          image_url: imageUrl,
          category: formData.category,
          stock_status: formData.stock_status,
        });

        if (error) throw error;
        
        toast({
          title: "Menu berhasil ditambahkan",
          description: "Menu baru telah tersedia",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchMenuItems();
    } catch (error: any) {
      toast({
        title: "Gagal menyimpan",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      category: item.category,
      stock_status: item.stock_status,
    });
    setSelectedFile(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus menu ini?")) return;

    try {
      const { error } = await supabase
        .from("menu_items")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: "Menu berhasil dihapus",
        description: "Menu telah dihapus dari daftar",
      });
      
      fetchMenuItems();
    } catch (error: any) {
      toast({
        title: "Gagal menghapus",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      category: "Makanan",
      stock_status: "Tersedia",
    });
    setEditingItem(null);
    setSelectedFile(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Kelola Menu</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Menu
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Menu" : "Tambah Menu Baru"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nama Menu</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Harga</label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Gambar Menu</label>
                {editingItem && !selectedFile && (
                  <div className="mb-2">
                    <img 
                      src={editingItem.image_url} 
                      alt="Current" 
                      className="w-20 h-20 object-cover rounded"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Gambar saat ini (pilih file baru untuk mengganti)
                    </p>
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  required={!editingItem}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Kategori</label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Makanan">Makanan</SelectItem>
                    <SelectItem value="Minuman">Minuman</SelectItem>
                    <SelectItem value="Lainnya">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Status Stok</label>
                <Select
                  value={formData.stock_status}
                  onValueChange={(value) => setFormData({ ...formData, stock_status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tersedia">Tersedia</SelectItem>
                    <SelectItem value="Habis">Habis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button type="submit" className="w-full" disabled={uploading}>
                {uploading ? "Mengupload..." : editingItem ? "Update Menu" : "Tambah Menu"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-40 object-cover rounded-lg"
              />
            </CardHeader>
            <CardContent>
              <CardTitle className="mb-2">{item.name}</CardTitle>
              <p className="text-xl font-bold text-primary mb-2">
                Rp {item.price.toLocaleString("id-ID")}
              </p>
              <div className="flex gap-2 text-sm mb-4">
                <span className="px-2 py-1 bg-muted rounded">{item.category}</span>
                <span className={`px-2 py-1 rounded ${
                  item.stock_status === "Tersedia" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {item.stock_status}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(item)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(item.id)}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};