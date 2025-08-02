import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  canonical?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "BLR İnşaat - Çorlu'da Güvenilir İnşaat ve Gayrimenkul Firması | 1980'den Beri",
  description = "BLR İnşaat - Çorlu'da 1980 yılından bu yana inşaat, yatırım ve gayrimenkul geliştirme alanlarında faaliyet gösteren güçlü ve köklü bir marka. Konut projeleri, villa, apartman, ticari yapılar ve altyapı çalışmaları.",
  keywords = "BLR İnşaat, Çorlu inşaat, Tekirdağ inşaat, gayrimenkul, konut projeleri, villa, apartman, inşaat firması, müteahhit, yapı firması",
  image = "/front/gorsel/genel/logo.png",
  url = "https://www.blrinsaat.com.tr",
  type = "website",
  canonical
}) => {
  const fullUrl = canonical || url;
  const fullImageUrl = image.startsWith('http') ? image : `https://www.blrinsaat.com.tr${image}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="BLR İnşaat" />
      <meta property="og:locale" content="tr_TR" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImageUrl} />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="language" content="Turkish" />
      <meta name="author" content="BLR İnşaat" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      
      {/* Structured Data for Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "BLR İnşaat",
          "alternateName": "Bilir İnşaat",
          "url": "https://www.blrinsaat.com.tr",
          "logo": "https://www.blrinsaat.com.tr/front/gorsel/genel/logo.png",
          "description": description,
          "foundingDate": "1980",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "REŞADİYE MAHALLESİ ATATÜRK BULVARI CADDESİ NO:48/D",
            "addressLocality": "Çorlu",
            "addressRegion": "Tekirdağ",
            "postalCode": "59850",
            "addressCountry": "TR"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+90-533-368-1965",
            "contactType": "customer service",
            "availableLanguage": "Turkish"
          },
          "sameAs": [
            "https://www.facebook.com/profile.php?id=61579125501611",
            "https://www.instagram.com/blryapiinsaat/",
            "https://www.youtube.com/@blrinsaat"
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEO; 