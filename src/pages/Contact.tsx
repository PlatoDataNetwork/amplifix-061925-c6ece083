import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, MapPin } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useJsonData } from "@/hooks/useJsonData";
import { Skeleton } from "@/components/ui/skeleton";
import { z } from "zod";

interface ContactData {
  contact: {
    hero_title: string;
    hero_title_highlight: string;
    hero_description: string;
    hero_cta_primary_text: string;
    hero_cta_secondary_text: string;
    hero_cta_secondary_link: string;
    
    form_title: string;
    form_first_name_label: string;
    form_first_name_placeholder: string;
    form_last_name_label: string;
    form_last_name_placeholder: string;
    form_email_label: string;
    form_email_placeholder: string;
    form_company_label: string;
    form_company_placeholder: string;
    form_company_type_label: string;
    form_company_type_placeholder: string;
    form_company_type_public: string;
    form_company_type_private: string;
    form_company_type_preipo: string;
    form_message_label: string;
    form_message_placeholder: string;
    form_submit_button: string;
    form_submit_button_loading: string;
    
    contact_info_title: string;
    contact_info_description: string;
    contact_email_label: string;
    contact_email_value: string;
    contact_office_label: string;
    contact_office_value: string;
    
    consultation_title: string;
    consultation_description: string;
    consultation_button_text: string;
    consultation_calendly_link: string;
    
    toast_missing_title: string;
    toast_missing_description: string;
    toast_success_title: string;
    toast_success_description: string;
    toast_error_title: string;
    toast_error_description: string;
  };
}

// Security: Comprehensive input validation schema
const contactFormSchema = z.object({
  firstName: z.string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "First name contains invalid characters"),
  lastName: z.string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Last name contains invalid characters"),
  email: z.string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters")
    .toLowerCase(),
  company: z.string()
    .trim()
    .max(100, "Company name must be less than 100 characters")
    .optional(),
  companyType: z.enum(["public", "private", "pre-ipo", ""]).optional(),
  message: z.string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters")
});

const Contact = () => {
  const { data, isLoading, error } = useJsonData<ContactData>('contact.json');
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    companyType: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!data) return;

    setIsSubmitting(true);

    try {
      // Security: Validate all inputs with Zod schema
      const validatedData = contactFormSchema.parse(formData);

      const { data: responseData, error } = await supabase.functions.invoke('send-contact-email', {
        body: validatedData
      });

      if (error) throw error;

      toast({
        title: data.contact.toast_success_title,
        description: data.contact.toast_success_description,
      });

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        companyType: "",
        message: ""
      });

    } catch (error: any) {
      if (error instanceof z.ZodError) {
        // Display validation errors
        const firstError = error.errors[0];
        toast({
          title: "Validation Error",
          description: firstError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: data.contact.toast_error_title,
          description: data.contact.toast_error_description,
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <MainHeader />
        <div className="pt-24 container mx-auto py-20 px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-6 w-full max-w-2xl mx-auto mb-8" />
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Skeleton className="h-12 w-48" />
              <Skeleton className="h-12 w-48" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <MainHeader />
        <div className="pt-24 container mx-auto py-20 px-4 text-center">
          <p className="text-destructive">Failed to load contact content</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MainHeader />
      
      {/* Hero Section */}
      <div className="pt-24 container mx-auto py-12 md:py-20 px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">
            {data.contact.hero_title} <span className="text-highlight-blue">{data.contact.hero_title_highlight}</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 px-4">
            {data.contact.hero_description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button 
              size="lg" 
              onClick={() => {
                const contactForm = document.getElementById('contact-form');
                if (contactForm) {
                  contactForm.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-lg min-h-[48px]"
            >
              {data.contact.hero_cta_primary_text}
            </Button>
            <a 
              href={data.contact.hero_cta_secondary_link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button 
                size="lg" 
                variant="outline" 
                className="border-border hover:bg-accent transition-colors w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-lg min-h-[48px]"
              >
                {data.contact.hero_cta_secondary_text}
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <section id="contact-form" className="container mx-auto py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-card p-8 rounded-xl border border-border">
              <h2 className="text-2xl font-bold mb-6">{data.contact.form_title}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                      {data.contact.form_first_name_label}
                    </label>
                    <Input 
                      id="firstName" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder={data.contact.form_first_name_placeholder}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                      {data.contact.form_last_name_label}
                    </label>
                    <Input 
                      id="lastName" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder={data.contact.form_last_name_placeholder}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    {data.contact.form_email_label}
                  </label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={data.contact.form_email_placeholder}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-2">
                    {data.contact.form_company_label}
                  </label>
                  <Input 
                    id="company" 
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder={data.contact.form_company_placeholder}
                  />
                </div>
                
                <div>
                  <label htmlFor="companyType" className="block text-sm font-medium mb-2">
                    {data.contact.form_company_type_label}
                  </label>
                  <Select value={formData.companyType} onValueChange={(value) => handleSelectChange('companyType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={data.contact.form_company_type_placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">{data.contact.form_company_type_public}</SelectItem>
                      <SelectItem value="private">{data.contact.form_company_type_private}</SelectItem>
                      <SelectItem value="pre-ipo">{data.contact.form_company_type_preipo}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    {data.contact.form_message_label}
                  </label>
                  <Textarea 
                    id="message" 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={data.contact.form_message_placeholder}
                    rows={6}
                    required
                  />
                </div>
                
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-highlight-blue text-white hover:bg-highlight-blue/90 disabled:opacity-50"
                >
                  {isSubmitting ? data.contact.form_submit_button_loading : data.contact.form_submit_button}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">{data.contact.contact_info_title}</h2>
                <p className="text-muted-foreground mb-8">
                  {data.contact.contact_info_description}
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-highlight-blue mt-1" />
                    <div>
                      <h3 className="font-medium mb-1">{data.contact.contact_email_label}</h3>
                      <p className="text-muted-foreground">{data.contact.contact_email_value}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-highlight-blue mt-1" />
                    <div>
                      <h3 className="font-medium mb-1">{data.contact.contact_office_label}</h3>
                      <p className="text-muted-foreground" style={{ whiteSpace: 'pre-line' }}>
                        {data.contact.contact_office_value}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/30 p-6 rounded-xl">
                <h3 className="font-bold mb-3">{data.contact.consultation_title}</h3>
                <p className="text-muted-foreground mb-4">
                  {data.contact.consultation_description}
                </p>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  asChild
                >
                  <a 
                    href={data.contact.consultation_calendly_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {data.contact.consultation_button_text}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
