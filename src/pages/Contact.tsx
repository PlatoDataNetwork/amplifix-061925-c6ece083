import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, MapPin } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation(['contact', 'common']);
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
  useLanguage();

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

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      toast({
        title: t('contact:form.toast_missing_title'),
        description: t('contact:form.toast_missing_description'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: responseData, error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });

      if (error) throw error;

      toast({
        title: t('contact:form.toast_success_title'),
        description: t('contact:form.toast_success_description'),
      });

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        companyType: "",
        message: ""
      });

    } catch (error: any) {
      console.error('Error sending email:', error);
      toast({
        title: t('contact:form.toast_error_title'),
        description: t('contact:form.toast_error_description'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MainHeader />
      
      {/* Hero Section */}
      <div className="pt-24 container mx-auto py-12 md:py-20 px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">
            {t('contact:hero.title')} <span className="text-highlight-blue">{t('contact:hero.title_highlight')}</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 px-4">
            {t('contact:hero.description')}
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
              {t('contact:hero.cta_primary_text')}
            </Button>
            <a 
              href={t('contact:hero.cta_secondary_link')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button 
                size="lg" 
                variant="outline" 
                className="border-border hover:bg-accent transition-colors w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-lg min-h-[48px]"
              >
                {t('contact:hero.cta_secondary_text')}
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
              <h2 className="text-2xl font-bold mb-6">{t('contact:form.title')}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                      {t('contact:form.first_name_label')}
                    </label>
                    <Input 
                      id="firstName" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder={t('contact:form.first_name_placeholder')}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                      {t('contact:form.last_name_label')}
                    </label>
                    <Input 
                      id="lastName" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder={t('contact:form.last_name_placeholder')}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    {t('contact:form.email_label')}
                  </label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t('contact:form.email_placeholder')}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-2">
                    {t('contact:form.company_label')}
                  </label>
                  <Input 
                    id="company" 
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder={t('contact:form.company_placeholder')}
                  />
                </div>

                <div>
                  <label htmlFor="companyType" className="block text-sm font-medium mb-2">
                    {t('contact:form.company_type_label')}
                  </label>
                  <Select 
                    value={formData.companyType} 
                    onValueChange={(value) => handleSelectChange('companyType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('contact:form.company_type_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">{t('contact:form.company_type_public')}</SelectItem>
                      <SelectItem value="private">{t('contact:form.company_type_private')}</SelectItem>
                      <SelectItem value="pre-ipo">{t('contact:form.company_type_preipo')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    {t('contact:form.message_label')}
                  </label>
                  <Textarea 
                    id="message" 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={t('contact:form.message_placeholder')}
                    className="min-h-[150px]"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-highlight-blue text-white hover:bg-highlight-blue/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('contact:form.submit_button_loading') : t('contact:form.submit_button')}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-card p-8 rounded-xl border border-border">
                <h3 className="text-2xl font-bold mb-6">{t('contact:info.title')}</h3>
                <p className="text-muted-foreground mb-6">
                  {t('contact:info.description')}
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Mail className="h-5 w-5 text-highlight-blue mt-1" />
                    <div>
                      <p className="font-medium">{t('contact:info.email_label')}</p>
                      <a href={`mailto:${t('contact:info.email_value')}`} className="text-muted-foreground hover:text-highlight-blue">
                        {t('contact:info.email_value')}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <MapPin className="h-5 w-5 text-highlight-blue mt-1" />
                    <div>
                      <p className="font-medium">{t('contact:info.office_label')}</p>
                      <p className="text-muted-foreground">{t('contact:info.office_value')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card p-8 rounded-xl border border-border">
                <h3 className="text-2xl font-bold mb-4">{t('contact:consultation.title')}</h3>
                <p className="text-muted-foreground mb-6">
                  {t('contact:consultation.description')}
                </p>
                <a 
                  href={t('contact:consultation.calendly_link')}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" variant="outline" className="w-full">
                    {t('contact:consultation.button_text')}
                  </Button>
                </a>
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
