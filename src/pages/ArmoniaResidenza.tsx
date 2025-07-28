import React, { useState, useEffect } from 'react';
import { projectService, Project } from '../services/supabaseService';
import { whatsappService } from '../services/whatsappService';
import '../styles.css';

const ArmoniaResidenza: React.FC = () => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProject();
  }, []);

  const loadProject = async () => {
    try {
      setLoading(true);
      setError(null);
      // Armonia projesini başlığına göre bul
      const projects = await projectService.getAll();
      const armoniaProject = projects.find(p => 
        p.title.toLowerCase().includes('armonia') || 
        p.title.toLowerCase().includes('residenza')
      );
      
      if (armoniaProject) {
        setProject(armoniaProject);
      } else {
        // Eğer Supabase'de yoksa varsayılan verileri kullan
        setProject({
          id: 1,
          title: 'ARMONIA RESIDENZA',
          description: 'Armonia Residenza, modern yaşamın tüm konforlarını sunan lüks bir yaşam projesidir. Çorlu\'nun en prestijli lokasyonlarında yer alan bu proje, estetik tasarımı ve kaliteli yapısıyla dikkat çekmektedir.',
          status: 'devam',
          images: [
            '/front/gorsel/slider/armonia.jpg',
            '/front/gorsel/proje/devam/armonia/1.jpg',
            '/front/gorsel/proje/devam/armonia/2.jpg',
            '/front/gorsel/proje/devam/armonia/3.jpg'
          ],
          technical_info: {
            location: 'Çorlu, Tekirdağ',
            area: '120-180',
            rooms: '2+1, 3+1, 4+1',
            price: 'Başlayan fiyatlarla'
          }
        });
      }
    } catch (err) {
      setError('Proje yüklenirken hata oluştu');
      console.error('Proje yükleme hatası:', err);
    } finally {
      setLoading(false);
    }
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
        Proje yükleniyor...
      </div>
    );
  }

  if (error || !project) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#dc3545', marginBottom: '16px' }}>Proje Bulunamadı</h2>
        <p style={{ color: '#666', marginBottom: '24px' }}>
          Armonia Residenza projesi şu anda mevcut değil.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container">
        {/* Proje başlığı */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 700, 
            color: '#232617', 
            marginBottom: '16px',
            fontFamily: 'Poppins, Montserrat, Inter, Roboto, Arial, sans-serif'
          }}>
            {project.title}
          </h1>
          <span style={{ 
            padding: '8px 16px', 
            borderRadius: '20px', 
            fontSize: '14px',
            fontWeight: 600,
            backgroundColor: project.status === 'bitmis' ? '#28a745' : project.status === 'devam' ? '#ffc107' : '#17a2b8',
            color: 'white',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            {project.status === 'bitmis' ? 'Tamamlandı' : project.status === 'devam' ? 'Devam Eden' : 'Başlayan'}
          </span>
        </div>

        {/* Proje açıklaması */}
        {project.description && (
          <div style={{ 
            marginBottom: '32px', 
            padding: '24px', 
            backgroundColor: 'white', 
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 600, 
              color: '#232617', 
              marginBottom: '16px'
            }}>
              Proje Hakkında
            </h3>
            <p style={{ 
              fontSize: '1.1rem', 
              color: '#444', 
              lineHeight: 1.7,
              margin: 0
            }}>
              {project.description}
            </p>
          </div>
        )}

        {/* Teknik bilgiler */}
        {project.technical_info && typeof project.technical_info === 'object' && (
          <div style={{ 
            marginBottom: '32px', 
            padding: '24px', 
            backgroundColor: 'white', 
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 600, 
              color: '#232617', 
              marginBottom: '16px'
            }}>
              Teknik Bilgiler
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {project.technical_info.location && (
                <div>
                  <strong style={{ color: '#666' }}>📍 Konum:</strong>
                  <p style={{ margin: '4px 0 0 0', color: '#333' }}>{project.technical_info.location}</p>
                </div>
              )}
              {project.technical_info.area && (
                <div>
                  <strong style={{ color: '#666' }}>🏠 Alan:</strong>
                  <p style={{ margin: '4px 0 0 0', color: '#333' }}>{project.technical_info.area} m²</p>
                </div>
              )}
              {project.technical_info.rooms && (
                <div>
                  <strong style={{ color: '#666' }}>🛏️ Oda Sayısı:</strong>
                  <p style={{ margin: '4px 0 0 0', color: '#333' }}>{project.technical_info.rooms}</p>
                </div>
              )}
              {project.technical_info.price && (
                <div>
                  <strong style={{ color: '#666' }}>💰 Fiyat:</strong>
                  <p style={{ margin: '4px 0 0 0', color: '#333' }}>{project.technical_info.price}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Proje görselleri */}
        {project.images && project.images.length > 0 ? (
          <div style={{ 
            marginBottom: '32px', 
            padding: '24px', 
            backgroundColor: 'white', 
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 600, 
              color: '#232617', 
              marginBottom: '24px'
            }}>
              Proje Görselleri
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
              gap: '16px' 
            }}>
              {project.images.map((image, index) => (
                <div 
                  key={index}
                  style={{ 
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <img 
                    src={image} 
                    alt={`${project.title} - Görsel ${index + 1}`}
                    style={{ 
                      width: '100%', 
                      height: '200px', 
                      objectFit: 'cover',
                      display: 'block'
                    }}
                    onError={(e) => {
                      e.currentTarget.src = '/front/gorsel/anasayfa/tum-projeler.png';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ 
            marginBottom: '32px', 
            padding: '24px', 
            backgroundColor: 'white', 
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <p style={{ color: '#666', margin: 0 }}>Bu proje için henüz görsel eklenmemiş.</p>
          </div>
        )}

        {/* WhatsApp İletişim Butonu */}
        <div style={{ 
          marginBottom: '32px', 
          padding: '24px', 
          backgroundColor: 'white', 
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 600, 
            color: '#232617', 
            marginBottom: '16px'
          }}>
            Bu Proje Hakkında Bilgi Alın
          </h3>
          <p style={{ 
            color: '#666', 
            marginBottom: '24px',
            fontSize: '1rem'
          }}>
            {project.title} projesi hakkında detaylı bilgi almak için WhatsApp üzerinden bizimle iletişime geçin.
          </p>
          <button
            onClick={async () => {
              await whatsappService.handleWhatsAppClick(
                '905421805959',
                `Merhaba, ${project.title} projesi hakkında teklif almak istiyorum.`,
                'project_detail',
                project.id,
                project.title
              );
            }}
            style={{
              background: '#25d366',
              color: 'white',
              border: 'none',
              padding: '16px 32px',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#128c7e';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#25d366';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.3)';
            }}
          >
            <i className="fab fa-whatsapp" style={{ fontSize: '20px' }}></i>
            WhatsApp ile İletişim
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArmoniaResidenza; 