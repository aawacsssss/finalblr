import { supabase } from './supabaseClient';

// Proje tipleri
export interface Project {
  id?: number;
  title: string;
  description?: string;
  status: 'baslayan' | 'devam' | 'bitmis';
  images?: string[];
  technical_info?: any;
  location?: {
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    map_embed_url?: string;
  };
  map_embed_url?: string; // Google Maps iframe URL'si
  created_at?: string;
  features?: string[];
  social_facilities?: string[];
  catalog?: string; // opsiyonel katalog linki
  video?: string; // opsiyonel video linki
}

// Slider tipi
export interface Slider {
  id?: number;
  title?: string;
  image: string;
  link?: string;
  order_index?: number;
  status?: 'baslayan' | 'devam' | 'bitmis';
  created_at?: string;
}

// Site içerik tipi
export interface SiteContent {
  id?: number;
  page_name: string;
  section_name?: string;
  title?: string;
  content?: string;
  images?: string[];
  order_index?: number;
  created_at?: string;
}

// Günlük ziyaretçi istatistiği için interface ve fonksiyonlar ekliyorum:
export interface Visit {
  id?: number;
  date: string; // YYYY-MM-DD
  count: number;
}

// Proje servisleri
export const projectService = {
  // Tüm projeleri getir
  async getAll(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Duruma göre projeleri getir
  async getByStatus(status: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Tek proje getir
  async getById(id: number): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  // Proje ekle
  async create(project: Project): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select('*')
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  // Proje güncelle
  async update(id: number, project: Partial<Project>): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', id)
      .select('*')
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  // Proje sil
  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Slider servisleri
export const sliderService = {
  // Tüm sliderları getir
  async getAll(): Promise<Slider[]> {
    const { data, error } = await supabase
      .from('sliders')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  // Slider ekle
  async create(slider: Slider): Promise<Slider | null> {
    const { data, error } = await supabase
      .from('sliders')
      .insert([slider])
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  // Slider güncelle
  async update(id: number, slider: Partial<Slider>): Promise<Slider | null> {
    const { data, error } = await supabase
      .from('sliders')
      .update(slider)
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  // Slider sil
  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('sliders')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Site içerik servisleri
export const siteContentService = {
  // Sayfa içeriklerini getir
  async getByPage(pageName: string): Promise<SiteContent[]> {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('page_name', pageName)
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  // İçerik güncelle
  async update(id: number, content: Partial<SiteContent>) {
    console.log('siteContentService.update çağrıldı:', { id, content });
    const { data, error } = await supabase
      .from('site_content')
      .update(content)
      .eq('id', id)
      .select();
    if (error) {
      console.error('siteContentService.update hatası:', error);
      throw error;
    }
    console.log('siteContentService.update başarılı:', data);
    return data;
  },
  async create(content: SiteContent) {
    const { error } = await supabase
      .from('site_content')
      .insert([content]);
    if (error) throw error;
  },

  // Tüm site içeriklerini getir (page_name ve order_index'e göre sıralı)
  async getAll(): Promise<SiteContent[]> {
    console.log('siteContentService.getAll çağrıldı');
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .order('page_name', { ascending: true })
      .order('order_index', { ascending: true });
    if (error) {
      console.error('siteContentService.getAll hatası:', error);
      throw error;
    }
    console.log('siteContentService.getAll başarılı, veri sayısı:', data?.length || 0);
    console.log('siteContentService.getAll veriler:', data);
    return data || [];
  },
};

// Bölge Koordinatörü içeriği için özel fonksiyonlar
export const coordinatorContentService = {
  async get(): Promise<SiteContent | null> {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('page_name', 'about')
      .eq('section_name', 'coordinator')
      .maybeSingle();
    if (error) throw error;
    return data;
  },
  async update(id: number, content: Partial<SiteContent>) {
    const { error } = await supabase
      .from('site_content')
      .update(content)
      .eq('id', id);
    if (error) throw error;
  }
};

// Supabase Storage'a birden fazla dosya yükle ve public URL listesini döndür
export async function uploadProjectImages(files: File[]): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    // Dosya adını normalize et (Türkçe ve özel karakterleri sadeleştir)
    const safeName = file.name
      .replace(/[ÇŞİÖÜĞçşıöüğ ]/g, '_')
      .replace(/[^a-zA-Z0-9_.-]/g, '_');
    const filePath = `projects/${Date.now()}_${safeName}`;
    const { error } = await supabase.storage.from('project-images').upload(filePath, file);
    if (error) throw error;
    const { data } = supabase.storage.from('project-images').getPublicUrl(filePath);
    urls.push(data.publicUrl);
  }
  return urls;
} 

export const visitService = {
  async getTodayVisits(): Promise<number> {
    const today = new Date().toISOString().slice(0, 10);
    const { data } = await supabase
      .from('visits')
      .select('count')
      .eq('date', today)
      .single();
    return data?.count || 0;
  },
  async incrementVisit(): Promise<void> {
    const today = new Date().toISOString().slice(0, 10);
    const { data } = await supabase
      .from('visits')
      .select('*')
      .eq('date', today)
      .single();
    if (data) {
      await supabase
        .from('visits')
        .update({ count: data.count + 1 })
        .eq('id', data.id);
    } else {
      await supabase
        .from('visits')
        .insert([{ date: today, count: 1 }]);
    }
  },
  async getVisitsByRange(start: string, end: string): Promise<Visit[]> {
    const { data } = await supabase
      .from('visits')
      .select('*')
      .gte('date', start)
      .lte('date', end)
      .order('date', { ascending: true });
    return data || [];
  }
}; 

// Misyon içeriğini güncelleyen yardımcı fonksiyon (geçici script)
export async function updateAboutMissionContent() {
  const newContent = `- *Müşteri Memnuniyeti:* Müşterilere en yüksek kalite standartlarında inşaat ve emlak hizmetleri sunmak. Müşteri beklentilerini en iyi şekilde karşılamak için sürekli geri bildirim toplamak ve geliştirmek.
  
- *Kaliteli ve Güvenilir Yapılar:* 
Dayanıklı, estetik ve güvenli yapılar inşa ederek, yaşam alanlarının kalitesini artırmak. Her projede yüksek kalitede malzemeler ve işçilik kullanmak.

- *Sürdürülebilirlik:* Çevreye duyarlı inşaat yöntemleri kullanarak, doğanın korunmasına katkıda bulunmak. Enerji verimliliği yüksek, ekolojik açıdan sürdürülebilir projeler geliştirmek.`;
  const { data, error } = await supabase
    .from('site_content')
    .update({ content: newContent })
    .eq('page_name', 'about')
    .eq('section_name', 'mission');
  if (error) throw error;
  return data;
} 

// Son aktiviteler için birleşik fonksiyon
export async function getRecentActivities() {
  // Projeler
  const { data: projects } = await supabase
    .from('projects')
    .select('id, title, created_at')
    .order('created_at', { ascending: false })
    .limit(5);
  // Sliderlar
  const { data: sliders } = await supabase
    .from('sliders')
    .select('id, title, created_at')
    .order('created_at', { ascending: false })
    .limit(5);
  // İçerikler
  const { data: contents } = await supabase
    .from('site_content')
    .select('id, title, created_at')
    .order('created_at', { ascending: false })
    .limit(5);
  // Hepsini tek diziye topla, type ekle
  const activities = [
    ...(projects || []).map(a => ({ ...a, type: 'project' })),
    ...(sliders || []).map(a => ({ ...a, type: 'slider' })),
    ...(contents || []).map(a => ({ ...a, type: 'content' })),
  ];
  // Tarihe göre sırala (en yeni en başta)
  activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  // Son 8 aktiviteyi döndür
  return activities.slice(0, 8);
} 