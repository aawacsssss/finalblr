import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectService, Project } from '../services/supabaseService';

// HTML içeriğini güvenli şekilde render eden yardımcı fonksiyon
const renderHTML = (htmlContent: string) => {
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

// Metni kelime sayısına göre kısaltan fonksiyon
const truncateText = (text: string, wordLimit: number = 20) => {
  const words = text.split(' ');
  if (words.length <= wordLimit) {
    return { text: text, isTruncated: false };
  }
  return { 
    text: words.slice(0, wordLimit).join(' ') + '...', 
    isTruncated: true 
  };
};

const CompletedProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.getByStatus('bitmis');
      setProjects(data);
    } catch (err) {
      setError('Projeler yüklenirken hata oluştu');
      console.error('Projeler yüklenirken hata:', err);
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
        Projeler yükleniyor...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#dc3545', marginBottom: '16px' }}>Hata</h2>
        <p style={{ color: '#666', marginBottom: '24px' }}>{error}</p>
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
                    <Link to="/baslanacak-projeler">
                      <div className="ic-btn text-center p-3">Başlanacak</div>
                    </Link>
                  </div>
                  <div className="col-lg-4">
                    <Link to="/devam-eden-projeler">
                      <div className="ic-btn text-center p-3">Devam Eden</div>
                    </Link>
                  </div>
                  <div className="col-lg-4">
                    <Link to="/tamamlanan-projeler">
                      <div className="ic-btn-2 text-center p-3">Tamamlanan</div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

       <section style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e8eaf6 100%)', padding: '48px 0' }}>
        <div className="container">
          {projects.length > 0 ? (
            <div className="row">
              {projects.map((project) => (
                <div key={project.id} className="col-lg-4 col-md-6 mb-4 d-flex">
                  <Link to={`/proje/${project.id}`} style={{ textDecoration: 'none', width: '100%' }}>
                    <div className="p-9" style={{ background: '#fff', borderRadius: 28, boxShadow: '0 8px 32px #0002', padding: 28, transition: 'box-shadow 0.2s, transform 0.2s', height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                    <div style={{ width: '100%' }}>
                      <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: '0 2px 12px #0001', marginBottom: 18, transition: 'box-shadow 0.2s, transform 0.2s' }}>
                        <div style={{ width: '100%', height: 240, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 24 }}>
                          {project.images && project.images.length > 0 ? (
                            <img
                              src={project.images[0]}
                              alt={project.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 24, transition: 'transform 0.2s' }}
                              onError={e => { 
                                e.currentTarget.onerror = null; 
                                e.currentTarget.style.display = 'none'; 
                                const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                if (nextElement) {
                                  nextElement.style.display = 'flex';
                                }
                              }}
                            />
                          ) : null}
                          <div style={{ 
                            display: project.images && project.images.length > 0 ? 'none' : 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                            padding: '20px',
                            textAlign: 'center'
                          }}>
                            <div style={{ fontSize: '3rem', marginBottom: '10px', color: '#94a3b8' }}>📸</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#475569', marginBottom: '5px' }}>
                              Proje Fotoğrafları
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                              Hazırlanmaktadır
                            </div>
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: 'Poppins, Montserrat, Inter, Roboto, Arial, sans-serif', fontWeight: 700, fontSize: 24, color: '#232617', letterSpacing: 1, marginBottom: 8 }}>{project.title}</div>
                                                 {project.description && (
                           <div style={{ color: '#666', fontSize: '14px', lineHeight: 1.5, margin: '8px 0' }}>
                             {(() => {
                               const { text: truncatedText, isTruncated } = truncateText(project.description, 20);
                               return (
                                 <div>
                                   {isTruncated ? (
                                     <>
                                       {renderHTML(truncatedText)}
                                       <button 
                                         onClick={() => {
                                           // Modal açma işlemi burada yapılacak
                                           alert('Proje detay sayfasına giderek tam açıklamayı görebilirsiniz.');
                                         }}
                                         style={{
                                           background: 'linear-gradient(135deg, #1a2236 0%, #2d3748 100%)',
                                           color: 'white',
                                           border: 'none',
                                           padding: '6px 12px',
                                           borderRadius: '6px',
                                           fontSize: '11px',
                                           fontWeight: '600',
                                           cursor: 'pointer',
                                           marginTop: '8px',
                                           transition: 'all 0.3s ease',
                                           boxShadow: '0 2px 8px rgba(26, 34, 54, 0.2)'
                                         }}
                                         onMouseEnter={(e) => {
                                           e.currentTarget.style.transform = 'translateY(-1px)';
                                           e.currentTarget.style.boxShadow = '0 4px 12px rgba(26, 34, 54, 0.3)';
                                         }}
                                         onMouseLeave={(e) => {
                                           e.currentTarget.style.transform = 'translateY(0)';
                                           e.currentTarget.style.boxShadow = '0 2px 8px rgba(26, 34, 54, 0.2)';
                                         }}
                                       >
                                         Devamını Gör
                                       </button>
                                     </>
                                   ) : (
                                     renderHTML(project.description)
                                   )}
                                 </div>
                               );
                             })()}
                           </div>
                         )}
                        {project.technical_info && project.technical_info.location && (
                          <p style={{ color: '#888', fontSize: '12px', margin: '8px 0 0 0' }}>
                            📍 {project.technical_info.location}
                          </p>
                        )}
                      </div>
                    </div>
                    <div style={{ width: '100%', textAlign: 'center', marginTop: '16px' }}>
                      <span style={{ 
                        display: 'inline-block',
                        padding: '4px 12px', 
                        borderRadius: '12px', 
                        fontSize: '12px',
                        fontWeight: 600,
                        backgroundColor: '#28a745',
                        color: 'white'
                      }}>
                        Tamamlandı
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <h3 style={{ color: '#666', marginBottom: '16px' }}>Henüz Tamamlanan Proje Yok</h3>
              <p style={{ color: '#888' }}>Şu anda tamamlanan projeler bulunmamaktadır.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default CompletedProjects; 