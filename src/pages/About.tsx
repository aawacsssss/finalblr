

  import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { siteContentService, SiteContent } from '../services/supabaseService';
import ReactMarkdown from 'react-markdown';

const About: React.FC = () => {
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);

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
                    <ReactMarkdown>
                      {getContentBySection('company_info')?.content || `
                        BLR İnşaat olarak, 1980 yılından bu yana başta inşaat ve yatırım sektörü olmak üzere gayrimenkul geliştirme, gıda ve diğer çeşitli alanlarda faaliyet gösteren güçlü ve köklü bir marka olarak hizmet vermekteyiz. 40 yılı aşkın birikimimiz, sağlam ticari tecrübemiz ve yenilikçi vizyonumuzla bulunduğumuz her sektörde öncü olma hedefiyle çalışmalarımızı aralıksız sürdürüyoruz.

                        Bizim için güvene dayalı ticaret anlayışı sadece bir tercih değil; aynı zamanda bir kurumsal değer ve vazgeçilmez bir prensiptir. Bu doğrultuda, çözüm odaklı yaklaşımımız ve sürdürülebilirlik ilkemizle iş dünyasına değer katmaya devam ediyoruz. Her projemizde topluma, doğaya ve ekonomiye olan sorumluluğumuzu ön planda tutarak yenilikçi fikirlerimizle sektörümüzde fark yaratmayı amaçlıyoruz.

                        Geniş yatırım araçlarımız ve kapsamlı hizmet ağımız sayesinde kârlı yatırımlar geliştirmeyi, bu yatırımları hayata geçirirken toplumun ihtiyaçlarına uygun projeler üretmeyi önceliğimiz olarak görüyoruz. Kent yaşamına değer katan özgün, modern ve güvenilir yaşam alanları inşa ederken bireylerin ve ailelerin huzurla yaşayabileceği ortamlar oluşturmayı ilke ediniyoruz. Bugün, binlerce kişiye hem ticari hem de sosyal anlamda hizmet sunmanın gururunu yaşıyoruz.

                        Geleceğe dair vizyonumuz, sadece sektörel standartları yakalamak değil; aynı zamanda bu standartları belirleyen ve ilham veren projeler ortaya koymaktır.

                        Köklü geçmişimizden aldığımız güç ve yenilikçi çözümlerimizle sizlere değer katmaya, öncü projelerle sektörümüzde fark yaratmaya ve güvenle büyüyen bir marka olmaya devam edeceğiz.
                      `}
                    </ReactMarkdown>
                  </div>
                </div>
                <div className="col-lg-6">
                  <img 
                    loading="lazy" 
                    className="prj" 
                    alt="BLR İnşaat Kurumsal" 
                    src={getContentBySection('main_image')?.images?.[0] || "/front/gorsel/genel/uysal-yapi-2.jpg"}
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
                    src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80"
                    style={{
                      objectFit: 'cover',
                      height: '400px',
                      width: '100%'
                    }}
                  />
                </div>
                <div className="col-lg-6 m-a pc-p-30 c-w content-wrapper">
                                     <div className="blr-subtitle">Vizyonumuz</div>
                  <div className="markdown-content">
                    <ReactMarkdown>
                      {getContentBySection('vision')?.content || `
                        Geleceğe dair vizyonumuz, sadece sektörel standartları yakalamak değil; aynı zamanda bu standartları belirleyen ve ilham veren projeler ortaya koymaktır.

                        Her projemizde topluma, doğaya ve ekonomiye olan sorumluluğumuzu ön planda tutarak yenilikçi fikirlerimizle sektörümüzde fark yaratmayı amaçlıyoruz. Kent yaşamına değer katan özgün, modern ve güvenilir yaşam alanları inşa ederken bireylerin ve ailelerin huzurla yaşayabileceği ortamlar oluşturmayı ilke ediniyoruz.

                        Köklü geçmişimizden aldığımız güç ve yenilikçi çözümlerimizle sizlere değer katmaya, öncü projelerle sektörümüzde fark yaratmaya ve güvenle büyüyen bir marka olmaya devam edeceğiz.
                      `}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>

              {/* Misyon Bölümü */}
              <div className="row mb-5 rotate">
                <div className="col-lg-6 m-a pc-p-30 c-w content-wrapper">
                                     <div className="blr-subtitle">Misyonumuz</div>
                  <div className="markdown-content">
                    <ReactMarkdown>
                      {getContentBySection('mission')?.content || `
                        Kaliteli ve güvenilir projelerle müşterilerimizin hayallerini gerçeğe dönüştürmek, yaşam kalitesini artıran modern yaşam alanları oluşturmak temel misyonumuzdur. Geniş yatırım araçlarımız ve kapsamlı hizmet ağımız sayesinde kârlı yatırımlar geliştirmeyi, bu yatırımları hayata geçirirken toplumun ihtiyaçlarına uygun projeler üretmeyi önceliğimiz olarak görüyoruz.

                        Bizim için güvene dayalı ticaret anlayışı sadece bir tercih değil; aynı zamanda bir kurumsal değer ve vazgeçilmez bir prensiptir. Bugün, binlerce kişiye hem ticari hem de sosyal anlamda hizmet sunmanın gururunu yaşıyoruz.
                      `}
                    </ReactMarkdown>
                  </div>
                </div>
                <div className="col-lg-6">
                  <img 
                    loading="lazy" 
                    className="prj" 
                    alt="BLR İnşaat Misyon" 
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
                    style={{
                      objectFit: 'cover',
                      height: '400px',
                      width: '100%'
                    }}
                  />
                </div>
              </div>

              {/* Ofisimiz Bölümü */}
              <div className="row mb-5">
                <div className="col-lg-12">
                                     <div className="blr-title-2 text-center mb-4" id="ofisimiz">Ofisimiz</div>
                  <p className="text-center c-w mb-5">Modern ve konforlu ofis alanımızda müşterilerimize en iyi hizmeti sunmak için çalışıyoruz.</p>
                </div>
              </div>

              {/* Ofis Fotoğrafları Grid */}
              <div className="row mb-5">
                <div className="col-lg-4 col-md-6 mb-4">
                  <div className="office-image-box">
                    <img 
                      src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=450&fit=crop"
                      alt="Ofis dış görünüm"
                      className="office-img"
                    />
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 mb-4">
                  <div className="office-image-box">
                    <img 
                      src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=450&fit=crop"
                      alt="Ofis iç mekan"
                      className="office-img"
                    />
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 mb-4">
                  <div className="office-image-box">
                    <img 
                      src="https://images.unsplash.com/photo-1554473675-d0397389e0d8?w=600&h=450&fit=crop"
                      alt="Çalışma ortamı"
                      className="office-img"
                    />
                  </div>
                </div>
              </div>

              {/* Ofis Konumu - İletişim ve Harita yan yana */}
              <div className="row">
                <div className="col-lg-12">
                                     <div className="blr-title-2 text-center mb-4">Ofis Konumumuz</div>
                  <div className="row">
                    <div className="col-lg-4">
                      <h5 className="c-w mb-3">İletişim Bilgileri</h5>
                      <p className="c-w mb-2"><strong>Adres:</strong> Kazımiye, Dumlupınar Cd. No:22, 59860 Çorlu/Tekirdağ</p>
                      <p className="c-w mb-2"><strong>Telefon:</strong> +90 (282) 651 20 30</p>
                      <p className="c-w mb-2"><strong>E-posta:</strong> info@blrinsaat.com.tr</p>
                    </div>
                    <div className="col-lg-8">
                      <div className="office-map">
                        <iframe 
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048.4555!2d26.555664!3d41.677177!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDQwJzM3LjgiTiAyNsKwMzMnMjAuNCJF!5e0!3m2!1str!2str!4v1642678901234!5m2!1str!2str"
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
        .blr-subtitle {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 1.2rem;
          color: white;
        }
        .office-image-box {
          position: relative;
          overflow: hidden;
          border-radius: 14px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .office-img {
          width: 100%;
          height: 300px; /* Daha büyük yükseklik */
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .office-image-box:hover .office-img {
          transform: scale(1.05);
        }
        .office-caption {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 10px 15px;
          background-color: rgba(0, 0, 0, 0.6);
          color: white;
          text-align: center;
          border-bottom-left-radius: 14px;
          border-bottom-right-radius: 14px;
        }
        .office-caption h4 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: bold;
        }
        .office-location-box {
          border-radius: 14px;
          padding: 30px;
          margin-top: 30px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .office-info {
          margin-bottom: 20px;
        }
        .contact-info h5, .transport-info h5 {
          font-size: 1.2rem;
          margin-bottom: 10px;
          color: white;
        }
        .contact-info p, .transport-info p {
          font-size: 1rem;
          color: #adb5bd;
          margin-bottom: 5px;
        }
        .office-map {
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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
          .office-image-box {
            height: 150px; /* Adjust height for smaller screens */
          }
          .office-caption h4 {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </>
  );
};

export default About; 