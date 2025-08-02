

  import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { siteContentService, SiteContent } from '../services/supabaseService';
import ReactMarkdown from 'react-markdown';

// HTML içeriğini güvenli şekilde render eden yardımcı fonksiyon
const renderHTML = (htmlContent: string) => {
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

const About: React.FC = () => {
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Varsayılan ofis görselleri
  const defaultOfficeImages = [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=450&fit=crop",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=450&fit=crop",
    "https://images.unsplash.com/photo-1554473675-d0397389e0d8?w=600&h=450&fit=crop"
  ];

  const openLightbox = (index: number, images: string[]) => {
    setLightboxImages(images);
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % lightboxImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
  };

  // Touch events for mobile swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextImage();
    }
    if (isRightSwipe) {
      prevImage();
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const contentsData = await siteContentService.getByPage('about');
        setContents(contentsData);
      } catch (error) {
        console.error('Hakkımızda sayfası verileri yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getContentBySection = (sectionName: string) => {
    return contents.find(content => content.section_name === sectionName);
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
                    <Link to="/hakkimizda">
                      <div className="ic-btn-2 text-center p-3">Hakkımızda</div>
                    </Link>
                  </div>
                  <div className="col-lg-4">
                    <Link to="/sefa-kalkan">
                      <div className="ic-btn text-center p-3">Nurettin Bilir</div>
                    </Link>
                  </div>
                  <div className="col-lg-4">
                    <a href="#ofisimiz" onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById('ofisimiz');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}>
                      <div className="ic-btn text-center p-3">Ofis</div>
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
              {/* Hakkımızda Bölümü */}
              <div className="row mb-5 rotate">
                <div className="col-lg-6 m-a pc-p-70 c-w content-wrapper">
                                     <div className="blr-title-2">Hakkımızda</div>
                  <div className="markdown-content">
                    {getContentBySection('company_info')?.content ? 
                      renderHTML(getContentBySection('company_info')?.content || '') :
                      <ReactMarkdown>
                        {`
                        BLR İnşaat olarak, 1980 yılından bu yana başta inşaat ve yatırım sektörü olmak üzere gayrimenkul geliştirme, gıda ve diğer çeşitli alanlarda faaliyet gösteren güçlü ve köklü bir marka olarak hizmet vermekteyiz. 40 yılı aşkın birikimimiz, sağlam ticari tecrübemiz ve yenilikçi vizyonumuzla bulunduğumuz her sektörde öncü olma hedefiyle çalışmalarımızı aralıksız sürdürüyoruz.

                        Bizim için güvene dayalı ticaret anlayışı sadece bir tercih değil; aynı zamanda bir kurumsal değer ve vazgeçilmez bir prensiptir. Bu doğrultuda, çözüm odaklı yaklaşımımız ve sürdürülebilirlik ilkemizle iş dünyasına değer katmaya devam ediyoruz. Her projemizde topluma, doğaya ve ekonomiye olan sorumluluğumuzu ön planda tutarak yenilikçi fikirlerimizle sektörümüzde fark yaratmayı amaçlıyoruz.

                        Geniş yatırım araçlarımız ve kapsamlı hizmet ağımız sayesinde kârlı yatırımlar geliştirmeyi, bu yatırımları hayata geçirirken toplumun ihtiyaçlarına uygun projeler üretmeyi önceliğimiz olarak görüyoruz. Kent yaşamına değer katan özgün, modern ve güvenilir yaşam alanları inşa ederken bireylerin ve ailelerin huzurla yaşayabileceği ortamlar oluşturmayı ilke ediniyoruz. Bugün, binlerce kişiye hem ticari hem de sosyal anlamda hizmet sunmanın gururunu yaşıyoruz.

                        Geleceğe dair vizyonumuz, sadece sektörel standartları yakalamak değil; aynı zamanda bu standartları belirleyen ve ilham veren projeler ortaya koymaktır.

                        Köklü geçmişimizden aldığımız güç ve yenilikçi çözümlerimizle sizlere değer katmaya, öncü projelerle sektörümüzde fark yaratmaya ve güvenle büyüyen bir marka olmaya devam edeceğiz.
                      `}
                      </ReactMarkdown>
                    }
                  </div>
                </div>
                <div className="col-lg-6">
                  <img 
                    loading="lazy" 
                    className="prj" 
                    alt="BLR İnşaat Kurumsal" 
                    src={getContentBySection('main_image')?.images?.[0] || "/front/gorsel/genel/logo.png"}
                  />
                </div>
              </div>

              {/* Vizyon Bölümü */}
              <div className="row mb-5">
                <div className="col-lg-6">
                  <img 
                    loading="lazy" 
                    className="prj" 
                    alt="BLR İnşaat Vizyon" 
                    src={getContentBySection('vision')?.images?.[0] || "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80"}
                    style={{
                      objectFit: 'cover',
                      height: '400px',
                      width: '100%'
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                </div>
                <div className="col-lg-6 m-a pc-p-30 c-w content-wrapper">
                  <div className="blr-title-2">Vizyonumuz</div>
                  <div className="markdown-content">
                    {getContentBySection('vision')?.content ? 
                      renderHTML(getContentBySection('vision')?.content || '') :
                      <ReactMarkdown>
                        {`
                        BLR İnşaat olarak, 40 yılı aşkın deneyimimizle inşaat sektöründe güvenilir ve kaliteli hizmet sunmaya devam ediyoruz. Geleceğe dair vizyonumuz, sadece sektörel standartları yakalamak değil; aynı zamanda bu standartları belirleyen ve ilham veren projeler ortaya koymaktır.

                        Her projemizde topluma, doğaya ve ekonomiye olan sorumluluğumuzu ön planda tutarak yenilikçi fikirlerimizle sektörümüzde fark yaratmayı amaçlıyoruz. Kent yaşamına değer katan özgün, modern ve güvenilir yaşam alanları inşa ederken bireylerin ve ailelerin huzurla yaşayabileceği ortamlar oluşturmayı ilke ediniyoruz.

                        Köklü geçmişimizden aldığımız güç ve yenilikçi çözümlerimizle sizlere değer katmaya, öncü projelerle sektörümüzde fark yaratmaya ve güvenle büyüyen bir marka olmaya devam edeceğiz.
                      `}
                      </ReactMarkdown>
                    }
                  </div>
                </div>
              </div>

              {/* Misyon Bölümü */}
              <div className="row mb-5 rotate">
                <div className="col-lg-6 m-a pc-p-70 c-w content-wrapper">
                  <div className="blr-title-2">Misyonumuz</div>
                  <div className="markdown-content">
                    {getContentBySection('mission')?.content ? 
                      renderHTML(getContentBySection('mission')?.content || '') :
                      <ReactMarkdown>
                        {`
                        Kaliteli ve güvenilir projelerle müşterilerimizin hayallerini gerçeğe dönüştürmek, yaşam kalitesini artıran modern yaşam alanları oluşturmak temel misyonumuzdur. Geniş yatırım araçlarımız ve kapsamlı hizmet ağımız sayesinde kârlı yatırımlar geliştirmeyi, bu yatırımları hayata geçirirken toplumun ihtiyaçlarına uygun projeler üretmeyi önceliğimiz olarak görüyoruz.

                        Bizim için güvene dayalı ticaret anlayışı sadece bir tercih değil; aynı zamanda bir kurumsal değer ve vazgeçilmez bir prensiptir. Bugün, binlerce kişiye hem ticari hem de sosyal anlamda hizmet sunmanın gururunu yaşıyoruz.

                        Modern yaşam alanları oluşturma amacıyla çeşitli konut projeleri geliştirmekteyiz. Bu projelerde konfor, güvenlik ve estetik unsurlarını bir araya getirerek yaşam kalitesini artırmayı hedeflemekteyiz.
                      `}
                      </ReactMarkdown>
                    }
                  </div>
                </div>
                <div className="col-lg-6">
                  <img 
                    loading="lazy" 
                    className="prj" 
                    alt="BLR İnşaat Misyon" 
                    src={getContentBySection('mission')?.images?.[0] || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                </div>
              </div>



              {/* Ofisimiz Bölümü */}
              <div className="row mb-5">
                <div className="col-lg-12">
                  <div className="blr-title-2 text-center mb-4" id="ofisimiz">Ofisimiz</div>
                  <div className="markdown-content text-center c-w mb-5">
                    <ReactMarkdown>
                      {getContentBySection('office')?.content || 'Modern ve konforlu ofis alanımızda müşterilerimize en iyi hizmeti sunmak için çalışıyoruz.'}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>

              {/* Ofis Fotoğrafları Grid */}
              <div className="row mb-5">
                {(() => {
                  const officeContent = getContentBySection('office');
                  const allOfficeImages = officeContent?.images && officeContent.images.length > 0 
                    ? officeContent.images
                    : defaultOfficeImages;
                  
                  // Sayfada sadece ilk 3 görsel göster
                  const displayImages = allOfficeImages.slice(0, 3);
                  const hasMoreImages = allOfficeImages.length > 3;
                  
                  return displayImages.length > 0 ? (
                    <>
                      {displayImages.map((image: string, index: number) => (
                        <div key={index} className="col-lg-4 col-md-6 mb-4">
                          <div className="office-image-box" 
                               onClick={() => openLightbox(index, allOfficeImages)}
                               style={{ cursor: 'pointer' }}>
                            <img 
                              src={image}
                              alt={`Ofis görseli ${index + 1}`}
                              className="office-img"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=450&fit=crop";
                              }}
                            />
                            <div className="office-image-overlay">
                              <i className="fas fa-search-plus"></i>
                            </div>
                            {index === 2 && hasMoreImages && (
                              <div className="more-images-overlay">
                                <span>+{allOfficeImages.length - 3}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    // Varsayılan görseller (admin panelinden düzenlenmediğinde)
                    <>
                      {defaultOfficeImages.slice(0, 3).map((image: string, index: number) => (
                        <div key={index} className="col-lg-4 col-md-6 mb-4">
                          <div className="office-image-box" 
                               onClick={() => openLightbox(index, defaultOfficeImages)}
                               style={{ cursor: 'pointer' }}>
                            <img 
                              src={image}
                              alt={`Ofis görseli ${index + 1}`}
                              className="office-img"
                            />
                            <div className="office-image-overlay">
                              <i className="fas fa-search-plus"></i>
                            </div>
                            {index === 2 && defaultOfficeImages.length > 3 && (
                              <div className="more-images-overlay">
                                <span>+{defaultOfficeImages.length - 3}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </>
                  );
                })()}
              </div>

              {/* Ofis Konumu - İletişim ve Harita yan yana */}
              <div className="row">
                <div className="col-lg-12">
                  <div className="blr-title-2 text-center mb-4">Ofis Konumumuz</div>
                  <div className="row">
                    <div className="col-lg-4">
                      <h5 className="c-w mb-3">İletişim Bilgileri</h5>
                      <div className="markdown-content c-w">
                        <ReactMarkdown>
                          {getContentBySection('office_location')?.content || `
                            **Adres:** Kazımiye, Dumlupınar Cd. No:22, 59860 Çorlu/Tekirdağ
                            
                            **Telefon:** 0533 368 1965
                            
                            **E-posta:** info@blrinsaat.com
                          `}
                        </ReactMarkdown>
                      </div>
                    </div>
                    <div className="col-lg-8">
                      <div className="office-map">
                        <iframe 
                          src={getContentBySection('office_location')?.images?.[0] || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048.4555!2d26.555664!3d41.677177!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDQwJzM3LjgiTiAyNsKwMzMnMjAuNCJF!5e0!3m2!1str!2str!4v1642678901234!5m2!1str!2str"}
                          width="100%"
                          height="300"
                          style={{ border: 0, borderRadius: '14px' }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title="BLR İnşaat Ofis Konumu"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" 
               onClick={(e) => e.stopPropagation()}
               onTouchStart={onTouchStart}
               onTouchMove={onTouchMove}
               onTouchEnd={onTouchEnd}>
            <button className="lightbox-close" onClick={closeLightbox}>×</button>
            <button className="lightbox-nav lightbox-prev" onClick={prevImage}>‹</button>
            <button className="lightbox-nav lightbox-next" onClick={nextImage}>›</button>
            <img 
              src={lightboxImages[currentImageIndex]} 
              alt={`Ofis görseli ${currentImageIndex + 1}`}
              className="lightbox-image"
            />
            <div className="lightbox-counter">
              {currentImageIndex + 1} / {lightboxImages.length}
            </div>
          </div>
        </div>
      )}

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
          margin-bottom: 1rem;
          color: white;
        }
        .office-image-box {
          position: relative;
          overflow: hidden;
          border-radius: 14px;
          transition: transform 0.3s ease;
        }
        .office-image-box:hover {
          transform: scale(1.02);
        }
        .office-img {
          width: 100%;
          height: 250px;
          object-fit: cover;
          border-radius: 14px;
        }
        .office-image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 14px;
        }
        .office-image-box:hover .office-image-overlay {
          opacity: 1;
        }
        .office-image-overlay i {
          color: white;
          font-size: 2rem;
        }
        .more-images-overlay {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: bold;
        }
        
        /* Lightbox Styles */
        .lightbox-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .lightbox-content {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
        }
        .lightbox-image {
          max-width: 100%;
          max-height: 90vh;
          object-fit: contain;
          border-radius: 8px;
        }
        .lightbox-close {
          position: absolute;
          top: -40px;
          right: 0;
          background: none;
          border: none;
          color: white;
          font-size: 2rem;
          cursor: pointer;
          z-index: 10000;
        }
        .lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.5);
          border: none;
          color: white;
          font-size: 2rem;
          padding: 10px 15px;
          cursor: pointer;
          border-radius: 50%;
          transition: background 0.3s ease;
        }
        .lightbox-nav:hover {
          background: rgba(0, 0, 0, 0.8);
        }
        .lightbox-prev {
          left: -60px;
        }
        .lightbox-next {
          right: -60px;
        }
        .lightbox-counter {
          position: absolute;
          bottom: -40px;
          left: 50%;
          transform: translateX(-50%);
          color: white;
          font-size: 1rem;
        }
        
        /* Mobil Responsive */
        @media (max-width: 768px) {
          .lightbox-nav {
            font-size: 1.5rem;
            padding: 8px 12px;
          }
          .lightbox-prev {
            left: 10px;
          }
          .lightbox-next {
            right: 10px;
          }
          .lightbox-close {
            top: 10px;
            right: 10px;
            font-size: 1.5rem;
          }
          .office-img {
            height: 200px;
          }
        }
      `}</style>
    </>
  );
};

export default About; 