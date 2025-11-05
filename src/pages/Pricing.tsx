import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, X, Shield, ArrowRight } from "lucide-react";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { useJsonData } from "@/hooks/useJsonData";
import { useLanguage } from "@/hooks/useLanguage";

interface PricingData {
  pricing: {
    seo: {
      title: string;
      description: string;
      keywords: string;
      canonical_url: string;
    };
    hero: {
      title: string;
      subtitle: string;
      description: string;
    };
    billing_toggle?: {
      monthly: string;
      annual: string;
      save_text: string;
      most_popular: string;
    };
    comparison_table?: {
      header_feature: string;
      header_startup: string;
      header_growth: string;
      header_enterprise: string;
    };
    plans: Array<{
      id: string;
      name: string;
      description: string;
      price: number | null;
      billing: string;
      popular: boolean;
      features: string[];
      limits: Record<string, string | number>;
      cta: string;
      highlight_color: string;
    }>;
    comparison: {
      title: string;
      features: Array<{
        category: string;
        items: Array<{
          feature: string;
          startup: boolean;
          growth: boolean;
          enterprise: boolean;
        }>;
      }>;
    };
    faq: {
      title: string;
      items: Array<{
        question: string;
        answer: string;
      }>;
    };
    guarantee: {
      title: string;
      description: string;
    };
    cta: {
      title: string;
      description: string;
      primary_button: string;
      secondary_button: string;
    };
  };
}

const Pricing = () => {
  const { data, isLoading, error } = useJsonData<PricingData>('pricing.json');
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");
  useLanguage(); // Auto-translates page

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <MainHeader />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background">
        <MainHeader />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">{error || 'Error loading pricing data'}</div>
        </div>
        <Footer />
      </div>
    );
  }

  const getDiscountedPrice = (price: number | null) => {
    if (!price) return null;
    return billingPeriod === "annual" ? Math.round(price * 0.8) : price;
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{data.pricing.seo.title}</title>
        <meta name="description" content={data.pricing.seo.description} />
        <meta name="keywords" content={data.pricing.seo.keywords} />
        <link rel="canonical" href={data.pricing.seo.canonical_url} />
      </Helmet>

      <MainHeader />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            {data.pricing.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            {data.pricing.hero.subtitle}
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {data.pricing.hero.description}
          </p>
        </div>
      </section>

      {/* Billing Toggle */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-center mb-12">
            <div className="bg-muted rounded-lg p-1">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  billingPeriod === "monthly"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {data.pricing.billing_toggle?.monthly || 'Monthly'}
              </button>
              <button
                onClick={() => setBillingPeriod("annual")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  billingPeriod === "annual"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {data.pricing.billing_toggle?.annual || 'Annual'}
                <Badge variant="secondary" className="ml-2">{data.pricing.billing_toggle?.save_text || 'Save 20%'}</Badge>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {data.pricing.plans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.popular ? 'border-highlight-blue shadow-lg scale-105' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-highlight-blue text-white">
                    {data.pricing.billing_toggle?.most_popular || 'Most Popular'}
                  </Badge>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <p className="text-muted-foreground">{plan.description}</p>
                  <div className="pt-4">
                    {plan.price ? (
                      <div>
                        <span className="text-4xl font-bold">
                          ${getDiscountedPrice(plan.price)}
                        </span>
                        <span className="text-muted-foreground">
                          /{billingPeriod === "annual" ? "month" : "month"}
                        </span>
                        {billingPeriod === "annual" && (
                          <div className="text-sm text-muted-foreground">
                            <span className="line-through">${plan.price}/month</span>
                            <span className="text-green-600 ml-2">Save ${plan.price - getDiscountedPrice(plan.price)!}/month</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <span className="text-4xl font-bold">Custom</span>
                        <div className="text-sm text-muted-foreground">Contact for pricing</div>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-highlight-blue hover:bg-highlight-blue/90' : ''}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">{data.pricing.comparison.title}</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4">{data.pricing.comparison_table?.header_feature || 'Feature'}</th>
                  <th className="text-center py-4 px-4">{data.pricing.comparison_table?.header_startup || 'Startup'}</th>
                  <th className="text-center py-4 px-4">{data.pricing.comparison_table?.header_growth || 'Growth'}</th>
                  <th className="text-center py-4 px-4">{data.pricing.comparison_table?.header_enterprise || 'Enterprise'}</th>
                </tr>
              </thead>
              <tbody>
                {data.pricing.comparison.features.map((category) => (
                  <>
                    <tr key={category.category} className="border-b bg-muted/50">
                      <td className="py-3 px-4 font-semibold" colSpan={4}>
                        {category.category}
                      </td>
                    </tr>
                    {category.items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4">{item.feature}</td>
                        <td className="text-center py-3 px-4">
                          {item.startup ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground mx-auto" />
                          )}
                        </td>
                        <td className="text-center py-3 px-4">
                          {item.growth ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground mx-auto" />
                          )}
                        </td>
                        <td className="text-center py-3 px-4">
                          {item.enterprise ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">{data.pricing.faq.title}</h2>
          <Accordion type="single" collapsible className="space-y-4">
            {data.pricing.faq.items.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex justify-center mb-6">
            <Shield className="h-12 w-12 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-4">{data.pricing.guarantee.title}</h2>
          <p className="text-muted-foreground text-lg">{data.pricing.guarantee.description}</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">{data.pricing.cta.title}</h2>
          <p className="text-xl text-muted-foreground mb-8">{data.pricing.cta.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-highlight-blue hover:bg-highlight-blue/90">
              {data.pricing.cta.primary_button}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline">
              {data.pricing.cta.secondary_button}
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;