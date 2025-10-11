import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Edit } from "lucide-react";

interface HeaderImage {
  id: string;
  image_url: string;
  position: number;
}

export const HeaderImageManagement = () => {
  const [headerImages, setHeaderImages] = useState<HeaderImage[]>([]);
  const [editingPosition, setEditingPosition] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchHeaderImages();
  }, []);

  const fetchHeaderImages = async () => {
    const { data, error } = await supabase
      .from("header_images")
      .select("*")
      .order("position");
    
    if (data && !error) {
      setHeaderImages(data);
    }
  };

  const handleUpdate = async (id: string, position: number) => {
    if (!selectedFile) {
      toast({
        title: "File gambar kosong",
        description: "Pilih file gambar terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      
      // Upload file to storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `header-${position}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, selectedFile, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      // Update database
      const { error } = await supabase
        .from("header_images")
        .update({ image_url: publicUrl })
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: "Gambar berhasil diupdate",
        description: `Gambar posisi ${position} telah diperbarui`,
      });
      
      setEditingPosition(null);
      setSelectedFile(null);
      fetchHeaderImages();
    } catch (error: any) {
      toast({
        title: "Gagal mengupdate",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Kelola Gambar Header</h2>
      <p className="text-muted-foreground">
        Ubah gambar yang ditampilkan di slider header website
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {headerImages.map((image) => (
          <Card key={image.id}>
            <CardHeader>
              <CardTitle>Posisi {image.position}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <img
                src={image.image_url}
                alt={`Header ${image.position}`}
                className="w-full h-48 object-cover rounded-lg"
              />
              
              {editingPosition === image.position ? (
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleUpdate(image.id, image.position)}
                      className="flex-1"
                      disabled={uploading}
                    >
                      {uploading ? "Mengupload..." : "Simpan"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingPosition(null);
                        setSelectedFile(null);
                      }}
                      className="flex-1"
                      disabled={uploading}
                    >
                      Batal
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setEditingPosition(image.position)}
                  className="w-full"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Gambar
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};