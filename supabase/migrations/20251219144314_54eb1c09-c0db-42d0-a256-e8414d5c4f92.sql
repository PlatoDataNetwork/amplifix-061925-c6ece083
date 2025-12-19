-- Update Arabic solutions translation
UPDATE translations 
SET content = '{
  "solutions": {
    "hero_title": "حلول لكل",
    "hero_title_highlight": "مرحلة",
    "hero_description": "حلول شاملة مصممة لتعزيز استراتيجية التواصل الخاصة بك في كل مرحلة من مراحل النمو.",
    "hero_cta_primary_text": "ابدأ الآن",
    "hero_cta_primary_link": "/contact",
    "hero_cta_secondary_text": "احجز عرضًا توضيحيًا",
    "hero_cta_secondary_link": "https://calendly.com/amplifix/amplifix-discovery",
    "solutions_list": [
      {"title": "الشركات العامة", "description": "حلول علاقات المستثمرين والاتصالات المؤسسية المدعومة بالذكاء الاصطناعي والمصممة للشركات المتداولة علنًا مع نهج الامتثال أولاً.", "link_text": "استكشف →", "link": "/solutions/public-companies", "icon": "Building2"},
      {"title": "الشركات الخاصة", "description": "حلول الاتصالات الاستراتيجية ومشاركة أصحاب المصلحة المصممة للشركات الخاصة التي تستعد للنمو أو التخارج.", "link_text": "استكشف →", "link": "/solutions/private-companies", "icon": "Users"},
      {"title": "الاستخبارات السوقية", "description": "رؤى السوق في الوقت الفعلي وتجميع الأخبار والاستخبارات عبر القطاعات الرئيسية لإبلاغ القرارات الاستراتيجية.", "link_text": "استكشف →", "link": "/intel", "icon": "TrendingUp"},
      {"title": "الاستشارات", "description": "خدمات استشارية استراتيجية لمساعدتك في التعامل مع تحديات الاتصالات المؤسسية المعقدة وتعظيم قيمة أصحاب المصلحة.", "link_text": "استكشف →", "link": "/solutions/advisory", "icon": "Lightbulb"},
      {"title": "تحليلات البيانات", "description": "مجموعة تحليلات شاملة توفر رؤى في الوقت الفعلي وتحليل المشاعر ومقاييس الأداء لاتخاذ قرارات مبنية على البيانات.", "link_text": "استكشف →", "link": "/solutions/analytics", "icon": "BarChart3"},
      {"title": "التطوير", "description": "حلول برمجية مخصصة وتكاملات منصات لتشغيل البنية التحتية للاتصالات المؤسسية.", "link_text": "استكشف →", "link": "/solutions/development", "icon": "Code"},
      {"title": "علاقات المستثمرين", "description": "منصة متكاملة لعلاقات المستثمرين والعلاقات العامة لتبسيط الاتصالات وتعزيز مشاركة أصحاب المصلحة.", "link_text": "استكشف →", "link": "/solutions/ir-pr", "icon": "Megaphone"},
      {"title": "التوزيع / IR / PR", "description": "شبكة توزيع محتوى متميزة لتضخيم رسالتك عبر القنوات المستهدفة وتعظيم الوصول.", "link_text": "استكشف →", "link": "/solutions/syndication", "icon": "Share2"},
      {"title": "توزيع الفيديو", "description": "التلفزيون المتدفق وتوزيع الفيديو الرقمي مع استهداف مدعوم بالذكاء الاصطناعي للوصول إلى الجماهير عبر كل شاشة.", "link_text": "استكشف →", "link": "/solutions/video-distribution", "icon": "Tv"}
    ]
  }
}'::jsonb,
updated_at = now()
WHERE namespace = 'solutions' AND language_code = 'ar';

