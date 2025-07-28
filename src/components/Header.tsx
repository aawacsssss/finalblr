import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { siteContentService } from '../services/supabaseService';
import { supabase } from '../services/supabaseClient';

const DEFAULT_LOGO = '/front/gorsel/genel/logo.png';

interface HeaderContent {
  logo?: {
    title: string;
    content: string;
    images?: string[];
  };
  navigation: Array<{
    title: string;
    content: string;
    order_index: number;
  }>;
}

interface SocialMediaSettings {
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
}

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSubMenuOpen, setIsMobileSubMenuOpen] = useState(false);
  const [headerLogo, setHeaderLogo] = useState<string>(DEFAULT_LOGO);
  const [logoError, setLogoError] = useState<string>('');
  const [headerContent, setHeaderContent] = useState<HeaderContent>({
    logo: undefined,
    navigation: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isProjectsDropdownOpen, setIsProjectsDropdownOpen] = useState(false);
  const [isKurumsalDropdownOpen, setIsKurumsalDropdownOpen] = useState(false);
  // Dropdown açık kalma için timer
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isMobileKurumsalOpen, setIsMobileKurumsalOpen] = useState(false);
  const [isMobileProjelerOpen, setIsMobileProjelerOpen] = useState(false);
  const [socialMedia, setSocialMedia] = useState<SocialMediaSettings>({});

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchHeaderContent = async () => {
      try {
        setLoading(true);
        const content = await siteContentService.getByPage('header');
        
        const logoContent = content.find(item => item.section_name === 'logo');
        const navigationContent = content
          .filter(item => item.section_name === 'navigation')
          .sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

        setHeaderContent({
          logo: logoContent ? {
            title: logoContent.title || '',
            content: logoContent.content || '',
            images: logoContent.images || []
          } : undefined,
          navigation: navigationContent.map(item => ({
            title: item.title || '',
            content: item.content || '',
            order_index: item.order_index || 0
          }))
        });

        if (logoContent?.images && logoContent.images.length > 0) {
          setHeaderLogo(logoContent.images[0]);
        } else {
          setHeaderLogo(DEFAULT_LOGO);
        }

        // Sosyal medya ayarlarını çek
        const { data: settingsData } = await supabase
          .from('site_settings')
          .select('*')
          .eq('id', 1)
          .single();

        if (settingsData) {
          setSocialMedia({
            facebookUrl: settingsData.facebook_url || 'https://facebook.com',
            instagramUrl: settingsData.instagram_url || 'https://instagram.com',
            youtubeUrl: settingsData.youtube_url || 'https://youtube.com'
          });
          
          // Logo yükleme sistemi - sadece site_settings kullan
          if (settingsData.facebook_url && settingsData.facebook_url.startsWith('HEADER_LOGO_DATA:')) {
            setHeaderLogo(settingsData.facebook_url.replace('HEADER_LOGO_DATA:', ''));
          } else {
            setHeaderLogo(DEFAULT_LOGO);
          }
        } else {
          // Varsayılan URL'ler
          setSocialMedia({
            facebookUrl: 'https://facebook.com',
            instagramUrl: 'https://instagram.com',
            youtubeUrl: 'https://youtube.com'
          });
          setHeaderLogo(DEFAULT_LOGO);
        }
      } catch (error) {
        console.error('Error fetching header content:', error);
        setHeaderLogo(DEFAULT_LOGO);
      } finally {
        setLoading(false);
      }
    };

    fetchHeaderContent();
  }, []);

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = DEFAULT_LOGO;
    setLogoError('Header logosu görseli yüklenemedi!');
  };

  if (loading) {
    return (
      <header className="header-2">
        <div className="container">
          <div className="header-top-2">
            <div className="logo">
              <img src="/front/gorsel/genel/logo.png" alt="BLR İnşaat" style={{ height: 120, maxWidth: '340px', objectFit: 'contain', padding: 0, margin: 0, display: 'block' }} />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      {logoError && (
        <div style={{ color: 'red', textAlign: 'center', fontWeight: 600, marginTop: 8 }}>{logoError}</div>
      )}
      
      {/* Desktop Header - Statik HTML'deki gibi */}
      <header id="main-header" className={`header-2 header ${isScrolled ? 'hidden' : ''}`} style={{ padding: '0px 0', overflow: 'visible' }}>
        <div className="container">
          <div className="header-top-2" style={{ marginBottom: 0, paddingBottom: 0 }}>
            <Link to="/" className="logo" style={{ overflow: 'visible' }}>
              <img src={headerLogo} alt={headerContent.logo?.title || "BLR İnşaat"} onError={handleImgError} style={{ height: 140, maxWidth: '340px', objectFit: 'contain', padding: 0, margin: 0, display: 'block' }} />
            </Link>
            
            <nav className="header-nav-2">
              <div className="container">
                <div className="header-nav-area-2">
                                     <ul className="header-menu">
                     <li><Link to="/">ANASAYFA</Link></li>
                     
                     <li className="dropdown"
                         onMouseEnter={() => {
                           if (dropdownTimeout) clearTimeout(dropdownTimeout);
                           setIsKurumsalDropdownOpen(true);
                         }}
                         onMouseLeave={() => {
                           const timeout = setTimeout(() => setIsKurumsalDropdownOpen(false), 200);
                           setDropdownTimeout(timeout);
                         }}>
                       <Link to="#" style={{ cursor: 'pointer', color: '#232526', textDecoration: 'none', fontWeight: 400, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }} onClick={(e) => e.preventDefault()}>KURUMSAL<i className="fa-solid fa-angle-down"></i></Link>
                       {isKurumsalDropdownOpen && (
                         <ul
                           className="drop-menu"
                           style={{
                             minWidth: 220,
                             background: '#fff',
                             boxShadow: '0 8px 32px #0002',
                             borderRadius: 10,
                             padding: '8px 0',
                             position: 'absolute',
                             zIndex: 100,
                             top: '100%',
                             left: 0,
                             display: 'flex',
                             flexDirection: 'column',
                             gap: 0
                           }}
                           onMouseEnter={() => {
                             if (dropdownTimeout) clearTimeout(dropdownTimeout);
                             setIsKurumsalDropdownOpen(true);
                           }}
                           onMouseLeave={() => {
                             const timeout = setTimeout(() => setIsKurumsalDropdownOpen(false), 200);
                             setDropdownTimeout(timeout);
                           }}
                         >
                           <li style={{ width: '100%' }}><Link to="/hakkimizda" style={{ display: 'block', width: '100%', padding: '12px 24px', textAlign: 'left', fontWeight: 500, color: '#232617', borderBottom: '1px solid #f0f0f0', textDecoration: 'none' }}>Hakkımızda</Link></li>
                           <li style={{ width: '100%' }}><Link to="/sefa-kalkan" style={{ display: 'block', width: '100%', padding: '12px 24px', textAlign: 'left', fontWeight: 500, color: '#232617', borderBottom: '1px solid #f0f0f0', textDecoration: 'none' }}>Nurettin Bilir</Link></li>
                           <li style={{ width: '100%' }}><Link to="/hakkimizda#ofisimiz" style={{ display: 'block', width: '100%', padding: '12px 24px', textAlign: 'left', fontWeight: 500, color: '#232617', textDecoration: 'none' }}>Ofis Konumumuz</Link></li>
                         </ul>
                       )}
                     </li>
                     
                     <li className="dropdown"
                        onMouseEnter={() => {
                          if (dropdownTimeout) clearTimeout(dropdownTimeout);
                          setIsProjectsDropdownOpen(true);
                        }}
                        onMouseLeave={() => {
                          const timeout = setTimeout(() => setIsProjectsDropdownOpen(false), 200);
                          setDropdownTimeout(timeout);
                        }}>
                      <Link to="#" style={{ cursor: 'pointer', color: '#232526', textDecoration: 'none', fontWeight: 400, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }} onClick={(e) => e.preventDefault()}>PROJELER<i className="fa-solid fa-angle-down"></i></Link>
                      {isProjectsDropdownOpen && (
                        <ul
                          className="drop-menu"
                          style={{
                            minWidth: 220,
                            background: '#fff',
                            boxShadow: '0 8px 32px #0002',
                            borderRadius: 10,
                            padding: '8px 0',
                            position: 'absolute',
                            zIndex: 100,
                            top: '100%',
                            left: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0
                          }}
                          onMouseEnter={() => {
                            if (dropdownTimeout) clearTimeout(dropdownTimeout);
                            setIsProjectsDropdownOpen(true);
                          }}
                          onMouseLeave={() => {
                            const timeout = setTimeout(() => setIsProjectsDropdownOpen(false), 200);
                            setDropdownTimeout(timeout);
                          }}
                        >
                          <li style={{ width: '100%' }}><Link to="/baslanacak-projeler" style={{ display: 'block', width: '100%', padding: '12px 24px', textAlign: 'left', fontWeight: 500, color: '#232617', borderBottom: '1px solid #f0f0f0', textDecoration: 'none' }}>Başlanacak Projeler</Link></li>
                          <li style={{ width: '100%' }}><Link to="/devam-eden-projeler" style={{ display: 'block', width: '100%', padding: '12px 24px', textAlign: 'left', fontWeight: 500, color: '#232617', borderBottom: '1px solid #f0f0f0', textDecoration: 'none' }}>Devam Eden Projeler</Link></li>
                          <li style={{ width: '100%' }}><Link to="/tamamlanan-projeler" style={{ display: 'block', width: '100%', padding: '12px 24px', textAlign: 'left', fontWeight: 500, color: '#232617', textDecoration: 'none' }}>Tamamlanan Projeler</Link></li>
                        </ul>
                      )}
                    </li>
                    
                    <li><Link to="/iletisim">İLETİŞİM</Link></li>
                  </ul>
                </div>
              </div>
            </nav>
            
            <div className="right">
              <ul className="social-media">
                <li><a aria-label="facebook" title="Facebook" target="_blank" rel="noopener noreferrer" href={socialMedia.facebookUrl}><i className="fa-brands fa-facebook"></i></a></li>
                <li><a aria-label="youtube" title="YouTube" target="_blank" rel="noopener noreferrer" href={socialMedia.youtubeUrl}><i className="fa-brands fa-youtube"></i></a></li>
                <li><a aria-label="instagram" title="Instagram" target="_blank" rel="noopener noreferrer" href={socialMedia.instagramUrl}><i className="fa-brands fa-instagram"></i></a></li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header - Statik HTML'deki gibi */}
      <header className="header-mobile" style={{ padding: '0px 0', overflow: 'visible' }}>
        <div className="container">
          <div className="header-mobile-area">
            <Link to="/" style={{ overflow: 'visible' }}>
              <img src={headerLogo} alt={headerContent.logo?.title || "BLR İnşaat"} onError={handleImgError} style={{ height: 100, maxWidth: '220px', objectFit: 'contain', padding: 0, margin: 0, display: 'block' }} />
            </Link>
            <div className="bars" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              MENÜ <i className="fa-solid fa-bars-staggered"></i>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Modal - Statik HTML'deki gibi */}
      {isMobileMenuOpen && (
        <div className="modal left fade show" style={{ display: 'block' }} id="leftPopup">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <img src={headerLogo} alt={headerContent.logo?.title || "BLR İnşaat"} onError={handleImgError} style={{ height: 120, maxWidth: '340px', objectFit: 'contain', padding: 0, margin: 0, display: 'block' }} />
                <button type="button" className="close" onClick={() => setIsMobileMenuOpen(false)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="mobile-nav-menu">
                  <ul>
                    <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Anasayfa</Link></li>
                    <li className="sub-menu" style={{ position: 'relative' }}>
                      <div 
                        className={`sub-menu-flex${isMobileKurumsalOpen ? ' active' : ''}`}
                        onClick={() => {
                          setIsMobileKurumsalOpen(v => !v);
                          setIsMobileProjelerOpen(false);
                        }}
                      >
                        <span style={{ fontSize: 16, fontWeight: 500 }}>Kurumsal</span>
                        <i className="fas fa-angle-down"></i>
                      </div>
                      <ul style={{
                        display: isMobileKurumsalOpen ? 'block' : 'none',
                        paddingLeft: '25px',
                        background: 'white'
                      }}>
                        <li style={{ border: 'none' }}><Link to="/hakkimizda" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px 0', display: 'block' }}>• Hakkımızda</Link></li>
                                                 <li style={{ border: 'none' }}><Link to="/sefa-kalkan" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px 0', display: 'block' }}>• Nurettin Bilir</Link></li>
                         <li style={{ border: 'none' }}><Link to="/hakkimizda#ofisimiz" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px 0', display: 'block' }}>• Ofis Konumumuz</Link></li>
                      </ul>
                    </li>
                    <li className="sub-menu" style={{ position: 'relative' }}>
                      <div 
                        className={`sub-menu-flex${isMobileProjelerOpen ? ' active' : ''}`}
                        onClick={() => {
                          setIsMobileProjelerOpen(v => !v);
                          setIsMobileKurumsalOpen(false);
                        }}
                      >
                        <span style={{ fontSize: 16, fontWeight: 500 }}>Projeler</span>
                        <i className="fas fa-angle-down"></i>
                      </div>
                      <ul style={{
                        display: isMobileProjelerOpen ? 'block' : 'none',
                        paddingLeft: '25px',
                        background: 'white'
                      }}>
                        <li style={{ border: 'none' }}><Link to="/baslanacak-projeler" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px 0', display: 'block' }}>• Başlanacak Projeler</Link></li>
                        <li style={{ border: 'none' }}><Link to="/devam-eden-projeler" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px 0', display: 'block' }}>• Devam Eden Projeler</Link></li>
                        <li style={{ border: 'none' }}><Link to="/tamamlanan-projeler" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '10px 0', display: 'block' }}>• Tamamlanan Projeler</Link></li>
                      </ul>
                    </li>
                    <li><Link to="/iletisim" onClick={() => setIsMobileMenuOpen(false)}>İLETİŞİM</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;