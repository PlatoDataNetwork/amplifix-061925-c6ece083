import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useJsonData } from "@/hooks/useJsonData";
import { AuthData } from "@/types/auth";

import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: authData, isLoading } = useJsonData<AuthData>('auth.json');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: formData.name,
          }
        }
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
          description: "Account created! Please check your email to confirm your account.",
        });
        navigate('/login');
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
        <MainHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="flex flex-col items-center gap-4">
            <img 
              src="/lovable-uploads/27fcb1ac-666f-4a63-a383-b63576970769.png" 
              alt="Loading..."
              className="w-16 h-16 animate-spin"
            />
            <span className="text-muted-foreground text-sm">Loading...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const signUpText = authData.sign_up;

  return (
    <div className="min-h-screen flex flex-col">
      <MainHeader />
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <div className="w-20 h-20 mx-auto flex items-center justify-center mb-4">
              <img 
                src="/lovable-uploads/27fcb1ac-666f-4a63-a383-b63576970769.png" 
                alt="AmplifiX Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold">{signUpText.title}</h1>
          </div>

          <div className="bg-card border-border/20 border rounded-xl p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {signUpText.name_label}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-background border rounded-lg pl-10 pr-4 py-3 focus:border-[#8A3FFC] focus:ring-2 focus:ring-[#8A3FFC]/20 focus:outline-none transition-all"
                    placeholder={signUpText.name_placeholder}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {signUpText.email_label}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-background border rounded-lg pl-10 pr-4 py-3 focus:border-[#8A3FFC] focus:ring-2 focus:ring-[#8A3FFC]/20 focus:outline-none transition-all"
                    placeholder={signUpText.email_placeholder}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {signUpText.password_label}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-background border rounded-lg pl-10 pr-12 py-3 focus:border-[#8A3FFC] focus:ring-2 focus:ring-[#8A3FFC]/20 focus:outline-none transition-all"
                    placeholder={signUpText.password_placeholder}
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

              <div>
                <label className="block text-sm font-medium mb-2">
                  {signUpText.confirm_password_label}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full bg-background border rounded-lg pl-10 pr-12 py-3 focus:border-[#8A3FFC] focus:ring-2 focus:ring-[#8A3FFC]/20 focus:outline-none transition-all"
                    placeholder={signUpText.confirm_password_placeholder}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] text-white hover:opacity-90 transition-opacity h-12 text-base font-semibold"
              >
                {isSubmitting ? "Creating account..." : signUpText.submit_button}
              </Button>
            </form>

            <p className="text-center text-muted-foreground text-sm mt-6">
              {signUpText.have_account}{' '}
              <LanguageAwareLink to="/login" className="text-[#8A3FFC] hover:text-[#06B6D4] transition-colors font-medium">
                {signUpText.sign_in_link}
              </LanguageAwareLink>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Signup;
