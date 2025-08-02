-- Tüm tabloları listele
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- ==========================================
-- PROJELER TABLOSU
-- ==========================================
SELECT * FROM projects;

-- ==========================================
-- SLİDER TABLOSU  
-- ==========================================
SELECT * FROM sliders;

-- ==========================================
-- SİTE İÇERİKLERİ
-- ==========================================
SELECT * FROM site_content;

-- ==========================================
-- ZİYARETÇİ VERİLERİ
-- ==========================================
SELECT * FROM visits;

-- ==========================================
-- WHATSAPP TIKLAMALARI
-- ==========================================
SELECT * FROM whatsapp_clicks;

-- ==========================================
-- SİTE AYARLARI
-- ==========================================
SELECT * FROM site_settings; 