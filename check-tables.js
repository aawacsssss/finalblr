const { createClient } = require('@supabase/supabase-js');

// Supabase bağlantı bilgileri
const supabaseUrl = 'https://ppsebgfdytsdhwuhoqaq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwc2ViZ2ZkeXRzZGh3dWhvcWFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3ODUxMDUsImV4cCI6MjA2ODM2MTEwNX0.0UxavI_Bo1y_CuD90PKxPiJBkmh7Une1SgzJyVw4Qi4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log('🔍 Supabase tabloları kontrol ediliyor...\n');
  
  const tables = [
    'projects',
    'sliders', 
    'site_content',
    'visits',
    'whatsapp_clicks',
    'site_settings'
  ];
  
  for (const table of tables) {
    try {
      console.log(`📋 ${table} tablosu kontrol ediliyor...`);
      
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1); // Sadece 1 kayıt al
      
      if (error) {
        console.log(`❌ ${table} tablosu bulunamadı veya erişim hatası:`, error.message);
      } else {
        console.log(`✅ ${table} tablosu mevcut`);
        
        // Toplam kayıt sayısını al
        const { count, error: countError } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (countError) {
          console.log(`   📊 Kayıt sayısı alınamadı: ${countError.message}`);
        } else {
          console.log(`   📊 Toplam kayıt: ${count}`);
        }
      }
      
    } catch (err) {
      console.log(`❌ ${table} genel hata:`, err.message);
    }
    
    console.log(''); // Boş satır
  }
  
  console.log('🏁 Tablo kontrolü tamamlandı!');
}

checkTables().catch(console.error); 