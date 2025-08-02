-- Sliders tablosuna project_id sütunu ekle
ALTER TABLE sliders ADD COLUMN IF NOT EXISTS project_id INTEGER;

-- Mevcut slider'ların link'lerinden proje ID'lerini çıkar ve project_id sütununa ekle
UPDATE sliders 
SET project_id = CAST(
  REGEXP_REPLACE(link, '.*\/proje\/(\d+).*', '\1') AS INTEGER
) 
WHERE link LIKE '%/proje/%' 
AND project_id IS NULL;

-- Sliders tablosuna foreign key constraint ekle (opsiyonel)
-- ALTER TABLE sliders ADD CONSTRAINT fk_sliders_project_id 
-- FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL; 