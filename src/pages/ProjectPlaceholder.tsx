import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { projectService, Project } from "../services/supabaseService";
import ReactMarkdown from 'react-markdown';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (id) {
      projectService.getById(Number(id)).then(setProject).catch(() => setProject(null));
    }
  }, [id]);

  // ESC ve sağ/sol ok ile lightbox kontrolü
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxOpen(false);
        setShowAll(false);
      } else if (e.key === 'ArrowRight') {
        setActiveIndex(prev => (prev + 1) % (project?.images?.length || 1));
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex(prev => (prev - 1 + (project?.images?.length || 1)) % (project?.images?.length || 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, project?.images?.length]);

  if (!project) return <div>Yükleniyor...</div>;
  const images = project.images || [];
  const sideThumbs = images.slice(1, 5);
  const hasMore = images.length > 5;

  return (
    <div style={{ paddingTop: 32 }}>


      {/* Galeri: Ana fotoğraf ve thumbnail grid */}
      <section className="proje">
        <div className="container">
          <div className="row" style={{ alignItems: "stretch" }}>
            {/* 1 görsel varsa: Ortalanmış tek görsel */}
            {images.length === 1 ? (
              <div className="col-lg-12" style={{ padding: 0, margin: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{
                  maxWidth: '800px',
                  width: '100%',
                  height: 500,
                  borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <img
                    src={images[0]}
                    alt={project.title}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover', 
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease'
                    }}
                    onClick={() => { setActiveIndex(0); setLightboxOpen(true); }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>
              </div>
            ) : (
              /* 2 görsel varsa: Tam genişlikte 2'li grid */
              images.length === 2 ? (
                <div className="col-lg-12" style={{ padding: 0, margin: 0 }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 16,
                    maxWidth: '100%',
                    height: 400,
                    borderRadius: 16,
                    overflow: 'hidden',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.1)',
                    margin: 'auto'
                  }}>
                    <img
                      src={images[0]}
                      alt={project.title + ' 1'}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover', 
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease'
                      }}
                      onClick={() => { setActiveIndex(0); setLightboxOpen(true); }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                    <img
                      src={images[1]}
                      alt={project.title + ' 2'}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover', 
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease'
                      }}
                      onClick={() => { setActiveIndex(1); setLightboxOpen(true); }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </div>
                </div>
              ) : (
                <>
                  {/* Sol: Büyük ana görsel (2'den farklı görsel sayısında) */}
                  <div className="col-lg-6" style={{ height: 400, padding: 0, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {images[0] && (
                      <img
                        className="prj main-image"
                        src={images[0]}
                        alt={project.title + " 1"}
                        style={{ maxWidth: "100%", maxHeight: 400, objectFit: "cover", borderRadius: 16, boxShadow: "0 2px 16px #0001", margin: "auto", display: "block", cursor: "pointer" }}
                        onClick={() => { setActiveIndex(0); setLightboxOpen(true); }}
                      />
                    )}
                  </div>
                  {/* Sağ: Thumbnail grid */}
                  <div className="col-lg-6 mob-mt-30" style={{ position: "relative" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, minHeight: 400 }}>
                      {sideThumbs.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={project.title + " thumb " + (idx + 2)}
                          style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 12, boxShadow: "0 1px 6px #0001", background: "#f5f5f5", cursor: "pointer" }}
                          onClick={() => { setActiveIndex(idx + 1); setLightboxOpen(true); }}
                        />
                      ))}
                      {/* Tüm Fotoğraflar butonu */}
                      {hasMore && (
                        <button
                          style={{
                            position: "absolute",
                            right: 16,
                            bottom: 16,
                            background: "#1a202c",
                            color: "#fff",
                            border: "none",
                            borderRadius: 8,
                            padding: "10px 20px",
                            fontWeight: 600,
                            boxShadow: "0 2px 8px #0002",
                            cursor: "pointer",
                            opacity: 0.92,
                          }}
                          onClick={() => { setShowAll(true); setLightboxOpen(true); setActiveIndex(0); }}
                        >
                          Tüm Fotoğrafları Görüntüle ({images.length})
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )
            )}
          </div>
        </div>
      </section>

      {/* Altında iki sütun: sol başlık/açıklama/katalog, sağda ilan bilgileri ve özellikler */}
      <section className="bg-gri">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 m-a">
                              <div className="blr-title">{project.title}</div>
              <ReactMarkdown>{project.description || ''}</ReactMarkdown>
              {project.catalog && (
                <a href={project.catalog} target="_blank" className="btn btn-blue mt-14" rel="noopener noreferrer">
                  <i className="fa-solid fa-file-pdf pr-12"></i>
                  <span>Dijital Katalog</span>
                </a>
              )}
            </div>
            <div className="col-lg-6">
              <div className="products-detail" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
                marginBottom: 16
              }}>
                {Array.isArray(project.features) && project.features.map((feature, idx) => {
                  // Zebra: her satırda 2 özellik, satırın arka planı değişiyor
                  const row = Math.floor(idx / 2);
                  const bg = row % 2 === 0 ? '#fff' : '#e6d09c';
                  return (
                    <div
                      key={idx}
                      className="value"
                      style={{
                        borderRadius: 12,
                        padding: '16px 0',
                        textAlign: 'center',
                        fontWeight: 500,
                        fontSize: 20,
                        background: bg,
                        boxShadow: '0 2px 8px #0001',
                        minHeight: 60,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {feature}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Haritası */}
      {project.location?.map_embed_url && (
        <section style={{ 
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', 
          padding: '60px 0',
          marginTop: '40px'
        }}>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                  <h2 style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: '700', 
                    color: '#232526',
                    marginBottom: '16px',
                    fontFamily: 'Tenor Sans, Arbutus Slab, serif'
                  }}>
                    Proje Konumu
                  </h2>
                  <p style={{ 
                    fontSize: '1.1rem', 
                    color: '#666',
                    maxWidth: '600px',
                    margin: '0 auto',
                    lineHeight: '1.6'
                  }}>
                    {project.location.address || `${project.title} projesinin konumu`}
                  </p>
                </div>
                
                <div style={{
                  width: '100%',
                  height: '400px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  border: '1px solid #e2e8f0'
                }}>
                  <iframe
                    src={project.location.map_embed_url}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`${project.title} konumu`}
                  />
                </div>
                
                {/* Koordinat bilgileri */}
                {project.location.coordinates && (
                  <div style={{ 
                    textAlign: 'center', 
                    marginTop: '20px',
                    padding: '16px',
                    background: 'rgba(255,255,255,0.8)',
                    borderRadius: '8px',
                    display: 'inline-block',
                    marginLeft: '50%',
                    transform: 'translateX(-50%)'
                  }}>
                    <span style={{ 
                      fontSize: '0.9rem', 
                      color: '#666',
                      fontFamily: 'monospace'
                    }}>
                      Koordinatlar: {project.location.coordinates.lat.toFixed(6)}, {project.location.coordinates.lng.toFixed(6)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Lightbox modal ESC ile kapanma ve sağ üstte X ikonu */}
      {lightboxOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.85)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => { setLightboxOpen(false); setShowAll(false); }}
        >
          <div
            style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Sağ üstte kapat X ikonu */}
            <button
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                background: 'rgba(0,0,0,0.5)',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: 36,
                height: 36,
                fontSize: 22,
                cursor: 'pointer',
                zIndex: 2
              }}
              onClick={() => { setLightboxOpen(false); setShowAll(false); }}
              aria-label="Kapat"
            >
              ×
            </button>
            <img
              src={images[activeIndex]}
              alt={`${project.title} ${activeIndex + 1}`}
              style={{ maxHeight: "80vh", maxWidth: "80vw", borderRadius: 10, boxShadow: "0 0 24px #0008" }}
            />
            {/* Sol ok */}
            {images.length > 1 && (
              <button
                style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 32, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
                onClick={e => { e.stopPropagation(); setActiveIndex((activeIndex - 1 + images.length) % images.length); }}
              >&#8592;</button>
            )}
            {/* Sağ ok */}
            {images.length > 1 && (
              <button
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 32, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
                onClick={e => { e.stopPropagation(); setActiveIndex((activeIndex + 1) % images.length); }}
              >&#8594;</button>
            )}
            {/* Thumbnail navigasyon */}
            {(showAll || images.length > 5) && (
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
                {images.map((img, idx) => (
                  <img
                    key={img}
                    src={img}
                    alt={`thumb${idx}`}
                    style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 6, border: idx === activeIndex ? "2px solid #fff" : "2px solid transparent", cursor: "pointer", opacity: idx === activeIndex ? 1 : 0.7 }}
                    onClick={e => { e.stopPropagation(); setActiveIndex(idx); }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}