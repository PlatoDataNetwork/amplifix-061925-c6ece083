import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { getCurrentLanguage } from '@/utils/language';

interface SEOHeadProps {
  title?: string;
  description?: string;
}

const languages = [
  { code: 'ar', locale: 'ar_SA', name: 'Arabic' },
  { code: 'bn', locale: 'bn_BD', name: 'Bengali' },
  { code: 'zh', locale: 'zh_CN', name: 'Chinese' },
  { code: 'da', locale: 'da_DK', name: 'Danish' },
  { code: 'nl', locale: 'nl_NL', name: 'Dutch' },
  { code: 'en', locale: 'en_US', name: 'English' },
  { code: 'et', locale: 'et_EE', name: 'Estonian' },
  { code: 'fi', locale: 'fi_FI', name: 'Finnish' },
  { code: 'fr', locale: 'fr_FR', name: 'French' },
  { code: 'de', locale: 'de_DE', name: 'German' },
  { code: 'el', locale: 'el_GR', name: 'Greek' },
  { code: 'he', locale: 'he_IL', name: 'Hebrew' },
  { code: 'hi', locale: 'hi_IN', name: 'Hindi' },
  { code: 'hu', locale: 'hu_HU', name: 'Hungarian' },
  { code: 'id', locale: 'id_ID', name: 'Indonesian' },
  { code: 'it', locale: 'it_IT', name: 'Italian' },
  { code: 'ja', locale: 'ja_JP', name: 'Japanese' },
  { code: 'km', locale: 'km_KH', name: 'Khmer' },
  { code: 'ko', locale: 'ko_KR', name: 'Korean' },
  { code: 'no', locale: 'no_NO', name: 'Norwegian' },
  { code: 'fa', locale: 'fa_IR', name: 'Persian' },
  { code: 'pl', locale: 'pl_PL', name: 'Polish' },
  { code: 'pt', locale: 'pt_BR', name: 'Portuguese' },
  { code: 'pa', locale: 'pa_IN', name: 'Punjabi' },
  { code: 'ro', locale: 'ro_RO', name: 'Romanian' },
  { code: 'ru', locale: 'ru_RU', name: 'Russian' },
  { code: 'sl', locale: 'sl_SI', name: 'Slovenian' },
  { code: 'es', locale: 'es_ES', name: 'Spanish' },
  { code: 'sv', locale: 'sv_SE', name: 'Swedish' },
  { code: 'th', locale: 'th_TH', name: 'Thai' },
  { code: 'tr', locale: 'tr_TR', name: 'Turkish' },
  { code: 'uk', locale: 'uk_UA', name: 'Ukrainian' },
  { code: 'ur', locale: 'ur_PK', name: 'Urdu' },
  { code: 'vi', locale: 'vi_VN', name: 'Vietnamese' },
];

const seoDescriptions: Record<string, string> = {
  en: 'AmplifiX leverages cutting-edge AI to transform how public and private companies manage investor relations and corporate communications.',
  es: 'AmplifiX aprovecha la IA de vanguardia para transformar cómo las empresas públicas y privadas gestionan las relaciones con inversores y comunicaciones corporativas.',
  fr: "AmplifiX exploite l'IA de pointe pour transformer la façon dont les entreprises publiques et privées gèrent les relations investisseurs et les communications d'entreprise.",
  de: 'AmplifiX nutzt modernste KI, um zu transformieren, wie öffentliche und private Unternehmen Investor Relations und Unternehmenskommunikation verwalten.',
  it: "AmplifiX sfrutta l'IA all'avanguardia per trasformare il modo in cui le aziende pubbliche e private gestiscono le relazioni con gli investitori e le comunicazioni aziendali.",
  pt: 'AmplifiX aproveita IA de ponta para transformar como empresas públicas e privadas gerenciam relações com investidores e comunicações corporativas.',
  zh: 'AmplifiX 利用尖端人工智能改变上市公司和私人公司管理投资者关系和企业沟通的方式。',
  ja: 'AmplifiXは最先端のAIを活用して、上場企業と非上場企業の投資家関係と企業コミュニケーションの管理方法を変革します。',
  ko: 'AmplifiX는 최첨단 AI를 활용하여 상장 및 비상장 기업이 투자자 관계 및 기업 커뮤니케이션을 관리하는 방식을 혁신합니다.',
  ar: 'تستفيد AmplifiX من الذكاء الاصطناعي المتطور لتحويل كيفية إدارة الشركات العامة والخاصة لعلاقات المستثمرين والاتصالات المؤسسية.',
  ru: 'AmplifiX использует передовой ИИ для трансформации того, как государственные и частные компании управляют отношениями с инвесторами и корпоративными коммуникациями.',
  hi: 'AmplifiX अत्याधुनिक AI का लाभ उठाकर सार्वजनिक और निजी कंपनियों के निवेशक संबंधों और कॉर्पोरेट संचार प्रबंधन को बदलता है।',
  nl: 'AmplifiX maakt gebruik van geavanceerde AI om te transformeren hoe openbare en private bedrijven investeerdersrelaties en bedrijfscommunicatie beheren.',
  sv: 'AmplifiX utnyttjar banbrytande AI för att transformera hur offentliga och privata företag hanterar investerarrelationer och företagskommunikation.',
  tr: 'AmplifiX, halka açık ve özel şirketlerin yatırımcı ilişkilerini ve kurumsal iletişimlerini nasıl yönettiklerini dönüştürmek için son teknoloji yapay zekayı kullanır.',
  pl: 'AmplifiX wykorzystuje najnowocześniejszą sztuczną inteligencję do przekształcenia sposobu, w jaki firmy publiczne i prywatne zarządzają relacjami z inwestorami i komunikacją korporacyjną.',
  fi: 'AmplifiX hyödyntää huippuluokan tekoälyä muuttamaan tapaa, jolla julkiset ja yksityiset yritykset hallitsevat sijoittajasuhteita ja yritysviestintää.',
  no: 'AmplifiX benytter banebrytende AI til å transformere hvordan offentlige og private selskaper administrerer investorrelasjoner og bedriftskommunikasjon.',
  da: 'AmplifiX udnytter banebrydende AI til at transformere, hvordan offentlige og private virksomheder administrerer investorrelationer og virksomhedskommunikation.',
  is: 'AmplifiX nýtir nýjustu gervigreind til að umbreyta því hvernig opinber og einkafyrirtæki stjórna fjárfestatengslum og fyrirtækjasamskiptum.',
  th: 'AmplifiX ใช้ AI ล้ำสมัยเพื่อเปลี่ยนแปลงวิธีที่บริษัทมหาชนและเอกชนจัดการความสัมพันธ์กับนักลงทุนและการสื่อสารองค์กร',
  he: 'AmplifiX מנצלת בינה מלאכותית חדישה כדי לשנות את האופן שבו חברות ציבוריות ופרטיות מנהלות יחסי משקיעים ותקשורת תאגידית.',
  fa: 'AmplifiX از هوش مصنوعی پیشرفته برای تغییر نحوه مدیریت روابط سرمایه‌گذاران و ارتباطات شرکتی توسط شرکت‌های دولتی و خصوصی استفاده می‌کند.',
};