-- Update Romanian solutions translation
UPDATE translations 
SET content = '{
  "solutions": {
    "hero_title": "Soluții pentru",
    "hero_title_highlight": "Fiecare Etapă",
    "hero_description": "Soluții complete concepute pentru a amplifica strategia ta de comunicare în fiecare etapă de creștere.",
    "hero_cta_primary_text": "Începe Acum",
    "hero_cta_primary_link": "/contact",
    "hero_cta_secondary_text": "Programează o Demonstrație",
    "hero_cta_secondary_link": "https://calendly.com/amplifix/amplifix-discovery",
    "solutions_list": [
      {"title": "Companii Publice", "description": "Soluții de relații cu investitorii și comunicări corporative bazate pe AI, concepute pentru companiile tranzacționate public cu abordare orientată spre conformitate.", "link_text": "Explorează →", "link": "/solutions/public-companies", "icon": "Building2"},
      {"title": "Companii Private", "description": "Soluții de comunicații strategice și implicare a părților interesate adaptate pentru companii private care se pregătesc pentru creștere sau ieșire.", "link_text": "Explorează →", "link": "/solutions/private-companies", "icon": "Users"},
      {"title": "Inteligență de Piață", "description": "Informații despre piață în timp real, agregare de știri și inteligență în sectoare cheie pentru a informa deciziile strategice.", "link_text": "Explorează →", "link": "/intel", "icon": "TrendingUp"},
      {"title": "Consultanță", "description": "Servicii de consultanță strategică pentru a vă ajuta să navigați provocările complexe de comunicare corporativă și să maximizați valoarea părților interesate.", "link_text": "Explorează →", "link": "/solutions/advisory", "icon": "Lightbulb"},
      {"title": "Analiză de Date", "description": "Suită completă de analiză care oferă informații în timp real, analiză de sentiment și metrici de performanță pentru decizii bazate pe date.", "link_text": "Explorează →", "link": "/solutions/analytics", "icon": "BarChart3"},
      {"title": "Dezvoltare", "description": "Soluții software personalizate și integrări de platforme pentru a alimenta infrastructura de comunicații corporative.", "link_text": "Explorează →", "link": "/solutions/development", "icon": "Code"},
      {"title": "Relații cu Investitorii", "description": "Platformă integrată de relații cu investitorii și relații publice pentru a eficientiza comunicațiile și a îmbunătăți implicarea părților interesate.", "link_text": "Explorează →", "link": "/solutions/ir-pr", "icon": "Megaphone"},
      {"title": "Sindicalizare / IR / PR", "description": "Rețea premium de distribuție a conținutului pentru a amplifica mesajul dvs. prin canale țintite și a maximiza acoperirea.", "link_text": "Explorează →", "link": "/solutions/syndication", "icon": "Share2"},
      {"title": "Distribuție Video", "description": "Streaming TV și distribuție video digitală cu targetare bazată pe AI pentru a ajunge la audiențe pe fiecare ecran.", "link_text": "Explorează →", "link": "/solutions/video-distribution", "icon": "Tv"}
    ]
  }
}'::jsonb,
updated_at = now()
WHERE namespace = 'solutions' AND language_code = 'ro';

