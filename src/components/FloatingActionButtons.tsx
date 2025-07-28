import React, { useState, useEffect } from 'react';
import { whatsappService } from '../services/whatsappService';
import { supabase } from '../services/supabaseClient';

const FloatingActionButtons: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      // Sayfanın yarısına inildiğinde scroll to top butonunu göster
      const scrollPosition = window.scrollY;
      const pageHeight = document.documentElement.scrollHeight;
      const halfHeight = pageHeight * 0.5;
      
      setShowScrollTop(scrollPosition > halfHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Video URL'sini yükle
  useEffect(() => {
    const loadVideoUrl = async () => {
      try {
        const { data: settingsData } = await supabase
          .from('site_settings')
          .select('youtube_url')
          .eq('id', 1)
          .single();
        
        if (settingsData && settingsData.youtube_url) {
          // YouTube URL'sini embed formatına çevir
          let embedUrl = settingsData.youtube_url;
          
          // YouTube URL'lerini embed formatına çevir
          if (embedUrl.includes('youtube.com/watch?v=')) {
            const videoId = embedUrl.split('v=')[1]?.split('&')[0];
            if (videoId) {
              embedUrl = `https://www.youtube.com/embed/${videoId}`;
            }
          } else if (embedUrl.includes('youtu.be/')) {
            const videoId = embedUrl.split('youtu.be/')[1]?.split('?')[0];
            if (videoId) {
              embedUrl = `https://www.youtube.com/embed/${videoId}`;
            }
          }
          
          setVideoUrl(embedUrl);
        } else {
          // Varsayılan video
          setVideoUrl('https://www.youtube.com/embed/2RJ3vuL0L2Q');
        }
      } catch (error) {
        console.error('Video URL yükleme hatası:', error);
        // Hata durumunda varsayılan video
        setVideoUrl('https://www.youtube.com/embed/2RJ3vuL0L2Q');
      }
    };

    loadVideoUrl();
    
    // Her 30 saniyede bir kontrol et (daha az sıklıkta)
    const interval = setInterval(loadVideoUrl, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openVideoModal = () => {
    setShowVideoModal(true);
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
  };

  return (
    <>
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        {showScrollTop ? (
          // Scroll to Top Butonu
          <button
            onClick={scrollToTop}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: '#232617',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.background = '#495228';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = '#232617';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
            </svg>
          </button>
        ) : (
          // Ofisimiz Butonu
          <button
            onClick={openVideoModal}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: '#808000',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.background = '#6B8E23';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = '#808000';
            }}
          >
            Ofisimiz
          </button>
        )}
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
          }}
          onClick={closeVideoModal}
        >
          <div
            style={{
              position: 'relative',
              width: '80%',
              maxWidth: '800px',
              height: '60%',
              maxHeight: '500px',
              backgroundColor: 'white',
              borderRadius: '12px',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Kapat Butonu */}
            <button
              onClick={closeVideoModal}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                zIndex: 10
              }}
            >
              ×
            </button>
            
            {/* YouTube Video İframe */}
            {showVideoModal && videoUrl && (
              <iframe
                src={videoUrl + (videoUrl.includes('?') ? '&' : '?') + 'autoplay=1&rel=0'}
                title="BLR İnşaat Ofis Video"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingActionButtons; 