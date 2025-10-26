
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Code, Lock, Zap, Globe } from "lucide-react";
import Footer from "@/components/Footer";
import { useJsonData } from "@/hooks/useJsonData";
import { ApiData } from "@/types/api";
import { Skeleton } from "@/components/ui/skeleton";
import * as LucideIcons from "lucide-react";

const API = () => {
  const { data, isLoading } = useJsonData<ApiData>("api.json");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white">
        <div className="container mx-auto py-12">
          <Skeleton className="h-12 w-64 mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const apiData = data.api;

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="h-12 w-12 text-[#8A3FFC] mb-4" /> : null;
  };

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET': return 'bg-blue-500/20 text-blue-400';
      case 'POST': return 'bg-green-500/20 text-green-400';
      case 'DELETE': return 'bg-red-500/20 text-red-400';
      case 'PUT': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <nav className="container mx-auto flex items-center justify-between py-6 border-b border-gray-800">
        <Link to="/" className="flex items-center gap-2">
          <ArrowLeft className="h-5 w-5" />
          <span>{apiData.navigation.back_text}</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8A3FFC] to-[#06B6D4] flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <h1 className="text-xl font-bold">{apiData.navigation.title}</h1>
        </div>
      </nav>

      <div className="container mx-auto py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="bg-gradient-to-r from-[#8A3FFC]/10 to-[#3B82F6]/10 text-[#8A3FFC] rounded-full px-6 py-2 border border-[#8A3FFC]/20">
              {apiData.hero.badge_text}
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6">
            {apiData.hero.title} <span className="bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] bg-clip-text text-transparent">{apiData.hero.title_highlight}</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            {apiData.hero.description}
          </p>
          <div className="flex gap-4 justify-center">
            <Button className="bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4]">{apiData.hero.cta_primary}</Button>
            <Button variant="outline">{apiData.hero.cta_secondary}</Button>
          </div>
        </div>

        {/* API Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">{apiData.features.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {apiData.features.items.map((feature, index) => (
              <div key={index} className="bg-[#121218] p-6 rounded-xl border border-gray-800">
                {getIcon(feature.icon)}
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* API Endpoints */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">{apiData.endpoints.title}</h2>
          <div className="space-y-6">
            {apiData.endpoints.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="bg-[#121218] p-6 rounded-xl border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">{section.name}</h3>
                  <span className="bg-[#8A3FFC]/20 text-[#8A3FFC] px-3 py-1 rounded-full text-sm">{section.version}</span>
                </div>
                <div className="space-y-4">
                  {section.endpoints.map((endpoint, endpointIndex) => (
                    <div key={endpointIndex} className="flex items-center gap-4 p-4 bg-[#0A0A0A] rounded-lg">
                      <span className={`${getMethodColor(endpoint.method)} px-2 py-1 rounded text-sm font-mono`}>
                        {endpoint.method}
                      </span>
                      <code className="text-gray-300">{endpoint.path}</code>
                      <span className="text-gray-400">{endpoint.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Code Example */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">{apiData.quick_start.title}</h2>
          <div className="bg-[#121218] p-6 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{apiData.quick_start.code_title}</h3>
              <div className="flex gap-2">
                <span className="text-sm text-gray-400">{apiData.quick_start.language}</span>
                <Code className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            <pre className="bg-[#0A0A0A] p-4 rounded-lg overflow-x-auto">
              <code className="text-sm text-gray-300">{`const response = await fetch('https://api.moltenarc.com/v1/messages', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    recipient: 'user@example.com',
    content: 'Hello from MoltenArc!',
    encryption: 'blockchain'
  })
});

const result = await response.json();
console.log('Message sent:', result.messageId);`}</code>
            </pre>
          </div>
        </section>

        {/* Rate Limits */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">{apiData.rate_limits.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {apiData.rate_limits.tiers.map((tier, index) => (
              <div 
                key={index}
                className={tier.featured 
                  ? "bg-gradient-to-b from-[#8A3FFC]/10 to-[#06B6D4]/10 p-6 rounded-xl border border-[#8A3FFC]/30"
                  : "bg-[#121218] p-6 rounded-xl border border-gray-800"
                }
              >
                <h3 className="text-xl font-bold mb-4">{tier.name}</h3>
                <div className="text-3xl font-bold text-[#8A3FFC] mb-2">{tier.requests}</div>
                <p className="text-gray-400 mb-4">{tier.requests_label}</p>
                <ul className="text-sm text-gray-300 space-y-2">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>• {feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default API;