-- Update Thai solutions translation
UPDATE translations 
SET content = '{
  "solutions": {
    "hero_title": "โซลูชันสำหรับ",
    "hero_title_highlight": "ทุกขั้นตอน",
    "hero_description": "โซลูชันที่ครอบคลุมออกแบบมาเพื่อเสริมกลยุทธ์การสื่อสารของคุณในทุกขั้นตอนของการเติบโต",
    "hero_cta_primary_text": "เริ่มต้นเลย",
    "hero_cta_primary_link": "/contact",
    "hero_cta_secondary_text": "จองการสาธิต",
    "hero_cta_secondary_link": "https://calendly.com/amplifix/amplifix-discovery",
    "solutions_list": [
      {"title": "บริษัทมหาชน", "description": "โซลูชันนักลงทุนสัมพันธ์และการสื่อสารองค์กรที่ขับเคลื่อนด้วย AI ออกแบบมาสำหรับบริษัทจดทะเบียนด้วยแนวทางที่เน้นการปฏิบัติตามกฎระเบียบ", "link_text": "สำรวจ →", "link": "/solutions/public-companies", "icon": "Building2"},
      {"title": "บริษัทเอกชน", "description": "โซลูชันการสื่อสารเชิงกลยุทธ์และการมีส่วนร่วมของผู้มีส่วนได้ส่วนเสียที่ปรับแต่งสำหรับบริษัทเอกชนที่เตรียมพร้อมสำหรับการเติบโตหรือการออก", "link_text": "สำรวจ →", "link": "/solutions/private-companies", "icon": "Users"},
      {"title": "ข้อมูลอัจฉริยะตลาด", "description": "ข้อมูลเชิงลึกของตลาดแบบเรียลไทม์ การรวบรวมข่าว และข้อมูลอัจฉริยะข้ามภาคส่วนหลักเพื่อแจ้งการตัดสินใจเชิงกลยุทธ์", "link_text": "สำรวจ →", "link": "/intel", "icon": "TrendingUp"},
      {"title": "ที่ปรึกษา", "description": "บริการที่ปรึกษาเชิงกลยุทธ์เพื่อช่วยคุณนำทางความท้าทายด้านการสื่อสารองค์กรที่ซับซ้อนและเพิ่มมูลค่าสูงสุดให้กับผู้มีส่วนได้ส่วนเสีย", "link_text": "สำรวจ →", "link": "/solutions/advisory", "icon": "Lightbulb"},
      {"title": "การวิเคราะห์ข้อมูล", "description": "ชุดการวิเคราะห์ที่ครอบคลุมให้ข้อมูลเชิงลึกแบบเรียลไทม์ การวิเคราะห์ความรู้สึก และเมตริกประสิทธิภาพสำหรับการตัดสินใจที่ขับเคลื่อนด้วยข้อมูล", "link_text": "สำรวจ →", "link": "/solutions/analytics", "icon": "BarChart3"},
      {"title": "การพัฒนา", "description": "โซลูชันซอฟต์แวร์ที่ปรับแต่งและการผสานรวมแพลตฟอร์มเพื่อขับเคลื่อนโครงสร้างพื้นฐานการสื่อสารองค์กรของคุณ", "link_text": "สำรวจ →", "link": "/solutions/development", "icon": "Code"},
      {"title": "นักลงทุนสัมพันธ์", "description": "แพลตฟอร์มนักลงทุนสัมพันธ์และประชาสัมพันธ์แบบบูรณาการเพื่อปรับปรุงการสื่อสารและเพิ่มการมีส่วนร่วมของผู้มีส่วนได้ส่วนเสีย", "link_text": "สำรวจ →", "link": "/solutions/ir-pr", "icon": "Megaphone"},
      {"title": "การเผยแพร่ / IR / PR", "description": "เครือข่ายการเผยแพร่เนื้อหาระดับพรีเมียมเพื่อขยายข้อความของคุณผ่านช่องทางที่กำหนดเป้าหมายและเพิ่มการเข้าถึงสูงสุด", "link_text": "สำรวจ →", "link": "/solutions/syndication", "icon": "Share2"},
      {"title": "การเผยแพร่วิดีโอ", "description": "สตรีมมิ่งทีวีและการเผยแพร่วิดีโอดิจิทัลพร้อมการกำหนดเป้าหมายที่ขับเคลื่อนด้วย AI เพื่อเข้าถึงผู้ชมทุกหน้าจอ", "link_text": "สำรวจ →", "link": "/solutions/video-distribution", "icon": "Tv"}
    ]
  }
}'::jsonb,
updated_at = now()
WHERE namespace = 'solutions' AND language_code = 'th';

-- Update Turkish solutions translation
UPDATE translations 
SET content = '{
  "solutions": {
    "hero_title": "Her Aşama İçin",
    "hero_title_highlight": "Çözümler",
    "hero_description": "Büyümenin her aşamasında iletişim stratejinizi güçlendirmek için tasarlanmış kapsamlı çözümler.",
    "hero_cta_primary_text": "Başlayın",
    "hero_cta_primary_link": "/contact",
    "hero_cta_secondary_text": "Demo Rezervasyonu",
    "hero_cta_secondary_link": "https://calendly.com/amplifix/amplifix-discovery",
    "solutions_list": [
      {"title": "Halka Açık Şirketler", "description": "Uyumluluk öncelikli yaklaşımla halka açık şirketler için tasarlanmış yapay zeka destekli yatırımcı ilişkileri ve kurumsal iletişim çözümleri.", "link_text": "Keşfet →", "link": "/solutions/public-companies", "icon": "Building2"},
      {"title": "Özel Şirketler", "description": "Büyüme veya çıkış için hazırlanan özel şirketler için uyarlanmış stratejik iletişim ve paydaş katılımı çözümleri.", "link_text": "Keşfet →", "link": "/solutions/private-companies", "icon": "Users"},
      {"title": "Pazar İstihbaratı", "description": "Stratejik kararları bilgilendirmek için temel sektörlerde gerçek zamanlı pazar içgörüleri, haber toplama ve istihbarat.", "link_text": "Keşfet →", "link": "/intel", "icon": "TrendingUp"},
      {"title": "Danışmanlık", "description": "Karmaşık kurumsal iletişim zorluklarını aşmanıza ve paydaş değerini maksimize etmenize yardımcı olacak stratejik danışmanlık hizmetleri.", "link_text": "Keşfet →", "link": "/solutions/advisory", "icon": "Lightbulb"},
      {"title": "Veri Analitiği", "description": "Veriye dayalı kararlar için gerçek zamanlı içgörüler, duygu analizi ve performans metrikleri sağlayan kapsamlı analitik paketi.", "link_text": "Keşfet →", "link": "/solutions/analytics", "icon": "BarChart3"},
      {"title": "Geliştirme", "description": "Kurumsal iletişim altyapınızı güçlendirmek için özel yazılım çözümleri ve platform entegrasyonları.", "link_text": "Keşfet →", "link": "/solutions/development", "icon": "Code"},
      {"title": "Yatırımcı İlişkileri", "description": "İletişimleri kolaylaştırmak ve paydaş katılımını artırmak için entegre yatırımcı ilişkileri ve halkla ilişkiler platformu.", "link_text": "Keşfet →", "link": "/solutions/ir-pr", "icon": "Megaphone"},
      {"title": "Sendikasyon / IR / PR", "description": "Mesajınızı hedefli kanallar aracılığıyla güçlendirmek ve erişimi maksimize etmek için premium içerik dağıtım ağı.", "link_text": "Keşfet →", "link": "/solutions/syndication", "icon": "Share2"},
      {"title": "Video Dağıtımı", "description": "Her ekranda kitlelere ulaşmak için yapay zeka destekli hedefleme ile akış TV ve dijital video dağıtımı.", "link_text": "Keşfet →", "link": "/solutions/video-distribution", "icon": "Tv"}
    ]
  }
}'::jsonb,
updated_at = now()
WHERE namespace = 'solutions' AND language_code = 'tr';

