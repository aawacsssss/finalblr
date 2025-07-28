-- Supabase'e office_video_url kolonu ekleme SQL'i

-- site_settings tablosuna office_video_url kolonu ekle
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS office_video_url TEXT;

-- Mevcut kayıtları kontrol et ve güncelle
UPDATE site_settings 
SET office_video_url = 'https://www.youtube.com/embed/2RJ3vuL0L2Q' 
WHERE id = 1 AND office_video_url IS NULL;

-- RLS politikalarını güncelle (eğer varsa)
-- Bu kısım Supabase projenizin ayarlarına göre değişebilir 