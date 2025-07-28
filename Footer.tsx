import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { siteContentService } from '../services/supabaseService';
import { projectService } from '../services/supabaseService';
import { supabase } from '../services/supabaseClient';
import { whatsappService } from '../services/whatsappService';

interface FooterContent {
  company_info?: {
    title: string;
    content: string;
    images?: string[];
  };
  contact_info?: {
    title: string;
    content: string;
  };
  social_links?: {
    title: string;
    content: string;
  };
  copyright?: {
    title: string;
    content: string;
  };
}

interface SocialMediaSettings {
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
}

const Footer: React.FC = () => {
  const [footerContent, setFooterContent] = useState<FooterContent>({});
  const [loading, setLoading] = useState(true);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showKVKKModal, setShowKVKKModal] = useState(false);
  const [footerLogo, setFooterLogo] = useState<string>('/front/gorsel/genel/logo.png');
  const [socialMedia, setSocialMedia] = useState<SocialMediaSettings>({
    facebookUrl: 'https://www.facebook.com/bilirinsaat',
    instagramUrl: 'https://www.instagram.com/bilirinsaat',
    youtubeUrl: 'https://www.youtube.com/@bilirinsaat'
  });

  useEffect(() => {
    const fetchFooterContent = async () => {
      try {
        setLoading(true);
        const content = await siteContentService.getByPage('footer');
        
        const companyInfo = content.find(item => item.section_name === 'company_info');
        const contactInfo = content.find(item => item.section_name === 'contact_info');
        const socialLinks = content.find(item => item.section_name === 'social_links');
        const copyright = content.find(item => item.section_name === 'copyright');

        setFooterContent({
          company_info: companyInfo ? {
            title: companyInfo.title || '',
            content: companyInfo.content || '',
            images: companyInfo.images || []
          } : undefined,
          contact_info: contactInfo ? {
            title: contactInfo.title || '',
            content: contactInfo.content || ''
          } : undefined,
          social_links: socialLinks ? {
            title: socialLinks.title || '',
            content: socialLinks.content || ''
          } : undefined,
          copyright: copyright ? {
            title: copyright.title || '',
            content: copyright.content || ''
          } : undefined
        });

        // Sosyal medya ayarlarını çek
        const { data: settingsData } = await supabase
          .from('site_settings')
          .select('*')
          .eq('id', 1)
          .single();

        if (settingsData && (settingsData.facebook_url || settingsData.instagram_url || settingsData.youtube_url)) {
          setSocialMedia({
            facebookUrl: settingsData.facebook_url || 'https://www.facebook.com/bilirinsaat',
            instagramUrl: settingsData.instagram_url || 'https://www.instagram.com/bilirinsaat',
            youtubeUrl: settingsData.youtube_url || 'https://www.youtube.com/@bilirinsaat'
          });
        }
        
        // Footer logo ayarlarını yükle
        try {
          // Önce logo_settings tablosundan okumaya çalış
          const { data: footerLogoData } = await supabase
            .from('logo_settings')
            .select('logo_data')
            .eq('logo_type', 'footer')
            .single();
          
          if (footerLogoData?.logo_data) {
            setFooterLogo(footerLogoData.logo_data);
          } else {
            // Fallback: site_settings'den oku
            if (settingsData.instagram_url && settingsData.instagram_url.startsWith('FOOTER_LOGO_DATA:')) {
              setFooterLogo(settingsData.instagram_url.replace('FOOTER_LOGO_DATA:', ''));
            }
          }
        } catch (error) {
          // Fallback: site_settings'den oku
          if (settingsData.instagram_url && settingsData.instagram_url.startsWith('FOOTER_LOGO_DATA:')) {
            setFooterLogo(settingsData.instagram_url.replace('FOOTER_LOGO_DATA:', ''));
          }
        }
      } catch (error) {
        console.error('Error fetching footer content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFooterContent();
    projectService.getAll().then(setAllProjects);
  }, []);

  // Categorize projects
  const upcomingProjects = allProjects.filter(p => p.status === 'baslayan');
  const ongoingProjects = allProjects.filter(p => p.status === 'devam');
  const completedProjects = allProjects.filter(p => p.status === 'bitmis');

  if (loading) {
    return (
      <footer style={{ background: '#212529', color: 'white', padding: '2rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
          <div>Yükleniyor...</div>
        </div>
      </footer>
    );
  }

  return (
    <>
      <footer style={{ 
        background: '#212529', 
        color: 'white', 
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          opacity: 0.05,
          background: 'radial-gradient(circle at 20% 20%, #495228 0%, transparent 50%), radial-gradient(circle at 80% 80%, #495228 0%, transparent 50%)'
        }}></div>

        {/* Main Footer Content */}
        <div style={{ 
          position: 'relative', 
          zIndex: 10,
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '4rem 1.5rem'
        }}>
          <div className="footer-main-row" style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr 2.2fr 1.3fr',
            gap: '2.2rem',
            alignItems: 'flex-start',
            width: '100%',
          }}>
            {/* Logo */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', minWidth: 180 }}>
              <img 
                src={footerLogo} 
                alt="BLR İnşaat" 
                style={{ height: '170px', maxWidth: '100%', objectFit: 'contain', marginBottom: 16 }} 
              />
            </div>
            {/* Hızlı Menü */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'white' }}>
                Hızlı Menü
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'left', fontSize: 15, lineHeight: '1.7' }}>
                <li style={{ marginBottom: '1rem' }}><Link to="/" style={{ color: '#e0e0e0', textDecoration: 'none' }}>Anasayfa</Link></li>
                <li style={{ marginBottom: '1rem' }}><Link to="/hakkimizda" style={{ color: '#e0e0e0', textDecoration: 'none' }}>Hakkımızda</Link></li>
                <li style={{ marginBottom: '1rem' }}><Link to="/projeler" style={{ color: '#e0e0e0', textDecoration: 'none' }}>Projelerimiz</Link></li>
                <li style={{ marginBottom: '1rem' }}><Link to="/ofis" style={{ color: '#e0e0e0', textDecoration: 'none' }}>Ofisimiz</Link></li>
                <li style={{ marginBottom: '1rem' }}><Link to="/iletisim" style={{ color: '#e0e0e0', textDecoration: 'none' }}>İletişim</Link></li>
              </ul>
            </div>
            {/* Projeler */}
            <div style={{ marginLeft: '-30px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'white' }}>
                Projelerimiz
              </h3>
              <div className="footer-projects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', width: '100%' }}>
                <div>
                  <div className="title" style={{ fontWeight: 700, fontSize: 17, marginBottom: 8, borderBottom: '2px solid #fff', display: 'inline-block', paddingBottom: 3 }}>Başlanacak Projeler</div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'left', wordBreak: 'break-word', fontSize: 15, lineHeight: '1.7' }}>
                    {upcomingProjects.map((project, index) => (
                      <li key={project.id} style={{ marginBottom: '0.5rem' }}>
                        <Link to={`/proje/${project.id}`} style={{ color: '#e0e0e0', textDecoration: 'none', transition: 'color 0.3s ease' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#ffd600'}
                          onMouseLeave={e => e.currentTarget.style.color = '#e0e0e0'}>
                          {project.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="title" style={{ fontWeight: 700, fontSize: 17, marginBottom: 8, borderBottom: '2px solid #fff', display: 'inline-block', paddingBottom: 3 }}>Devam Eden Projeler</div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'left', wordBreak: 'break-word', fontSize: 15, lineHeight: '1.7' }}>
                    {ongoingProjects.map((project, index) => (
                      <li key={project.id} style={{ marginBottom: '0.5rem' }}>
                        <Link to={`/proje/${project.id}`} style={{ color: '#e0e0e0', textDecoration: 'none', transition: 'color 0.3s ease' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#ffd600'}
                          onMouseLeave={e => e.currentTarget.style.color = '#e0e0e0'}>
                          {project.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="title" style={{ fontWeight: 700, fontSize: 17, marginBottom: 8, borderBottom: '2px solid #fff', display: 'inline-block', paddingBottom: 3 }}>Tamamlanan Projeler</div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'left', wordBreak: 'break-word', fontSize: 15, lineHeight: '1.7' }}>
                    {completedProjects.map((project, index) => (
                      <li key={project.id} style={{ marginBottom: '0.5rem' }}>
                        <Link to={`/proje/${project.id}`} style={{ color: '#e0e0e0', textDecoration: 'none', transition: 'color 0.3s ease' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#ffd600'}
                          onMouseLeave={e => e.currentTarget.style.color = '#e0e0e0'}>
                          {project.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            {/* İletişim */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'white' }}>
                İletişim
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 12, padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 22, color: '#fff' }}><i className="fas fa-phone-alt"></i></span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>Telefon</div>
                    <a href="tel:+902826512030" style={{ color: '#e0e0e0', textDecoration: 'none', fontSize: 15 }}>0 (282) 651 20 30</a>
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 12, padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 22, color: '#fff' }}><i className="fas fa-envelope"></i></span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>E-posta</div>
                    <a href="mailto:info@bilirinsaat.com.tr" style={{ color: '#e0e0e0', textDecoration: 'none', fontSize: 15 }}>info@bilirinsaat.com.tr</a>
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 12, padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 22, color: '#fff' }}><i className="fas fa-map-marker-alt"></i></span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>Adres</div>
                    <a href="https://maps.app.goo.gl/usfTNp5Men9taey36" target="_blank" rel="noopener noreferrer" style={{ color: '#e0e0e0', textDecoration: 'none', fontSize: 15 }}>
                      REŞADİYE MAHALLESİ ATATÜRK BULVARI CADDESİ NO:48/D ÇORLU/TEKİRDAĞ
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <style>{`
            @media (max-width: 1100px) {
              .footer-main-row {
                grid-template-columns: 1fr 1fr;
                gap: 2.2rem;
              }
            }
            @media (max-width: 700px) {
              .footer-main-row {
                grid-template-columns: 1fr;
                gap: 1.2rem;
              }
            }
          `}</style>
        </div>

        {/* Sosyal Medya Linkleri */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '3rem', 
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h4 style={{ 
            fontSize: '1.1rem', 
            fontWeight: 'bold', 
            marginBottom: '1.5rem',
            color: 'white'
          }}>
            Bizi Takip Edin
          </h4>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '1.5rem',
            flexWrap: 'wrap'
          }}>
            {/* Facebook */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                position: 'relative',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1877f2';
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.1)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(24, 119, 242, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onClick={() => {
                window.open(socialMedia.facebookUrl, '_blank');
              }}
            >
              <i className="fab fa-facebook-f" style={{ fontSize: '20px' }}></i>
            </div>

            {/* Instagram */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                position: 'relative',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)';
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.1)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(220, 39, 67, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onClick={() => {
                window.open(socialMedia.instagramUrl, '_blank');
              }}
            >
              <i className="fab fa-instagram" style={{ fontSize: '20px' }}></i>
            </div>

            {/* YouTube */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                position: 'relative',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ff0000';
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.1)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 0, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onClick={() => {
                window.open(socialMedia.youtubeUrl, '_blank');
              }}
            >
              <i className="fab fa-youtube" style={{ fontSize: '20px' }}></i>
            </div>

            {/* WhatsApp */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                position: 'relative',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#25d366';
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.1)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(37, 211, 102, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onClick={async () => {
                await whatsappService.handleWhatsAppClick(
                  '905421805959',
                  'Merhaba, BLR İnşaat hakkında bilgi almak istiyorum.',
                  'footer'
                );
              }}
            >
              <i className="fab fa-whatsapp" style={{ fontSize: '20px' }}></i>
            </div>
          </div>
        </div>
      </footer>
      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            <button 
              onClick={() => setShowPrivacyModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ×
            </button>
            <h2 style={{ color: '#212529', marginBottom: '1rem' }}>Gizlilik Politikası</h2>
            <div style={{ color: '#666', lineHeight: 1.6 }}>
              <p>BLR İnşaat olarak kişisel verilerinizin güvenliği bizim için çok önemlidir. Bu gizlilik politikası, web sitemizi ziyaret ettiğinizde toplanan bilgilerin nasıl kullanıldığını açıklar.</p>
              <h3>Toplanan Bilgiler</h3>
              <p>Web sitemizi ziyaret ettiğinizde, IP adresiniz, tarayıcı türünüz, işletim sisteminiz ve ziyaret ettiğiniz sayfalar gibi teknik bilgiler otomatik olarak toplanır.</p>
              <h3>Bilgilerin Kullanımı</h3>
              <p>Toplanan bilgiler sadece web sitemizin iyileştirilmesi ve size daha iyi hizmet sunulması amacıyla kullanılır.</p>
              <h3>Bilgi Güvenliği</h3>
              <p>Kişisel verileriniz, endüstri standardı güvenlik önlemleri ile korunmaktadır.</p>
            </div>
          </div>
        </div>
      )}
      {/* Terms of Service Modal */}
      {showTermsModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            <button 
              onClick={() => setShowTermsModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ×
            </button>
            <h2 style={{ color: '#212529', marginBottom: '1rem' }}>Kullanım Şartları</h2>
            <div style={{ color: '#666', lineHeight: 1.6 }}>
              <p>BLR İnşaat web sitesini kullanarak aşağıdaki şartları kabul etmiş sayılırsınız.</p>
              <h3>Genel Kullanım</h3>
              <p>Web sitemizi yasal amaçlar için kullanabilirsiniz. Sitenin güvenliğini tehlikeye atacak veya başkalarının haklarını ihlal edecek davranışlarda bulunamazsınız.</p>
              <h3>Fikri Mülkiyet</h3>
              <p>Sitedeki tüm içerik, BLR İnşaat'ın fikri mülkiyeti altındadır ve izinsiz kullanılamaz.</p>
              <h3>Sorumluluk Reddi</h3>
              <p>BLR İnşaat, web sitesindeki bilgilerin doğruluğu konusunda garanti vermez.</p>
            </div>
          </div>
        </div>
      )}
      {/* KVKK Modal */}
      {showKVKKModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            <button 
              onClick={() => setShowKVKKModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ×
            </button>
            <h2 style={{ color: '#212529', marginBottom: '1rem' }}>KVKK Aydınlatma Metni</h2>
            <div style={{ color: '#666', lineHeight: 1.6 }}>
              <p>6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında, BLR İnşaat olarak kişisel verilerinizin işlenmesi hakkında sizi bilgilendirmekteyiz.</p>
              <h3>Veri Sorumlusu</h3>
              <p>Kişisel verilerinizin veri sorumlusu BLR İnşaat'tır.</p>
              <h3>İşlenen Veriler</h3>
              <p>Kimlik bilgileri, iletişim bilgileri ve işlem güvenliği bilgileri işlenmektedir.</p>
              <h3>Veri İşleme Amaçları</h3>
              <p>Kişisel verileriniz, hizmet sunumu, iletişim ve yasal yükümlülüklerin yerine getirilmesi amacıyla işlenmektedir.</p>
              <h3>Haklarınız</h3>
              <p>KVKK'nın 11. maddesi kapsamında sahip olduğunuz hakları kullanabilirsiniz.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer; 