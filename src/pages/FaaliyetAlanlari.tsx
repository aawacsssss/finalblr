import React, { useState, useEffect } from 'react';
import { siteContentService, SiteContent } from '../services/supabaseService';

// HTML içeriğini güvenli şekilde render eden yardımcı fonksiyon
const renderHTML = (htmlContent: string) => {
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

const FaaliyetAlanlari: React.FC = () => {
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const contentsData = await siteContentService.getByPage('faaliyet-alanlari');
        setContents(contentsData);
      } catch (error) {
        console.error('Faaliyet Alanları sayfası verileri yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getContentBySection = (sectionName: string) => {
    const content = contents.find(content => content.section_name === sectionName);
    return content;
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Yükleniyor...
      </div>
    );
  }

  return (
    <>
      {/* Navigation Tabs - Header'a göre orantılı */}
      <div style={{ marginTop: '60px' }}>
        <section className="p-5">
          <div className="container">
            <div className="row">
              <div className="p-2">
                <div className="row">
                  <div className="col-lg-4">
                    <a href="/hakkimizda">
                      <div className="ic-btn text-center p-3">Hakkımızda</div>
                    </a>
                  </div>
                  <div className="col-lg-4">
                    <div className="ic-btn-2 text-center p-3">Faaliyet Alanlarımız</div>
                  </div>
                  <div className="col-lg-4">
                    <a href="/sefa-kalkan">
                      <div className="ic-btn text-center p-3">Nurettin Bilir</div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Main Content - BLR İnşaat Style */}
      <section className="pt-0">
        <div className="container">
          <div className="row">
            <div className="bg-dark p-50-40 mb-5">
              {/* Giriş Bölümü */}
              <div className="row mb-5 rotate">
                <div className="col-lg-6 m-a pc-p-70 c-w content-wrapper">
                  <div className="blr-title-2">Faaliyet Alanlarımız</div>
                  <div className="markdown-content">
                    {getContentBySection('intro')?.content ? 
                      renderHTML(getContentBySection('intro')?.content || '') :
                      <p>
                        {`Bilir İnşaat, inşaat sektöründe geniş bir hizmet yelpazesiyle faaliyet göstermektedir. 
                        Şirketimiz; konut projeleri, villa yapıları, sanayi ve üretim tesisleri, yol yapım 
                        ve altyapı çalışmaları, kamu alanları taahhüt işleri ile hastane, otel ve alışveriş 
                        merkezleri gibi birçok farklı alanda projeler gerçekleştirmiştir.

                        Yüksek kalite standartları, mühendislik gücü ve yenilikçi yaklaşımıyla, bugüne kadar 
                        çeşitli ölçek ve kapsamda birçok projeye başarıyla imza atmıştır.`}
                      </p>
                    }
                  </div>
                </div>
                <div className="col-lg-6">
                  <img 
                    loading="lazy" 
                    className="prj" 
                    alt="BLR İnşaat Faaliyet Alanları" 
                    src={
                      (getContentBySection('main_image')?.images?.[0] || 
                      getContentBySection('intro_image')?.images?.[0] ||
                      getContentBySection('intro')?.images?.[0] ||
                      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80") + 
                      (getContentBySection('main_image')?.images?.[0] ? `?t=${Date.now()}` : '')
                    }
                  />
                </div>
              </div>

              {/* Yenilikçi Yaklaşım Bölümü */}
              <div className="row mb-5">
                <div className="col-lg-6">
                  <img 
                    loading="lazy" 
                    className="prj" 
                    alt="Yenilikçi Yaklaşım" 
                    src={getContentBySection('innovation_image')?.images?.[0] || "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=450&fit=crop"}
                    style={{
                      objectFit: 'cover',
                      height: '400px',
                      width: '100%'
                    }}
                  />
                </div>
                <div className="col-lg-6 m-a pc-p-30 c-w content-wrapper">
                  <div className="blr-title-2">Yenilikçi Yaklaşım</div>
                  <div className="markdown-content">
                    {getContentBySection('innovation')?.content ? 
                      renderHTML(getContentBySection('innovation')?.content || '') :
                      <p>
                        {`Sektördeki yenilikleri yakından takip eden firmamız, güncel inşaat yöntemleri ve 
                        ileri teknoloji uygulamaları ile projelerini daha verimli ve kaliteli şekilde 
                        hayata geçirmektedir.

                        Ayrıca çevre dostu malzemeler kullanarak sürdürülebilir yapılar inşa etmeye 
                        özen göstermekteyiz.`}
                      </p>
                    }
                  </div>
                </div>
              </div>

              {/* Gerçekleştirilen Projeler Bölümü */}
              <div className="row mb-5 rotate">
                <div className="col-lg-6 m-a pc-p-30 c-w content-wrapper">
                  <div className="blr-title-2">Gerçekleştirilen Projeler</div>
                  <div className="markdown-content">
                    {getContentBySection('completed_projects')?.content ? 
                      renderHTML(getContentBySection('completed_projects')?.content || '') :
                      <p>
                        {`Firmamızın sektördeki deneyimi sayesinde pek çok başarılı projeye imza atılmıştır. 
                        Bu projeler arasında:
                        
                        • Konut siteleri
                        • Rezidans projeleri
                        • Villa yerleşkeleri
                        • Alışveriş merkezleri
                        • Ofis ve ticaret binaları
                        
                        yer almaktadır.`}
                      </p>
                    }
                  </div>
                </div>
                <div className="col-lg-6">
                  <img 
                    loading="lazy" 
                    className="prj" 
                    alt="Gerçekleştirilen Projeler" 
                    src={getContentBySection('completed_projects_image')?.images?.[0] || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=450&fit=crop"}
                    style={{
                      objectFit: 'cover',
                      height: '400px',
                      width: '100%'
                    }}
                  />
                </div>
              </div>

              {/* Konut İnşaatları Bölümü */}
              <div className="row mb-5">
                <div className="col-lg-6">
                  <img 
                    loading="lazy" 
                    className="prj" 
                    alt="Konut İnşaatları" 
                    src={getContentBySection('residential_image')?.images?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=450&fit=crop"}
                    style={{
                      objectFit: 'cover',
                      height: '400px',
                      width: '100%'
                    }}
                  />
                </div>
                <div className="col-lg-6 m-a pc-p-30 c-w content-wrapper">
                  <div className="blr-title-2">Konut İnşaatları</div>
                  <div className="markdown-content">
                    {getContentBySection('residential')?.content ? 
                      renderHTML(getContentBySection('residential')?.content || '') :
                      <p>
                        {`Modern yaşam alanları oluşturma amacıyla çeşitli konut projeleri geliştirilmektedir. 
                        Farklı ölçeklerde konut yapılarıyla yaşam kalitesini artırmayı hedeflemekteyiz.`}
                      </p>
                    }
                  </div>
                </div>
              </div>

              {/* Villa Projeleri Bölümü */}
              <div className="row mb-5 rotate">
                <div className="col-lg-6 m-a pc-p-30 c-w content-wrapper">
                  <div className="blr-title-2">Villa Projeleri</div>
                  <div className="markdown-content">
                    {getContentBySection('villa')?.content ? 
                      renderHTML(getContentBySection('villa')?.content || '') :
                      <p>
                        {`Estetik ve konforu ön planda tutan, özel tasarımlı villa projeleriyle üst segmentte 
                        yaşam alanları inşa ediyoruz.`}
                      </p>
                    }
                  </div>
                </div>
                <div className="col-lg-6">
                  <img 
                    loading="lazy" 
                    className="prj" 
                    alt="Villa Projeleri" 
                    src={getContentBySection('villa_image')?.images?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=450&fit=crop"}
                    style={{
                      objectFit: 'cover',
                      height: '400px',
                      width: '100%'
                    }}
                  />
                </div>
              </div>

              {/* Sanayi ve Üretim Tesisleri Bölümü */}
              <div className="row mb-5">
                <div className="col-lg-6">
                  <img 
                    loading="lazy" 
                    className="prj" 
                    alt="Sanayi ve Üretim Tesisleri" 
                    src={getContentBySection('industrial_image')?.images?.[0] || "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=450&fit=crop"}
                    style={{
                      objectFit: 'cover',
                      height: '400px',
                      width: '100%'
                    }}
                  />
                </div>
                <div className="col-lg-6 m-a pc-p-30 c-w content-wrapper">
                  <div className="blr-title-2">Sanayi ve Üretim Tesisleri</div>
                  <div className="markdown-content">
                    {getContentBySection('industrial')?.content ? 
                      renderHTML(getContentBySection('industrial')?.content || '') :
                      <p>
                        {`Fabrika, depo ve üretim tesisleri gibi endüstriyel yapılarda fonksiyonel ve 
                        verimli çözümler sunmaktayız.`}
                      </p>
                    }
                  </div>
                </div>
              </div>

              {/* Yol ve Altyapı Taahhütleri Bölümü */}
              <div className="row mb-5 rotate">
                <div className="col-lg-6 m-a pc-p-30 c-w content-wrapper">
                  <div className="blr-title-2">Yol ve Altyapı Taahhütleri</div>
                  <div className="markdown-content">
                    {getContentBySection('infrastructure')?.content ? 
                      renderHTML(getContentBySection('infrastructure')?.content || '') :
                      <p>
                        {`Ulaşım projeleri kapsamında çeşitli yol yapımı ve altyapı çalışmalarında 
                        aktif rol üstlenmekteyiz.`}
                      </p>
                    }
                  </div>
                </div>
                <div className="col-lg-6">
                  <img 
                    loading="lazy" 
                    className="prj" 
                    alt="Yol ve Altyapı Taahhütleri" 
                    src={getContentBySection('infrastructure_image')?.images?.[0] || "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&h=450&fit=crop"}
                    style={{
                      objectFit: 'cover',
                      height: '400px',
                      width: '100%'
                    }}
                  />
                </div>
              </div>

              {/* Kamu Alanları ve Resmi Taahhüt Projeleri Bölümü */}
              <div className="row mb-5">
                <div className="col-lg-6">
                  <img 
                    loading="lazy" 
                    className="prj" 
                    alt="Kamu Alanları ve Resmi Taahhüt Projeleri" 
                    src={getContentBySection('public_image')?.images?.[0] || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=450&fit=crop"}
                    style={{
                      objectFit: 'cover',
                      height: '400px',
                      width: '100%'
                    }}
                  />
                </div>
                <div className="col-lg-6 m-a pc-p-30 c-w content-wrapper">
                  <div className="blr-title-2">Kamu Alanları ve Resmi Taahhüt Projeleri</div>
                  <div className="markdown-content">
                    {getContentBySection('public')?.content ? 
                      renderHTML(getContentBySection('public')?.content || '') :
                      <p>
                        {`Belediye, kamu kurumları ve devlet projeleri kapsamında açık alanlar, parklar, 
                        sosyal tesisler gibi kamusal yapılar inşa edilmektedir.`}
                      </p>
                    }
                  </div>
                </div>
              </div>

              {/* Hastane, Otel ve AVM Projeleri Bölümü */}
              <div className="row mb-5 rotate">
                <div className="col-lg-6 m-a pc-p-30 c-w content-wrapper">
                  <div className="blr-title-2">Hastane, Otel ve AVM Projeleri</div>
                  <div className="markdown-content">
                    {getContentBySection('healthcare_hospitality')?.content ? 
                      renderHTML(getContentBySection('healthcare_hospitality')?.content || '') :
                      <p>
                        {`Sağlık, turizm ve ticaret alanlarında; hastaneler, oteller ve alışveriş merkezleri 
                        gibi büyük ölçekli yapılar firmamızın uzmanlık alanlarındandır.`}
                      </p>
                    }
                  </div>
                </div>
                <div className="col-lg-6">
                  <img 
                    loading="lazy" 
                    className="prj" 
                    alt="Hastane, Otel ve AVM Projeleri" 
                    src={getContentBySection('healthcare_hospitality_image')?.images?.[0] || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=450&fit=crop"}
                    style={{
                      objectFit: 'cover',
                      height: '400px',
                      width: '100%'
                    }}
                  />
                </div>
              </div>

              {/* Ticari Yapılar Bölümü */}
              <div className="row mb-5">
                <div className="col-lg-6">
                  <img 
                    loading="lazy" 
                    className="prj" 
                    alt="Ticari Yapılar" 
                    src={getContentBySection('commercial_image')?.images?.[0] || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=450&fit=crop"}
                    style={{
                      objectFit: 'cover',
                      height: '400px',
                      width: '100%'
                    }}
                  />
                </div>
                <div className="col-lg-6 m-a pc-p-30 c-w content-wrapper">
                  <div className="blr-title-2">Ticari Yapılar</div>
                  <div className="markdown-content">
                    {getContentBySection('commercial')?.content ? 
                      renderHTML(getContentBySection('commercial')?.content || '') :
                      <p>
                        {`Bilir İnşaat, iş yeri ve ticari alanların inşaatı ile yönetimi konusunda da 
                        faaliyet göstermektedir. Ofis binaları, dükkanlar ve iş merkezleri gibi projeler 
                        bu kapsamdadır.`}
                      </p>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .prj {
          width: 100%;
          height: auto;
          border-radius: 14px;
          transition: transform 0.3s ease;
        }
        .prj:hover {
          transform: scale(1.02);
        }
        .bg-dark {
          background-color: #212529;
        }
        .p-50-40 {
          padding: 50px 40px;
        }
        .mb-5 {
          margin-bottom: 3rem;
        }
        .rotate {
          transform: rotate(0deg);
        }
        .m-a {
          margin: auto;
        }
        .pc-p-70 {
          padding: 70px;
        }
        .pc-p-30 {
          padding: 30px;
        }
        .c-w {
          color: white;
        }
        .content-wrapper {
          line-height: 1.8;
        }
        .blr-title-2 {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
          color: white;
        }
        .markdown-content h1, 
        .markdown-content h2, 
        .markdown-content h3, 
        .markdown-content h4, 
        .markdown-content h5, 
        .markdown-content h6 {
          font-size: 1.1rem;
          font-weight: 600;
          color: white;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .markdown-content p {
          margin-bottom: 0.8rem;
          line-height: 1.6;
        }
        .markdown-content ul, .markdown-content ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
        .markdown-content li {
          margin-bottom: 0.3rem;
        }
        @media (max-width: 991px) {
          .pc-p-70 {
            padding: 30px 20px;
          }
          .p-50-40 {
            padding: 30px 20px;
          }
        }
      `}</style>
    </>
  );
};

export default FaaliyetAlanlari; 