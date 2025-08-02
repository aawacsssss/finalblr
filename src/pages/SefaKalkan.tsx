import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { siteContentService, SiteContent } from '../services/supabaseService';
import ReactMarkdown from 'react-markdown';

const SefaKalkan: React.FC = () => {
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Önce tüm içerikleri çek ve sefa_kalkan sayfasını ara
        const allContents = await siteContentService.getAll();
        // sefa_kalkan sayfası içeriklerini filtrele
        const contentsData = allContents.filter(content => content.page_name === 'sefa_kalkan');
        
        // Eğer sefa_kalkan sayfası içeriği yoksa, about sayfasından coordinator içeriğini al
        if (contentsData.length === 0) {
          const coordinatorContent = allContents.find(content => 
            content.page_name === 'about' && content.section_name === 'coordinator'
          );
          if (coordinatorContent) {
            setContents([coordinatorContent]);
          } else {
            setContents([]);
          }
                 } else {
           setContents(contentsData);
         }
      } catch (error) {
        console.error('Sefa Kalkan sayfası verileri yüklenirken hata:', error);
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


      {/* Navigation Tabs - 80px aşağıya taşındı */}
      <div style={{ marginTop: '80px' }}>
        <section className="p-5">
          <div className="container">
            <div className="row">
              <div className="p-2">
                <div className="row">
                  <div className="col-lg-4">
                    <Link to="/hakkimizda">
                      <div className="ic-btn text-center p-3">Hakkımızda</div>
                    </Link>
                  </div>
                                     <div className="col-lg-4">
                     <Link to="/sefa-kalkan">
                       <div className="ic-btn-2 text-center p-3">Nurettin Bilir</div>
                     </Link>
                   </div>
                  <div className="col-lg-4">
                    <a href="/hakkimizda#ofisimiz" onClick={(e) => {
                      e.preventDefault();
                      window.location.href = '/hakkimizda#ofisimiz';
                      // Sayfanın yüklenmesi için kısa bir gecikme sonra ofisimiz elementine scroll yapılmasını sağlayalım
                      setTimeout(() => {
                        const element = document.getElementById('ofisimiz');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }, 500);
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

      {/* Main Content */}
      <section className="pt-0">
        <div className="container">
          <div className="bg-dark p-50-40 mb-5">
            <div className="row">
              <div className="col-lg-12 m-a pc-p-70 c-w">
                {contents.length > 0 ? (
                  <>
                    <div className="blr-title-2 mb-4">{contents[0].title || 'Sefa Kalkan'}</div>
                    <div className="sefa-content">
                      {contents[0].content ? (
                        <ReactMarkdown>{contents[0].content}</ReactMarkdown>
                      ) : (
                        <p>
                          Sefa Kalkan, inşaat sektöründeki deneyimi ve vizyoner yaklaşımıyla BLR İnşaat'ın gelişimine önemli katkılar sağlamaktadır. Uzun yıllara dayanan sektör tecrübesi ve güçlü liderlik vasıflarıyla, şirketimizin büyüme stratejilerini başarıyla yönetmektedir.
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="blr-title-2 mb-4">Sefa Kalkan</div>
                    <div className="sefa-content">
                      <p>
                        Sefa Kalkan, inşaat sektöründeki deneyimi ve vizyoner yaklaşımıyla BLR İnşaat'ın gelişimine önemli katkılar sağlamaktadır. Uzun yıllara dayanan sektör tecrübesi ve güçlü liderlik vasıflarıyla, şirketimizin büyüme stratejilerini başarıyla yönetmektedir.
                      </p>
                      <p>
                        Sektördeki yenilikçi yaklaşımları ve müşteri odaklı iş anlayışıyla tanınan Sefa Kalkan, BLR İnşaat'ın her projesinde kalite ve güvenilirliği ön planda tutmaktadır. Modern yapı teknolojilerini yakından takip ederek, sürdürülebilir ve çevre dostu projelerin geliştirilmesine öncülük etmektedir.
                      </p>
                    </div>
                  </>
                )}
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
        .sefa-content {
          color: white;
          line-height: 1.8;
          font-size: 16px;
        }
        .sefa-content p {
          margin-bottom: 1.5rem;
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

export default SefaKalkan; 