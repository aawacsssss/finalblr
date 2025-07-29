import React, { useState, useEffect } from "react";
import "../styles.css";
import { siteContentService, SiteContent } from '../services/supabaseService';
import { supabase } from '../services/supabaseClient';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface ContactContent {
  hero?: {
    title: string;
    content: string;
    images?: string[];
  };
  contact_info?: {
    title: string;
    content: string;
  };
  working_hours?: {
    title: string;
    content: string;
  };
}

interface SocialMediaSettings {
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contactContent, setContactContent] = useState<ContactContent>({});
  const [contentLoading, setContentLoading] = useState(true);
  const [showKvkk, setShowKvkk] = useState(false);
  const [socialMedia, setSocialMedia] = useState<SocialMediaSettings>({});

  useEffect(() => {
    const fetchContactContent = async () => {
      try {
        setContentLoading(true);
        const content = await siteContentService.getByPage('contact');
        
        const heroContent = content.find(item => item.section_name === 'hero');
        const contactInfoContent = content.find(item => item.section_name === 'contact_info');
        const workingHoursContent = content.find(item => item.section_name === 'working_hours');

        setContactContent({
          hero: heroContent ? {
            title: heroContent.title || '',
            content: heroContent.content || '',
            images: heroContent.images || []
          } : undefined,
          contact_info: contactInfoContent ? {
            title: contactInfoContent.title || '',
            content: contactInfoContent.content || ''
          } : undefined,
          working_hours: workingHoursContent ? {
            title: workingHoursContent.title || '',
            content: workingHoursContent.content || ''
          } : undefined
        });

        // Sosyal medya ayarlarını çek
        const { data: settingsData, error: settingsError } = await supabase
          .from('site_settings')
          .select('*')
          .eq('id', 1)
          .single();

        if (settingsError) {
          console.error('Site ayarları yükleme hatası:', settingsError);
          // Hata durumunda varsayılan değerler kullan
          setSocialMedia({
            facebookUrl: 'https://facebook.com',
            instagramUrl: 'https://instagram.com',
            youtubeUrl: 'https://youtube.com'
          });
        } else if (settingsData) {
          setSocialMedia({
            facebookUrl: settingsData.facebook_url || 'https://facebook.com',
            instagramUrl: settingsData.instagram_url || 'https://instagram.com',
            youtubeUrl: settingsData.youtube_url || 'https://youtube.com'
          });
        } else {
          // Veri yoksa varsayılan URL'ler
          setSocialMedia({
            facebookUrl: 'https://facebook.com',
            instagramUrl: 'https://instagram.com',
            youtubeUrl: 'https://youtube.com'
          });
        }
      } catch (error) {
        console.error('Error fetching contact content:', error);
      } finally {
        setContentLoading(false);
      }
    };

    fetchContactContent();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Form validasyonu
      if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
        throw new Error('Lütfen tüm zorunlu alanları doldurun.');
      }

      // Email formatı kontrolü (eğer email girilmişse)
      if (formData.email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          throw new Error('Lütfen geçerli bir email adresi girin.');
        }
      }

      // Supabase'e kaydet
      const { error } = await supabase.from('contact_messages').insert([formData]);
      if (error) throw new Error('Mesaj kaydedilemedi: ' + error.message);

      // Email gönder (Vercel Function)
      try {
        const emailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email || 'Email girilmedi',
            subject: 'Yeni İletişim Formu Mesajı',
            message: formData.message,
            phone: formData.phone
          }),
        });

        if (!emailResponse.ok) {
          console.warn('Email gönderilemedi ama mesaj kaydedildi');
        }
      } catch (emailError) {
        console.warn('Email gönderme hatası:', emailError);
        // Email hatası olsa bile form başarılı sayılır
      }

      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  if (contentLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div>Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="contact-page" style={{ background: '#fff', minHeight: '100vh', padding: '32px 0 0 0', marginTop: 64 }}>
      <div className="container">
        <div className="row" style={{ justifyContent: 'center' }}>
          <div className="bg-dark contact-page-info c-w mb-5" style={{ padding: 60, position: 'relative', borderRadius: '0 0 70px 0', width: '100%', maxWidth: 1200, margin: '0 auto 40px auto', boxShadow: '0 4px 32px #0002', display: 'flex', flexWrap: 'wrap', gap: 32 }}>
            {/* Sol: Bilgi ve sosyal */}
            <div className="col-lg-6" style={{ flex: 1, minWidth: 280, color: '#fff', marginBottom: 24 }}>
              <p style={{ maxWidth: 400, letterSpacing: 2, fontWeight: 100, color: '#fff', marginBottom: 32 }}>
                {contactContent.hero?.content || 'Soru, görüş ve önerileriniz için aşağıdaki iletişim kanallarımızdan bize ulaşabilirsiniz.'}
              </p>
              {/* İletişim bilgileri - her zaman basit metin formatında */}
              <div style={{ color: '#fff', fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
                <div style={{ marginBottom: 8 }}>Adres: REŞADİYE MAHALLESİ ATATÜRK BULVARI CADDESİ NO:48/D ÇORLU/TEKİRDAĞ BİLİR İNŞAAT</div>
                <div style={{ marginBottom: 8 }}>Telefon: 0533 368 1965</div>
                <div style={{ marginBottom: 8 }}>E-posta: iletisim@blrinsaat.com</div>
              </div>
              <ul className="social-media" style={{ display: 'flex', gap: 16, listStyle: 'none', padding: 0 }}>
                <li><a aria-label="facebook" title="Facebook" target="_blank" rel="noopener noreferrer" href={socialMedia.facebookUrl} style={{ color: '#fff', fontSize: 28 }}><i className="fa-brands fa-facebook"></i></a></li>
                <li><a aria-label="youtube" title="YouTube" target="_blank" rel="noopener noreferrer" href={socialMedia.youtubeUrl} style={{ color: '#fff', fontSize: 28 }}><i className="fa-brands fa-youtube"></i></a></li>
                <li><a aria-label="instagram" title="Instagram" target="_blank" rel="noopener noreferrer" href={socialMedia.instagramUrl} style={{ color: '#fff', fontSize: 28 }}><i className="fa-brands fa-instagram"></i></a></li>
              </ul>
            </div>
            {/* Sağ: Form */}
            <div className="col-lg-6" style={{ flex: 1, minWidth: 320, maxWidth: 480, background: '#fff', borderRadius: 24, boxShadow: '0 2px 16px #0001', padding: 32, margin: '0 auto' }}>
              <div className="contact-title" style={{ fontWeight: 700, fontSize: 24, marginBottom: 24, color: '#1a202c' }}>İletişim Formu</div>
              <form className="contact-form" onSubmit={handleSubmit}>
                {success && (
                  <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '12px', borderRadius: '4px', marginBottom: '16px', border: '1px solid #c3e6cb' }}>
                    Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.
                  </div>
                )}
                {error && (
                  <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '12px', borderRadius: '4px', marginBottom: '16px', border: '1px solid #f5c6cb' }}>
                    {error}
                  </div>
                )}
                <div className="row">
                  <div className="col-lg-12 mb-3">
                    <input type="text" name="name" className="form-item" placeholder="Ad, Soyad *" value={formData.name} onChange={handleInputChange} required style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }} />
                  </div>
                  <div className="col-lg-12 mb-3">
                    <input type="tel" name="phone" className="form-item" placeholder="Telefon Numaranız *" value={formData.phone} onChange={handleInputChange} required style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }} />
                  </div>
                  <div className="col-lg-12 mb-3">
                    <input type="email" name="email" className="form-item" placeholder="E-Posta Adresi (Zorunlu Değil)" value={formData.email} onChange={handleInputChange} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }} />
                  </div>
                  <div className="col-lg-12 mb-3">
                    <textarea name="message" id="message" cols={6} rows={4} className="form-item" placeholder="Mesajınız *" value={formData.message} onChange={handleInputChange} required style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }} />
                  </div>
                  <div className="col-lg-12">
                    <div className="form-bottom" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
                      {/* <div className="recaptcha"><div className="g-recaptcha" data-sitekey="6Lfdb7sqAAAAAASb-ILEnN6MrEM5dHit4B3CioZ9"></div></div> */}
                      <button type="submit" className="form-btn" disabled={loading} style={{ background: '#1a202c', color: '#fff', borderRadius: 8, padding: '12px 32px', fontWeight: 600, fontSize: 18, minWidth: 120 }}>
                        {loading ? 'Gönderiliyor...' : 'Gönder'}
                      </button>
                    </div>
                    <div style={{ fontSize: 13, color: '#888', marginTop: 12, textAlign: 'center' }}>
                      İletişim formunu göndererek <a href="#" onClick={e => { e.preventDefault(); setShowKvkk(true); }} style={{ color: '#1e88e5', textDecoration: 'underline', cursor: 'pointer' }}>Kişisel Verilerin Korunması Aydınlatma Metni</a>'ni okuduğunuzu kabul etmiş olursunuz.
                    </div>
                  </div>
            </div>
              </form>
            </div>
          </div>
        </div>
        {/* Harita kutusu */}
        <div className="row" style={{ marginTop: 32 }}>
          <div className="col-lg-12">
            <div className="contact-maps bg-box" style={{ borderRadius: 24, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 16px #0001', padding: 0 }}>
              <div className="contact-title" style={{ fontWeight: 700, fontSize: 22, margin: '24px 0 16px 0', color: '#1a202c' }}>Harita'da Yerimiz</div>
              <div style={{ width: '100%' }}>
                <iframe
                  width="100%"
                  height="600"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=RE%C5%9EAD%C4%B0YE%20MAHALLES%C4%B0%20ATAT%C3%9CRK%20BULVARI%20CADDES%C4%B0%20NO:48/D+(Bilir%20%C4%B0n%C5%9Faat)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                  title="Bilir İnşaat Konum"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
          </div>
          </div>
          </div>
      </div>
      {showKvkk && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.45)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, maxWidth: 480, width: '90%', padding: 32, boxShadow: '0 8px 32px #0003', position: 'relative' }}>
            <button onClick={() => setShowKvkk(false)} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>&times;</button>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Kişisel Verilerin Korunması Aydınlatma Metni</h2>
            <div style={{ fontSize: 15, color: '#222', lineHeight: 1.7, maxHeight: 400, overflowY: 'auto' }}>
              İletişim formu aracılığıyla ad, soyad, telefon numarası ve e-posta adresi gibi kişisel verileriniz, yalnızca tarafınızla iletişime geçmek ve taleplerinizi yanıtlamak amacıyla alınmakta ve veri tabanımızda saklanmaktadır. Bu bilgiler hiçbir şekilde üçüncü kişilerle paylaşılmamakta, ticari amaçlarla kullanılmamakta ve yalnızca yasal yükümlülükler kapsamında yetkili kurumlarla paylaşılabilir.<br /><br />Kişisel verilerinizle ilgili haklarınız ve detaylı bilgi için bizimle iletişime geçebilirsiniz.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact; 