const SEOHead = ({ title, description }: SEOHeadProps) => {
  const location = useLocation();
  const currentLang = getCurrentLanguage();
  const currentLocale = languages.find(l => l.code === currentLang)?.locale || 'en_US';
  const baseUrl = 'https://amplifix.net';
  
  // Get path without language prefix
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const pathWithoutLang = pathSegments.length > 0 && pathSegments[0].length === 2 
    ? '/' + pathSegments.slice(1).join('/') 
    : location.pathname;
  
  const defaultTitle = 'AmplifiX - AI-Powered Investor Relations & Corporate Communications';
  const defaultDescription = seoDescriptions[currentLang] || seoDescriptions.en;
  
  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={currentLang} dir={['ar', 'he', 'fa'].includes(currentLang) ? 'rtl' : 'ltr'} />
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="language" content={currentLang} />
      <meta httpEquiv="content-language" content={currentLang} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${baseUrl}${location.pathname}`} />
      <meta property="og:image" content={`${baseUrl}/lovable-uploads/amplifix-social-logo.png`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="1200" />
      <meta property="og:site_name" content="AmplifiX" />
      <meta property="og:locale" content={currentLocale} />
      
      {/* OG Alternate Locales */}
      {languages
        .filter(lang => lang.code !== currentLang)
        .map(lang => (
          <meta 
            key={`og-alt-${lang.code}`}
            property="og:locale:alternate" 
            content={lang.locale} 
          />
        ))
      }
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={`${baseUrl}/lovable-uploads/amplifix-social-logo.png`} />
      <meta name="twitter:site" content="@AmplifiX" />
      <meta name="twitter:creator" content="@AmplifiX" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="author" content="AmplifiX" />
      <meta name="copyright" content="AmplifiX" />
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="Global" />
      
      {/* Canonical URL - always in current language */}
      <link rel="canonical" href={`${baseUrl}${location.pathname}`} />
      
      {/* Hreflang Tags for all languages */}
      {languages.map(lang => {
        const langPath = lang.code === 'en' ? pathWithoutLang : `/${lang.code}${pathWithoutLang}`;
        return (
          <link
            key={`hreflang-${lang.code}`}
            rel="alternate"
            hrefLang={lang.code}
            href={`${baseUrl}${langPath}`}
          />
        );
      })}
      
      {/* x-default hreflang - points to English version */}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${baseUrl}${pathWithoutLang}`}
      />
      
      {/* Language-specific structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "AmplifiX",
          "url": baseUrl,
          "description": finalDescription,
          "inLanguage": currentLang,
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${baseUrl}/intel?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
      
      {/* Organization structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "AmplifiX",
          "url": baseUrl,
          "logo": `${baseUrl}/lovable-uploads/amplifix-social-logo.png`,
          "description": seoDescriptions.en,
          "sameAs": [
            "https://twitter.com/AmplifiX",
            "https://linkedin.com/company/amplifix"
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;
