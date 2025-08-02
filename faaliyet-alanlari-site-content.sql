-- Faaliyet Alanları Sayfası için Site Content Kayıtları
-- Bu SQL dosyasını Supabase SQL Editor'da çalıştırın

-- Ana giriş bölümü
INSERT INTO "public"."site_content" ("page_name", "section_name", "title", "content", "images", "order_index", "created_at") 
VALUES ('faaliyet-alanlari', 'intro', 'Faaliyet Alanları Giriş', 
'Bilir İnşaat, inşaat sektöründe geniş bir hizmet yelpazesiyle faaliyet göstermektedir. Şirketimiz; konut projeleri, villa yapıları, sanayi ve üretim tesisleri, yol yapım ve altyapı çalışmaları, kamu alanları taahhüt işleri ile hastane, otel ve alışveriş merkezleri gibi birçok farklı alanda projeler gerçekleştirmiştir.

Yüksek kalite standartları, mühendislik gücü ve yenilikçi yaklaşımıyla, bugüne kadar çeşitli ölçek ve kapsamda birçok projeye başarıyla imza atmıştır.', 
ARRAY['https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'], 
1, NOW());

-- Ana görsel
INSERT INTO "public"."site_content" ("page_name", "section_name", "title", "content", "images", "order_index", "created_at") 
VALUES ('faaliyet-alanlari', 'main_image', 'Ana Görsel', '', 
ARRAY['https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'], 
2, NOW());

-- Yenilikçi Yaklaşım
INSERT INTO "public"."site_content" ("page_name", "section_name", "title", "content", "images", "order_index", "created_at") 
VALUES ('faaliyet-alanlari', 'innovation', 'Yenilikçi Yaklaşım', 
'Sektördeki yenilikleri yakından takip eden firmamız, güncel inşaat yöntemleri ve ileri teknoloji uygulamaları ile projelerini daha verimli ve kaliteli şekilde hayata geçirmektedir.

Ayrıca çevre dostu malzemeler kullanarak sürdürülebilir yapılar inşa etmeye özen göstermekteyiz.', 
ARRAY[]::text[], 
3, NOW());

-- Yenilikçi Yaklaşım Görseli
INSERT INTO "public"."site_content" ("page_name", "section_name", "title", "content", "images", "order_index", "created_at") 
VALUES ('faaliyet-alanlari', 'innovation_image', 'Yenilikçi Yaklaşım Görseli', '', 
ARRAY['https://images.unsplash.com/photo-1554473675-d0397389e0d8?w=600&h=450&fit=crop'], 
4, NOW());

-- Gerçekleştirilen Projeler
INSERT INTO "public"."site_content" ("page_name", "section_name", "title", "content", "images", "order_index", "created_at") 
VALUES ('faaliyet-alanlari', 'completed_projects', 'Gerçekleştirilen Projeler', 
'Firmamızın sektördeki deneyimi sayesinde pek çok başarılı projeye imza atılmıştır. Bu projeler arasında:

• Konut siteleri
• Rezidans projeleri
• Villa yerleşkeleri
• Alışveriş merkezleri
• Ofis ve ticaret binaları

yer almaktadır.', 
ARRAY[]::text[], 
5, NOW());

-- Gerçekleştirilen Projeler Görseli
INSERT INTO "public"."site_content" ("page_name", "section_name", "title", "content", "images", "order_index", "created_at") 
VALUES ('faaliyet-alanlari', 'completed_projects_image', 'Gerçekleştirilen Projeler Görseli', '', 
ARRAY['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=450&fit=crop'], 
6, NOW());

-- Konut İnşaatları
INSERT INTO "public"."site_content" ("page_name", "section_name", "title", "content", "images", "order_index", "created_at") 
VALUES ('faaliyet-alanlari', 'residential', 'Konut İnşaatları', 
'Modern yaşam alanları oluşturma amacıyla çeşitli konut projeleri geliştirilmektedir. Farklı ölçeklerde konut yapılarıyla yaşam kalitesini artırmayı hedeflemekteyiz.', 
ARRAY[]::text[], 
7, NOW());

-- Konut İnşaatları Görseli
INSERT INTO "public"."site_content" ("page_name", "section_name", "title", "content", "images", "order_index", "created_at") 
VALUES ('faaliyet-alanlari', 'residential_image', 'Konut İnşaatları Görseli', '', 
ARRAY['https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'], 
8, NOW());

-- Villa Projeleri
INSERT INTO "public"."site_content" ("page_name", "section_name", "title", "content", "images", "order_index", "created_at") 
VALUES ('faaliyet-alanlari', 'villa', 'Villa Projeleri', 
'Estetik ve konforu ön planda tutan, özel tasarımlı villa projeleriyle üst segmentte yaşam alanları inşa ediyoruz.', 
ARRAY[]::text[], 
9, NOW());