-- Update Ukrainian solutions translation
UPDATE translations 
SET content = '{
  "solutions": {
    "hero_title": "Рішення для",
    "hero_title_highlight": "Кожного Етапу",
    "hero_description": "Комплексні рішення, розроблені для посилення вашої комунікаційної стратегії на кожному етапі зростання.",
    "hero_cta_primary_text": "Розпочати",
    "hero_cta_primary_link": "/contact",
    "hero_cta_secondary_text": "Замовити Демо",
    "hero_cta_secondary_link": "https://calendly.com/amplifix/amplifix-discovery",
    "solutions_list": [
      {"title": "Публічні Компанії", "description": "Рішення для відносин з інвесторами та корпоративних комунікацій на базі ШІ, розроблені для публічних компаній з підходом, орієнтованим на відповідність.", "link_text": "Дослідити →", "link": "/solutions/public-companies", "icon": "Building2"},
      {"title": "Приватні Компанії", "description": "Рішення для стратегічних комунікацій та залучення зацікавлених сторін, адаптовані для приватних компаній, які готуються до зростання або виходу.", "link_text": "Дослідити →", "link": "/solutions/private-companies", "icon": "Users"},
      {"title": "Ринкова Розвідка", "description": "Ринкові інсайти в реальному часі, агрегація новин та розвідка по ключових вертикалях для інформування стратегічних рішень.", "link_text": "Дослідити →", "link": "/intel", "icon": "TrendingUp"},
      {"title": "Консультування", "description": "Стратегічні консультаційні послуги, які допоможуть вам орієнтуватися в складних викликах корпоративних комунікацій та максимізувати цінність зацікавлених сторін.", "link_text": "Дослідити →", "link": "/solutions/advisory", "icon": "Lightbulb"},
      {"title": "Аналітика Даних", "description": "Комплексний аналітичний пакет, що забезпечує інсайти в реальному часі, аналіз настроїв та метрики продуктивності для рішень на основі даних.", "link_text": "Дослідити →", "link": "/solutions/analytics", "icon": "BarChart3"},
      {"title": "Розробка", "description": "Індивідуальні програмні рішення та інтеграції платформ для живлення вашої інфраструктури корпоративних комунікацій.", "link_text": "Дослідити →", "link": "/solutions/development", "icon": "Code"},
      {"title": "Відносини з Інвесторами", "description": "Інтегрована платформа для відносин з інвесторами та зв''язків з громадськістю для оптимізації комунікацій та покращення залучення зацікавлених сторін.", "link_text": "Дослідити →", "link": "/solutions/ir-pr", "icon": "Megaphone"},
      {"title": "Синдикація / IR / PR", "description": "Преміальна мережа розповсюдження контенту для посилення вашого повідомлення через цільові канали та максимізації охоплення.", "link_text": "Дослідити →", "link": "/solutions/syndication", "icon": "Share2"},
      {"title": "Відео Дистрибуція", "description": "Потокове телебачення та цифрова відео дистрибуція з таргетуванням на базі ШІ для охоплення аудиторій на кожному екрані.", "link_text": "Дослідити →", "link": "/solutions/video-distribution", "icon": "Tv"}
    ]
  }
}'::jsonb,
updated_at = now()
WHERE namespace = 'solutions' AND language_code = 'uk';