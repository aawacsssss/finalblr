import React from 'react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { Button } from './components/ui/button';
import { Play, Building, Home, ShoppingBag, Users } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <span className="text-xl font-bold text-gray-900">BİLİR İNŞAAT</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#sirket-bilgileri" className="bg-gray-800 text-white px-4 py-2 text-sm">
                  Şirket Bilgileri
                </a>
                <a href="#ofisimiz" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm">
                  Ofisimiz
                </a>
                <a href="#faaliyet-alanlari" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm">
                  Faaliyet Alanları
                </a>
                <a href="#misyon-vizyon" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm">
                  Misyon & Vizyon
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl mb-4">Hakkımızda</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Trakya bölgesinde 40 yıldır faaliyet gösteren köklü bir inşaat ve emlak firması
          </p>
        </div>
      </section>

      {/* Şirket Bilgileri Section */}
      <section id="sirket-bilgileri" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl mb-8 text-gray-900">Şirket Bilgileri</h2>
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p>
                  Bilir İnşaat, Trakya bölgesinde 40 yıldır faaliyet göstermekte olan köklü bir 
                  inşaat ve emlak firmasıdır. Nurettin Bilir ve Sefer Kalkan tarafından kurulan bu firma, 
                  yenilikçi bir bakış açısıyla sektörde yer almayı başarmıştır.
                </p>
                <p>
                  Sektördeki yenilikleri yakından takip ederek, güncel inşaat yöntemleri ve 
                  teknolojilerini kullanmakta, böylece projelerini daha verimli ve kaliteli bir 
                  şekilde hayata geçirmektedir. Çevre dostu malzemeler kullanarak sürdürülebilir 
                  yapılar inşa etmektedir.
                </p>
                <p>
                  40 yıllık deneyimiyle Trakya bölgesinde inşaat sektöründe güçlü bir yere sahip 
                  olup, yenilikçi ve müşteri odaklı yaklaşımıyla sektördeki yerini korumaktadır. 
                  Firmamızın deneyimi, pek çok başarılı projeye imza atmasını sağlamıştır.
                </p>
                <p>
                  Bu projeler arasında konut siteleri, alışveriş merkezleri ve ofis binaları 
                  yer almaktadır. Müşterilerine güvenilir ve kaliteli hizmet sunma misyonuyla, 
                  inşaat sektöründe lider bir firma olarak büyüme ve gelişme vizyonunu 
                  benimser.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=800&fit=crop"
                alt="Modern inşaat projesi"
                className="rounded-lg shadow-lg max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ofisimiz Section */}
      <section id="ofisimiz" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl text-gray-900 mb-4">Ofisimiz</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Modern ve konforlu ofis alanımızda müşterilerimize en iyi hizmeti sunmak için çalışıyoruz.
            </p>
          </div>
          
          {/* Adres ve Harita */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="text-2xl mb-6 text-gray-900">Adres Bilgileri</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Merkez Ofis</h4>
                  <p className="text-gray-700">
                    Bilir İnşaat Merkez Ofisi<br />
                    Trakya Bölgesi<br />
                    Edirne, Türkiye
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">İletişim</h4>
                  <p className="text-gray-700">
                    Telefon: +90 (284) XXX XX XX<br />
                    E-posta: info@bilirinşaat.com<br />
                    Çalışma Saatleri: 08:00 - 18:00
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Ulaşım</h4>
                  <p className="text-gray-700">
                    • Şehir merkezine 5 dakika<br />
                    • Toplu taşıma ile kolay erişim<br />
                    • Otopark imkanı mevcut
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <h3 className="text-xl mb-4 text-gray-900">Konum</h3>
              <div className="w-full h-80 bg-gray-200 rounded-lg overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048.4555!2d26.555664!3d41.677177!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDQwJzM3LjgiTiAyNsKwMzMnMjAuNCJF!5e0!3m2!1str!2str!4v1642678901234!5m2!1str!2str"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Bilir İnşaat Ofis Konumu"
                ></iframe>
              </div>
            </div>
          </div>
          
          {/* Ofis Fotoğrafları */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop"
                alt="Ofis dış görünüm"
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg text-center">Ofis Dış Görünüm</h3>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop"
                alt="Ofis iç mekan"
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg text-center">Ofis İç Mekan</h3>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1554473675-d0397389e0d8?w=400&h=300&fit=crop"
                alt="Çalışma ortamı"
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg text-center">Çalışma Ortamı</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Faaliyet Alanları Section */}
      <section id="faaliyet-alanlari" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl text-gray-900 mb-4">Faaliyet Alanları</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Bilir İnşaat, inşaat sektöründe geniş bir yelpazede hizmet sunmaktadır.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="bg-gray-800 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Home className="w-8 h-8" />
              </div>
              <h3 className="text-xl mb-4">Konut İnşaatı</h3>
              <p className="text-gray-600">
                Modern yaşam alanları oluşturma amacıyla çeşitli konut projeleri geliştirmektedir.
              </p>
            </div>
            
            <div className="text-center p-8 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="bg-gray-800 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building className="w-8 h-8" />
              </div>
              <h3 className="text-xl mb-4">Ticari Alanlar</h3>
              <p className="text-gray-600">
                İş yeri ve ticari alanların inşaatı ve yönetimi üzerine projeler gerçekleştirmektedir.
              </p>
            </div>
            
            <div className="text-center p-8 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="bg-gray-800 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl mb-4">Emlak Danışmanlığı</h3>
              <p className="text-gray-600">
                Müşterilere emlak alım, satım ve kiralama süreçlerinde danışmanlık hizmetleri sunmaktadır.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Misyon & Vizyon Section */}
      <section id="misyon-vizyon" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Misyon */}
            <div>
              <h2 className="text-3xl mb-8">Misyon</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-white/10 p-3 rounded-full mt-1">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-3">Müşteri Memnuniyeti</h3>
                    <p className="text-gray-300">
                      Müşterilere en yüksek kalite standartlarında inşaat ve emlak hizmetleri sunmak. 
                      Müşteri beklentilerini en iyi şekilde karşılamak için sürekli geri bildirim 
                      toplamak ve geliştirmek.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-white/10 p-3 rounded-full mt-1">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-3">Kaliteli ve Güvenilir Yapılar</h3>
                    <p className="text-gray-300">
                      Dayanıklı, estetik ve güvenli yapılar inşa ederek, yaşam alanlarının kalitesini 
                      artırmak. Her projede yüksek kalitede malzemeler ve işçilik kullanmak.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-white/10 p-3 rounded-full mt-1">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-3">Sürdürülebilirlik</h3>
                    <p className="text-gray-300">
                      Çevreye duyarlı inşaat yöntemleri kullanarak, doğanın korunmasına katkıda bulunmak. 
                      Enerji verimliliği yüksek, ekolojik açıdan sürdürülebilir projeler geliştirmek.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vizyon */}
            <div>
              <h2 className="text-3xl mb-8">Vizyon</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl mb-3">• Sektör Liderliği</h3>
                  <p className="text-gray-300 mb-4">
                    İnşaat sektöründe Türkiye'nin en saygın ve tercih edilen firmalarından biri olmak. 
                    Hem yerel hem de ulusal düzeyde liderlik pozisyonu elde etmek.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl mb-3">• İnovasyon ve Gelişim</h3>
                  <p className="text-gray-300 mb-4">
                    Sürekli olarak yeniliklere açık bir yaklaşım benimseyerek, teknolojik gelişmeleri 
                    takip etmek ve uygulamak. Yaratıcı çözümler sunarak sektörde fark yaratmak.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl mb-3">• Uzun Süreli İlişkiler</h3>
                  <p className="text-gray-300 mb-4">
                    Müşteriler, tedarikçiler ve iş ortakları ile kalıcı ve sağlam ilişkiler kurmak. 
                    Güvenilir bir iş ortağı olarak sektörde tanınmak.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl mb-3">• Topluma Katkı</h3>
                  <p className="text-gray-300">
                    Faaliyet gösterdiği bölgelerde sosyal sorumluluk projelerine destek vererek, 
                    topluma katkıda bulunmak ve yerel kalkınmaya yardımcı olmak.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-lg mb-2">BİLİR İNŞAAT</h3>
              <p className="text-gray-300 text-sm">
                Kurucular: Nurettin Bilir & Sefer Kalkan<br />
                40 yıllık deneyim - Trakya Bölgesi
              </p>
            </div>
            <div>
              <p className="text-gray-300 text-sm">
                &copy; 2024 Bilir İnşaat. Tüm hakları saklıdır.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}