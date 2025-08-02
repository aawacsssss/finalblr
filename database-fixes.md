# 🔧 VERİTABANI DÜZELTME PLANI

## 1. 🚨 Interface Düzeltmeleri

### A) Project Interface'i Düzelt:
```typescript
export interface Project {
  id?: number;
  title: string;
  description?: string;
  status: 'baslayan' | 'devam' | 'bitmis';
  images?: string[];
  technical_info?: any;
  features?: string[];
  video?: string;
  map_embed_url?: string;
  created_at?: string;
  // Kaldır: location, social_facilities, catalog
}
```

### B) Slider Interface'i Düzelt:
```typescript
export interface Slider {
  id?: number;
  title?: string;
  image: string;
  link?: string;
  order_index?: number;
  created_at?: string;
  // Kaldır: status
}
```

### C) Visit Interface'i Düzelt:
```typescript
export interface Visit {
  id?: number;
  date: string;
  title?: string;      // Ekle
  content?: string;    // Ekle
  slug?: string;       // Ekle
  count: number;
  created_at?: string; // Ekle
}
```

## 2. 🚨 Eksik CRUD Servisleri Ekle

### A) contact_messages Service:
```typescript
export const contactMessageService = {
  async getAll(): Promise<ContactMessage[]>,
  async getById(id: number): Promise<ContactMessage | null>,
  async create(message: ContactMessage): Promise<ContactMessage | null>,
  async update(id: number, message: Partial<ContactMessage>): Promise<ContactMessage | null>,
  async delete(id: number): Promise<void>
}
```

### B) whatsapp_clicks Service:
```typescript
export const whatsappClickService = {
  async getAll(): Promise<WhatsAppClick[]>,
  async delete(id: number): Promise<void>
}
```

## 3. 🚨 Admin Panel Eksiklikleri

### A) contact_messages Yönetimi Ekle
### B) whatsapp_clicks Yönetimi Ekle
### C) visits Tablosu Düzelt

## 4. 🚨 Veritabanı Schema Düzeltmeleri

### A) site_settings'e office_video_url Ekle
### B) visits Tablosu Yapısını Düzelt
### C) Gereksiz Alanları Kaldır 