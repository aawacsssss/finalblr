import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { projectService, Project } from "../services/supabaseService";
import ReactMarkdown from 'react-markdown';

// HTML içeriğini güvenli şekilde render eden yardımcı fonksiyon
const renderHTML = (htmlContent: string) => {
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

// Metni kelime sayısına göre kısaltan fonksiyon
const truncateText = (text: string, wordLimit: number = 40) => {
  const words = text.split(' ');
  if (words.length <= wordLimit) {
    return { text: text, isTruncated: false };
  }
  return { 
    text: words.slice(0, wordLimit).join(' ') + '...', 
    isTruncated: true 
  };
};

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Touch/swipe için minimum mesafe
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

    if (isLeftSwipe && images.length > 1) {
      setActiveIndex((activeIndex + 1) % images.length);
    }
    if (isRightSwipe && images.length > 1) {
      setActiveIndex((activeIndex - 1 + images.length) % images.length);
    }
  };

  // iframe kodundan URL çıkarma fonksiyonu
  const extractUrlFromIframe = (iframeCode: string) => {
    if (iframeCode.includes('<iframe')) {
      const match = iframeCode.match(/src="([^"]+)"/);
      return match ? match[1] : iframeCode;
    }
    return iframeCode;
  };

  useEffect(() => {
    if (id) {
      projectService.getById(Number(id)).then(setProject).catch(() => setProject(null));
    }
  }, [id]);

  useEffect(() => {
    if (project?.video) {
      setVideoModalOpen(true);
    }
  }, [project]);

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
            {/* Görsel yoksa placeholder mesajı */}
            {(!images || images.length === 0) ? (
              <div className="col-lg-12" style={{ padding: 0, margin: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{
                  maxWidth: '800px',
                  width: '100%',
                  height: 400,
                  borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  border: '2px dashed #cbd5e0'
                }}>
                  <div style={{ textAlign: 'center', padding: '30px' }}>
                    <div style={{ 
                      fontSize: '3.5rem', 
                      marginBottom: '20px', 
                      color: '#94a3b8' 
                    }}>📸</div>
                    <h3 style={{ 
                      fontSize: '1.3rem', 
                      fontWeight: '600', 
                      color: '#475569',
                      marginBottom: '10px',
                      fontFamily: 'Arbutus Slab, serif'
                    }}>
                      Projemizin Görselleri Hazırlanmaktadır
                    </h3>
                    <p style={{ 
                      fontSize: '0.95rem', 
                      color: '#64748b',
                      margin: 0
                    }}>
                      Yakında burada projemizin detaylı görsellerini görebileceksiniz.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* 1 görsel varsa: Ortalanmış tek görsel */
              images.length === 1 ? (
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
                      <div className="thumbnail-grid" style={{ 
                        display: "grid", 
                        gridTemplateColumns: "1fr 1fr", 
                        gap: 8, 
                        minHeight: 400
                      }}>
                        {sideThumbs.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={project.title + " thumb " + (idx + 2)}
                            className="thumbnail-image"
                            style={{ 
                              width: "100%", 
                              height: 180, 
                              objectFit: "cover", 
                              borderRadius: 12, 
                              boxShadow: "0 1px 6px #0001", 
                              background: "#f5f5f5", 
                              cursor: "pointer"
                            }}
                            onClick={() => { setActiveIndex(idx + 1); setLightboxOpen(true); }}
                          />
                        ))}
                        {/* Tüm Fotoğraflar butonu */}
                        {hasMore && (
                          <button
                            className="view-all-btn"
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
                              opacity: 0.92
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
              <div className="project-description">
                {project.description ? (
                  (() => {
                    const { text: truncatedText, isTruncated } = truncateText(project.description, 40);
                    return (
                      <div>
                        {isTruncated ? (
                          <>
                            {renderHTML(truncatedText)}
                            <button 
                              onClick={() => setDescriptionModalOpen(true)}
                              style={{
                                background: 'linear-gradient(135deg, #1a2236 0%, #2d3748 100%)',
                                color: 'white',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                marginTop: '16px',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 12px rgba(26, 34, 54, 0.2)'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 16px rgba(26, 34, 54, 0.3)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(26, 34, 54, 0.2)';
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
                  })()
                ) : (
                  <ReactMarkdown>{project.description || ''}</ReactMarkdown>
                )}
              </div>
              {project.catalog && (
                <a href={project.catalog} target="_blank" className="btn btn-blue mt-14" rel="noopener noreferrer">
                  <i className="fa-solid fa-file-pdf pr-12"></i>
                  <span>Dijital Katalog</span>
                </a>
              )}
            </div>
            <div className="col-lg-6">
              {/* Özellikler yoksa placeholder mesajı */}
              {(!project.features || project.features.length === 0) ? (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: 250,
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  borderRadius: 16,
                  border: '2px dashed #cbd5e0',
                  padding: '30px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#94a3b8' }}>🏗️</div>
                    <h3 style={{ 
                      fontSize: '1.3rem', 
                      fontWeight: '600', 
                      color: '#475569',
                      marginBottom: '10px',
                      fontFamily: 'Arbutus Slab, serif'
                    }}>
                      Projemizin Özellikleri Yakında Eklenecektir
                    </h3>
                    <p style={{ 
                      fontSize: '0.95rem', 
                      color: '#64748b',
                      margin: 0
                    }}>
                      Projemizin detaylı özellikleri ve teknik bilgileri yakında burada yer alacak.
                    </p>
                  </div>
                </div>
              ) : (
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
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Haritası */}
      {project.technical_info?.map_embed_url && (
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
                    fontFamily: 'Arbutus Slab, serif'
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
                    {project.technical_info?.address || `${project.title} projesinin konumu`}
                  </p>
                </div>
                
                <div style={{
                  width: '100%',
                  height: '400px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <iframe
                    src={extractUrlFromIframe(project.technical_info.map_embed_url)}
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
                {project.location?.coordinates && (
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
            style={{ 
              position: 'relative', 
              maxWidth: '98vw', 
              maxHeight: '98vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%'
            }}
            onClick={e => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
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
            
            {/* Ana görsel container */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flex: 1,
              position: 'relative',
              marginBottom: 0
            }}>
              <img
                src={images[activeIndex]}
                alt={`${project.title} ${activeIndex + 1}`}
                style={{ 
                  maxHeight: "85vh", 
                  maxWidth: "95vw", 
                  width: "auto",
                  height: "auto",
                  borderRadius: 10, 
                  boxShadow: "0 0 24px #0008",
                  objectFit: "contain",
                  display: "block",
                  marginBottom: 0
                }}
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
            </div>
            
            {/* Thumbnail navigasyon */}
            {(showAll || images.length > 5) && (
              <div style={{ 
                display: 'flex', 
                gap: 8, 
                justifyContent: 'center', 
                alignItems: 'center',
                flexWrap: 'wrap',
                maxWidth: '95vw',
                padding: '8px',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: 8,
                margin: '5px 0 0 0'
              }}>
                {images.map((img, idx) => (
                  <img
                    key={img}
                    src={img}
                    alt={`thumb${idx}`}
                    style={{ 
                      width: 60, 
                      height: 40, 
                      objectFit: "cover", 
                      borderRadius: 6, 
                      border: idx === activeIndex ? "2px solid #fff" : "2px solid transparent", 
                      cursor: "pointer", 
                      opacity: idx === activeIndex ? 1 : 0.7,
                      flexShrink: 0,
                      transition: 'all 0.2s ease'
                    }}
                    onClick={e => { e.stopPropagation(); setActiveIndex(idx); }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = idx === activeIndex ? '1' : '0.7'}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Açıklama Modalı */}
      {descriptionModalOpen && project.description && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.85)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={() => setDescriptionModalOpen(false)}
        >
          <div style={{ 
            position: 'relative', 
            maxWidth: '800px', 
            maxHeight: '80vh', 
            background: '#fff', 
            borderRadius: 16,
            padding: '40px',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }} 
          onClick={e => e.stopPropagation()}
          >
            <button
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'rgba(0,0,0,0.1)',
                color: '#333',
                border: 'none',
                borderRadius: '50%',
                width: 40,
                height: 40,
                fontSize: 24,
                cursor: 'pointer',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onClick={() => setDescriptionModalOpen(false)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0,0,0,0.2)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              aria-label="Kapat"
            >×</button>
            
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ 
                fontSize: '28px', 
                fontWeight: '700', 
                color: '#1a2236',
                marginBottom: '16px',
                fontFamily: 'Arbutus Slab, serif'
              }}>
                {project.title}
              </h2>
              <div style={{ 
                width: '60px', 
                height: '4px', 
                background: 'linear-gradient(135deg, #e6d09c 0%, #d4af37 100%)',
                borderRadius: '2px',
                marginBottom: '24px'
              }}></div>
            </div>
            
            <div style={{ 
              fontSize: '16px', 
              lineHeight: '1.8', 
              color: '#374151',
              fontFamily: 'Inter, sans-serif'
            }}>
              {renderHTML(project.description)}
            </div>
          </div>
        </div>
      )}

      {videoModalOpen && project.video && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.85)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={() => setVideoModalOpen(false)}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh', background: '#000', borderRadius: 12 }} onClick={e => e.stopPropagation()}>
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
              onClick={() => setVideoModalOpen(false)}
              aria-label="Kapat"
            >×</button>
            {project.video.includes('youtube.com') || project.video.includes('youtu.be') ? (
              <iframe
                width="800"
                height="450"
                src={project.video.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                title="Proje Videosu"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                style={{ maxWidth: '80vw', maxHeight: '80vh', borderRadius: 10, background: '#000' }}
              />
            ) : (
              <video
                src={project.video}
                controls
                autoPlay
                style={{ maxWidth: '80vw', maxHeight: '80vh', borderRadius: 10, background: '#000' }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}