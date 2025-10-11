import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MenuManagement } from "@/components/admin/MenuManagement";
import { HeaderImageManagement } from "@/components/admin/HeaderImageManagement";

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }
    
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logout berhasil",
      description: "Anda telah keluar dari admin panel",
    });
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Admin Panel - Dapur Mama</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Keluar
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="menu" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="menu">Kelola Menu</TabsTrigger>
            <TabsTrigger value="header">Kelola Header</TabsTrigger>
          </TabsList>
          
          <TabsContent value="menu">
            <MenuManagement />
          </TabsContent>
          
          <TabsContent value="header">
            <HeaderImageManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}