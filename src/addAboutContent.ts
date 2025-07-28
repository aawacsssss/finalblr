import { siteContentService } from './services/supabaseService';

async function run() {
  await siteContentService.create({
    page_name: 'about',
    section_name: 'main_image',
    title: 'Ana Görsel',
    content: '',
    order_index: 1,
    images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80']
  });
  await siteContentService.create({
    page_name: 'about',
    section_name: 'office',
    title: 'Merkez Ofisimiz',
    content: 'Ofisimizden kareler',
    order_index: 2,
    images: [
      'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520880867055-1e30d1cb001c?auto=format&fit=crop&w=800&q=80'
    ]
  });
  console.log('About içerikleri başarıyla eklendi!');
}

run().catch(console.error); 