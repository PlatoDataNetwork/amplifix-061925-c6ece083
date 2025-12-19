import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { getCurrentLanguage } from '@/utils/language';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
}

const languages = [
  { code: 'ar', locale: 'ar_SA', name: 'Arabic' },
  { code: 'bn', locale: 'bn_BD', name: 'Bengali' },
  { code: 'zh', locale: 'zh_CN', name: 'Chinese (Simplified)' },
  { code: 'zh-TW', locale: 'zh_TW', name: 'Chinese (Traditional)' },
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

// Page-specific translated titles
const pageTitles: Record<string, Record<string, string>> = {
  home: {
    en: 'AmplifiX - AI-Powered Investor Relations & Corporate Communications',
    es: 'AmplifiX - Relaciones con Inversores y Comunicaciones Corporativas con IA',
    fr: "AmplifiX - Relations Investisseurs et Communications d'Entreprise par IA",
    de: 'AmplifiX - KI-gestützte Investor Relations und Unternehmenskommunikation',
    it: 'AmplifiX - Relazioni con gli Investitori e Comunicazioni Aziendali con IA',
    pt: 'AmplifiX - Relações com Investidores e Comunicações Corporativas com IA',
    zh: 'AmplifiX - AI驱动的投资者关系与企业沟通',
    ja: 'AmplifiX - AI駆動の投資家関係と企業コミュニケーション',
    ko: 'AmplifiX - AI 기반 투자자 관계 및 기업 커뮤니케이션',
    ar: 'AmplifiX - علاقات المستثمرين والاتصالات المؤسسية المدعومة بالذكاء الاصطناعي',
    ru: 'AmplifiX - Отношения с инвесторами и корпоративные коммуникации на базе ИИ',
    hi: 'AmplifiX - AI-संचालित निवेशक संबंध और कॉर्पोरेट संचार',
    nl: 'AmplifiX - AI-gestuurde Investor Relations en Bedrijfscommunicatie',
    sv: 'AmplifiX - AI-driven Investerarrelationer och Företagskommunikation',
    tr: 'AmplifiX - Yapay Zeka Destekli Yatırımcı İlişkileri ve Kurumsal İletişim',
    he: 'AmplifiX - יחסי משקיעים ותקשורת תאגידית מונעי בינה מלאכותית',
    fa: 'AmplifiX - روابط سرمایه‌گذاران و ارتباطات شرکتی مبتنی بر هوش مصنوعی',
    th: 'AmplifiX - ความสัมพันธ์กับนักลงทุนและการสื่อสารองค์กรด้วย AI',
    pl: 'AmplifiX - Relacje z Inwestorami i Komunikacja Korporacyjna z AI',
    fi: 'AmplifiX - Tekoälypohjaiset sijoittajasuhteet ja yritysviestintä',
    no: 'AmplifiX - AI-drevet investorrelasjoner og bedriftskommunikasjon',
    da: 'AmplifiX - AI-drevet investorrelationer og virksomhedskommunikation',
  },
  showcase: {
    en: 'Innovation Showcase | AmplifiX',
    es: 'Escaparate de Innovación | AmplifiX',
    fr: 'Vitrine de l\'Innovation | AmplifiX',
    de: 'Innovationsschaufenster | AmplifiX',
    it: 'Vetrina dell\'Innovazione | AmplifiX',
    pt: 'Vitrine de Inovação | AmplifiX',
    zh: '创新展示 | AmplifiX',
    ja: 'イノベーションショーケース | AmplifiX',
    ko: '혁신 쇼케이스 | AmplifiX',
    ar: 'معرض الابتكار | AmplifiX',
    ru: 'Витрина инноваций | AmplifiX',
    hi: 'नवाचार शोकेस | AmplifiX',
    nl: 'Innovatie Showcase | AmplifiX',
    sv: 'Innovationsutställning | AmplifiX',
    tr: 'İnovasyon Vitrini | AmplifiX',
    he: 'תצוגת חדשנות | AmplifiX',
    fa: 'نمایشگاه نوآوری | AmplifiX',
    th: 'โชว์เคสนวัตกรรม | AmplifiX',
    pl: 'Wystawa Innowacji | AmplifiX',
    fi: 'Innovaationäyttely | AmplifiX',
    no: 'Innovasjonsutstilling | AmplifiX',
    da: 'Innovationsudstilling | AmplifiX',
  },
  about: {
    en: 'About Us | AmplifiX',
    es: 'Sobre Nosotros | AmplifiX',
    fr: 'À Propos | AmplifiX',
    de: 'Über Uns | AmplifiX',
    it: 'Chi Siamo | AmplifiX',
    pt: 'Sobre Nós | AmplifiX',
    zh: '关于我们 | AmplifiX',
    ja: '会社概要 | AmplifiX',
    ko: '회사 소개 | AmplifiX',
    ar: 'من نحن | AmplifiX',
    ru: 'О нас | AmplifiX',
    hi: 'हमारे बारे में | AmplifiX',
    nl: 'Over Ons | AmplifiX',
    sv: 'Om Oss | AmplifiX',
    tr: 'Hakkımızda | AmplifiX',
    he: 'אודותינו | AmplifiX',
    fa: 'درباره ما | AmplifiX',
    th: 'เกี่ยวกับเรา | AmplifiX',
    pl: 'O Nas | AmplifiX',
    fi: 'Tietoa Meistä | AmplifiX',
    no: 'Om Oss | AmplifiX',
    da: 'Om Os | AmplifiX',
  },
  solutions: {
    en: 'Solutions | AmplifiX',
    es: 'Soluciones | AmplifiX',
    fr: 'Solutions | AmplifiX',
    de: 'Lösungen | AmplifiX',
    it: 'Soluzioni | AmplifiX',
    pt: 'Soluções | AmplifiX',
    zh: '解决方案 | AmplifiX',
    ja: 'ソリューション | AmplifiX',
    ko: '솔루션 | AmplifiX',
    ar: 'الحلول | AmplifiX',
    ru: 'Решения | AmplifiX',
    hi: 'समाधान | AmplifiX',
    nl: 'Oplossingen | AmplifiX',
    sv: 'Lösningar | AmplifiX',
    tr: 'Çözümler | AmplifiX',
    he: 'פתרונות | AmplifiX',
    fa: 'راه‌حل‌ها | AmplifiX',
    th: 'โซลูชัน | AmplifiX',
    pl: 'Rozwiązania | AmplifiX',
    fi: 'Ratkaisut | AmplifiX',
    no: 'Løsninger | AmplifiX',
    da: 'Løsninger | AmplifiX',
  },
  contact: {
    en: 'Contact Us | AmplifiX',
    es: 'Contáctenos | AmplifiX',
    fr: 'Contactez-nous | AmplifiX',
    de: 'Kontakt | AmplifiX',
    it: 'Contattaci | AmplifiX',
    pt: 'Contate-nos | AmplifiX',
    zh: '联系我们 | AmplifiX',
    ja: 'お問い合わせ | AmplifiX',
    ko: '문의하기 | AmplifiX',
    ar: 'اتصل بنا | AmplifiX',
    ru: 'Контакты | AmplifiX',
    hi: 'संपर्क करें | AmplifiX',
    nl: 'Contact | AmplifiX',
    sv: 'Kontakt | AmplifiX',
    tr: 'İletişim | AmplifiX',
    he: 'צור קשר | AmplifiX',
    fa: 'تماس با ما | AmplifiX',
    th: 'ติดต่อเรา | AmplifiX',
    pl: 'Kontakt | AmplifiX',
    fi: 'Ota Yhteyttä | AmplifiX',
    no: 'Kontakt Oss | AmplifiX',
    da: 'Kontakt Os | AmplifiX',
  },
  intel: {
    en: 'Market Intelligence | AmplifiX',
    es: 'Inteligencia de Mercado | AmplifiX',
    fr: 'Intelligence de Marché | AmplifiX',
    de: 'Marktintelligenz | AmplifiX',
    it: 'Intelligence di Mercato | AmplifiX',
    pt: 'Inteligência de Mercado | AmplifiX',
    zh: '市场情报 | AmplifiX',
    ja: 'マーケットインテリジェンス | AmplifiX',
    ko: '시장 인텔리전스 | AmplifiX',
    ar: 'ذكاء السوق | AmplifiX',
    ru: 'Рыночная аналитика | AmplifiX',
    hi: 'बाजार खुफिया | AmplifiX',
    nl: 'Marktintelligentie | AmplifiX',
    sv: 'Marknadsintelligens | AmplifiX',
    tr: 'Pazar İstihbaratı | AmplifiX',
    he: 'מודיעין שוק | AmplifiX',
    fa: 'هوش بازار | AmplifiX',
    th: 'ข่าวกรองตลาด | AmplifiX',
    pl: 'Wywiad Rynkowy | AmplifiX',
    fi: 'Markkinatiedustelu | AmplifiX',
    no: 'Markedsintelligens | AmplifiX',
    da: 'Markedsintelligens | AmplifiX',
  },
  'public-companies': {
    en: 'Public Companies | AmplifiX',
    es: 'Empresas Públicas | AmplifiX',
    fr: 'Entreprises Publiques | AmplifiX',
    de: 'Öffentliche Unternehmen | AmplifiX',
    it: 'Società Quotate | AmplifiX',
    pt: 'Empresas Públicas | AmplifiX',
    zh: '上市公司 | AmplifiX',
    ja: '上場企業 | AmplifiX',
    ko: '상장 기업 | AmplifiX',
    ar: 'الشركات العامة | AmplifiX',
    ru: 'Публичные компании | AmplifiX',
    hi: 'सार्वजनिक कंपनियां | AmplifiX',
    nl: 'Beursgenoteerde Bedrijven | AmplifiX',
    sv: 'Publika Bolag | AmplifiX',
    tr: 'Halka Açık Şirketler | AmplifiX',
    he: 'חברות ציבוריות | AmplifiX',
    fa: 'شرکت‌های عمومی | AmplifiX',
    th: 'บริษัทมหาชน | AmplifiX',
    pl: 'Spółki Publiczne | AmplifiX',
    fi: 'Julkiset Yhtiöt | AmplifiX',
    no: 'Børsnoterte Selskaper | AmplifiX',
    da: 'Børsnoterede Selskaber | AmplifiX',
  },
  'private-companies': {
    en: 'Private Companies | AmplifiX',
    es: 'Empresas Privadas | AmplifiX',
    fr: 'Entreprises Privées | AmplifiX',
    de: 'Private Unternehmen | AmplifiX',
    it: 'Società Private | AmplifiX',
    pt: 'Empresas Privadas | AmplifiX',
    zh: '私人公司 | AmplifiX',
    ja: '非上場企業 | AmplifiX',
    ko: '비상장 기업 | AmplifiX',
    ar: 'الشركات الخاصة | AmplifiX',
    ru: 'Частные компании | AmplifiX',
    hi: 'निजी कंपनियां | AmplifiX',
    nl: 'Particuliere Bedrijven | AmplifiX',
    sv: 'Privata Bolag | AmplifiX',
    tr: 'Özel Şirketler | AmplifiX',
    he: 'חברות פרטיות | AmplifiX',
    fa: 'شرکت‌های خصوصی | AmplifiX',
    th: 'บริษัทเอกชน | AmplifiX',
    pl: 'Spółki Prywatne | AmplifiX',
    fi: 'Yksityiset Yhtiöt | AmplifiX',
    no: 'Private Selskaper | AmplifiX',
    da: 'Private Selskaber | AmplifiX',
  },
  advisory: {
    en: 'Advisory Services | AmplifiX',
    es: 'Servicios de Asesoría | AmplifiX',
    fr: 'Services de Conseil | AmplifiX',
    de: 'Beratungsdienste | AmplifiX',
    it: 'Servizi di Consulenza | AmplifiX',
    pt: 'Serviços de Consultoria | AmplifiX',
    zh: '咨询服务 | AmplifiX',
    ja: 'アドバイザリーサービス | AmplifiX',
    ko: '자문 서비스 | AmplifiX',
    ar: 'الخدمات الاستشارية | AmplifiX',
    ru: 'Консультационные услуги | AmplifiX',
    hi: 'सलाहकार सेवाएं | AmplifiX',
    nl: 'Adviesdiensten | AmplifiX',
    sv: 'Rådgivningstjänster | AmplifiX',
    tr: 'Danışmanlık Hizmetleri | AmplifiX',
    he: 'שירותי ייעוץ | AmplifiX',
    fa: 'خدمات مشاوره | AmplifiX',
    th: 'บริการที่ปรึกษา | AmplifiX',
    pl: 'Usługi Doradcze | AmplifiX',
    fi: 'Neuvontapalvelut | AmplifiX',
    no: 'Rådgivningstjenester | AmplifiX',
    da: 'Rådgivningstjenester | AmplifiX',
  },
  faq: {
    en: 'FAQ | AmplifiX',
    es: 'Preguntas Frecuentes | AmplifiX',
    fr: 'FAQ | AmplifiX',
    de: 'Häufige Fragen | AmplifiX',
    it: 'Domande Frequenti | AmplifiX',
    pt: 'Perguntas Frequentes | AmplifiX',
    zh: '常见问题 | AmplifiX',
    ja: 'よくある質問 | AmplifiX',
    ko: '자주 묻는 질문 | AmplifiX',
    ar: 'الأسئلة الشائعة | AmplifiX',
    ru: 'Часто задаваемые вопросы | AmplifiX',
    hi: 'अक्सर पूछे जाने वाले प्रश्न | AmplifiX',
    nl: 'Veelgestelde Vragen | AmplifiX',
    sv: 'Vanliga Frågor | AmplifiX',
    tr: 'Sıkça Sorulan Sorular | AmplifiX',
    he: 'שאלות נפוצות | AmplifiX',
    fa: 'سوالات متداول | AmplifiX',
    th: 'คำถามที่พบบ่อย | AmplifiX',
    pl: 'Najczęściej Zadawane Pytania | AmplifiX',
    fi: 'Usein Kysytyt Kysymykset | AmplifiX',
    no: 'Ofte Stilte Spørsmål | AmplifiX',
    da: 'Ofte Stillede Spørgsmål | AmplifiX',
  },
};

// Helper to get page key from path
const getPageKeyFromPath = (path: string): string => {
  const cleanPath = path.replace(/^\//, '').split('/')[0];
  if (!cleanPath || cleanPath === '') return 'home';
  if (cleanPath === 'ir-pr') return 'advisory';
  if (cleanPath === 'blog') return 'intel';
  return cleanPath;
};

// Get translated title for current page
const getPageTitle = (path: string, lang: string): string => {
  const pageKey = getPageKeyFromPath(path);
  const pageTranslations = pageTitles[pageKey];
  if (pageTranslations) {
    return pageTranslations[lang] || pageTranslations.en;
  }
  return pageTitles.home[lang] || pageTitles.home.en;
};

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

const SEOHead = ({ title, description, canonicalUrl }: SEOHeadProps) => {
  const location = useLocation();
  const currentLang = getCurrentLanguage();
  const currentLocale = languages.find(l => l.code === currentLang)?.locale || 'en_US';
  const baseUrl = 'https://amplifix.net';
  
  // Get path without language prefix
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const pathWithoutLang = pathSegments.length > 0 && pathSegments[0].length === 2 
    ? '/' + pathSegments.slice(1).join('/') 
    : location.pathname;
  
  const defaultTitle = getPageTitle(pathWithoutLang, currentLang);
  const defaultDescription = seoDescriptions[currentLang] || seoDescriptions.en;
  
  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;
  
  // Show full URL path for og:site_name on non-home pages
  const displayUrl = pathWithoutLang === '/' || pathWithoutLang === '' 
    ? 'amplifix.net' 
    : `amplifix.net${pathWithoutLang}`;

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
      <meta property="og:site_name" content={displayUrl} />
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
      
      {/* Canonical URL - use provided canonical or current path */}
      <link rel="canonical" href={canonicalUrl || `${baseUrl}${location.pathname}`} />
      
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
