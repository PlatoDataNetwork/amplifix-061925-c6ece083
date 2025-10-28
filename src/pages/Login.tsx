import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useJsonData } from "@/hooks/useJsonData";
import { AuthData } from "@/types/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import SharedHeader from "@/components/SharedHeader";
import Footer from "@/components/Footer";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: authData, isLoading } = useJsonData<AuthData>('auth.json');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      }
    };
    checkUser();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (isLoading || !authData) {
    return (
      <div className="min-h-screen flex flex-col">
        <SharedHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md space-y-8">
            <Skeleton className="h-12 w-3/4 mx-auto" />
            <div className="bg-card border rounded-xl p-8 space-y-6">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const signInText = authData.sign_in;

  return (
    <div className="min-h-screen flex flex-col">
      <SharedHeader />
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#8A3FFC] to-[#06B6D4] flex items-center justify-center mb-4">
              <span className="text-white font-bold text-2xl">A</span>
            </div>
            <h1 className="text-3xl font-bold">{signInText.title}</h1>
          </div>

          <div className="bg-card border rounded-xl p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {signInText.email_label}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-background border rounded-lg pl-10 pr-4 py-3 focus:border-[#8A3FFC] focus:ring-2 focus:ring-[#8A3FFC]/20 focus:outline-none transition-all"
                    placeholder={signInText.email_placeholder}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {signInText.password_label}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-background border rounded-lg pl-10 pr-12 py-3 focus:border-[#8A3FFC] focus:ring-2 focus:ring-[#8A3FFC]/20 focus:outline-none transition-all"
                    placeholder={signInText.password_placeholder}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="mr-2 rounded border-gray-300" />
                  <span className="text-muted-foreground">{signInText.remember_me}</span>
                </label>
                <button type="button" className="text-[#8A3FFC] hover:text-[#06B6D4] transition-colors">
                  {signInText.forgot_password}
                </button>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] text-white hover:opacity-90 transition-opacity h-12 text-base font-semibold"
              >
                {isSubmitting ? "Signing in..." : signInText.submit_button}
              </Button>
            </form>

            <p className="text-center text-muted-foreground text-sm mt-6">
              {signInText.no_account}{' '}
              <Link to="/signup" className="text-[#8A3FFC] hover:text-[#06B6D4] transition-colors font-medium">
                {signInText.sign_up_link}
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