-- Villa Projeleri Görseli
INSERT INTO "public"."site_content" ("page_name", "section_name", "title", "content", "images", "order_index", "created_at") 
VALUES ('faaliyet-alanlari', 'villa_image', 'Villa Projeleri Görseli', '', 
ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'], 
10, NOW());

-- Sanayi ve Üretim Tesisleri
INSERT INTO "public"."site_content" ("page_name", "section_name", "title", "content", "images", "order_index", "created_at") 
VALUES ('faaliyet-alanlari', 'industrial', 'Sanayi ve Üretim Tesisleri', 
'Fabrika, depo ve üretim tesisleri gibi endüstriyel yapılarda fonksiyonel ve verimli çözümler sunmaktayız.', 
ARRAY[]::text[], 
11, NOW());

-- Sanayi ve Üretim Tesisleri Görseli
INSERT INTO "public"."site_content" ("page_name", "section_name", "title", "content", "images", "order_index", "created_at") 
VALUES ('faaliyet-alanlari', 'industrial_image', 'Sanayi ve Üretim Tesisleri Görseli', '', 
ARRAY['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80'], 
12, NOW());

-- Yol ve Altyapı Taahhütleri
INSERT INTO "public"."site_content" ("page_name", "section_name", "title", "content", "images", "order_index", "created_at") 
VALUES ('faaliyet-alanlari', 'infrastructure', 'Yol ve Altyapı Taahhütleri', 
'Ulaşım projeleri kapsamında çeşitli yol yapımı ve altyapı çalışmalarında aktif rol üstlenmekteyiz.', 
ARRAY[]::text[], 
13, NOW());

-- Yol ve Altyapı Taahhütleri Görseli
INSERT INTO "public"."site_content" ("page_name", "section_name", "title", "content", "images", "order_index", "created_at") 
VALUES ('faaliyet-alanlari', 'infrastructure_image', 'Yol ve Altyapı Taahhütleri Görseli', '', 
ARRAY['https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'], 
14, NOW());

-- Kamu Alanları ve Resmi Taahhüt Projeleri
INSERT INTO "public"."site_content" ("page_name", "section_name", "title", "content", "images", "order_index", "created_at") 
VALUES ('faaliyet-alanlari', 'public', 'Kamu Alanları ve Resmi Taahhüt Projeleri', 
'Belediye, kamu kurumları ve devlet projeleri kapsamında açık alanlar, parklar, sosyal tesisler gibi kamusal yapılar inşa edilmektedir.', 
ARRAY[]::text[], 
15, NOW());

-- Kamu Alanları ve Resmi Taahhüt Projeleri Görseli
INSERT INTO "public"."site_content" ("page_name", "section_name", "title", "content", "images", "order_index", "created_at") 
VALUES ('faaliyet-alanlari', 'public_image', 'Kamu Alanları ve Resmi Taahhüt Projeleri Görseli', '', 
ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80'], 
16, NOW());

-- Hastane, Otel ve AVM Projeleri
INSERT INTO "public"."site_content" ("page_name", "section_name", "title", "content", "images", "order_index", "created_at") 
VALUES ('faaliyet-alanlari', 'healthcare_hospitality', 'Hastane, Otel ve AVM Projeleri', 
'Sağlık, turizm ve ticaret alanlarında; hastaneler, oteller ve alışveriş merkezleri gibi büyük ölçekli yapılar firmamızın uzmanlık alanlarındandır.', 
ARRAY[]::text[], 
17, NOW());

-- Hastane, Otel ve AVM Projeleri Görseli
INSERT INTO "public"."site_content" ("page_name", "section_name", "title", "content", "images", "order_index", "created_at") 
VALUES ('faaliyet-alanlari', 'healthcare_hospitality_image', 'Hastane, Otel ve AVM Projeleri Görseli', '', 
ARRAY['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'], 
18, NOW());

-- Ticari Yapılar
INSERT INTO "public"."site_content" ("page_name", "section_name", "title", "content", "images", "order_index", "created_at") 
VALUES ('faaliyet-alanlari', 'commercial', 'Ticari Yapılar', 
'Bilir İnşaat, iş yeri ve ticari alanların inşaatı ile yönetimi konusunda da faaliyet göstermektedir. Ofis binaları, dükkanlar ve iş merkezleri gibi projeler bu kapsamdadır.', 
ARRAY[]::text[], 
19, NOW());

-- Ticari Yapılar Görseli
INSERT INTO "public"."site_content" ("page_name", "section_name", "title", "content", "images", "order_index", "created_at") 
VALUES ('faaliyet-alanlari', 'commercial_image', 'Ticari Yapılar Görseli', '', 
ARRAY['https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=450&fit=crop'], 
20, NOW()); 