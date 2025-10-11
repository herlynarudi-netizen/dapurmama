import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";

export default function Auth() {
  const [email, setEmail] = useState("rudirestautama@dapurmama.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize admin user on component mount
  useEffect(() => {
    const initializeAdmin = async () => {
      try {
        console.log('Initializing admin user...');
        const { data, error } = await supabase.functions.invoke('setup-admin');
        
        if (error) {
          console.error('Error initializing admin:', error);
        } else {
          console.log('Admin initialization result:', data);
        }
      } catch (error) {
        console.error('Error calling setup-admin:', error);
      } finally {
        setInitializing(false);
      }
    };

    initializeAdmin();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Login berhasil",
        description: "Selamat datang di Admin Panel",
      });
      
      navigate("/admin");
    } catch (error: any) {
      toast({
        title: "Login gagal",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 pb-6 text-center">
            <p className="text-muted-foreground">Mempersiapkan sistem...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Masuk ke panel admin Dapur Mama
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Pengguna</label>
              <Input
                type="email"
                placeholder="Rudi Resta"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled
                className="bg-muted"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
              />
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              <LogIn className="mr-2 h-4 w-4" />
              {loading ? "Memproses..." : "Masuk"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}