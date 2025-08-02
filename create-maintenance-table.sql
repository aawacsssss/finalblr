-- Bakım modu ayarları tablosu
CREATE TABLE IF NOT EXISTS maintenance_settings (
  id SERIAL PRIMARY KEY,
  is_maintenance_mode BOOLEAN DEFAULT FALSE,
  maintenance_title VARCHAR(255) DEFAULT 'BLR İNŞAAT - Bakım Modu',
  maintenance_message TEXT DEFAULT 'Sitemiz şu anda bakım modunda. Lütfen daha sonra tekrar deneyiniz.',
  maintenance_image VARCHAR(500),
  contact_phone VARCHAR(20) DEFAULT '0533 368 1965',
  contact_email VARCHAR(100) DEFAULT 'iletisim@blrinsaat.com',
  estimated_duration VARCHAR(50) DEFAULT '2-3 saat',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Varsayılan bakım ayarlarını ekle
INSERT INTO maintenance_settings (
  is_maintenance_mode,
  maintenance_title,
  maintenance_message,
  contact_phone,
  contact_email,
  estimated_duration
) VALUES (
  FALSE,
  'BLR İNŞAAT - Bakım Modu',
  'Sitemiz şu anda bakım modunda. Lütfen daha sonra tekrar deneyiniz. Acil durumlar için bizimle iletişime geçebilirsiniz.',
  '0533 368 1965',
  'iletisim@blrinsaat.com',
  '2-3 saat'
) ON CONFLICT DO NOTHING;

-- Tablo güncelleme trigger'ı
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_maintenance_settings_updated_at 
    BEFORE UPDATE ON maintenance_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 