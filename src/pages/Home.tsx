import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import { sliderService, siteContentService, Slider, SiteContent } from '../services/supabaseService';
import SEO from '../components/SEO';

const Home: React.FC = () => {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [homeContents, setHomeContents] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);

    const loadData = async () => {
      try {
        const [slidersData, contentsData] = await Promise.all([
          sliderService.getAll(),
          siteContentService.getByPage('home')
        ]);
        
      setSliders(slidersData || []);
      setHomeContents(contentsData || []);
      setDataLoaded(true);
      

      } catch (error) {
      // Silent error handling
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadData();
  }, []);

  const handleSlideChange = (swiper: any) => {
    const realIndex = swiper.realIndex !== undefined ? swiper.realIndex : swiper.activeIndex;
    console.log('Slide changed:', realIndex, 'Total slides:', sliders.length);
    setActiveSlideIndex(realIndex);
  };

  useEffect(() => {
    const handleResize = () => {
      // Pencere boyutu değiştiğinde yapılacak işlemler
    };

    const calculateHeaderHeight = () => {
      const mobileHeader = document.querySelector('.header-mobile');
      const mainHeader = document.getElementById('main-header');

      const header = mobileHeader || mainHeader;
      if (header) {
        const height = (header as HTMLElement).offsetHeight;
        setHeaderHeight(height);
      }
    };

    calculateHeaderHeight();
    window.addEventListener('resize', () => {
      handleResize();
      calculateHeaderHeight();
    });

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getContentBySection = (sectionName: string) => {
    return homeContents.find(content => content.section_name === sectionName);
  };

  const getImageUrl = (content: SiteContent | undefined, fallbackPath: string) => {
    if (content?.images && content.images.length > 0) {
      return content.images[0];
    }
    return fallbackPath;
  };

  return (
    <>
      <SEO 
        title="BLR İnşaat - Çorlu'da Güvenilir İnşaat ve Gayrimenkul Firması | 1980'den Beri"
        description="BLR İnşaat - Çorlu'da 1980 yılından bu yana inşaat, yatırım ve gayrimenkul geliştirme alanlarında faaliyet gösteren güçlü ve köklü bir marka. Konut projeleri, villa, apartman, ticari yapılar ve altyapı çalışmaları."
        keywords="BLR İnşaat, Çorlu inşaat, Tekirdağ inşaat, gayrimenkul, konut projeleri, villa, apartman, inşaat firması, müteahhit, yapı firması, Çorlu müteahhit, Tekirdağ müteahhit"
        canonical="https://www.blrinsaat.com.tr/"
      />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Mobilde slider'ı header'ın altına taşı - GÜÇLÜ CSS */
        @media (max-width: 768px) {
          #hero-section {
            margin: 0 !important;
            padding: 0 !important;
            position: relative !important;
            z-index: 1001 !important;
            height: 260px !important;
            max-height: 260px !important;
          }
          
          /* Swiper'ın margin/padding'ini kaldır */
          .mySwiper2 {
            margin: 0 !important;
            padding: 0 !important;
            touch-action: pan-x pan-y !important;
            -webkit-touch-callout: none !important;
            -webkit-tap-highlight-color: transparent !important;
          }
          
          /* SwiperSlide'ların yüksekliğini ayarla */
          .swiper-slide {
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            touch-action: pan-x pan-y !important;
            -webkit-touch-callout: none !important;
            -webkit-tap-highlight-color: transparent !important;
          }
          
          /* Swiper wrapper'ın margin'ini kaldır */
          .swiper-wrapper {
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            touch-action: pan-x pan-y !important;
            -webkit-touch-callout: none !important;
            -webkit-tap-highlight-color: transparent !important;
          }
          
          /* Tüm Swiper elementlerinin margin'ini kaldır */
          .swiper, .swiper-container, .swiper-slide, .swiper-wrapper {
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
          }
          
          /* Section'ın alt margin'ini kaldır */
          #hero-section {
            margin-bottom: 0 !important;
            padding-bottom: 0 !important;
          }
          
          /* Navigation butonlarını göster */
          .swiper-button-next,
          .swiper-button-prev {
            display: flex !important;
            position: absolute !important;
            width: 40px !important;
            height: 40px !important;
            background: rgba(35, 38, 23, 0.8) !important;
            border-radius: 50% !important;
            color: white !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            border: none !important;
            font-size: 18px !important;
            z-index: 1000 !important;
          }
          
          .swiper-button-prev {
            left: 20px !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
          }
          
          .swiper-button-next {
            right: 20px !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
          }
          
          /* Pagination'ı gizle */
          .swiper-pagination {
            display: none !important;
          }
          
          /* Swiper'ın hidden overflow'unu düzelt */
          .swiper-backface-hidden {
            overflow: visible !important;
          }
          
          /* Buton container'ın üst padding'ini kaldır */
          .project-buttons-container {
            padding-top: 0 !important;
            margin-top: -80px !important;
            position: relative !important;
            z-index: 1003 !important;
          }
          
          /* Web için butonları göster */
          @media (min-width: 769px) {
            .project-buttons-container {
              display: flex !important;
              margin-top: 0 !important;
              padding: 10px 20px !important;
              background: rgba(255, 255, 255, 0.95) !important;
              visibility: visible !important;
              opacity: 1 !important;
            }
          }
          
          /* Tüm ekran boyutlarında butonları göster */
          .project-buttons-container {
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
            position: relative !important;
            z-index: 9999 !important;
          }
          
          /* Tüm gizleme kurallarını geçersiz kıl */
          .project-buttons-container,
          .project-buttons-container * {
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
            position: relative !important;
            z-index: 9999 !important;
          }
          
          /* Tüm gizleme kurallarını geçersiz kıl - daha güçlü */
          div[class*="project-buttons"],
          div[class*="project-buttons"] *,
          .project-buttons-container,
          .project-buttons-container * {
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
            position: relative !important;
            z-index: 9999 !important;
            pointer-events: auto !important;
          }
          
          /* Mobil için buton container ayarları */
          @media (max-width: 768px) {
            .yeni-butonlar-container {
              justify-content: center !important;
              align-items: center !important;
              gap: 6px !important;
              padding: 0 !important;
              margin-top: 10px !important;
              min-height: 50px !important;
              background: none !important;
              flex-wrap: wrap !important;
            }
            
            .yeni-butonlar-container > div {
              padding: 8px 16px !important;
              border-radius: 20px !important;
              font-size: 10px !important;
              min-width: 90px !important;
              max-width: 110px !important;
              flex: 1 !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              text-align: center !important;
              white-space: nowrap !important;
              overflow: hidden !important;
              text-overflow: ellipsis !important;
              background: rgba(35, 38, 23, 0.9) !important;
            }
            
            /* Mobil slider ayarları */
            .mySwiper2 {
              touch-action: pan-x pan-y !important;
              user-select: none !important;
              -webkit-user-select: none !important;
              -moz-user-select: none !important;
              -ms-user-select: none !important;
              overflow: visible !important;
              position: relative !important;
            }
            
            .mySwiper2 .swiper-wrapper {
              margin: 0 !important;
              padding: 0 !important;
              background: transparent !important;
            }
            
            .mySwiper2 .swiper-slide {
              width: 100% !important;
              height: 100% !important;
              flex-shrink: 0 !important;
            }
            
            .mySwiper2 .swiper-slide img {
              width: 100% !important;
              height: 100% !important;
              object-fit: cover !important;
              object-position: center !important;
              pointer-events: auto !important;
              background: transparent !important;
            }
            
            .mySwiper2 .swiper-slide {
              background: transparent !important;
            }
            
            .mySwiper2 .swiper-wrapper {
              background: transparent !important;
            }
            
            .mySwiper2 {
              background: transparent !important;
            }
            
            .mySwiper2 .swiper-slide a {
              pointer-events: auto !important;
            }
            

            
            /* Mobilde navigation butonlarını göster */
            .swiper-button-next,
            .swiper-button-prev {
              display: flex !important;
              position: absolute !important;
              width: 40px !important;
              height: 40px !important;
              background: rgba(35, 38, 23, 0.8) !important;
              border-radius: 50% !important;
              color: white !important;
              align-items: center !important;
              justify-content: center !important;
              cursor: pointer !important;
              border: none !important;
              font-size: 18px !important;
              z-index: 1000 !important;
            }
            
            .swiper-button-prev {
              left: 20px !important;
              top: 50% !important;
              transform: translateY(-50%) !important;
            }
            
            .swiper-button-next {
              right: 20px !important;
              top: 50% !important;
              transform: translateY(-50%) !important;
            }
            

            

          }
          
          /* JavaScript ile gizlenmeyi engelle */
          .project-buttons-container {
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
            position: relative !important;
            z-index: 9999 !important;
            pointer-events: auto !important;
            transform: none !important;
            filter: none !important;
            clip: auto !important;
            clip-path: none !important;
          }
          
          /* Header'ı normal akışa al ve üst boşluğu kaldır */
          .header-mobile {
            position: static !important;
            z-index: auto !important;
            margin-top: 0 !important;
            padding-top: 0 !important;
          }
          
          /* Sayfa üst boşluğunu kaldır */
          body, html {
            margin-top: 0 !important;
            padding-top: 0 !important;
          }
        }
      `}</style>

      {/* Modern Hero Section with Slider */}
      <section style={{
        position: 'relative',
        width: '100%',
        height: window.innerWidth <= 768 ? '260px' : '720px',
        maxHeight: window.innerWidth <= 768 ? '260px' : '720px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        margin: '0px',
        padding: '0px',
        zIndex: window.innerWidth <= 768 ? 1001 : 1,
        background: 'transparent'
      }} className="p-0" id="hero-section">
        {/* Swiper Slider */}
        {loading || !dataLoaded ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            background: '#f8f9fa'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #232617',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          </div>
        ) : sliders.length > 0 ? (
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={0}
            slidesPerView={1}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
              waitForTransition: true,
              stopOnLastSlide: false,
            }}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            loop={true}
            onSlideChange={handleSlideChange}
            className="mySwiper2"
            grabCursor={true}
            allowTouchMove={true}
            resistance={false}
            watchSlidesProgress={true}
            shortSwipes={true}
            longSwipes={true}
            longSwipesRatio={0.3}
            longSwipesMs={200}
            threshold={10}
            simulateTouch={true}
            touchEventsTarget="wrapper"
            preventClicks={false}
            preventClicksPropagation={false}
            allowSlideNext={true}
            allowSlidePrev={true}
            touchStartPreventDefault={false}
            touchMoveStopPropagation={false}

            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              margin: '0px',
              padding: '0px',
              zIndex: window.innerWidth <= 768 ? 1002 : 1,
              background: 'transparent'
            }}

          >
            {sliders.map((slide, index) => {
              return (
              <SwiperSlide key={slide.id}>
                  <Link to={`/proje/${slide.project_id || (slide.link?.match(/\/proje\/(\d+)/)?.[1] || slide.id)}`} style={{ display: 'block', width: '100%', height: '100%' }}>
                  <img
                    src={slide.image}
                    alt={slide.title || 'Slider Image'}
                    style={{
                      width: '100%',
                      height: '100%',
                         objectFit: window.innerWidth <= 768 ? 'cover' : (slide.image_fit || 'cover'),
                      objectPosition: slide.image_position || 'center',
                      backgroundColor: slide.background_color || '#f8f9fa'
                    }}
                  />
                </Link>
              </SwiperSlide>
              )
            })}
          </Swiper>
        ) : (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            background: '#f8f9fa',
            color: '#666',
            fontSize: '1.2rem'
          }}>
            Slider içeriği bulunamadı
          </div>
        )}
      </section>

            {/* Project Buttons - YENİ KONUM */}
        <div 
        className="yeni-butonlar-container"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          gap: window.innerWidth <= 768 ? '8px' : '12px',
          padding: window.innerWidth <= 768 ? '10px 15px' : '15px 20px',
                                  background: 'none',
            margin: '0',
                              marginTop: window.innerWidth <= 768 ? '10px' : '10px',
            width: '100%',
            flexDirection: 'row',
            transition: 'all 0.3s ease',
            position: 'relative',
          zIndex: 9999,
          visibility: 'visible',
          opacity: 1,
          border: 'none',
          minHeight: window.innerWidth <= 768 ? '50px' : '60px',
          pointerEvents: 'auto',
        }}>
        {sliders && sliders.length > 0 ? sliders.map((slide, idx) => {
          // Proje ID'sini doğru al
          const projectId = slide.project_id || (slide.link?.match(/\/proje\/(\d+)/)?.[1]) || slide.id;
          const isActive = idx === (activeSlideIndex % sliders.length);
          const buttonText = slide.title ? slide.title.replace(/<[^>]*>/g, '') : `Proje ${idx + 1}`;
          
          return (
            <div
              key={slide.id}
              style={{
                background: isActive ? 'rgba(35, 38, 23, 1)' : 'rgba(35, 38, 23, 0.7)',
                color: 'white',
                padding: window.innerWidth <= 768 ? '8px 16px' : '12px 24px',
                borderRadius: '25px',
                textDecoration: 'none',
                fontSize: window.innerWidth <= 768 ? '10px' : '14px',
                fontWeight: 600,
                boxShadow: isActive ? '0 6px 20px rgba(0,0,0,0.4)' : '0 4px 15px rgba(0,0,0,0.2)',
                backdropFilter: 'blur(10px)',
                border: isActive ? '2px solid rgba(255,255,255,0.4)' : '2px solid rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                minWidth: window.innerWidth <= 768 ? '100px' : '120px',
                maxWidth: window.innerWidth <= 768 ? '100px' : '180px',
                flex: window.innerWidth <= 768 ? '1' : 'auto',
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
                opacity: isActive ? 1 : 0.8
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                }
              }}
              onClick={() => {
                window.location.href = `/proje/${projectId}`;
              }}
            >
              {buttonText}
            </div>
          );
        }) : (
          <>
            <div
                style={{
                background: 'rgba(35, 38, 23, 0.7)',
                color: 'white',
                padding: window.innerWidth <= 768 ? '8px 16px' : '12px 24px',
                borderRadius: '25px',
                textDecoration: 'none',
                fontSize: window.innerWidth <= 768 ? '10px' : '14px',
                fontWeight: 600,
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                  textAlign: 'center',
                minWidth: window.innerWidth <= 768 ? '100px' : '120px',
                maxWidth: window.innerWidth <= 768 ? '100px' : '180px',
                flex: window.innerWidth <= 768 ? '1' : 'auto'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
              }}
              onClick={() => {
                window.location.href = '/proje/32';
              }}
            >
              Proje 1
            </div>
            <div
              style={{
                background: 'rgba(35, 38, 23, 0.7)',
                color: 'white',
                padding: window.innerWidth <= 768 ? '8px 16px' : '12px 24px',
                borderRadius: '25px',
                textDecoration: 'none',
                fontSize: window.innerWidth <= 768 ? '10px' : '14px',
                fontWeight: 600,
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease',
                  cursor: 'pointer',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                minWidth: window.innerWidth <= 768 ? '100px' : '120px',
                maxWidth: window.innerWidth <= 768 ? '100px' : '180px',
                flex: window.innerWidth <= 768 ? '1' : 'auto'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
              }}
              onClick={() => {
                window.location.href = '/proje/33';
              }}
            >
              Proje 2
              </div>
            <div
              style={{
                background: 'rgba(35, 38, 23, 0.7)',
                color: 'white',
                padding: window.innerWidth <= 768 ? '8px 16px' : '12px 24px',
                borderRadius: '25px',
                textDecoration: 'none',
                fontSize: window.innerWidth <= 768 ? '10px' : '14px',
                fontWeight: 600,
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                minWidth: window.innerWidth <= 768 ? '100px' : '120px',
                maxWidth: window.innerWidth <= 768 ? '100px' : '180px',
                flex: window.innerWidth <= 768 ? '1' : 'auto'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
              }}
              onClick={() => {
                window.location.href = '/proje/34';
              }}
            >
              Proje 3
        </div>
          </>
      )}
        </div>

      {/* Modern içerik blokları */}
      <section style={{ background: '#fff', borderRadius: '32px', margin: '0 0 40px 0', boxShadow: '0 8px 32px #0001', padding: '70px 0' }}>
        <div className="container">
          {/* İçerik 1 */}
          <div className="row align-items-center" style={{ marginBottom: '48px' }}>
            <div className="col-lg-6 m-a pc-p-70">
              <div className="blr-title-2" style={{ fontSize: '2.5rem', fontWeight: 700, color: '#232617', marginBottom: '24px' }}>
                {getContentBySection('hero')?.title || 'BLR İnşaat'}
              </div>
              <p style={{ fontSize: '1.2rem', color: '#444', lineHeight: 1.7 }}>
                {getContentBySection('hero')?.content || 'BLR İnşaat olarak, kaliteli yaşam alanları inşa ediyoruz.'}
              </p>
            </div>
            <div className="col-lg-6 d-flex justify-content-center">
              <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 24px #0001', transition: 'transform 0.2s' }}>
                <img 
                  className="mob-mt-30" 
                  loading="lazy" 
                  alt={getContentBySection('hero')?.title || "BLR İnşaat"} 
                  src={getImageUrl(getContentBySection('hero'), "/front/gorsel/genel/logo.png")} 
                  style={{ width: '100%', height: '340px', objectFit: 'cover', objectPosition: 'center' }} 
                />
              </div>
            </div>
          </div>

          {/* İçerik 2 */}
          <div className="row align-items-center flex-row-reverse" style={{ marginBottom: '48px' }}>
            <div className="col-lg-6 m-a pc-p-70">
              <div className="blr-title-2" style={{ fontSize: '2.5rem', fontWeight: 700, color: '#232617', marginBottom: '24px' }}>
                {getContentBySection('about_preview')?.title || 'BLR İnşaat'}
              </div>
              <p style={{ fontSize: '1.2rem', color: '#444', lineHeight: 1.7 }}>
                {getContentBySection('about_preview')?.content || 'BLR İnşaat olarak, güvenilir ve kaliteli yapılar inşa ediyoruz.'}
              </p>
            </div>
            <div className="col-lg-6 d-flex justify-content-center">
              <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 24px #0001', transition: 'transform 0.2s' }}>
                <img 
                  className="mob-mt-30" 
                  loading="lazy" 
                  alt={getContentBySection('about_preview')?.title || "BLR İnşaat"} 
                  src={getImageUrl(getContentBySection('about_preview'), "/front/gorsel/genel/logo.png")} 
                  style={{ width: '100%', height: '340px', objectFit: 'cover', objectPosition: 'center' }} 
                />
              </div>
            </div>
          </div>

          {/* İçerik 3 */}
          <div className="row align-items-center" style={{ marginBottom: '48px' }}>
            <div className="col-lg-6 m-a pc-p-70">
              <div className="blr-title-2" style={{ fontSize: '2.5rem', fontWeight: 700, color: '#232617', marginBottom: '24px' }}>
                {getContentBySection('security')?.title || 'BLR İnşaat'}
              </div>
              <p style={{ fontSize: '1.2rem', color: '#444', lineHeight: 1.7 }}>
                {getContentBySection('security')?.content || 'BLR İnşaat olarak, güvenli yapılar inşa ediyoruz.'}
              </p>
            </div>
            <div className="col-lg-6 d-flex justify-content-center">
              <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 24px #0001', transition: 'transform 0.2s' }}>
                <img 
                  loading="lazy" 
                  alt="BLR İnşaat" 
                  src={getImageUrl(getContentBySection('security'), "/front/gorsel/genel/logo.png")} 
                  style={{ width: '100%', height: '340px', objectFit: 'cover', objectPosition: 'center' }} 
                />
              </div>
            </div>
          </div>

          {/* İçerik 4 */}
          <div className="row align-items-center flex-row-reverse" style={{ marginBottom: '48px' }}>
            <div className="col-lg-6 m-a pc-p-70">
              <div className="blr-title-2" style={{ fontSize: '2.5rem', fontWeight: 700, color: '#232617', marginBottom: '24px' }}>
                {getContentBySection('comfort')?.title || 'BLR İnşaat'}
              </div>
              <p style={{ fontSize: '1.2rem', color: '#444', lineHeight: 1.7 }}>
                {getContentBySection('comfort')?.content || 'BLR İnşaat olarak, konforlu yaşam alanları inşa ediyoruz.'}
              </p>
            </div>
            <div className="col-lg-6 d-flex justify-content-center">
              <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 24px #0001', transition: 'transform 0.2s' }}>
                <img 
                  loading="lazy" 
                  alt="BLR İnşaat" 
                  src={getImageUrl(getContentBySection('comfort'), "/front/gorsel/genel/logo.png")} 
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
              {getContentBySection('services')?.title || 'BLR İnşaat'}
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
              {getContentBySection('services')?.content || 'BLR İnşaat olarak, kapsamlı hizmetler sunmaktayız.'}
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
    </>
  );
};

export default Home; 