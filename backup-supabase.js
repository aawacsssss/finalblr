const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase bağlantı bilgileri
const supabaseUrl = 'https://ppsebgfdytsdhwuhoqaq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwc2ViZ2ZkeXRzZGh3dWhvcWFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3ODUxMDUsImV4cCI6MjA2ODM2MTEwNX0.0UxavI_Bo1y_CuD90PKxPiJBkmh7Une1SgzJyVw4Qi4';

const supabase = createClient(supabaseUrl, supabaseKey);

// Yedekleme klasörü
const backupDir = './supabase-backup';
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

async function backupTable(tableName) {
  try {
    console.log(`📥 ${tableName} tablosu indiriliyor...`);
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*');
    
    if (error) {
      console.error(`❌ ${tableName} hatası:`, error);
      return;
    }
    
    const fileName = `${tableName}-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    const filePath = path.join(backupDir, fileName);
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`✅ ${tableName}: ${data.length} kayıt indirildi -> ${fileName}`);
    
  } catch (err) {
    console.error(`❌ ${tableName} genel hata:`, err);
  }
}

async function backupAllTables() {
  console.log('🚀 Supabase veritabanı yedekleme başlıyor...\n');
  
  const tables = [
    'projects',
    'sliders', 
    'site_content',
    'visits',
    'whatsapp_clicks',
    'site_settings'
  ];
  
  for (const table of tables) {
    await backupTable(table);
  }
  
  console.log('\n🎉 Yedekleme tamamlandı!');
  console.log(`📁 Yedekler: ${backupDir} klasöründe`);
}

// Yedeklemeyi başlat
backupAllTables().catch(console.error); 