-- ==========================================
-- VERİTABANI SORUNLARINI DÜZELTME
-- ==========================================

-- 1. SITE_CONTENT TABLOSUNDAKİ MARKA İSİMLERİNİ DÜZELT
UPDATE site_content 
SET title = 'BLR İnşaat', 
    content = 'Kaliteli ve güvenilir inşaat hizmetleri'
WHERE id = 20;

UPDATE site_content 
SET content = 'Adres: REŞADİYE MAHALLESİ ATATÜRK BULVARI CADDESİ NO:48/D ÇORLU/TEKİRDAĞ BLR İNŞAAT
Telefon: 0533 368 1965
E-posta: iletisim@blrinsaat.com'
WHERE id = 21;

-- 2. TEST VERİLERİNİ TEMİZLE
DELETE FROM visits WHERE title LIKE '%Blog%' OR title LIKE '%İçerik%';

DELETE FROM contact_messages WHERE name = 'deneme' OR email = 'denem@gmail.com';

-- 3. BOŞ PROJEYİ SİL
DELETE FROM projects WHERE title = 'BOŞ PROJE ÖRNEK';

-- 4. SITE_CONTENT'TEK TEST RESİMLERİNİ TEMİZLE
UPDATE site_content 
SET images = '[]' 
WHERE images LIKE '%unsplash%' OR images LIKE '%test%';

-- 5. WHATSAPP_CLICKS TABLOSUNU KONTROL ET
-- (Bu tablo boş olabilir, normal)

-- 6. SLIDERS TABLOSUNU KONTROL ET
-- (3 kayıt var, normal)

-- 7. SITE_SETTINGS TABLOSUNU KONTROL ET
-- (1 kayıt var, normal) 