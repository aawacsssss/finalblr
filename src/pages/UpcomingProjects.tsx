import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectService, Project } from '../services/supabaseService';

const UpcomingProjects: React.FC = () => {
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
      const data = await projectService.getByStatus('baslayan');
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
                      <div className="ic-btn-2 text-center p-3">Başlanacak</div>
                    </Link>
                  </div>
                  <div className="col-lg-4">
                    <Link to="/devam-eden-projeler">
                      <div className="ic-btn text-center p-3">Devam Eden</div>
                    </Link>
                  </div>
                  <div className="col-lg-4">
                    <Link to="/tamamlanan-projeler">
                      <div className="ic-btn text-center p-3">Tamamlanan</div>
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
                  <div className="p-9" style={{ background: '#fff', borderRadius: 28, boxShadow: '0 8px 32px #0002', padding: 28, transition: 'box-shadow 0.2s, transform 0.2s', height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ width: '100%' }}>
                      <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: '0 2px 12px #0001', marginBottom: 18, transition: 'box-shadow 0.2s, transform 0.2s' }}>
                        <div style={{ width: '100%', height: 240, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img
                            src={project.images && project.images.length > 0 ? project.images[0] : '/front/gorsel/anasayfa/tum-projeler.png'}
                            alt={project.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 24, transition: 'transform 0.2s' }}
                            onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/front/gorsel/anasayfa/tum-projeler.png'; }}
                          />
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <Link to={`/proje/${project.id}`} style={{ textDecoration: 'none' }}>
                          <div style={{ fontFamily: 'Poppins, Montserrat, Inter, Roboto, Arial, sans-serif', fontWeight: 700, fontSize: 24, color: '#232617', letterSpacing: 1, marginBottom: 8, cursor: 'pointer' }}>{project.title}</div>
                        </Link>
                        {project.description && (
                          <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.5, margin: '8px 0' }}>
                            {project.description.length > 100 ? `${project.description.substring(0, 100)}...` : project.description}
                          </p>
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
                        backgroundColor: '#17a2b8',
                        color: 'white'
                      }}>
                        Başlayacak
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <h3 style={{ color: '#666', marginBottom: '16px' }}>Henüz Başlanacak Proje Yok</h3>
              <p style={{ color: '#888' }}>Şu anda başlanacak projeler bulunmamaktadır.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default UpcomingProjects; 