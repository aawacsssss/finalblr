import { supabase } from './supabaseClient';

export interface WhatsAppClick {
  id?: number;
  page_url: string;
  button_location: 'footer' | 'floating' | 'project_detail' | 'header';
  project_id?: number;
  project_title?: string;
  user_agent?: string;
  ip_address?: string;
  referrer?: string;
  clicked_at?: string;
  created_at?: string;
}

export interface WhatsAppStats {
  total_clicks: number;
  today_clicks: number;
  this_week_clicks: number;
  this_month_clicks: number;
  by_location: {
    footer: number;
    floating: number;
    project_detail: number;
    header: number;
  };
  by_project: Array<{
    project_id: number;
    project_title: string;
    clicks: number;
  }>;
  daily_stats: Array<{
    date: string;
    clicks: number;
  }>;
}

class WhatsAppService {
  // WhatsApp tıklamasını kaydet
  async recordClick(clickData: Omit<WhatsAppClick, 'id' | 'clicked_at' | 'created_at'>): Promise<void> {
    try {
      const { error } = await supabase
        .from('whatsapp_clicks')
        .insert({
          page_url: clickData.page_url,
          button_location: clickData.button_location,
          project_id: clickData.project_id || null,
          project_title: clickData.project_title || null,
          user_agent: clickData.user_agent || navigator.userAgent,
          ip_address: clickData.ip_address || 'unknown',
          referrer: clickData.referrer || document.referrer,
        });

      if (error) {
        console.error('WhatsApp click kaydetme hatası:', error);
        // Tablo yoksa sessizce geç
        if (error.code === '42P01') {
          console.log('whatsapp_clicks tablosu mevcut değil, kayıt atlanıyor');
          return;
        }
      }
    } catch (error) {
      console.error('WhatsApp click kaydetme hatası:', error);
      // Tablo yoksa sessizce geç
      if (error instanceof Error && error.message.includes('does not exist')) {
        console.log('whatsapp_clicks tablosu mevcut değil, kayıt atlanıyor');
        return;
      }
    }
  }

  // İstatistikleri getir
  async getStats(): Promise<WhatsAppStats> {
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // Tablo yoksa boş istatistikler döndür
      try {
        // Toplam tıklamalar
        const { data: totalClicks, count: totalCount, error: totalError } = await supabase
          .from('whatsapp_clicks')
          .select('*', { count: 'exact', head: true });

        if (totalError) {
          console.error('Toplam tıklama sayısı alınamadı:', totalError);
        }

        // Bugünkü tıklamalar
        const { data: todayClicks, count: todayCount, error: todayError } = await supabase
          .from('whatsapp_clicks')
          .select('*', { count: 'exact', head: true })
          .gte('clicked_at', today.toISOString());

        if (todayError) {
          console.error('Bugünkü tıklama sayısı alınamadı:', todayError);
        }

        // Lokasyona göre tıklamalar (bugün)
        const { data: locationStats, error: locationError } = await supabase
          .from('whatsapp_clicks')
          .select('button_location')
          .gte('clicked_at', today.toISOString());

        if (locationError) {
          console.error('Lokasyon istatistikleri alınamadı:', locationError);
        }

        // Projeye göre tıklamalar (bugün)
        const { data: projectStats, error: projectError } = await supabase
          .from('whatsapp_clicks')
          .select('project_id, project_title')
          .not('project_id', 'is', null)
          .gte('clicked_at', today.toISOString());

        if (projectError) {
          console.error('Proje istatistikleri alınamadı:', projectError);
        }

        // Lokasyon istatistiklerini hesapla
        const byLocation = {
          footer: 0,
          floating: 0,
          project_detail: 0,
          header: 0
        };

        locationStats?.forEach(click => {
          if (click.button_location in byLocation) {
            byLocation[click.button_location as keyof typeof byLocation]++;
          }
        });

        // Proje istatistiklerini hesapla
        const projectCounts: { [key: number]: { title: string; clicks: number } } = {};
        projectStats?.forEach(click => {
          if (click.project_id) {
            if (!projectCounts[click.project_id]) {
              projectCounts[click.project_id] = {
                title: click.project_title || 'Bilinmeyen Proje',
                clicks: 0
              };
            }
            projectCounts[click.project_id].clicks++;
          }
        });

        const byProject = Object.entries(projectCounts).map(([id, data]) => ({
          project_id: parseInt(id),
          project_title: data.title,
          clicks: data.clicks
        }));

        return {
          total_clicks: totalCount || 0,
          today_clicks: todayCount || 0,
          this_week_clicks: todayCount || 0, // Şimdilik bugünkü sayıyı kullan
          this_month_clicks: todayCount || 0, // Şimdilik bugünkü sayıyı kullan
          by_location: byLocation,
          by_project: byProject,
          daily_stats: [] // Şimdilik boş
        };
      } catch (error) {
        console.error('WhatsApp istatistikleri getirme hatası:', error);
        // Tablo yoksa boş istatistikler döndür
        if (error instanceof Error && error.message.includes('does not exist')) {
          console.log('whatsapp_clicks tablosu mevcut değil, boş istatistikler döndürülüyor');
        }
        return {
          total_clicks: 0,
          today_clicks: 0,
          this_week_clicks: 0,
          this_month_clicks: 0,
          by_location: { footer: 0, floating: 0, project_detail: 0, header: 0 },
          by_project: [],
          daily_stats: []
        };
      }
    } catch (error) {
      console.error('WhatsApp istatistikleri getirme hatası:', error);
      return {
        total_clicks: 0,
        today_clicks: 0,
        this_week_clicks: 0,
        this_month_clicks: 0,
        by_location: { footer: 0, floating: 0, project_detail: 0, header: 0 },
        by_project: [],
        daily_stats: []
      };
    }
  }

  // WhatsApp linki oluştur
  createWhatsAppLink(phoneNumber: string, message: string): string {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  }

  // WhatsApp tıklamasını kaydet ve linki aç
  async handleWhatsAppClick(
    phoneNumber: string,
    message: string,
    location: WhatsAppClick['button_location'],
    projectId?: number,
    projectTitle?: string
  ): Promise<void> {
    // Tıklamayı kaydet
    await this.recordClick({
      page_url: window.location.href,
      button_location: location,
      project_id: projectId,
      project_title: projectTitle,
    });

    // WhatsApp linkini aç
    const whatsappLink = this.createWhatsAppLink(phoneNumber, message);
    window.open(whatsappLink, '_blank');
  }
}

export const whatsappService = new WhatsAppService(); 