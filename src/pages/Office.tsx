import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { siteContentService, SiteContent } from '../services/supabaseService';
import ReactMarkdown from 'react-markdown';

const Office: React.FC = () => {
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const contentsData = await siteContentService.getByPage('office');
        setContents(contentsData);
      } catch (error) {
        console.error('Ofis sayfası verileri yüklenirken hata:', error);
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


      {/* Navigation Tabs */}
      <section className="p-5">
        <div className="container">
          <div className="row">
            <div className="p-2">
                              <div className="row">
                  <div className="col-lg-3">
                    <Link to="/hakkimizda">
                      <div className="ic-btn text-center p-3">Hakkımızda</div>
                    </Link>
                  </div>
                  <div className="col-lg-3">
                    <Link to="/faaliyet-alanlari">
                      <div className="ic-btn text-center p-3">Faaliyet Alanları</div>
                    </Link>
                  </div>
                  <div className="col-lg-3">
                    <Link to="/nurettin-bilir">
                                          <div className="ic-btn text-center p-3">Nurettin Bilir</div>
                    </Link>
                  </div>
                  <div className="col-lg-3">
                                   <Link to="/ofis">
                   <div className="ic-btn-2 text-center p-3">Ofis</div>
                 </Link>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pt-0">
        <div className="container">
          <div className="row">
            <div className="bg-dark p-50-40 mb-5">
              {/* Hakkımızda Bölümü */}
              <div className="row mb-5 rotate">
                <div className="col-lg-6 m-a pc-p-70 c-w content-wrapper">
                                     <div className="blr-title-2">Hakkımızda</div>
                  <ReactMarkdown>
                    {getContentBySection('company_info')?.content || `
                      BLR İnşaat olarak, 1980 yılından bu yana başta inşaat ve yatırım sektörü olmak üzere gayrimenkul geliştirme, gıda ve diğer çeşitli alanlarda faaliyet gösteren güçlü ve köklü bir marka olarak hizmet vermekteyiz.

                      40 yılı aşkın birikimimiz, sağlam ticari tecrübemiz ve yenilikçi vizyonumuzla bulunduğumuz her sektörde öncü olma hedefiyle çalışmalarımızı aralıksız sürdürüyoruz.

                      Bizim için güvene dayalı ticaret anlayışı sadece bir tercih değil; aynı zamanda bir kurumsal değer ve vazgeçilmez bir prensiptir. Bu doğrultuda, çözüm odaklı yaklaşımımız ve sürdürülebilirlik ilkemizle iş dünyasına değer katmaya devam ediyoruz.
                    `}
                  </ReactMarkdown>
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
                    src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80"
                    style={{
                      objectFit: 'cover',
                      height: '400px',
                      width: '100%'
                    }}
                  />
                </div>
                <div className="col-lg-6 m-a pc-p-70 c-w content-wrapper">
                                     <div className="blr-title-2">Vizyonumuz</div>
                  <ReactMarkdown>
                    {getContentBySection('vision')?.content || `
                      Geleceğe dair vizyonumuz, sadece sektörel standartları yakalamak değil; aynı zamanda bu standartları belirleyen ve ilham veren projeler ortaya koymaktır.

                      Her projemizde topluma, doğaya ve ekonomiye olan sorumluluğumuzu ön planda tutarak yenilikçi fikirlerimizle sektörümüzde fark yaratmayı amaçlıyoruz.
                    `}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Misyon Bölümü */}
              <div className="row mb-5 rotate">
                <div className="col-lg-6 m-a pc-p-70 c-w content-wrapper">
                                     <div className="blr-title-2">Misyonumuz</div>
                  <ReactMarkdown>
                    {getContentBySection('mission')?.content || `
                      Kaliteli ve güvenilir projelerle müşterilerimizin hayallerini gerçeğe dönüştürmek, yaşam kalitesini artıran modern yaşam alanları oluşturmak temel misyonumuzdur.

                      Geniş yatırım araçlarımız ve kapsamlı hizmet ağımız sayesinde kârlı yatırımlar geliştirmeyi, bu yatırımları hayata geçirirken toplumun ihtiyaçlarına uygun projeler üretmeyi önceliğimiz olarak görüyoruz.
                    `}
                  </ReactMarkdown>
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

              {/* Ofis Bölümü */}
              <div className="row">
                <div className="col-lg-12">
                  <div className="video-box mb-5">
                    <a 
                      href="https://www.youtube.com/watch?v=2RJ3vuL0L2Q" 
                      data-lity=""
                    >
                      <img 
                        loading="lazy" 
                        className="w-100" 
                        alt="BLR İnşaat Ofis Video" 
                        src="/front/gorsel/genel/logo.png"
                      />
                    </a>
                  </div>

                  <p className="c-w" style={{ fontSize: '16px', lineHeight: '1.8' }}>
                    BLR İnşaat'ın modern ve şık tasarıma sahip merkez ofisi, işimize verdiğimiz değeri ve profesyonelliğimizi yansıtan bir ortam sunuyor. Ofisimiz, kolay ulaşım ve konforlu misafir ağırlama olanaklarıyla iş ve ziyaretleriniz için ideal bir lokasyonda bulunmaktadır. Şehrin merkezi noktalarına yakın konumuyla, hem özel araçla hem de toplu taşıma araçlarıyla rahatlıkla ulaşılabilir.
                  </p>

                  <p className="c-w" style={{ fontSize: '16px', lineHeight: '1.8' }}>
                    Modern ve ferah bekleme alanlarımızda misafirlerimiz için sıcak bir karşılama sunuyor, konforlu bir ortam sağlıyoruz. Karşılama alanımız, şık ve ferah bir atmosfer sunan oturma grupları ve ihtiyaca uygun ikram seçenekleriyle donatılmıştır. Profesyonel ve güler yüzlü ekibimiz, sizleri hızlıca doğru birime yönlendirmek ve ihtiyaçlarınıza çözüm sunmak için hazırdır.
                  </p>

                  <p className="c-w" style={{ fontSize: '16px', lineHeight: '1.8' }}>
                    Toplantı alanlarımız, iş birliğini ve yaratıcılığı teşvik eden modern bir tasarıma sahiptir. Teknolojik altyapıyla donatılmış bu alanlar, etkili sunumlar, strateji toplantıları ve beyin fırtınaları için ideal bir ortam sunar. Şık ve ferah dekorasyonu, misafirlerinizi ağırlarken prestijli bir izlenim bırakmanızı sağlar. Farklı kapasite seçenekleriyle ihtiyaçlarınıza uygun esnek çözümler sunan toplantı odalarımız, rahat oturma düzeni ve ergonomik mobilyalarıyla uzun süreli oturumlarda dahi konforu ön planda tutar.
                  </p>

                  <p className="c-w" style={{ fontSize: '16px', lineHeight: '1.8' }}>
                    Çalışma alanlarımız, ekip ruhunu güçlendiren ve verimliliği artıran bir tasarıma sahiptir. Her detayı özenle düşünülmüş ofisimizde, modern ofis teknolojileri ve konforlu çalışma ortamı bir araya getirilmiştir. Gün ışığından maksimum faydalanan ferah çalışma alanları, çalışanlarımızın motivasyonunu ve üretkenliğini artırmaktadır.
                  </p>

                  <div className="row mt-5">
                    <div className="col-lg-3 col-md-6 mb-4">
                      <img 
                        loading="lazy" 
                        className="prj" 
                        alt="BLR İnşaat Ofis 1" 
                        src="/front/gorsel/genel/logo.png"
                      />
                    </div>
                    <div className="col-lg-3 col-md-6 mb-4">
                      <img 
                        loading="lazy" 
                        className="prj" 
                        alt="BLR İnşaat Ofis 2" 
                        src="/front/gorsel/genel/logo.png"
                      />
                    </div>
                    <div className="col-lg-3 col-md-6 mb-4">
                      <img 
                        loading="lazy" 
                        className="prj" 
                        alt="BLR İnşaat Ofis 3" 
                        src="/front/gorsel/genel/logo.png"
                      />
                    </div>
                    <div className="col-lg-3 col-md-6 mb-4">
                      <img 
                        loading="lazy" 
                        className="prj" 
                        alt="BLR İnşaat Ofis 4" 
                        src="/front/gorsel/genel/logo.png"
                      />
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
        .video-box {
          position: relative;
          display: block;
          border-radius: 14px;
          overflow: hidden;
        }
        .video-box::before {
          content: '\\f144';
          font-family: 'Font Awesome 6 Free';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 60px;
          color: white;
          z-index: 2;
          transition: transform 0.3s ease;
        }
        .video-box:hover::before {
          transform: translate(-50%, -50%) scale(1.1);
        }
        .video-box img {
          width: 100%;
          height: auto;
          border-radius: 14px;
        }
      `}</style>
    </>
  );
};

export default Office; 