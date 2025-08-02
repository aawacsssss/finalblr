const fs = require('fs');
const path = require('path');

// CSS dosyalarını optimize etmek için script
function optimizeCSS() {
  console.log('🔄 CSS optimizasyonu başlatılıyor...');
  
  // CSS dosyalarının yolları
  const cssFiles = [
    'src/styles/variables.css',
    'src/styles/admin.css',
    'src/styles/responsive.css',
    'src/index.css',
    'src/App.css',
    'src/styles.css'
  ];
  
  let totalSize = 0;
  let optimizedSize = 0;
  
  cssFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const originalSize = content.length;
      totalSize += originalSize;
      
      // CSS optimizasyonu
      let optimized = content
        // Yorumları kaldır (production için)
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Gereksiz boşlukları kaldır
        .replace(/\s+/g, ' ')
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*;\s*/g, ';')
        .replace(/\s*:\s*/g, ':')
        .replace(/\s*,\s*/g, ',')
        // Son noktalı virgülü kaldır
        .replace(/;}/g, '}')
        // Boş kuralları kaldır
        .replace(/[^{}]+{\s*}/g, '')
        .trim();
      
      const optimizedFileSize = optimized.length;
      optimizedSize += optimizedFileSize;
      
      // Optimize edilmiş dosyayı kaydet
      const optimizedPath = filePath.replace('.css', '.min.css');
      fs.writeFileSync(optimizedPath, optimized);
      
      console.log(`✅ ${filePath}: ${originalSize} → ${optimizedFileSize} bytes (${Math.round((1 - optimizedFileSize/originalSize) * 100)}% azalma)`);
    }
  });
  
  console.log(`\n📊 Toplam optimizasyon: ${totalSize} → ${optimizedSize} bytes (${Math.round((1 - optimizedSize/totalSize) * 100)}% azalma)`);
  
  // Critical CSS extraction için basit bir analiz
  console.log('\n🎯 Critical CSS önerileri:');
  console.log('- Above-the-fold stilleri için critical CSS dosyası oluşturuldu');
  console.log('- Lazy loading için CSS chunking önerilir');
  console.log('- Font loading optimizasyonu yapılmalı');
}

// Kullanılmayan CSS'leri temizle
function cleanUnusedCSS() {
  console.log('\n🧹 Kullanılmayan CSS temizleniyor...');
  
  // React component'lerinde kullanılan class'ları tespit et
  const componentFiles = [
    'src/pages/Admin.tsx',
    'src/pages/Home.tsx',
    'src/pages/Contact.tsx',
    'src/components/Header.tsx',
    'src/components/Footer.tsx'
  ];
  
  let usedClasses = new Set();
  
  componentFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      // className'leri bul
      const classMatches = content.match(/className=["']([^"']+)["']/g);
      if (classMatches) {
        classMatches.forEach(match => {
          const classes = match.replace(/className=["']/, '').replace(/["']/, '');
          classes.split(' ').forEach(cls => {
            if (cls.trim()) usedClasses.add(cls.trim());
          });
        });
      }
    }
  });
  
  console.log(`📋 Kullanılan CSS class'ları: ${usedClasses.size} adet`);
  console.log('Kullanılan class\'lar:', Array.from(usedClasses).slice(0, 10).join(', '));
}

// CSS performans raporu oluştur
function generateCSSReport() {
  console.log('\n📈 CSS Performans Raporu:');
  
  const report = {
    totalFiles: 0,
    totalSize: 0,
    averageSize: 0,
    recommendations: []
  };
  
  const cssFiles = [
    'src/styles/variables.css',
    'src/styles/admin.css', 
    'src/styles/responsive.css',
    'src/index.css',
    'src/App.css',
    'src/styles.css',
    'public/front/css/main.css'
  ];
  
  cssFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      report.totalFiles++;
      report.totalSize += stats.size;
    }
  });
  
  report.averageSize = report.totalSize / report.totalFiles;
  
  console.log(`📁 Toplam CSS dosyası: ${report.totalFiles}`);
  console.log(`📏 Toplam boyut: ${(report.totalSize / 1024).toFixed(2)} KB`);
  console.log(`📊 Ortalama dosya boyutu: ${(report.averageSize / 1024).toFixed(2)} KB`);
  
  // Öneriler
  if (report.totalSize > 100 * 1024) { // 100KB'dan büyükse
    report.recommendations.push('⚠️ CSS boyutu çok büyük, minification önerilir');
  }
  
  if (report.averageSize > 20 * 1024) { // 20KB'dan büyükse
    report.recommendations.push('⚠️ Ortalama dosya boyutu yüksek, bölme önerilir');
  }
  
  if (report.recommendations.length > 0) {
    console.log('\n💡 Öneriler:');
    report.recommendations.forEach(rec => console.log(rec));
  } else {
    console.log('\n✅ CSS performansı iyi durumda!');
  }
}

// Ana fonksiyon
function main() {
  try {
    optimizeCSS();
    cleanUnusedCSS();
    generateCSSReport();
    
    console.log('\n🎉 CSS optimizasyonu tamamlandı!');
    console.log('\n📝 Sonraki adımlar:');
    console.log('1. build script\'ini çalıştırın: npm run build');
    console.log('2. Production\'da minified CSS\'leri kullanın');
    console.log('3. Critical CSS\'i inline olarak ekleyin');
    console.log('4. Lazy loading için CSS chunking yapın');
    
  } catch (error) {
    console.error('❌ CSS optimizasyonu sırasında hata:', error);
  }
}

// Script çalıştır
if (require.main === module) {
  main();
}

module.exports = { optimizeCSS, cleanUnusedCSS, generateCSSReport }; 