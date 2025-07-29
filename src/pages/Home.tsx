import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { sliderService, siteContentService, Slider, SiteContent } from '../services/supabaseService';

const Home: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [homeContents, setHomeContents] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);

  // Eski slider verileri (fallback olarak)
  const defaultSliders: Slider[] = [
    {
      id: 1,
      title: 'ARMONIA RESIDENZA',
      image: '/front/gorsel/slider/armonia.jpg',
      link: '/armonia-residenza'
    },
    {
      id: 2,
      title: 'CENTRO',
      image: '/front/gorsel/slider/centro.jpg',
      link: '/centro'
    },
    {
      id: 3,
      title: 'GARDENYA VILLA',
      image: '/front/gorsel/slider/gardenya-villa.jpg',
      link: '/gardenya-villa'
    },
    {
      id: 4,
      title: 'LUSSO',
      image: '/front/gorsel/slider/lusso.jpg',
      link: '/lusso'
    },
    {
      id: 5,
      title: 'VIA PALAZZO',
      image: '/front/gorsel/slider/via-palazzo.jpg',
      link: '/via-palazzo'
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [slidersData, contentsData] = await Promise.all([
          sliderService.getAll(),
          siteContentService.getByPage('home')
        ]);
        
        // Eğer Supabase'den veri gelmezse, varsayılan verileri kullan
        setSliders(slidersData.length > 0 ? slidersData : defaultSliders);
        setHomeContents(contentsData);
      } catch (error) {
        console.error('Ana sayfa verileri yüklenirken hata:', error);
        // Hata durumunda varsayılan verileri kullan
        setSliders(defaultSliders);
        setHomeContents([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // İçerik bölümlerini section_name'e göre grupla
  const getContentBySection = (sectionName: string) => {
    return homeContents.find(content => content.section_name === sectionName);
  };

  // Görsel URL'sini al (veritabanından veya fallback)
  const getImageUrl = (content: SiteContent | undefined, fallbackPath: string) => {
    if (content?.images && content.images.length > 0) {
      return content.images[0];
    }
    return fallbackPath;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div>Yükleniyor...</div>
      </div>
    );
  }

  return (
    <>
      <section style={{ position: 'relative', paddingTop: '180px' }} className="p-0">
        {sliders.length > 0 ? (
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation
            loop
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            spaceBetween={10}
            className="mySwiper2"
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          >
            {sliders.map((slide, idx) => (
              <SwiperSlide key={slide.id}>
                <Link to={slide.link || '#'}>
                  <img
                    src={slide.image}
                    alt={slide.title || `Slider ${idx + 1}`}
                    style={{
                      width: '100%',
                      display: 'block',
                    }}
                  />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div style={{ 
            height: '720px', 
            width: '100%', 
            background: '#f0f0f0', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '18px',
            color: '#666'
          }}>
            Slider verisi yükleniyor...
          </div>
        )}

        {/* Dinamik Proje Kutucukları */}
        {sliders.length > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: '12px',
            marginTop: '32px',
            marginBottom: '16px',
          }}>
            {(() => {
              const total = sliders.length;
              if (total === 0) return null;
              // 3 buton: önceki, aktif, sonraki
              const prevIdx = (activeIndex - 1 + total) % total;
              const nextIdx = (activeIndex + 1) % total;
              const indices = total === 1 ? [activeIndex] : total === 2 ? [prevIdx, activeIndex] : [prevIdx, activeIndex, nextIdx];
              return indices.map((idx, i) => (
                <div
                  key={sliders[idx].id}
                  style={{
                    background: activeIndex === idx ? '#232617' : '#f5f5f5',
                    color: activeIndex === idx ? '#fff' : '#232617',
                    borderRadius: '20px',
                    padding: activeIndex === idx ? '22px 36px' : '10px 18px',
                    minWidth: activeIndex === idx ? '180px' : '80px',
                    textAlign: 'center',
                    fontSize: activeIndex === idx ? '22px' : '14px',
                    letterSpacing: '2px',
                    opacity: activeIndex === idx ? 1 : 0.5,
                    border: activeIndex === idx ? '2px solid #232617' : '1px solid #ddd',
                    boxShadow: activeIndex === idx ? '0 2px 16px #23261722' : 'none',
                    transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
                    fontFamily: 'Poppins, Montserrat, Inter, Roboto, Arial, sans-serif',
                    fontWeight: activeIndex === idx ? 700 : 500,
                    cursor: 'pointer',
                    zIndex: activeIndex === idx ? 2 : 1,
                    transform: activeIndex === idx ? 'scale(1.12)' : 'scale(0.92)',
                  }}
                >
                  {sliders[idx].title || `Proje ${idx + 1}`}
                </div>
              ));
            })()}
          </div>
        )}
      </section>

      {/* Modern içerik blokları */}
      <section style={{ background: '#fff', borderRadius: '32px', margin: '40px 0', boxShadow: '0 8px 32px #0001', padding: '70px 0' }}>
        <div className="container">
          {/* İçerik 1 */}
          <div className="row align-items-center" style={{ marginBottom: '48px' }}>
            <div className="col-lg-6 m-a pc-p-70">
              <div className="blr-title-2" style={{ fontSize: '2.5rem', fontWeight: 700, color: '#232617', marginBottom: '24px' }}>
                {getContentBySection('hero')?.title || 'Hayalinizdeki Yaşam Alanları'}
              </div>
              <p style={{ fontSize: '1.2rem', color: '#444', lineHeight: 1.7 }}>
                {getContentBySection('hero')?.content || 'BLR İnşaat olarak, yaşam alanlarınızı sadece bir ev değil, bir yaşam tarzı olarak tasarlıyoruz. Modern mimarinin zarif çizgileriyle, fonksiyonelliği ve estetiği bir araya getiriyor, her detayı özenle işliyoruz. Hayalinizdeki konforu ve şıklığı, gerçeğe dönüştürüyoruz.'}
              </p>
            </div>
            <div className="col-lg-6 d-flex justify-content-center">
              <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 24px #0001', transition: 'transform 0.2s' }}>
                <img 
                  className="mob-mt-30" 
                  loading="lazy" 
                  alt={getContentBySection('hero')?.title || "BLR İnşaat"} 
                  src={getImageUrl(getContentBySection('hero'), "/front/gorsel/anasayfa/1.png")} 
                  style={{ width: '100%', height: '340px', objectFit: 'cover', objectPosition: 'center' }} 
                />
              </div>
            </div>
          </div>

          {/* İçerik 2 */}
          <div className="row align-items-center flex-row-reverse" style={{ marginBottom: '48px' }}>
            <div className="col-lg-6 m-a pc-p-70">
              <div className="blr-title-2" style={{ fontSize: '2.5rem', fontWeight: 700, color: '#232617', marginBottom: '24px' }}>
                {getContentBySection('about_preview')?.title || 'Geleceğe Değer Katan Tasarımlar'}
              </div>
              <p style={{ fontSize: '1.2rem', color: '#444', lineHeight: 1.7 }}>
                {getContentBySection('about_preview')?.content || 'Projelerimizde, çağın ötesinde bir bakış açısı ile zamana meydan okuyan yapılar inşa ediyoruz. Yenilikçi çözümler ve sürdürülebilir malzemelerle, hem bugünün hem de yarının ihtiyaçlarına cevap veren mekanlar sunuyoruz.'}
              </p>
            </div>
            <div className="col-lg-6 d-flex justify-content-center">
              <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 24px #0001', transition: 'transform 0.2s' }}>
                <img 
                  className="mob-mt-30" 
                  loading="lazy" 
                  alt={getContentBySection('about_preview')?.title || "BLR İnşaat"} 
                  src={getImageUrl(getContentBySection('about_preview'), "/front/gorsel/anasayfa/4.png")} 
                  style={{ width: '100%', height: '340px', objectFit: 'cover', objectPosition: 'center' }} 
                />
              </div>
            </div>
          </div>

          {/* İçerik 3 */}
          <div className="row align-items-center" style={{ marginBottom: '48px' }}>
            <div className="col-lg-6 m-a pc-p-70">
              <div className="blr-title-2" style={{ fontSize: '2.5rem', fontWeight: 700, color: '#232617', marginBottom: '24px' }}>
                {getContentBySection('security')?.title || 'Güvenliğinizi Ön Planda Tutan Yapılar'}
              </div>
              <p style={{ fontSize: '1.2rem', color: '#444', lineHeight: 1.7 }}>
                {getContentBySection('security')?.content || 'Ailenizin huzuru ve güvenliği için en kaliteli malzemeleri ve ileri mühendislik tekniklerini kullanıyoruz. Deprem yönetmeliğine uygun, dayanıklı ve güvenilir yapılarımızla, sevdiklerinizle birlikte güven içinde yaşayacağınız alanlar oluşturuyoruz.'}
              </p>
            </div>
            <div className="col-lg-6 d-flex justify-content-center">
              <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 24px #0001', transition: 'transform 0.2s' }}>
                <img 
                  loading="lazy" 
                  alt="BLR İnşaat" 
                  src={getImageUrl(getContentBySection('security'), "/front/gorsel/anasayfa/2.png")} 
                  style={{ width: '100%', height: '340px', objectFit: 'cover', objectPosition: 'center' }} 
                />
              </div>
            </div>
          </div>

          {/* İçerik 4 */}
          <div className="row align-items-center flex-row-reverse" style={{ marginBottom: '48px' }}>
            <div className="col-lg-6 m-a pc-p-70">
              <div className="blr-title-2" style={{ fontSize: '2.5rem', fontWeight: 700, color: '#232617', marginBottom: '24px' }}>
                {getContentBySection('comfort')?.title || 'Her Detayda Konfor ve Şıklık'}
              </div>
              <p style={{ fontSize: '1.2rem', color: '#444', lineHeight: 1.7 }}>
                {getContentBySection('comfort')?.content || 'İç mekan tasarımlarımızda, konforu ve estetiği buluşturuyoruz. Ferah ve aydınlık yaşam alanları, fonksiyonel çözümler ve modern dekorasyon anlayışıyla, evinizde her anı keyifle yaşamanız için çalışıyoruz.'}
              </p>
            </div>
            <div className="col-lg-6 d-flex justify-content-center">
              <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 24px #0001', transition: 'transform 0.2s' }}>
                <img 
                  className="mob-mt-30" 
                  loading="lazy" 
                  alt="BLR İnşaat" 
                  src={getImageUrl(getContentBySection('comfort'), "/front/gorsel/anasayfa/3.png")} 
                  style={{ width: '100%', height: '340px', objectFit: 'cover', objectPosition: 'center' }} 
                />
              </div>
            </div>
          </div>

          {/* İçerik 5 */}
          <div className="row align-items-center" style={{ marginBottom: '48px' }}>
            <div className="col-lg-6 m-a pc-p-70">
              <div className="blr-title-2" style={{ fontSize: '2.5rem', fontWeight: 700, color: '#232617', marginBottom: '24px' }}>
                {getContentBySection('parking')?.title || 'Konforlu ve Güvenli Otopark İmkanı'}
              </div>
              <p style={{ fontSize: '1.2rem', color: '#444', lineHeight: 1.7 }}>
                {getContentBySection('parking')?.content || 'Her daireye özel, geniş ve güvenli otopark alanlarımız ile araçlarınız için de en iyi çözümleri sunuyoruz. Şehir hayatının park sorununu ortadan kaldırıyor, size ve ailenize rahat bir yaşam vadediyoruz.'}
              </p>
            </div>
            <div className="col-lg-6 d-flex justify-content-center">
              <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 24px #0001', transition: 'transform 0.2s' }}>
                <img 
                  className="mob-mt-30" 
                  loading="lazy" 
                  alt="BLR İnşaat Otopark" 
                  src={getImageUrl(getContentBySection('parking'), "/front/gorsel/anasayfa/6.png")} 
                  style={{ width: '100%', height: '340px', objectFit: 'cover', objectPosition: 'center' }} 
                />
              </div>
            </div>
          </div>

          {/* İçerik 6 */}
          <div className="row align-items-center flex-row-reverse">
            <div className="col-lg-6 m-a pc-p-70">
              <div className="blr-title-2" style={{ fontSize: '2.5rem', fontWeight: 700, color: '#232617', marginBottom: '24px' }}>
                {getContentBySection('social')?.title || 'Sosyal Yaşamın Kalbinde'}
              </div>
              <p style={{ fontSize: '1.2rem', color: '#444', lineHeight: 1.7 }}>
                {getContentBySection('social')?.content || 'Projelerimizde, sadece bir ev değil, aynı zamanda sosyal yaşamın merkezinde olmanızı sağlıyoruz. Yeşil alanlar, çocuk oyun parkları, spor ve dinlenme alanları ile her yaştan birey için keyifli ve aktif bir yaşam sunuyoruz.'}
              </p>
            </div>
            <div className="col-lg-6 d-flex justify-content-center">
              <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 24px #0001', transition: 'transform 0.2s' }}>
                <img 
                  className="mob-mt-30" 
                  loading="lazy" 
                  alt="BLR İnşaat Sosyal Alanlar" 
                  src={getImageUrl(getContentBySection('social'), "/front/gorsel/anasayfa/5.png")} 
                  style={{ width: '100%', height: '340px', objectFit: 'cover', objectPosition: 'center' }} 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section style={{ background: '#f8f9fa', padding: '80px 0' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#232617', marginBottom: '20px' }}>
              {getContentBySection('services')?.title || 'Emlak Danışmanlığı'}
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
              {getContentBySection('services')?.content || 'Müşterilere emlak alım, satım ve kiralama süreçlerinde danışmanlık hizmetleri sunmaktadır.'}
            </p>
          </div>
          
          <div className="row">
            {homeContents
              .filter(content => content.section_name === 'service_item')
              .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
              .map((service, index) => (
                <div key={index} className="col-lg-4 col-md-6 mb-4">
                  <div style={{ 
                    background: '#fff', 
                    borderRadius: '16px', 
                    padding: '30px', 
                    height: '100%',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
                  }}
                  >
                    {service.images && service.images.length > 0 && (
                      <div style={{ marginBottom: '20px' }}>
                        <img 
                          src={service.images[0]} 
                          alt={service.title || 'Service'} 
                          style={{ 
                            width: '100%', 
                            height: '200px', 
                            objectFit: 'cover', 
                            borderRadius: '12px' 
                          }} 
                        />
                      </div>
                    )}
                    <h3 className="blr-title-2" style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: 700, 
                      color: '#232617', 
                      marginBottom: '15px' 
                    }}>
                      {service.title || 'Hizmet'}
                    </h3>
                    <p style={{ 
                      fontSize: '1rem', 
                      color: '#666', 
                      lineHeight: 1.6 
                    }}>
                      {service.content || 'Hizmet açıklaması'}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
      <style>{`
              @media (max-width: 1200px) {
              .blr-title-2 {
                font-size: 1.4rem !important;
              }
              .section-title {
                font-size: 1.1rem !important;
              }
              .prj-img {
                height: 160px !important;
              }
            }
            @media (max-width: 991px) {
              .blr-title-2 {
                font-size: 1.5rem !important;
              }
            }
  @media (max-width: 900px) {
    .proje-1 .col-lg-3, .proje-1 .col-6 {
      width: 50% !important;
      max-width: 50% !important;
      flex: 0 0 50% !important;
    }
    .proje-1 .p-9 {
      padding: 8px !important;
    }
    .prj-img {
      height: 120px !important;
    }
    .blr-title-2 {
      font-size: 1.1rem !important;
    }
    .section-title {
      font-size: 1rem !important;
    }
  }
  @media (max-width: 600px) {
    .proje-1 .col-lg-3, .proje-1 .col-6 {
      width: 100% !important;
      max-width: 100% !important;
      flex: 0 0 100% !important;
    }
    .prj-img {
      height: 80px !important;
    }
    .blr-title-2 {
      font-size: 0.95rem !important;
    }
    .section-title {
      font-size: 0.9rem !important;
    }
  }
`}</style>
    </>
  );
};

export default Home; 