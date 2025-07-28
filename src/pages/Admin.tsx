import React, { useState, useEffect } from 'react';
import { projectService, sliderService, siteContentService, Project, Slider, SiteContent } from '../services/supabaseService';
import { uploadProjectImages } from '../services/supabaseService';
import { visitService, Visit } from '../services/supabaseService';
import { useTheme } from '@mui/material/styles';
import { supabase } from '../services/supabaseClient';
import { getRecentActivities } from '../services/supabaseService';
import { whatsappService, WhatsAppStats } from '../services/whatsappService';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
// Material UI
import { Box, Button, TextField, Typography, Paper, Alert, AppBar, Toolbar, Tabs, Tab, IconButton, Card, CardContent, CardActions, Select, MenuItem, InputLabel, FormControl, FormHelperText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Grid, CircularProgress } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ViewListIcon from '@mui/icons-material/ViewList';
import ImageIcon from '@mui/icons-material/Image';
import ArticleIcon from '@mui/icons-material/Article';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MessageIcon from '@mui/icons-material/Message';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Avatar from '@mui/material/Avatar';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Menu from '@mui/material/Menu';
import Badge from '@mui/material/Badge';
import BarChartIcon from '@mui/icons-material/BarChart';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
// Modern ikon importları:
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import TooltipMUI from '@mui/material/Tooltip';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useAuth } from '../contexts/AuthContext';

// Animasyonlu sayaç için yardımcı fonksiyon
type AnimatedCountTarget = number;
function useAnimatedCount(target: AnimatedCountTarget, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const interval = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(interval);
  }, [target, duration]);
  return count;
}

// Dark mode toggle
const DarkModeSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#fff',
    '& + .MuiSwitch-track': {
      backgroundColor: '#232526',
    },
  },
  '& .MuiSwitch-track': {
    backgroundColor: '#1e88e5',
  },
}));

// Görsel sıralama için yardımcı fonksiyon
function moveArrayItem<T>(arr: T[], from: number, to: number): T[] {
  const newArr = [...arr];
  const item = newArr.splice(from, 1)[0];
  newArr.splice(to, 0, item);
  return newArr;
}

// Renk ve font teması
const MODERN_COLORS = {
  primary: '#1a2236',
  accent: '#e6d09c',
  bg: '#f7f7fa',
  card: '#fff',
  shadow: '0 4px 32px #0002',
  sidebar: 'linear-gradient(180deg,#232526 80%,#e6d09c 120%)',
  sidebarDark: 'linear-gradient(180deg,#232526 80%,#1a2236 120%)',
};
const MODERN_FONT = 'Montserrat, Poppins, Arial, sans-serif';

function Admin() {
  const { user: authUser, signIn, signOut, loading: authLoading } = useAuth();
  
  // === GENEL UI STATE ===
  const [page, setPage] = useState(() => {
    return authUser ? 'dashboard' : 'login';
  });
  const [activeTab, setActiveTab] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  // === KULLANICI GİRİŞ STATE ===
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // === PROJE YÖNETİMİ STATE ===
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<Partial<Project>>({ title: '', description: '', status: 'devam', images: [], technical_info: {} });
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectFeatures, setProjectFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  // === SLIDER YÖNETİMİ STATE ===
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [newSlider, setNewSlider] = useState<Partial<Slider>>({ title: '', image: '', link: '', order_index: 0, status: 'devam' });
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null);
  const [sliderAddMode, setSliderAddMode] = useState<'manual' | 'project'>('manual');
  const [selectedProjectForSlider, setSelectedProjectForSlider] = useState<Project | null>(null);
  const [selectedImageForSlider, setSelectedImageForSlider] = useState<string>('');

  // === İÇERİK YÖNETİMİ STATE ===
  const [siteContents, setSiteContents] = useState<SiteContent[]>([]);
  const [selectedPage, setSelectedPage] = useState<string>('');
  const [editingContent, setEditingContent] = useState<SiteContent | null>(null);
  const [showContentModal, setShowContentModal] = useState(false);
// Yeni eklenenler:
const [siteContentsFilter, setSiteContentsFilter] = useState('');
const siteContentsFiltered = siteContents.filter(c =>
  (c.title || '').toLowerCase().includes(siteContentsFilter.toLowerCase()) ||
  (c.page_name || '').toLowerCase().includes(siteContentsFilter.toLowerCase()) ||
  (c.section_name || '').toLowerCase().includes(siteContentsFilter.toLowerCase())
);
const handleDeleteContent = async (id: number) => {
  if (window.confirm('Bu içeriği silmek istediğinizden emin misiniz?')) {
    try {
      await supabase.from('site_content').delete().eq('id', id);
      loadData();
    } catch (err) {
      alert('Silme sırasında hata oluştu!');
    }
  }
};

  // === DASHBOARD/İSTATİSTİK STATE ===
  const [todayVisits, setTodayVisits] = useState(0);
  const [weeklyVisits, setWeeklyVisits] = useState<Visit[]>([]);
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [mostVisited, setMostVisited] = useState<Visit | null>(null);
  const [visitAvg, setVisitAvg] = useState(0);
  const [lastVisit, setLastVisit] = useState<string>('');
  const requests = useAnimatedCount(47);

  // === AYARLAR STATE ===
  const [settings, setSettings] = useState({
    siteTitle: 'BLR İNŞAAT',
    siteDescription: '',
    contactEmail: '',
    phoneNumber: '',
    address: '',
    facebookUrl: '',
    instagramUrl: '',
    youtubeUrl: '',
    headerLogo: '',
    footerLogo: '',
    officeVideoUrl: 'https://www.youtube.com/embed/2RJ3vuL0L2Q',
    theme: darkMode ? 'dark' : 'light',
    adminPassword: '',
    newPassword: '',
    confirmPassword: '',
    maintenanceMode: false,
    emailNotifications: false,
    autoBackup: false,
  });
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [contentSaved, setContentSaved] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);
  
  // Logo yükleme için state'ler
  const [headerLogoFile, setHeaderLogoFile] = useState<File | null>(null);
  const [footerLogoFile, setFooterLogoFile] = useState<File | null>(null);


  // Özellik ekleme inputu (proje düzenleme için)
  const [editingProjectFeatureInput, setEditingProjectFeatureInput] = useState('');

  // === MENÜ ITEMLERİ ===
  const menuItems: { icon: JSX.Element; label: string }[] = [
    {icon: <DashboardRoundedIcon sx={{ fontSize: 28 }} />, label: 'DASHBOARD'},
    {icon: <ImageRoundedIcon sx={{ fontSize: 28 }} />, label: 'SLİDER'},
    {icon: <AssignmentTurnedInRoundedIcon sx={{ fontSize: 28 }} />, label: 'PROJELER'},
    {icon: <ArticleRoundedIcon sx={{ fontSize: 28 }} />, label: 'İÇERİK'},
    {icon: <BarChartIcon sx={{ fontSize: 28 }} />, label: 'İSTATİSTİKLER'},
    {icon: <SettingsRoundedIcon sx={{ fontSize: 28 }} />, label: 'AYARLAR'},
  ];

  // === GENEL HOOK'LAR ===
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const theme = useTheme();

  // === GENEL VERİ YÜKLEME VE GÜNCELLEME HOOK'U ===
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Hata yönetimi ile veri yükleme
        const [projectsData, slidersData, contentsData] = await Promise.allSettled([
          projectService.getAll(),
          sliderService.getAll(),
          siteContentService.getAll()
        ]);
        
        // Projeler
        if (projectsData.status === 'fulfilled') {
          setProjects(projectsData.value);
        } else {
          console.error('Projeler yükleme hatası:', projectsData.reason);
        }
        
        // Sliderlar
        if (slidersData.status === 'fulfilled') {
          setSliders(slidersData.value);
        } else {
          console.error('Sliderlar yükleme hatası:', slidersData.reason);
        }
        
        // İçerikler
        if (contentsData.status === 'fulfilled') {
          console.log('İçerikler yüklendi, ham veri:', contentsData.value);
          
          // Sefa Kalkan içeriğini özel olarak kontrol et
          const sefaKalkanContent = contentsData.value.find(item => 
            item.title && item.title.includes('Sefa Kalkan')
          );
          if (sefaKalkanContent) {
            console.log('Sefa Kalkan içeriği bulundu:', sefaKalkanContent);
          }
          
          const processedContents = contentsData.value.map(item => ({
            ...item,
            images: !item.images
              ? []
              : typeof item.images === 'string'
                ? JSON.parse(item.images)
                : item.images
          }));
          
          setSiteContents(processedContents);
          console.log('İşlenmiş siteContents:', processedContents);
        } else {
          console.error('İçerikler yükleme hatası:', contentsData.reason);
        }
        
      } catch (err) {
        console.error('Genel veri yükleme hatası:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // === AYARLAR YÜKLEME HOOK'U ===
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  
  useEffect(() => {
    const loadSettings = async () => {
      // Sadece ayarlar sekmesi aktifse ve henüz yüklenmemişse yükle
      if (activeTab !== 5 || settingsLoaded) return;
      
      try {
        setSettingsLoading(true);
        
        // Logo yükleme işlemini site_settings'den yap
        let headerLogo = '';
        let footerLogo = '';

        // Site ayarlarını yükle
        const { data: settingsData, error: settingsError } = await supabase
          .from('site_settings')
          .select('*')
          .eq('id', 1)
          .single();

        if (settingsError) {
          console.error('Site ayarları yükleme hatası:', settingsError);
          return;
        }

        if (settingsData) {
          // Logo ayarlarını site_settings'den kontrol et
          if (!headerLogo && settingsData.facebook_url && settingsData.facebook_url.startsWith('HEADER_LOGO_DATA:')) {
            headerLogo = settingsData.facebook_url.replace('HEADER_LOGO_DATA:', '');
          }
          if (!footerLogo && settingsData.instagram_url && settingsData.instagram_url.startsWith('FOOTER_LOGO_DATA:')) {
            footerLogo = settingsData.instagram_url.replace('FOOTER_LOGO_DATA:', '');
          }

          setSettings(prev => ({
            ...prev,
            facebookUrl: settingsData.facebook_url || '',
            instagramUrl: settingsData.instagram_url || '',
            youtubeUrl: settingsData.youtube_url || '',
            officeVideoUrl: settingsData.youtube_url ? 
              (settingsData.youtube_url.startsWith('VIDEO_DATA:') ? 
                settingsData.youtube_url.replace('VIDEO_DATA:', '') : 
                settingsData.youtube_url) : 
              prev.officeVideoUrl,
            siteTitle: settingsData.site_title || prev.siteTitle,
            siteDescription: settingsData.site_description || prev.siteDescription,
            contactEmail: settingsData.contact_email || prev.contactEmail,
            phoneNumber: settingsData.phone_number || prev.phoneNumber,
            address: settingsData.address || prev.address,
            headerLogo: headerLogo,
            footerLogo: footerLogo
          }));
        }
        
        setSettingsLoaded(true);
      } catch (error) {
        console.error('Ayarlar yüklenirken hata:', error);
      } finally {
        setSettingsLoading(false);
      }
    };

    loadSettings();
  }, [activeTab, settingsLoaded]);

  // === GENEL SAYFA DEĞİŞTİRME HOOK'U ===
  const [dataLoaded, setDataLoaded] = useState(false);
  
  useEffect(() => {
    if (page === 'dashboard' && !dataLoaded) {
      loadData();
      setDataLoaded(true);
    }
  }, [page, dataLoaded]);

  // === EKLENECEK SLIDER VERİLERİ ===
  const defaultSliders: Slider[] = [
    {
      id: 1,
      title: 'ARMONIA RESIDENZA',
      image: '/front/gorsel/slider/armonia.jpg',
      link: '/armonia-residenza',
      order_index: 1,
      status: 'devam'
    },
    {
      id: 2,
      title: 'CENTRO',
      image: '/front/gorsel/slider/centro.jpg',
      link: '/centro',
      order_index: 2,
      status: 'bitmis'
    },
    {
      id: 3,
      title: 'GARDENYA VILLA',
      image: '/front/gorsel/slider/gardenya-villa.jpg',
      link: '/gardenya-villa',
      order_index: 3,
      status: 'baslayan'
    },
    {
      id: 4,
      title: 'LUSSO',
      image: '/front/gorsel/slider/lusso.jpg',
      link: '/lusso',
      order_index: 4,
      status: 'devam'
    },
    {
      id: 5,
      title: 'VIA PALAZZO',
      image: '/front/gorsel/slider/via-palazzo.jpg',
      link: '/via-palazzo',
      order_index: 5,
      status: 'bitmis'
    }
  ];

  // === GENEL SAYFA DEĞİŞTİRME FONKSİYONU ===
  const handlePageChange = (newPage: string) => {
    setPage(newPage);
    if (newPage === 'dashboard') {
      loadData();
    }
  };

  // === KULLANICI GİRİŞ FONKSİYONLARI ===
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError('Giriş başarısız: ' + error.message);
      } else {
      setPage('dashboard');
      loadData();
      }
    } catch (err) {
      setError('Giriş sırasında hata oluştu!');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setPage('login');
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error('Çıkış sırasında hata:', err);
    }
  };

  // === GENEL VERİ YÜKLEME FONKSİYONU ===
  const loadData = async () => {
    try {
      const [projectsData, slidersData, contentsData] = await Promise.all([
        projectService.getAll(),
        sliderService.getAll(),
        siteContentService.getAll() // Tüm içerikleri yükle
      ]);
      setProjects(projectsData);
      setSliders(slidersData);
      setSiteContents(
        contentsData.map(item => ({
          ...item,
          images: !item.images
            ? []
            : typeof item.images === 'string'
              ? JSON.parse(item.images)
              : item.images
        }))
      );
    } catch (err) {
      console.error('Veri yükleme hatası:', err);
    }
  };

  // === EKLENECEK SLIDER VERİLERİNİ SUPABASE'E EKLEME ===
  const addDefaultSliders = async () => {
    try {
      for (const slider of defaultSliders) {
        await sliderService.create(slider);
      }
      alert('Eski slider verileri başarıyla eklendi!');
      loadData();
    } catch (err) {
      console.error('Slider ekleme hatası:', err);
      alert('Slider eklenirken hata oluştu!');
    }
  };

  // === PROJE İŞLEMLERİ ===
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!editingProject) return;
      let uploadedUrls: string[] = [];
      // Sadece File olanları ayıkla
      const fileImages = Array.isArray(editingProject.images)
        ? (editingProject.images.filter(img => img && typeof img === 'object' && 'name' in img && 'size' in img && 'type' in img) as unknown as File[])
        : [];
      if (fileImages.length > 0) {
        uploadedUrls = await uploadProjectImages(fileImages);
      }
      // URL inputlarından boş olanları çıkar
      const urlInputs = Array.isArray(editingProject.images)
        ? (editingProject.images as string[]).filter(img => typeof img === 'string' && img.trim() !== '')
        : [];
      // Tüm görselleri birleştir
      const allImages = [...urlInputs, ...uploadedUrls];
      await projectService.create({
        title: editingProject.title,
        description: editingProject.description,
        status: editingProject.status,
        images: allImages,
        features: editingProject.features || [],
        technical_info: editingProject.technical_info || {},
      } as Project);
      setEditingProject(null);
      setFeatureInput('');
      loadData();
    } catch (err) {
      console.error('Proje ekleme hatası:', err);
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.id) return;
    try {
      await projectService.update(editingProject.id, editingProject);
      setEditingProject(null);
      loadData();
    } catch (err) {
      console.error('Proje güncelleme hatası:', err);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (window.confirm('Bu projeyi silmek istediğinizden emin misiniz?')) {
      try {
        await projectService.delete(id);
        loadData();
      } catch (err) {
        console.error('Proje silme hatası:', err);
      }
    }
  };

  // === SLIDER İŞLEMLERİ ===
  const handleCreateSlider = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sliderService.create(newSlider as Slider);
      setNewSlider({ title: '', image: '', link: '', order_index: 0, status: 'devam' });
      setSliderAddMode('manual');
      setSelectedProjectForSlider(null);
      loadData();
    } catch (err) {
      console.error('Slider ekleme hatası:', err);
    }
  };

  const handleCreateSliderFromProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectForSlider) {
      alert('Lütfen bir proje seçin!');
      return;
    }

    if (!selectedImageForSlider) {
      alert('Lütfen bir görsel seçin!');
      return;
    }

    try {
      const projectSlider: Partial<Slider> = {
        title: selectedProjectForSlider.title,
        image: selectedImageForSlider,
        link: `/proje/${selectedProjectForSlider.id}`,
        order_index: newSlider.order_index || 0,
        status: selectedProjectForSlider.status || 'devam'
      };

      await sliderService.create(projectSlider as Slider);
      
      setNewSlider({ title: '', image: '', link: '', order_index: 0, status: 'devam' });
      setSliderAddMode('manual');
      setSelectedProjectForSlider(null);
      setSelectedImageForSlider('');
      loadData();
    } catch (err) {
      console.error('Projeden slider ekleme hatası:', err);
    }
  };

  const handleUpdateSlider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlider?.id) return;
    try {
      await sliderService.update(editingSlider.id, editingSlider);
      setEditingSlider(null);
      loadData();
    } catch (err) {
      console.error('Slider güncelleme hatası:', err);
    }
  };

  const handleDeleteSlider = async (id: number) => {
    if (window.confirm('Bu slider\'ı silmek istediğinizden emin misiniz?')) {
      try {
        await sliderService.delete(id);
        loadData();
      } catch (err) {
        console.error('Slider silme hatası:', err);
      }
    }
  };

  // Slider düzenleme fonksiyonu:
  const handleSliderEdit = (slider: Slider) => {
    setEditingSlider(slider);
  };

  // === İÇERİK İŞLEMLERİ ===
  const handleUpdateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContent?.id) return;
    try {
      console.log('Güncellenecek içerik:', editingContent);
      await siteContentService.update(editingContent.id, {
        page_name: editingContent.page_name,
        section_name: editingContent.section_name,
        title: editingContent.title,
        content: editingContent.content,
        order_index: editingContent.order_index,
        images: editingContent.images
      });
      setEditingContent(null);
      setShowContentModal(false);
      loadData();
      alert('İçerik başarıyla güncellendi!');
    } catch (err) {
      console.error('İçerik güncelleme hatası:', err);
      alert('İçerik güncellenirken hata oluştu!');
    }
  };

  const handleEditContent = (content: SiteContent) => {
    console.log('Düzenlenecek içerik (ham):', content);
    const processedContent = { 
      id: content.id,
      page_name: content.page_name,
      section_name: content.section_name,
      title: content.title,
      content: content.content,
      order_index: content.order_index,
      images: content.images
    };
    console.log('Düzenlenecek içerik (işlenmiş):', processedContent);
    setEditingContent(processedContent);
    setShowContentModal(true);
  };

  // Yeni içerik ekleme
  const handleCreateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContent) return;
    try {
      const newContent: SiteContent = {
        page_name: editingContent.page_name,
        section_name: editingContent.section_name || '',
        title: editingContent.title || '',
        content: editingContent.content || '',
        order_index: editingContent.order_index || 0,
        images: Array.isArray(editingContent.images) ? editingContent.images : [],
      };
      await siteContentService.create(newContent);
      setEditingContent(null);
      setShowContentModal(false);
      loadData();
      alert('İçerik başarıyla eklendi!');
    } catch (err) {
      console.error('İçerik ekleme hatası:', err);
      alert('İçerik eklenirken hata oluştu!');
    }
  };

  // === AYARLAR FORMU SUBMIT ===
  const handleSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Site ayarlarını kaydet
      await supabase
        .from('site_settings')
        .upsert({
          id: 1, // Tek bir ayar kaydı
          site_title: settings.siteTitle,
          site_description: settings.siteDescription,
          contact_email: settings.contactEmail,
          phone_number: settings.phoneNumber,
          address: settings.address,
          facebook_url: settings.facebookUrl,
          instagram_url: settings.instagramUrl,
          youtube_url: settings.youtubeUrl,
          office_video_url: settings.officeVideoUrl,
          maintenance_mode: settings.maintenanceMode,
          email_notifications: settings.emailNotifications,
          auto_backup: settings.autoBackup,
          updated_at: new Date().toISOString()
        });

    setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
      
    // Tema değişikliği uygula
    if (settings.theme === 'dark') setDarkMode(true);
    else setDarkMode(false);
    } catch (error) {
      console.error('Ayarlar kaydedilirken hata:', error);
      alert('Ayarlar kaydedilirken hata oluştu!');
    }
  };

  const handleSocialMediaSave = async () => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          id: 1,
          facebook_url: settings.facebookUrl,
          instagram_url: settings.instagramUrl,
          youtube_url: settings.youtubeUrl,
          updated_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch (error) {
      console.error('Sosyal medya ayarları kaydedilirken hata:', error);
      alert('Sosyal medya ayarları kaydedilirken hata oluştu!');
    }
  };

  // Logo yükleme fonksiyonları
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleLogoUpload = async (file: File, type: 'header' | 'footer') => {
    try {
      const base64Data = await fileToBase64(file);
      
      // Logo'yu site_settings tablosuna kaydet
      const fallbackField = type === 'header' ? 'facebook_url' : 'instagram_url';
      const prefix = type === 'header' ? 'HEADER_LOGO_DATA:' : 'FOOTER_LOGO_DATA:';
      
      const { error: fallbackError } = await supabase
        .from('site_settings')
        .upsert({
          [fallbackField]: prefix + base64Data,
        });
      
      if (fallbackError) throw fallbackError;
      
      // State'i güncelle
      setSettings(prev => ({
        ...prev,
        [type === 'header' ? 'headerLogo' : 'footerLogo']: base64Data
      }));
      
      alert(`${type === 'header' ? 'Header' : 'Footer'} logosu başarıyla yüklendi!`);
    } catch (error) {
      console.error('Logo yükleme hatası:', error);
      alert('Logo yükleme hatası!');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'header' | 'footer') => {
    const file = event.target.files?.[0];
    if (file) {
      // Dosya tipini kontrol et
      if (!file.type.startsWith('image/')) {
        alert('Lütfen geçerli bir resim dosyası seçin!');
        return;
      }
      
      // Dosya boyutunu kontrol et (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Dosya boyutu 5MB\'dan küçük olmalıdır!');
        return;
      }
      
      if (type === 'header') {
        setHeaderLogoFile(file);
      } else {
        setFooterLogoFile(file);
      }
      
      handleLogoUpload(file, type);
    }
  };



  // === DASHBOARD İSTATİSTİKLERİ HOOK'U ===
  useEffect(() => {
    async function fetchVisits() {
      const today = await visitService.getTodayVisits();
      setTodayVisits(today);
      // Son 7 gün
      const now = new Date();
      const end = now.toISOString().slice(0, 10);
      const startDate = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
      const start = startDate.toISOString().slice(0, 10);
      const week = await visitService.getVisitsByRange(start, end);
      setWeeklyVisits(week);
      // Haftalık toplam
      setWeeklyTotal(week.reduce((sum, v) => sum + (v.count || 0), 0));
      // En çok ziyaret edilen gün
      setMostVisited(week.reduce((max, v) => (v.count > (max?.count || 0) ? v : max), null as Visit | null));
      // Ortalama
      setVisitAvg(week.length ? Math.round(week.reduce((sum, v) => sum + (v.count || 0), 0) / week.length) : 0);
      // Son ziyaret zamanı (en son gün)
      setLastVisit(week.length ? week[week.length - 1].date : '');
    }
    fetchVisits();
  }, []);

  // === GENEL RESET VISİT SAYAC FONKSİYONU ===
  const handleResetVisits = async () => {
    if (window.confirm('Tüm ziyaretçi verileri sıfırlansın mı?')) {
      await visitService.getVisitsByRange('1900-01-01', '2100-01-01').then(async (visits) => {
        for (const v of visits) {
          if (v.id) await supabase.from('visits').delete().eq('id', v.id);
        }
      });
      setWeeklyVisits([]);
      setTodayVisits(0);
      setWeeklyTotal(0);
      setMostVisited(null);
      setVisitAvg(0);
      setLastVisit('');
      alert('Tüm ziyaretçi verileri sıfırlandı!');
    }
  };

  // === GENEL DARK MODE TOGGLE ===
  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  // === GENEL MENÜ AÇILIR MENÜ ===
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // === GENEL PROJE ÖZELLİKLERİ VE GÖRSEL YÜKLEME ===
  const handleProjectFeaturesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFeatureInput(event.target.value);
  };

  const handleAddProjectFeature = () => {
    if (featureInput.trim() && !projectFeatures.includes(featureInput.trim())) {
      setProjectFeatures([...projectFeatures, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const handleRemoveProjectFeature = (feature: string) => {
    setProjectFeatures(projectFeatures.filter(f => f !== feature));
  };

  const handleImageUrlsChange = (index: number, value: string) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = value;
    setImageUrls(newImageUrls);
  };

  const handleImageFilesChange = (index: number, file: File) => {
    const newImageFiles = [...imageFiles];
    newImageFiles[index] = file;
    setImageFiles(newImageFiles);
  };

  // === GENEL PROJE SEÇİMİ ===
  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
  };

  // === GENEL PROJE DÜZENLEME FORMU ===
  const handleProjectEdit = (project: Project) => {
    setEditingProject(project);
  };

  // === GENEL İÇERİK DÜZENLEME FORMU ===
  const handleContentEdit = (content: SiteContent) => {
    setEditingContent(content);
    setShowContentModal(true);
  };

  // === GENEL İÇERİK EKLEME FORMU ===
  const handleContentCreate = () => {
    setEditingContent({} as SiteContent);
    setShowContentModal(true);
  };

  // === GENEL İÇERİK DÜZENLEME MODAL ===
  const handleContentModalClose = () => {
    setShowContentModal(false);
    setEditingContent(null);
  };

  // === GENEL PROJE DÜZENLEME MODAL ===
  const handleProjectModalClose = () => {
    setEditingProject(null);
  };

  // === GENEL SLIDER DÜZENLEME MODAL ===
  const handleSliderModalClose = () => {
    setEditingSlider(null);
  };

  // === GENEL İÇERİK DÜZENLEME MODAL (SUPABASE) ===
  const handleContentSupabaseModalClose = () => {
    setShowContentModal(false);
    setEditingContent(null);
  };

  // === GENEL SLIDER DÜZENLEME MODAL (SUPABASE) ===
  const handleSliderSupabaseModalClose = () => {
    setEditingSlider(null);
  };

  // === GENEL PROJE DÜZENLEME MODAL (SUPABASE) ===
  const handleProjectSupabaseModalClose = () => {
    setEditingProject(null);
  };

  // Drag & Drop için yeni fonksiyonlar
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !editingProject) return;

    const items = Array.from(editingProject.images || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setEditingProject({ ...editingProject, images: items });
  };

  const handleFeatureDragEnd = (result: DropResult) => {
    if (!result.destination || !editingProject) return;

    const items = Array.from(editingProject.features || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setEditingProject({ ...editingProject, features: items });
  };

  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobil için
  const user = { name: 'Admin', avatar: '/front/gorsel/genel/logo.png' };

  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [whatsappStats, setWhatsappStats] = useState<WhatsAppStats | null>(null);
  const [whatsappLoading, setWhatsappLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 0) {
      getRecentActivities().then(setRecentActivities);
      loadWhatsAppStats(); // Dashboard'da WhatsApp istatistiklerini de yükle
    }
    if (activeTab === 4) { // İstatistikler sekmesi
      loadWhatsAppStats();
    }

  }, [activeTab]);

  const loadWhatsAppStats = async () => {
    try {
      setWhatsappLoading(true);
      const stats = await whatsappService.getStats();
      setWhatsappStats(stats);
    } catch (error) {
      console.error('WhatsApp istatistikleri yükleme hatası:', error);
    } finally {
      setWhatsappLoading(false);
    }
  };

  // === MODERN LOGIN SAYFASI ===
  if (page === 'login') {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%)',
        position: 'relative',
        overflow: 'hidden',
        p: 0,
        m: 0,
        top: 0
      }}>
        <style>
          {`
            body, html {
              margin: 0 !important;
              padding: 0 !important;
              height: 100% !important;
              overflow-x: hidden !important;
            }
          `}
        </style>
        {/* Arka plan dekoratif elementler */}
        <Box sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          animation: 'float 6s ease-in-out infinite'
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
          animation: 'float 8s ease-in-out infinite reverse'
        }} />
        
        <Paper sx={{ 
          p: 5, 
          borderRadius: 4, 
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)', 
          maxWidth: 450, 
          width: '100%',
          background: 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Logo ve başlık */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ 
              textAlign: 'center',
              mb: 3
            }}>
              <img 
                src="/front/gorsel/genel/logo.png" 
                alt="BLR İnşaat Logo" 
                style={{ 
                  width: 150, 
                  height: 150, 
                  objectFit: 'contain',
                  marginBottom: '16px'
                }} 
              />
            </Box>
            <Typography variant="h4" fontWeight={900} sx={{ 
              color: MODERN_COLORS.primary, 
              fontFamily: MODERN_FONT,
              mb: 1
            }}>
              BLR İNŞAAT
          </Typography>
            <Typography variant="body1" sx={{ 
              color: '#666', 
              fontFamily: MODERN_FONT,
              fontWeight: 500
            }}>
              Admin Panel
            </Typography>
          </Box>

          {/* Giriş formu */}
        <form onSubmit={handleLogin}>
            <TextField
              label="E-posta Adresi"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              autoFocus
              sx={{ 
                fontFamily: MODERN_FONT,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: MODERN_COLORS.primary,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: MODERN_COLORS.primary,
                  },
                }
              }}
            />
            <TextField
              label="Şifre"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              sx={{ 
                fontFamily: MODERN_FONT,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: MODERN_COLORS.primary,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: MODERN_COLORS.primary,
                  },
                }
              }}
            />
            
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ 
                mt: 4, 
                py: 2, 
                fontWeight: 700, 
                borderRadius: 2, 
                fontFamily: MODERN_FONT, 
                fontSize: 16, 
                background: 'linear-gradient(135deg, #256353 0%, #4a7c59 100%)',
                boxShadow: '0 8px 25px rgba(37, 99, 83, 0.3)',
                '&:hover': { 
                  background: 'linear-gradient(135deg, #1e4d3f 0%, #3a6b4a 100%)',
                  boxShadow: '0 12px 35px rgba(37, 99, 83, 0.4)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Giriş Yap
            </Button>
        </form>
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mt: 3, 
                borderRadius: 2,
                fontFamily: MODERN_FONT
              }}
            >
              {error}
            </Alert>
          )}
          
          {/* Alt bilgi */}
          <Box sx={{ textAlign: 'center', mt: 4, pt: 3, borderTop: '1px solid #eee' }}>
            <Typography variant="body2" sx={{ 
              color: '#888', 
              fontFamily: MODERN_FONT,
              fontSize: 13
            }}>
              Güvenli admin erişimi
            </Typography>
          </Box>
        </Paper>

        {/* CSS Animasyonları */}
        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-20px) rotate(180deg); }
            }
          `}
        </style>
      </Box>
    );
  }

  // === DASHBOARD ===
  return (
    <Box sx={{ display: 'flex', height: '100vh', background: darkMode ? '#181c24' : MODERN_COLORS.bg, transition: 'background 0.3s', m: 0, p: 0, top: 0 }}>
      <style>
        {`
          body, html {
            margin: 0 !important;
            padding: 0 !important;
            height: 100% !important;
            overflow-x: hidden !important;
          }
        `}
      </style>
      {/* Sidebar */}
      <Box sx={{
        width: { xs: sidebarOpen ? 180 : 0, md: 80 },
        minWidth: { xs: sidebarOpen ? 180 : 0, md: 80 },
        background: darkMode ? MODERN_COLORS.sidebarDark : MODERN_COLORS.sidebar,
        color: MODERN_COLORS.accent,
        display: { xs: sidebarOpen ? 'flex' : 'none', md: 'flex' },
        flexDirection: 'column',
        alignItems: 'center',
        py: 1,
        boxShadow: 4,
        position: { xs: 'fixed', md: 'sticky' },
        top: { xs: 0, md: 0 },
        height: { xs: '100vh', md: '100vh' },
        zIndex: 1300,
        borderRight: darkMode ? '1px solid #222' : '1px solid #e6d09c',
        transition: 'width 0.3s',
      }}>
        {/* Logo */}
        <Box sx={{ width: 48, height: 48, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/front/gorsel/genel/logo.png" alt="Logo" style={{ width: 38, height: 38, objectFit: 'contain' }} />
        </Box>
        {/* Menü */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
          {menuItems.map((item, idx) => (
            <TooltipMUI title={item.label} placement="right" arrow key={item.label}>
              <Button
                sx={{
                  minWidth: 0,
                  width: 48,
                  height: 48,
                  color: activeTab === idx ? MODERN_COLORS.primary : MODERN_COLORS.accent,
                  background: activeTab === idx ? MODERN_COLORS.accent : 'transparent',
                  borderRadius: 2,
                  mb: 0.5,
                  boxShadow: activeTab === idx ? MODERN_COLORS.shadow : 'none',
                  position: 'relative',
                  transition: 'all 0.18s',
                  fontFamily: MODERN_FONT,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    background: MODERN_COLORS.accent,
                    color: MODERN_COLORS.primary,
                    boxShadow: MODERN_COLORS.shadow,
                  },
                  '&::before': activeTab === idx ? {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 8,
                    bottom: 8,
                    width: 4,
                    borderRadius: 2,
                    background: MODERN_COLORS.primary,
                  } : {},
                }}
                onClick={() => { setActiveTab(idx); setSidebarOpen(false); }}
              >
                {item.icon}
              </Button>
            </TooltipMUI>
          ))}
        </Box>
        {/* Siteyi görüntüle butonu */}
        <Button 
          sx={{ 
            justifyContent: 'center', 
            color: MODERN_COLORS.primary, 
            fontWeight: 600, 
            px: 0, 
            py: 1, 
            borderRadius: 2, 
            mb: 1, 
            background: '#4caf50', 
            boxShadow: 2, 
            fontFamily: MODERN_FONT, 
            fontSize: 13, 
            minWidth: 0, 
            width: 48, 
            height: 40 
          }} 
          onClick={() => window.open('/', '_blank')}
        >
          <VisibilityIcon />
        </Button>
        {/* Çıkış butonu minimal */}
        <Button sx={{ justifyContent: 'center', color: MODERN_COLORS.primary, fontWeight: 600, px: 0, py: 1, borderRadius: 2, mb: 1, background: MODERN_COLORS.accent, boxShadow: 2, fontFamily: MODERN_FONT, fontSize: 13, minWidth: 0, width: 48, height: 40 }} onClick={handleLogout}>
          <LogoutIcon />
        </Button>
      </Box>
      {/* Hamburger menü açma butonu (mobilde) */}
      <Box sx={{ position: 'fixed', top: 18, left: 18, zIndex: 1400, display: { xs: 'block', md: 'none' } }}>
        <IconButton onClick={() => setSidebarOpen(true)} sx={{ color: MODERN_COLORS.primary, background: MODERN_COLORS.accent, boxShadow: MODERN_COLORS.shadow, width: 40, height: 40, borderRadius: 2 }}>
          <MenuIcon />
        </IconButton>
      </Box>
      {/* Sağ üst kullanıcı ve dark mode */}
      <Box sx={{ position: 'fixed', right: 32, top: 24, zIndex: 1000, display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Dark mode switch kaldırıldı */}
        {/* Avatar ve Badge kaldırıldı */}
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>Profilim</MenuItem>
          <MenuItem onClick={handleMenuClose}>Ayarlar</MenuItem>
          <MenuItem onClick={() => { setPage('login'); setEmail(''); setPassword(''); }}>Çıkış Yap</MenuItem>
        </Menu>
      </Box>
      {/* Dashboard ana içerik */}
      <Box sx={{ flex: 1, p: { xs: 0, md: 1 }, pt: { xs: 0, md: 0 }, transition: 'background 0.3s', background: darkMode ? '#181c24' : MODERN_COLORS.bg, height: '100vh', overflow: 'auto' }}>
        {activeTab === 0 && (
          <Grid container spacing={2} sx={{ p: 1 }}>
            {/* Sol ana alan */}
            <Grid item xs={12} md={8}>
              {/* Hoş geldin mesajı */}
              <Paper sx={{ p: 2, mb: 2, borderRadius: 3, background: '#256353', color: '#fff', fontFamily: MODERN_FONT }}>
                <Typography variant="h5" fontWeight={700} mb={1}>Hoş geldiniz, Admin! 👋</Typography>
                <Typography>YapıTrust Admin Paneli'ne hoş geldiniz. Burada tüm projeleri, içerikleri ve site ayarlarını yönetebilirsiniz.</Typography>
              </Paper>
              {/* Özet kutular */}
              <Grid container spacing={2} mb={2}>
                <Grid item xs={12} sm={6} md={3}><Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}><Typography fontWeight={700} fontSize={22}>{projects.length}</Typography><Typography color="text.secondary">Toplam Projeler</Typography></Paper></Grid>
                <Grid item xs={12} sm={6} md={3}><Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}><Typography fontWeight={700} fontSize={22}>{projects.filter(p => p.status === 'devam').length}</Typography><Typography color="text.secondary">Aktif Projeler</Typography></Paper></Grid>
                <Grid item xs={12} sm={6} md={3}><Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}><Typography fontWeight={700} fontSize={22}>12.5K</Typography><Typography color="text.secondary">Bu Ay Ziyaret</Typography></Paper></Grid>
                <Grid item xs={12} sm={6} md={3}><Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}><Typography fontWeight={700} fontSize={22}>{whatsappStats?.total_clicks || 0}</Typography><Typography color="text.secondary">WhatsApp Talepleri</Typography></Paper></Grid>
              </Grid>
              {/* Hızlı işlemler */}
              <Paper sx={{ p: 2, mb: 2, borderRadius: 3, background: '#fff', boxShadow: MODERN_COLORS.shadow }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button onClick={() => setActiveTab(2)} sx={{ p: 0, width: '100%', height: 140, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 3, boxShadow: '0 2px 12px #0001', background: '#f7f7fa', '&:hover': { background: '#e6d09c22' } }}>
                      <AddCircleOutlineIcon sx={{ fontSize: 44, color: MODERN_COLORS.primary, mb: 1 }} />
                      <Typography fontWeight={700} fontSize={17} color={MODERN_COLORS.primary}>Yeni Proje Ekle</Typography>
                      <Typography fontSize={13} color="#888">Yeni bir proje oluşturun</Typography>
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button onClick={() => setActiveTab(2)} sx={{ p: 0, width: '100%', height: 140, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 3, boxShadow: '0 2px 12px #0001', background: '#f7f7fa', '&:hover': { background: '#e6d09c22' } }}>
                      <ListAltIcon sx={{ fontSize: 44, color: MODERN_COLORS.primary, mb: 1 }} />
                      <Typography fontWeight={700} fontSize={17} color={MODERN_COLORS.primary}>Projeleri Yönet</Typography>
                      <Typography fontSize={13} color="#888">Tüm projeleri görüntüle ve düzenle</Typography>
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button onClick={() => setActiveTab(3)} sx={{ p: 0, width: '100%', height: 140, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 3, boxShadow: '0 2px 12px #0001', background: '#f7f7fa', '&:hover': { background: '#e6d09c22' } }}>
                      <ArticleIcon sx={{ fontSize: 44, color: MODERN_COLORS.primary, mb: 1 }} />
                      <Typography fontWeight={700} fontSize={17} color={MODERN_COLORS.primary}>İçerik Yönetimi</Typography>
                      <Typography fontSize={13} color="#888">Site içeriklerini düzenle</Typography>
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button onClick={() => setActiveTab(5)} sx={{ p: 0, width: '100%', height: 140, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 3, boxShadow: '0 2px 12px #0001', background: '#f7f7fa', '&:hover': { background: '#e6d09c22' } }}>
                      <SettingsIcon sx={{ fontSize: 44, color: MODERN_COLORS.primary, mb: 1 }} />
                      <Typography fontWeight={700} fontSize={17} color={MODERN_COLORS.primary}>Ayarlar</Typography>
                      <Typography fontSize={13} color="#888">Site ayarlarını yönet</Typography>
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
              {/* Proje durumu barları */}
              <Paper sx={{ p: 2, mb: 2, borderRadius: 3 }}>
                <Typography fontWeight={700} mb={2}>Proje Durumu</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}><Typography fontWeight={600} color="#2563eb">{projects.filter(p => p.status === 'baslayan').length}</Typography><Typography color="text.secondary">Başlanacak</Typography></Grid>
                  <Grid item xs={4}><Typography fontWeight={600} color="#ea580c">{projects.filter(p => p.status === 'devam').length}</Typography><Typography color="text.secondary">Devam Eden</Typography></Grid>
                  <Grid item xs={4}><Typography fontWeight={600} color="#16a34a">{projects.filter(p => p.status === 'bitmis').length}</Typography><Typography color="text.secondary">Tamamlanan</Typography></Grid>
                </Grid>
              </Paper>
            </Grid>
            {/* Sağ: Son Aktiviteler */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, borderRadius: 3, minHeight: 340, boxShadow: MODERN_COLORS.shadow }}>
                <Typography fontWeight={700} mb={2} fontSize={18}>Son Aktiviteler</Typography>
                <Grid container spacing={2}>
                  {recentActivities.length === 0 && <Grid item xs={12}><Typography color="text.secondary">Aktivite bulunamadı.</Typography></Grid>}
                  {recentActivities.map((act: any, idx: number) => (
                    <Grid item xs={12} key={idx}>
                      <Paper sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2, boxShadow: '0 2px 8px #0001', mb: 1 }}>
                        {/* İkon */}
                        {act.type === 'project' && <AssignmentIcon sx={{ color: '#2563eb', fontSize: 32 }} />}
                        {act.type === 'slider' && <ImageIcon sx={{ color: '#ea580c', fontSize: 32 }} />}
                        {act.type === 'content' && <ArticleIcon sx={{ color: '#16a34a', fontSize: 32 }} />}
                        {/* Bilgi */}
                        <Box>
                          <Typography fontWeight={700} fontSize={15}>{act.title || '(Başlıksız)'}</Typography>
                          <Typography fontSize={13} color="#888">{act.type === 'project' ? 'Proje' : act.type === 'slider' ? 'Slider' : 'İçerik'} • {new Date(act.created_at).toLocaleString('tr-TR')}</Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        )}

          {/* Slider sekmesi */}
          {activeTab === 1 && (
            <Box>
              <Typography variant="h5" fontWeight={600} mb={2}>Slider Yönetimi</Typography>
              {/* Yeni slider ekleme formu */}
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={500} mb={2}>Yeni Slider Ekle</Typography>
                  
                  {/* Ekleme Modu Seçimi */}
                  <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                    <Button
                      variant={sliderAddMode === 'manual' ? 'contained' : 'outlined'}
                      onClick={() => setSliderAddMode('manual')}
                      startIcon={<AddCircleOutlineIcon />}
                    >
                      Manuel Ekle
                    </Button>
                    <Button
                      variant={sliderAddMode === 'project' ? 'contained' : 'outlined'}
                      onClick={() => setSliderAddMode('project')}
                      startIcon={<AssignmentIcon />}
                    >
                      Mevcut Projeden Ekle
                    </Button>
                  </Box>

                  {/* Manuel Ekleme Formu */}
                  {sliderAddMode === 'manual' && (
                  <Box component="form" onSubmit={handleCreateSlider} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                    <TextField
                      label="Başlık"
                      value={newSlider.title}
                      onChange={e => setNewSlider({ ...newSlider, title: e.target.value })}
                      fullWidth
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TextField
                        label="Görsel URL"
                        value={newSlider.image}
                        onChange={e => setNewSlider({ ...newSlider, image: e.target.value })}
                        fullWidth
                      />
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="slider-image-upload-new"
                        onChange={async e => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            try {
                              const urls = await uploadProjectImages([file]);
                              setNewSlider({ ...newSlider, image: urls[0] });
                            } catch (err) {
                              alert('Görsel yüklenirken hata oluştu!');
                            }
                          }
                        }}
                      />
                      <label htmlFor="slider-image-upload-new">
                        <Button variant="outlined" component="span" size="small">Bilgisayardan Yükle</Button>
                      </label>
                      {newSlider.image && <img src={newSlider.image} alt="slider" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, marginLeft: 4 }} />}
                    </Box>
                    <TextField
                      label="Link"
                      value={newSlider.link}
                      onChange={e => setNewSlider({ ...newSlider, link: e.target.value })}
                      fullWidth
                    />
                    <TextField
                      label="Sıra"
                      type="number"
                      value={newSlider.order_index}
                      onChange={e => setNewSlider({ ...newSlider, order_index: Number(e.target.value) })}
                      fullWidth
                    />
                    <FormControl fullWidth>
                      <InputLabel>Proje Durumu</InputLabel>
                      <Select
                        value={newSlider.status || 'devam'}
                        onChange={e => setNewSlider({ ...newSlider, status: e.target.value as 'baslayan' | 'devam' | 'bitmis' })}
                        label="Proje Durumu"
                      >
                        <MenuItem value="baslayan">Yakında Başlıyor</MenuItem>
                        <MenuItem value="devam">Devam Eden Proje</MenuItem>
                        <MenuItem value="bitmis">Tamamlanan Proje</MenuItem>
                      </Select>
                    </FormControl>
                    <Box sx={{ gridColumn: { xs: '1', md: '1 / span 2' }, mt: 2 }}>
                      <Button type="submit" variant="contained" color="primary" fullWidth>Kaydet</Button>
                    </Box>
                  </Box>
                  )}

                  {/* Projeden Ekleme Formu */}
                  {sliderAddMode === 'project' && (
                    <Box component="form" onSubmit={handleCreateSliderFromProject} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                      <FormControl fullWidth>
                        <InputLabel>Proje Seçin</InputLabel>
                        <Select
                          value={selectedProjectForSlider?.id || ''}
                          onChange={(e) => {
                            const project = projects.find(p => p.id === e.target.value);
                            setSelectedProjectForSlider(project || null);
                            setSelectedImageForSlider(''); // Reset selected image when project changes
                          }}
                          label="Proje Seçin"
                        >
                          {projects.map((project) => (
                            <MenuItem key={project.id} value={project.id}>
                              {project.title} - {project.status === 'baslayan' ? 'Yakında Başlıyor' : project.status === 'devam' ? 'Devam Eden' : 'Tamamlanan'}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      
                      {selectedProjectForSlider && (
                        <>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                            {selectedProjectForSlider.images && selectedProjectForSlider.images.length > 0 && (
                              <img 
                                src={selectedProjectForSlider.images[0]} 
                                alt={selectedProjectForSlider.title}
                                style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }}
                              />
                            )}
                            <Box>
                              <Typography fontWeight={600}>{selectedProjectForSlider.title}</Typography>
                              <Typography fontSize={14} color="text.secondary">
                                Durum: {selectedProjectForSlider.status === 'baslayan' ? 'Yakında Başlıyor' : selectedProjectForSlider.status === 'devam' ? 'Devam Eden' : 'Tamamlanan'}
                              </Typography>
                            </Box>
                          </Box>
                          
                          {/* Görsel Seçimi */}
                          {selectedProjectForSlider.images && selectedProjectForSlider.images.length > 0 && (
                            <Box sx={{ gridColumn: { xs: '1', md: '1 / span 2' } }}>
                              <Typography variant="subtitle2" fontWeight={500} mb={2}>Slider için Görsel Seçin:</Typography>
                              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                {selectedProjectForSlider.images.map((image, index) => (
                                  <Box
                                    key={index}
                                    sx={{
                                      position: 'relative',
                                      cursor: 'pointer',
                                      border: selectedImageForSlider === image ? '3px solid #1976d2' : '3px solid transparent',
                                      borderRadius: 1,
                                      overflow: 'hidden',
                                      transition: 'all 0.2s ease',
                                      '&:hover': {
                                        transform: 'scale(1.05)',
                                        borderColor: '#1976d2'
                                      }
                                    }}
                                    onClick={() => setSelectedImageForSlider(image)}
                                  >
                                    <img
                                      src={image}
                                      alt={`${selectedProjectForSlider.title} - Görsel ${index + 1}`}
                                      style={{
                                        width: 120,
                                        height: 80,
                                        objectFit: 'cover',
                                        display: 'block'
                                      }}
                                    />
                                    {selectedImageForSlider === image && (
                                      <Box
                                        sx={{
                                          position: 'absolute',
                                          top: 4,
                                          right: 4,
                                          backgroundColor: '#1976d2',
                                          color: 'white',
                                          borderRadius: '50%',
                                          width: 24,
                                          height: 24,
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          fontSize: 12
                                        }}
                                      >
                                        ✓
                                      </Box>
                                    )}
                                  </Box>
                                ))}
                              </Box>
                              {selectedImageForSlider && (
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                  Seçilen görsel: {selectedProjectForSlider.images.indexOf(selectedImageForSlider) + 1}. görsel
                                </Typography>
                              )}
                            </Box>
                          )}
                        </>
                      )}
                      
                      <TextField
                        label="Sıra"
                        type="number"
                        value={newSlider.order_index}
                        onChange={e => setNewSlider({ ...newSlider, order_index: Number(e.target.value) })}
                        fullWidth
                      />
                      
                      <Box sx={{ gridColumn: { xs: '1', md: '1 / span 2' }, mt: 2 }}>
                        <Button 
                          type="submit" 
                          variant="contained" 
                          color="primary" 
                          fullWidth
                          disabled={!selectedProjectForSlider || !selectedImageForSlider}
                        >
                          Projeden Slider Oluştur
                        </Button>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
              {/* Slider listesi */}
              <Paper>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Başlık</TableCell>
                        <TableCell>Görsel</TableCell>
                        <TableCell>Link</TableCell>
                        <TableCell>Sıra</TableCell>
                        <TableCell>Durum</TableCell>
                        <TableCell align="right">İşlemler</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sliders.map((slider) => (
                        <TableRow key={slider.id}>
                          <TableCell>{slider.title}</TableCell>
                          <TableCell>{slider.image && <img src={slider.image} alt="slider" style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} />}</TableCell>
                          <TableCell>{slider.link}</TableCell>
                          <TableCell>{slider.order_index}</TableCell>
                          <TableCell>
                            {slider.status === 'baslayan' && 'Yakında Başlıyor'}
                            {slider.status === 'devam' && 'Devam Eden Proje'}
                            {slider.status === 'bitmis' && 'Tamamlanan Proje'}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton color="primary" onClick={() => handleSliderEdit(slider)}><EditIcon /></IconButton>
                            <IconButton color="error" onClick={() => handleDeleteSlider(slider.id!)}><DeleteIcon /></IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
              {/* Slider düzenleme dialogu */}
              <Dialog open={!!editingSlider} onClose={handleSliderModalClose} maxWidth="sm" fullWidth>
                <DialogTitle>Slider Düzenle</DialogTitle>
                <DialogContent>
                  {editingSlider && (
                    <Box component="form" onSubmit={handleUpdateSlider} sx={{ display: 'grid', gap: 2, mt: 1 }}>
                      <TextField
                        label="Başlık"
                        value={editingSlider.title}
                        onChange={e => setEditingSlider({ ...editingSlider, title: e.target.value })}
                        fullWidth
                      />
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <TextField
                          label="Görsel URL"
                          value={editingSlider.image}
                          onChange={e => setEditingSlider({ ...editingSlider, image: e.target.value })}
                          fullWidth
                        />
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          id="slider-image-upload"
                          onChange={async e => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              try {
                                const urls = await uploadProjectImages([file]);
                                setEditingSlider({ ...editingSlider, image: urls[0] });
                              } catch (err) {
                                alert('Görsel yüklenirken hata oluştu!');
                              }
                            }
                          }}
                        />
                        <label htmlFor="slider-image-upload">
                          <Button variant="outlined" component="span" size="small">Bilgisayardan Yükle</Button>
                        </label>
                        {editingSlider.image && <img src={editingSlider.image} alt="slider" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, marginLeft: 4 }} />}
                      </Box>
                      <TextField
                        label="Link"
                        value={editingSlider.link}
                        onChange={e => setEditingSlider({ ...editingSlider, link: e.target.value })}
                        fullWidth
                      />
                      <TextField
                        label="Sıra"
                        type="number"
                        value={editingSlider.order_index}
                        onChange={e => setEditingSlider({ ...editingSlider, order_index: Number(e.target.value) })}
                        fullWidth
                      />
                      <FormControl fullWidth>
                        <InputLabel>Proje Durumu</InputLabel>
                        <Select
                          value={editingSlider.status || 'devam'}
                          onChange={e => setEditingSlider({ ...editingSlider, status: e.target.value as 'baslayan' | 'devam' | 'bitmis' })}
                          label="Proje Durumu"
                        >
                          <MenuItem value="baslayan">Yakında Başlıyor</MenuItem>
                          <MenuItem value="devam">Devam Eden Proje</MenuItem>
                          <MenuItem value="bitmis">Tamamlanan Proje</MenuItem>
                        </Select>
                      </FormControl>
                      <DialogActions>
                        <Button onClick={handleSliderModalClose} color="secondary">İptal</Button>
                        <Button type="submit" variant="contained" color="primary">Kaydet</Button>
                      </DialogActions>
                    </Box>
                  )}
                </DialogContent>
              </Dialog>
            </Box>
          )}

          {/* Projeler sekmesi (activeTab === 2) modern ve fonksiyonel: */}
          {activeTab === 2 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight={700} sx={{ fontFamily: MODERN_FONT, color: MODERN_COLORS.primary }}>Projeler</Typography>
                <Button variant="contained" color="primary" sx={{ fontWeight: 700, borderRadius: 2, fontSize: 15 }} onClick={() => setEditingProject({ title: '', description: '', status: 'devam', images: [], technical_info: {} })}>
                  Yeni Proje Ekle
                </Button>
              </Box>
              <Grid container spacing={4} sx={{ padding: 2 }}>
                {projects.map((project) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={project.id} sx={{ padding: 2 }}>
                    <Card sx={{ 
                      borderRadius: 4, 
                      boxShadow: MODERN_COLORS.shadow, 
                      height: 320, 
                      width: '100%',
                      minWidth: 250,
                      maxWidth: 350,
                      display: 'flex', 
                      flexDirection: 'column', 
                      p: 0, 
                      overflow: 'hidden', 
                      background: '#f7f7f7', 
                      cursor: 'pointer', 
                      transition: 'box-shadow 0.2s, transform 0.2s', 
                      '&:hover': { boxShadow: '0 8px 32px #0003', transform: 'scale(1.03)' } 
                    }}>
                      <Box sx={{ position: 'relative', width: '100%', height: 180, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Chip
                          label={project.status === 'devam' ? 'Devam Eden' : project.status === 'bitmis' ? 'Tamamlanan' : 'Başlanacak'}
                          color={project.status === 'devam' ? 'warning' : project.status === 'bitmis' ? 'success' : 'info'}
                          sx={{ position: 'absolute', top: 8, left: 8, fontWeight: 600, fontSize: 12, px: 1.5, py: 0.5, borderRadius: 1, zIndex: 2 }}
                        />
                        {project.images && project.images[0] ? (
                          <img src={project.images[0]} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        ) : (
                          <ImageIcon sx={{ fontSize: 60, color: '#bbb' }} />
                        )}
                      </Box>
                      <Box sx={{ width: '100%', minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#232323', padding: '0 8px' }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ 
                          color: '#fff', 
                          letterSpacing: 0.5, 
                          fontSize: 13, 
                          textTransform: 'uppercase', 
                          mb: 0,
                          width: '100%',
                          textAlign: 'center',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>{project.title}</Typography>
                      </Box>
                      <CardActions sx={{ 
                        justifyContent: 'center', 
                        p: 1, 
                        gap: 1, 
                        background: '#f7f7f7', 
                        flexDirection: 'column',
                        minHeight: 80,
                        alignItems: 'stretch'
                      }}>
                        <Box sx={{ display: 'flex', gap: 1, width: '100%', justifyContent: 'center' }}>
                        <Button size="small" variant="outlined" color="primary" sx={{ fontSize: 12, px: 1.5, py: 0.5, borderRadius: 1 }} onClick={() => setEditingProject(project)}>Düzenle</Button>
                        <Button size="small" variant="outlined" color="error" sx={{ fontSize: 12, px: 1.5, py: 0.5, borderRadius: 1 }} onClick={() => handleDeleteProject(project.id!)}>Sil</Button>
                        </Box>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          color="info" 
                          sx={{ 
                            fontSize: 12, 
                            px: 1.5, 
                            py: 0.5, 
                            borderRadius: 1,
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                          }} 
                          onClick={() => window.open(`/proje/${project.id}`, '_blank')}
                        >
                          <VisibilityIcon sx={{ fontSize: 14 }} />
                          Önizleme
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              {/* Proje ekleme/düzenleme modalı */}
              <Dialog open={!!editingProject && !editingProject.id} onClose={() => setEditingProject(null)} maxWidth="md" fullWidth>
                <DialogTitle>Yeni Proje Ekle</DialogTitle>
                <DialogContent>
                  {editingProject && !editingProject.id && (
                    <Box component="form" onSubmit={handleCreateProject} sx={{ display: 'grid', gap: 3, mt: 1 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            label="Proje Adı"
                            value={editingProject.title}
                            onChange={e => setEditingProject({ ...editingProject, title: e.target.value })}
                            required
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            <InputLabel>Durum</InputLabel>
                            <Select
                              value={editingProject.status}
                              label="Durum"
                              onChange={e => setEditingProject({ ...editingProject, status: e.target.value as any })}
                            >
                              <MenuItem value="baslayan">Başlayan</MenuItem>
                              <MenuItem value="devam">Devam Eden</MenuItem>
                              <MenuItem value="bitmis">Bitmiş</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            label="Kategori (isteğe bağlı)"
                            value={editingProject.technical_info?.category || ''}
                            onChange={e => setEditingProject({ ...editingProject, technical_info: { ...editingProject.technical_info, category: e.target.value } })}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            label="Tarih (isteğe bağlı)"
                            type="date"
                            value={editingProject.technical_info?.date || ''}
                            onChange={e => setEditingProject({ ...editingProject, technical_info: { ...editingProject.technical_info, date: e.target.value } })}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label="Adres (isteğe bağlı)"
                            value={editingProject.technical_info?.address || ''}
                            onChange={e => setEditingProject({ ...editingProject, technical_info: { ...editingProject.technical_info, address: e.target.value } })}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label="Proje Açıklaması"
                            value={editingProject.description}
                            onChange={e => setEditingProject({ ...editingProject, description: e.target.value })}
                            multiline
                            minRows={3}
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                      {/* Görsel yükleme ve önizleme */}
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" mb={1}>Görseller:</Typography>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          id="new-project-images-upload"
                          multiple
                          onChange={async e => {
                            if (e.target.files && e.target.files.length > 0) {
                              const files = Array.from(e.target.files);
                              try {
                                const urls = await uploadProjectImages(files);
                                setEditingProject(prev => prev ? { ...prev, images: [...(prev.images || []), ...urls] } : prev);
                              } catch (err) {
                                alert('Görsel yüklenirken hata oluştu!');
                              }
                            }
                          }}
                        />
                        <label htmlFor="new-project-images-upload">
                          <Button variant="outlined" component="span" size="small">Bilgisayardan Çoklu Yükle</Button>
                        </label>
                        {/* Küçük önizleme */}
                        {Array.isArray(editingProject.images) && editingProject.images.map((img, idx) => (
                          <Box key={idx} sx={{ position: 'relative', display: 'inline-block', mr: 1, mt: 1 }}>
                            <img src={img} alt="proje" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 4, border: '1px solid #ddd' }} />
                            <Button size="small" color="error" sx={{ position: 'absolute', top: -8, right: -8, minWidth: 0, width: 20, height: 20, borderRadius: '50%', p: 0 }} onClick={() => setEditingProject(prev => prev ? { ...prev, images: prev.images!.filter((_, i) => i !== idx) } : prev)}>x</Button>
                          </Box>
                        ))}
                      </Box>
                      {/* Özellikler */}
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" mb={1}>Özellikler:</Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                          <TextField
                            value={featureInput}
                            onChange={e => setFeatureInput(e.target.value)}
                            placeholder="Özellik ekle"
                            fullWidth
                          />
                          <Button
                            variant="outlined"
                            onClick={() => {
                              if (featureInput.trim()) {
                                setEditingProject(prev => prev ? { ...prev, features: [...(prev.features || []), featureInput.trim()] } : prev);
                                setFeatureInput('');
                              }
                            }}
                          >
                            Ekle
                          </Button>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {Array.isArray(editingProject.features) && editingProject.features.map((feature, idx) => (
                            <Box key={idx} sx={{
                              background: idx % 2 === 1 ? '#e6d09c' : '#fff',
                              borderRadius: 2,
                              px: 2,
                              py: 1,
                              mb: 1,
                              fontWeight: 500,
                              border: '1px solid #ddd',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}>
                              {feature}
                              <Button size="small" onClick={() => setEditingProject(prev => prev ? { ...prev, features: prev.features!.filter((_, i) => i !== idx) } : prev)}>Sil</Button>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                      <DialogActions sx={{ mt: 2 }}>
                        <Button onClick={() => setEditingProject(null)} color="secondary">İptal</Button>
                        <Button type="submit" variant="contained" color="primary">Kaydet</Button>
                      </DialogActions>
                    </Box>
                  )}
                </DialogContent>
              </Dialog>
              {/* Proje düzenleme dialogu (id varsa) zaten mevcut */}
              <Dialog open={!!editingProject && !!editingProject.id} onClose={() => setEditingProject(null)} maxWidth="sm" fullWidth>
                <DialogTitle>Proje Düzenle</DialogTitle>
                <DialogContent>
                  {editingProject && editingProject.id && (
                    <Box component="form" onSubmit={handleUpdateProject} sx={{ display: 'grid', gap: 2, mt: 1 }}>
                      <TextField
                        label="Proje Adı"
                        value={editingProject.title}
                        onChange={e => setEditingProject({ ...editingProject, title: e.target.value })}
                        required
                        fullWidth
                      />
                      <FormControl fullWidth>
                        <InputLabel>Durum</InputLabel>
                        <Select
                          value={editingProject.status}
                          label="Durum"
                          onChange={e => setEditingProject({ ...editingProject, status: e.target.value as any })}
                        >
                          <MenuItem value="baslayan">Başlayan</MenuItem>
                          <MenuItem value="devam">Devam Eden</MenuItem>
                          <MenuItem value="bitmis">Bitmiş</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        label="Proje Açıklaması"
                        value={editingProject.description}
                        onChange={e => setEditingProject({ ...editingProject, description: e.target.value })}
                        multiline
                        minRows={3}
                        fullWidth
                      />
                      {/* Çoklu görsel alanı */}
                      <Box sx={{ gridColumn: { xs: '1', md: '1 / span 2' } }}>
                        <Typography variant="body2" mb={1}>Görsel URL'leri (virgülle ayır):</Typography>
                        <TextField
                          label="Görsel URL (virgülle ayır)"
                          value={Array.isArray(editingProject.images) ? editingProject.images.join(', ') : (editingProject.images || '')}
                          onChange={e => setEditingProject({ ...editingProject, images: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                          fullWidth
                          sx={{ mb: 1 }}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          id="editing-project-images-upload"
                          multiple
                          onChange={async e => {
                            if (e.target.files && e.target.files.length > 0) {
                              const files = Array.from(e.target.files);
                              try {
                                const urls = await uploadProjectImages(files);
                                setEditingProject(prev => prev ? { ...prev, images: [...(prev.images || []), ...urls] } : prev);
                              } catch (err) {
                                alert('Görsel yüklenirken hata oluştu!');
                              }
                            }
                          }}
                        />
                        <label htmlFor="editing-project-images-upload">
                          <Button variant="outlined" component="span" size="small">Bilgisayardan Çoklu Yükle</Button>
                        </label>
                        {/* Proje görselleri için Drag & Drop sıralama */}
                        <Typography variant="body2" mb={1} sx={{ mt: 2, fontWeight: 600, color: '#666' }}>
                          📸 Görselleri sıralamak için sürükleyip bırakın:
                        </Typography>
                        <DragDropContext onDragEnd={handleDragEnd}>
                          <Droppable droppableId="project-images" direction="horizontal">
                            {(provided) => (
                              <Box
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                sx={{ 
                                  display: 'flex', 
                                  gap: 1, 
                                  mt: 1, 
                                  flexWrap: 'wrap',
                                  minHeight: 60,
                                  p: 1,
                                  borderRadius: 2,
                                  border: '2px dashed #ddd',
                                  background: '#f9f9f9'
                                }}
                              >
                          {Array.isArray(editingProject.images) && editingProject.images.map((url, idx) => (
                                  <Draggable key={idx} draggableId={`image-${idx}`} index={idx}>
                                    {(provided, snapshot) => (
                                      <Box
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        sx={{ 
                                          position: 'relative', 
                                          display: 'inline-block',
                                          transform: snapshot.isDragging ? 'rotate(5deg)' : 'none',
                                          transition: 'transform 0.2s ease',
                                          cursor: 'grab',
                                          '&:active': { cursor: 'grabbing' }
                                        }}
                                      >
                                        <img 
                                          src={url} 
                                          alt="proje" 
                                          style={{ 
                                            width: 60, 
                                            height: 60, 
                                            objectFit: 'cover', 
                                            borderRadius: 8,
                                            border: snapshot.isDragging ? '2px solid #1a2236' : '2px solid #ddd',
                                            boxShadow: snapshot.isDragging ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)'
                                          }} 
                                        />
                                        {/* Sıra numarası */}
                                        <Box sx={{
                                          position: 'absolute',
                                          top: -8,
                                          left: -8,
                                          background: '#1a2236',
                                          color: 'white',
                                          borderRadius: '50%',
                                          width: 24,
                                          height: 24,
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          fontSize: 12,
                                          fontWeight: 'bold'
                                        }}>
                                          {idx + 1}
                            </Box>
                                        {/* Sil butonu */}
                                        <Button 
                                          size="small" 
                                          color="error" 
                                          sx={{ 
                                            position: 'absolute', 
                                            top: -8, 
                                            right: -8, 
                                            minWidth: 0, 
                                            width: 24, 
                                            height: 24, 
                                            borderRadius: '50%', 
                                            p: 0,
                                            background: '#ff4444',
                                            color: 'white',
                                            '&:hover': { background: '#cc0000' }
                                          }} 
                                          onClick={() => setEditingProject(prev => prev ? { ...prev, images: prev.images!.filter((_, i) => i !== idx) } : prev)}
                                        >
                                          ×
                                        </Button>
                                      </Box>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                        </Box>
                            )}
                          </Droppable>
                        </DragDropContext>
                      </Box>
                      {/* Proje düzenleme özellik ekleme ve sıralama */}
                      <Box sx={{ gridColumn: { xs: '1', md: '1 / span 2' } }}>
                        <Typography variant="body2" mb={1}>Özellikler:</Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                          <TextField
                            value={editingProjectFeatureInput}
                            onChange={e => setEditingProjectFeatureInput(e.target.value)}
                            placeholder="Özellik ekle"
                            fullWidth
                          />
                          <Button
                            variant="outlined"
                            onClick={() => {
                              if (editingProjectFeatureInput.trim()) {
                                setEditingProject(prev => prev ? {
                                  ...prev,
                                  features: [...(prev.features || []), editingProjectFeatureInput.trim()]
                                } : prev);
                                setEditingProjectFeatureInput('');
                              }
                            }}
                          >
                            Ekle
                          </Button>
                        </Box>
                        <Typography variant="body2" mb={1} sx={{ mt: 2, fontWeight: 600, color: '#666' }}>
                          🏷️ Özellikleri sıralamak için sürükleyip bırakın:
                        </Typography>
                        <DragDropContext onDragEnd={handleFeatureDragEnd}>
                          <Droppable droppableId="project-features">
                            {(provided) => (
                              <Box
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                sx={{ 
                                  display: 'flex', 
                                  flexWrap: 'wrap', 
                                  gap: 1,
                                  minHeight: 40,
                                  p: 1,
                                  borderRadius: 2,
                                  border: '2px dashed #ddd',
                                  background: '#f9f9f9'
                                }}
                              >
                          {Array.isArray(editingProject.features) && editingProject.features.map((feature, idx) => (
                                  <Draggable key={idx} draggableId={`feature-${idx}`} index={idx}>
                                    {(provided, snapshot) => (
                                      <Box
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        sx={{
                              background: idx % 2 === 1 ? '#e6d09c' : '#fff',
                              borderRadius: 2,
                              px: 2,
                              py: 1,
                              mb: 1,
                              fontWeight: 500,
                                          border: snapshot.isDragging ? '2px solid #1a2236' : '1px solid #ddd',
                              display: 'flex',
                              alignItems: 'center',
                                          gap: 1,
                                          transform: snapshot.isDragging ? 'rotate(2deg)' : 'none',
                                          transition: 'transform 0.2s ease',
                                          cursor: 'grab',
                                          '&:active': { cursor: 'grabbing' },
                                          boxShadow: snapshot.isDragging ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)'
                                        }}
                                      >
                                        {/* Sıra numarası */}
                                        <Box sx={{
                                          background: '#1a2236',
                                          color: 'white',
                                          borderRadius: '50%',
                                          width: 20,
                                          height: 20,
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          fontSize: 10,
                                          fontWeight: 'bold'
                                        }}>
                                          {idx + 1}
                                        </Box>
                              {feature}
                                        <Button 
                                          size="small" 
                                          color="error"
                                          sx={{ 
                                            minWidth: 0, 
                                            width: 20, 
                                            height: 20, 
                                            borderRadius: '50%', 
                                            p: 0,
                                            background: '#ff4444',
                                            color: 'white',
                                            '&:hover': { background: '#cc0000' }
                                          }}
                                          onClick={() => setEditingProject(prev => prev ? { ...prev, features: prev.features!.filter((_, i) => i !== idx) } : prev)}
                                        >
                                          ×
                                        </Button>
                            </Box>
                                    )}
                                  </Draggable>
                          ))}
                                {provided.placeholder}
                        </Box>
                            )}
                          </Droppable>
                        </DragDropContext>
                      </Box>
                      <DialogActions>
                        <Button onClick={() => setEditingProject(null)} color="secondary">İptal</Button>
                        <Button type="submit" variant="contained" color="primary">Kaydet</Button>
                      </DialogActions>
                    </Box>
                  )}
                </DialogContent>
              </Dialog>
            </Box>
          )}

          {/* Ayarlar sekmesi */}
          {activeTab === 5 && (
            <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4 }}>
              <Typography variant="h4" fontWeight={900} mb={4} sx={{ fontFamily: MODERN_FONT, color: MODERN_COLORS.primary }}>Ayarlar</Typography>
              
              {settingsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
              <Grid container spacing={4}>
                {/* İstatistikler - En üstte */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 4, borderRadius: 3, boxShadow: MODERN_COLORS.shadow }}>
                    <Typography variant="h6" fontWeight={700} mb={3} sx={{ color: MODERN_COLORS.primary }}>Sistem İstatistikleri</Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ textAlign: 'center', p: 2, background: '#f8f9fa', borderRadius: 2 }}>
                          <Typography variant="h4" fontWeight={700} color="primary">{projects.length}</Typography>
                          <Typography color="text.secondary">Toplam Proje</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ textAlign: 'center', p: 2, background: '#f8f9fa', borderRadius: 2 }}>
                          <Typography variant="h4" fontWeight={700} color="success.main">{sliders.length}</Typography>
                          <Typography color="text.secondary">Slider</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ textAlign: 'center', p: 2, background: '#f8f9fa', borderRadius: 2 }}>
                          <Typography variant="h4" fontWeight={700} color="warning.main">{siteContents.length}</Typography>
                          <Typography color="text.secondary">İçerik</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ textAlign: 'center', p: 2, background: '#f8f9fa', borderRadius: 2 }}>
                          <Typography variant="h4" fontWeight={700} color="info.main">{todayVisits}</Typography>
                          <Typography color="text.secondary">Bugünkü Ziyaret</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                </Paper>
                </Grid>

                {/* Site Ayarları */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 4, borderRadius: 3, boxShadow: MODERN_COLORS.shadow }}>
                    <Typography variant="h6" fontWeight={700} mb={3} sx={{ color: MODERN_COLORS.primary }}>Site Ayarları</Typography>
                    <Box component="form" onSubmit={handleSettingsSave} sx={{ display: 'grid', gap: 3 }}>
                      <TextField
                        label="Site Başlığı"
                        value={settings.siteTitle}
                        onChange={e => setSettings({ ...settings, siteTitle: e.target.value })}
                        fullWidth
                        required
                      />
                      <TextField
                        label="Site Açıklaması"
                        value={settings.siteDescription || ''}
                        onChange={e => setSettings({ ...settings, siteDescription: e.target.value })}
                        fullWidth
                        multiline
                        rows={3}
                      />
                      <TextField
                        label="İletişim E-posta"
                        value={settings.contactEmail || ''}
                        onChange={e => setSettings({ ...settings, contactEmail: e.target.value })}
                        fullWidth
                        type="email"
                      />
                      <TextField
                        label="Telefon Numarası"
                        value={settings.phoneNumber || ''}
                        onChange={e => setSettings({ ...settings, phoneNumber: e.target.value })}
                        fullWidth
                      />
                      <TextField
                        label="Adres"
                        value={settings.address || ''}
                        onChange={e => setSettings({ ...settings, address: e.target.value })}
                        fullWidth
                        multiline
                        rows={2}
                      />
                      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ py: 1.5, fontWeight: 600 }}>
                        Site Ayarlarını Kaydet
                      </Button>
                    </Box>
                </Paper>
                </Grid>

                {/* Sosyal Medya Ayarları */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 4, borderRadius: 3, boxShadow: MODERN_COLORS.shadow }}>
                    <Typography variant="h6" fontWeight={700} mb={3} sx={{ color: MODERN_COLORS.primary }}>Sosyal Medya</Typography>
                    <Box sx={{ display: 'grid', gap: 3 }}>
                      <TextField
                        label="Facebook URL"
                        value={settings.facebookUrl || ''}
                        onChange={e => setSettings({ ...settings, facebookUrl: e.target.value })}
                        fullWidth
                        placeholder="https://facebook.com/..."
                      />
                      <TextField
                        label="Instagram URL"
                        value={settings.instagramUrl || ''}
                        onChange={e => setSettings({ ...settings, instagramUrl: e.target.value })}
                        fullWidth
                        placeholder="https://instagram.com/..."
                      />
                      <TextField
                        label="YouTube URL"
                        value={settings.youtubeUrl || ''}
                        onChange={e => setSettings({ ...settings, youtubeUrl: e.target.value })}
                        fullWidth
                        placeholder="https://youtube.com/..."
                      />
                      <Button 
                        variant="outlined" 
                        color="primary" 
                        fullWidth 
                        sx={{ py: 1.5, fontWeight: 600 }}
                        onClick={handleSocialMediaSave}
                      >
                        Sosyal Medya Ayarlarını Kaydet
                      </Button>
                    </Box>
                </Paper>
                </Grid>

                    {/* Logo Ayarları */}
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: MODERN_COLORS.shadow }}>
                        <Typography variant="h6" fontWeight={700} mb={3} sx={{ color: MODERN_COLORS.primary }}>Logo Ayarları</Typography>
                        <Box sx={{ display: 'grid', gap: 3 }}>
                          {/* Header Logo */}
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600} mb={1}>Header Logo</Typography>
                            <input
                              type="file"
                              id="header-logo-upload"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={(e) => handleFileChange(e, 'header')}
                            />
                            <label htmlFor="header-logo-upload">
                              <Button variant="outlined" component="span" fullWidth sx={{ py: 1.5 }}>
                                Header Logo Yükle
                              </Button>
                            </label>
                            {settings.headerLogo && (
                              <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <img 
                                  src={settings.headerLogo} 
                                  alt="Header Logo" 
                                  style={{ 
                                    maxWidth: '100%', 
                                    maxHeight: 100, 
                                    objectFit: 'contain',
                                    borderRadius: 4
                                  }} 
                                  loading="lazy"
                                />
                              </Box>
                            )}
                          </Box>

                          {/* Footer Logo */}
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600} mb={1}>Footer Logo</Typography>
                            <input
                              type="file"
                              id="footer-logo-upload"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={(e) => handleFileChange(e, 'footer')}
                            />
                            <label htmlFor="footer-logo-upload">
                              <Button variant="outlined" component="span" fullWidth sx={{ py: 1.5 }}>
                                Footer Logo Yükle
                              </Button>
                            </label>
                            {settings.footerLogo && (
                              <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <img 
                                  src={settings.footerLogo} 
                                  alt="Footer Logo" 
                                  style={{ 
                                    maxWidth: '100%', 
                                    maxHeight: 100, 
                                    objectFit: 'contain',
                                    borderRadius: 4
                                  }} 
                                  loading="lazy"
                                />
                              </Box>
                            )}
                          </Box>

                          {/* Video Yönetimi */}
                          <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle2" fontWeight={600} mb={1}>YouTube Video URL</Typography>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', mb: 2 }}>
                              <TextField
                                label="YouTube Video URL"
                                value={settings.officeVideoUrl || ''}
                                onChange={e => setSettings({ ...settings, officeVideoUrl: e.target.value })}
                                fullWidth
                                placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
                                helperText="YouTube video URL'sini yapıştırın"
                              />
                              <Button 
                                variant="contained" 
                                onClick={async () => {
                                  try {
                                    await supabase
                                      .from('site_settings')
                                      .upsert({
                                        id: 1,
                                        youtube_url: settings.officeVideoUrl,
                                        updated_at: new Date().toISOString()
                                      });
                                    
                                    alert('Video URL başarıyla kaydedildi!');
                                  } catch (error) {
                                    console.error('Video URL kaydetme hatası:', error);
                                    alert('Video URL kaydedilirken hata oluştu!');
                                  }
                                }}
                                disabled={!settings.officeVideoUrl}
                                sx={{ py: 1.5 }}
                              >
                                Kaydet
                              </Button>
                            </Box>
                            
                            {settings.officeVideoUrl && (
                              <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" color="text.secondary" mb={1}>
                                  Mevcut Video URL:
                                </Typography>
                                <Typography variant="body2" sx={{ wordBreak: 'break-all', color: MODERN_COLORS.primary }}>
                                  {settings.officeVideoUrl}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                    </Box>
                </Paper>
                </Grid>

                {/* Admin Hesap Ayarları */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 4, borderRadius: 3, boxShadow: MODERN_COLORS.shadow }}>
                    <Typography variant="h6" fontWeight={700} mb={3} sx={{ color: MODERN_COLORS.primary }}>Admin Hesap Ayarları</Typography>
                    <Box sx={{ display: 'grid', gap: 3 }}>
                      <TextField
                        label="Mevcut Şifre"
                        type="password"
                        value={settings.adminPassword}
                        onChange={e => setSettings({ ...settings, adminPassword: e.target.value })}
                        fullWidth
                      />
                      <TextField
                        label="Yeni Şifre"
                        type="password"
                        value={settings.newPassword}
                        onChange={e => setSettings({ ...settings, newPassword: e.target.value })}
                        fullWidth
                      />
                      <TextField
                        label="Yeni Şifre (Tekrar)"
                        type="password"
                        value={settings.confirmPassword}
                        onChange={e => setSettings({ ...settings, confirmPassword: e.target.value })}
                        fullWidth
                      />
                      <Button variant="outlined" color="warning" fullWidth sx={{ py: 1.5, fontWeight: 600 }}>
                        Şifre Değiştir
                      </Button>
                    </Box>
                </Paper>
                </Grid>

                {/* Sistem Ayarları */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 4, borderRadius: 3, boxShadow: MODERN_COLORS.shadow }}>
                    <Typography variant="h6" fontWeight={700} mb={3} sx={{ color: MODERN_COLORS.primary }}>Sistem Ayarları</Typography>
                    <Box sx={{ display: 'grid', gap: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography>Bakım Modu</Typography>
                        <Switch checked={settings.maintenanceMode || false} onChange={e => setSettings({ ...settings, maintenanceMode: e.target.checked })} />
              </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography>E-posta Bildirimleri</Typography>
                        <Switch checked={settings.emailNotifications || false} onChange={e => setSettings({ ...settings, emailNotifications: e.target.checked })} />
                </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography>Otomatik Yedekleme</Typography>
                        <Switch checked={settings.autoBackup || false} onChange={e => setSettings({ ...settings, autoBackup: e.target.checked })} />
              </Box>
                      <Button variant="outlined" color="error" fullWidth sx={{ py: 1.5, fontWeight: 600 }}>
                        Veritabanını Yedekle
                      </Button>
                      <Button variant="outlined" color="error" fullWidth sx={{ py: 1.5, fontWeight: 600 }}>
                        Önbelleği Temizle
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
              <Snackbar open={settingsSaved} autoHideDuration={3000} onClose={() => setSettingsSaved(false)} message="Ayarlar başarıyla kaydedildi!" />
                </>
              )}
            </Box>
          )}

          {/* İçerik Yönetimi sekmesi */}
          {activeTab === 3 && (
            <Box sx={{ maxWidth: 1400, mx: 'auto', mt: 4, background: MODERN_COLORS.card, p: 5, borderRadius: 4, boxShadow: MODERN_COLORS.shadow }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight={900} sx={{ fontFamily: MODERN_FONT, color: MODERN_COLORS.primary }}>
                  İçerik Yönetimi
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setEditingContent({
                      id: 0,
                      page_name: 'contact',
                      section_name: 'hero',
                      title: 'İletişim',
                      content: 'Soru, görüş ve önerileriniz için aşağıdaki iletişim kanallarımızdan bize ulaşabilirsiniz.',
                      images: [],
                      order_index: 1
                    });
                    setShowContentModal(true);
                  }}
                  sx={{
                    background: MODERN_COLORS.primary,
                    '&:hover': { background: '#1a2236' }
                  }}
                >
                  Yeni İçerik Ekle
                </Button>
              </Box>

              {/* Sayfa Filtreleme */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" fontWeight={600} mb={2} sx={{ color: MODERN_COLORS.primary }}>
                  Sayfa Seçin
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {Array.from(new Set(siteContents.map(c => c.page_name))).map((pageName) => (
                    <Chip
                      key={pageName}
                      label={pageName.charAt(0).toUpperCase() + pageName.slice(1)}
                      onClick={() => setSelectedPage(pageName)}
                      color={selectedPage === pageName ? 'primary' : 'default'}
                      variant={selectedPage === pageName ? 'filled' : 'outlined'}
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              </Box>

              {/* İçerik Kartları */}
              {Object.entries(
                siteContents
                  .filter(content => !selectedPage || content.page_name === selectedPage)
                  .reduce((acc, cur) => {
                  if (!acc[cur.page_name]) acc[cur.page_name] = [];
                  acc[cur.page_name].push(cur);
                  return acc;
                }, {} as Record<string, SiteContent[]>)
              ).map(([page, contents]) => (
                <Box key={page} sx={{ mb: 6 }}>
                  <Typography variant="h5" fontWeight={700} mb={3} sx={{ 
                    textTransform: 'capitalize', 
                    color: MODERN_COLORS.primary,
                    borderBottom: `3px solid ${MODERN_COLORS.accent}`,
                    pb: 1,
                    display: 'inline-block'
                  }}>
                    {page.charAt(0).toUpperCase() + page.slice(1)} Sayfası
                  </Typography>
                  
                  <Grid container spacing={3}>
                    {contents.sort((a, b) => (a.order_index || 0) - (b.order_index || 0)).map((content) => {
                          let safeImages = [];
                          if (!content.images) safeImages = [];
                          else if (typeof content.images === 'string') {
                            try { safeImages = JSON.parse(content.images); } catch { safeImages = []; }
                          } else safeImages = content.images;

                          return (
                        <Grid item xs={12} md={6} lg={4} key={content.id}>
                          <Card sx={{ 
                            height: '100%', 
                            display: 'flex', 
                            flexDirection: 'column',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                            }
                          }}>
                            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                              {/* Bölüm Adı */}
                              <Chip 
                                label={content.section_name || 'Bölüm Yok'} 
                                size="small" 
                                color="secondary" 
                                sx={{ mb: 2 }}
                              />
                              
                              {/* Başlık */}
                              <Typography variant="h6" fontWeight={600} mb={2} sx={{ 
                                color: MODERN_COLORS.primary,
                                minHeight: '2.5rem',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}>
                                {content.title || 'Başlık Yok'}
                              </Typography>

                              {/* İçerik Önizleme */}
                              <Typography variant="body2" color="text.secondary" sx={{ 
                                mb: 2,
                                minHeight: '3rem',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                lineHeight: 1.4
                              }}>
                                {content.content ? 
                                  (content.content.length > 100 ? content.content.substring(0, 100) + '...' : content.content) 
                                  : 'İçerik yok'
                                }
                              </Typography>

                              {/* Görseller */}
                              {Array.isArray(safeImages) && safeImages.length > 0 && (
                                <Box sx={{ mb: 2 }}>
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                    Görseller ({safeImages.length})
                                  </Typography>
                                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {safeImages.slice(0, 3).map((img, idx) => (
                                      <img 
                                        key={idx} 
                                        src={img} 
                                        alt="görsel" 
                                        style={{ 
                                          width: 40, 
                                          height: 40, 
                                          objectFit: 'cover', 
                                          borderRadius: 4,
                                          border: '1px solid #e0e0e0'
                                        }} 
                                      />
                                    ))}
                                    {safeImages.length > 3 && (
                                      <Box sx={{ 
                                        width: 40, 
                                        height: 40, 
                                        borderRadius: 4,
                                        border: '1px solid #e0e0e0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: '#f5f5f5',
                                        color: '#666',
                                        fontSize: '12px'
                                      }}>
                                        +{safeImages.length - 3}
                                      </Box>
                                    )}
                                  </Box>
                                </Box>
                              )}

                              {/* Sıra Bilgisi */}
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Sıra:
                                </Typography>
                                <Chip 
                                  label={content.order_index || 0} 
                                  size="small" 
                                  variant="outlined"
                                />
                              </Box>
                            </CardContent>

                            {/* Aksiyon Butonları */}
                            <CardActions sx={{ p: 3, pt: 0, gap: 1 }}>
                              <Button 
                                size="small" 
                                variant="contained" 
                                startIcon={<EditIcon />}
                                onClick={() => { 
                                  setEditingContent(content); 
                                  setShowContentModal(true); 
                                }}
                                sx={{ 
                                  flex: 1,
                                  background: MODERN_COLORS.primary,
                                  '&:hover': { background: '#1a2236' }
                                }}
                              >
                                Düzenle
                              </Button>
                              <Button 
                                size="small" 
                                variant="outlined" 
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={async () => {
                                  if (window.confirm('Bu içeriği silmek istediğinizden emin misiniz?')) {
                                    try {
                                      if (content.id) {
                                        await handleDeleteContent(content.id);
                                        loadData();
                                      }
                                    } catch (error) {
                                      console.error('İçerik silme hatası:', error);
                                    }
                                  }
                                }}
                              >
                                Sil
                              </Button>
                            </CardActions>
                          </Card>
                        </Grid>
                          );
                        })}
                  </Grid>
                </Box>
              ))}

              {/* İçerik bulunamadı mesajı */}
              {siteContents.filter(content => !selectedPage || content.page_name === selectedPage).length === 0 && (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 8,
                  background: '#f8f9fa',
                  borderRadius: 3
                }}>
                  <Typography variant="h6" color="text.secondary" mb={2}>
                    {selectedPage ? `${selectedPage} sayfasında` : 'Hiçbir sayfada'} içerik bulunamadı
                  </Typography>
                  
                  {/* İletişim sayfası için özel şablonlar */}
                  {selectedPage === 'contact' && (
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="subtitle1" fontWeight={600} mb={3} color={MODERN_COLORS.primary}>
                        İletişim Sayfası İçin Önerilen İçerikler:
                      </Typography>
                      <Grid container spacing={2} justifyContent="center">
                        <Grid item>
                          <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => {
                              setEditingContent({
                                id: 0,
                                page_name: 'contact',
                                section_name: 'hero',
                                title: 'İletişim',
                                content: 'Soru, görüş ve önerileriniz için aşağıdaki iletişim kanallarımızdan bize ulaşabilirsiniz.',
                                images: [],
                                order_index: 1
                              });
                              setShowContentModal(true);
                            }}
                            sx={{ mb: 1 }}
                          >
                            Hero Bölümü Ekle
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => {
                              setEditingContent({
                                id: 0,
                                page_name: 'contact',
                                section_name: 'contact_info',
                                title: 'İletişim Bilgileri',
                                content: `📞 Telefon: 0282 651 20 30
📱 Cep: 0542 180 59 59
📧 E-posta: info@blrinsaat.com.tr
📍 Adres: REŞADİYE MAHALLESİ ATATÜRK BULVARI CADDESİ NO:48/D ÇORLU/TEKİRDAĞ BİLİR İNŞAAT`,
                                images: [],
                                order_index: 2
                              });
                              setShowContentModal(true);
                            }}
                            sx={{ mb: 1 }}
                          >
                            İletişim Bilgileri Ekle
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => {
                              setEditingContent({
                                id: 0,
                                page_name: 'contact',
                                section_name: 'contact_info',
                                title: 'İletişim Bilgileri (HTML)',
                                content: `<div style="color: #fff; font-size: 16; line-height: 1.8; margin-bottom: 32;">
  <div style="margin-bottom: 8;">Adres: REŞADİYE MAHALLESİ ATATÜRK BULVARI CADDESİ NO:48/D ÇORLU/TEKİRDAĞ BİLİR İNŞAAT</div>
  <div style="margin-bottom: 8;">Telefon: 0533 368 1965</div>
  <div style="margin-bottom: 8;">E-posta: iletisim@blrinsaat.com</div>
</div>`,
                                images: [],
                                order_index: 2
                              });
                              setShowContentModal(true);
                            }}
                            sx={{ mb: 1 }}
                          >
                            İletişim Bilgileri (HTML) Ekle
                          </Button>
                        </Grid>

                        <Grid item xs={12}>
                          <Button
                            variant="contained"
                            color="warning"
                            startIcon={<EditIcon />}
                            onClick={async () => {
                              // Mevcut iletişim içeriklerini düzelt
                              try {
                                const contactContents = siteContents.filter(c => c.page_name === 'contact');
                                
                                for (const content of contactContents) {
                                  if (content.id && content.section_name === 'hero') {
                                    await siteContentService.update(content.id, {
                                      ...content,
                                      title: 'İletişim',
                                      content: 'Soru, görüş ve önerileriniz için aşağıdaki iletişim kanallarımızdan bize ulaşabilirsiniz.'
                                    });
                                  }
                                }
                                
                                loadData();
                                alert('İletişim içerikleri düzeltildi!');
                              } catch (error) {
                                console.error('İçerik düzeltme hatası:', error);
                                alert('İçerik düzeltilirken hata oluştu!');
                              }
                            }}
                            sx={{ mt: 2 }}
                          >
                            Hero İçeriğini Düzelt
                          </Button>
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            variant="outlined"
                            color="info"
                            startIcon={<VisibilityIcon />}
                            onClick={() => {
                              const contactContents = siteContents.filter(c => c.page_name === 'contact');
                              console.log('Mevcut İletişim İçerikleri:', contactContents);
                              alert(`Mevcut ${contactContents.length} iletişim içeriği bulundu. Console'da detayları görebilirsiniz.`);
                            }}
                            sx={{ mt: 1 }}
                          >
                            Mevcut İçerikleri Görüntüle
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                  
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setEditingContent({
                        id: 0,
                        page_name: selectedPage || '',
                        section_name: '',
                        title: '',
                        content: '',
                        images: [],
                        order_index: 0
                      });
                      setShowContentModal(true);
                    }}
                  >
                    İlk İçeriği Ekle
                  </Button>
                </Box>
              )}
              {/* İçerik düzenleme modalı */}
              {showContentModal && editingContent && (
                <Dialog 
                  open={showContentModal} 
                  onClose={() => setShowContentModal(false)} 
                  maxWidth="md" 
                  fullWidth
                  PaperProps={{
                    sx: {
                      borderRadius: 3,
                      boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <DialogTitle sx={{ 
                    background: MODERN_COLORS.primary, 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}>
                    <EditIcon />
                    {editingContent.id ? 'İçerik Düzenle' : 'Yeni İçerik Ekle'}
                  </DialogTitle>
                  <DialogContent sx={{ p: 4 }}>
                    <Box component="form" onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        console.log('Modal submit - editingContent:', editingContent);
                        console.log('Güncellenecek ID:', editingContent.id);
                        console.log('Güncellenecek başlık:', editingContent.title);
                        console.log('Güncellenecek içerik:', editingContent.content);
                        
                        if (editingContent.id && editingContent.id > 0) {
                          const updateData = {
                            page_name: editingContent.page_name,
                            section_name: editingContent.section_name,
                            title: editingContent.title,
                            content: editingContent.content,
                            order_index: editingContent.order_index,
                            images: editingContent.images
                          };
                          console.log('Gönderilecek update data:', updateData);
                          
                          const result = await siteContentService.update(editingContent.id, updateData);
                          console.log('Update sonucu:', result);
                        } else {
                          await siteContentService.create(editingContent);
                        }
                        setShowContentModal(false);
                        setContentSaved(true);
                        loadData();
                        setTimeout(() => setContentSaved(false), 2000);
                      } catch (err: any) {
                        console.error('Modal submit hatası:', err);
                        alert('Kayıt sırasında hata oluştu: ' + (err?.message || err));
                      }
                    }} sx={{ display: 'grid', gap: 3 }}>
                      
                      {/* Sayfa Seçimi */}
                      <FormControl fullWidth>
                        <InputLabel>Sayfa</InputLabel>
                        <Select
                          value={editingContent.page_name || ''}
                          onChange={e => {
                            const pageName = e.target.value;
                            setEditingContent({ ...editingContent, page_name: pageName });
                            
                            // Sayfa seçildiğinde otomatik bölüm önerisi
                            if (pageName === 'contact' && !editingContent.section_name) {
                              setEditingContent(prev => prev ? { ...prev, section_name: 'hero' } : null);
                            }
                          }}
                          label="Sayfa"
                          required
                        >
                          <MenuItem value="home">Anasayfa</MenuItem>
                          <MenuItem value="about">Hakkımızda</MenuItem>
                          <MenuItem value="projects">Projeler</MenuItem>
                          <MenuItem value="contact">İletişim</MenuItem>
                          <MenuItem value="footer">Footer</MenuItem>
                        </Select>
                      </FormControl>

                                            {/* Bölüm Adı */}
                      <FormControl fullWidth>
                        <InputLabel>Bölüm Adı</InputLabel>
                        <Select
                          value={editingContent.section_name || ''}
                          onChange={e => setEditingContent({ ...editingContent, section_name: e.target.value })}
                          label="Bölüm Adı"
                          required
                        >
                          {editingContent.page_name === 'contact' && (
                            <>
                              <MenuItem value="hero">Hero (Sayfa Başlığı)</MenuItem>
                              <MenuItem value="contact_info">İletişim Bilgileri</MenuItem>
                            </>
                          )}
                          {editingContent.page_name === 'about' && (
                            <>
                              <MenuItem value="hero">Hero (Sayfa Başlığı)</MenuItem>
                              <MenuItem value="about_section">Hakkımızda Bölümü</MenuItem>
                              <MenuItem value="team">Ekip</MenuItem>
                              <MenuItem value="values">Değerlerimiz</MenuItem>
                              <MenuItem value="coordinator">Bölge Koordinatörü</MenuItem>
                            </>
                          )}
                          {editingContent.page_name === 'home' && (
                            <>
                              <MenuItem value="hero">Hero (Ana Slider)</MenuItem>
                              <MenuItem value="about_section">Hakkımızda Özeti</MenuItem>
                              <MenuItem value="services">Hizmetler</MenuItem>
                              <MenuItem value="projects_section">Projeler Bölümü</MenuItem>
                            </>
                          )}
                          {editingContent.page_name === 'projects' && (
                            <>
                              <MenuItem value="hero">Hero (Sayfa Başlığı)</MenuItem>
                              <MenuItem value="filter_section">Filtre Bölümü</MenuItem>
                              <MenuItem value="projects_list">Projeler Listesi</MenuItem>
                            </>
                          )}
                          {editingContent.page_name === 'footer' && (
                            <>
                              <MenuItem value="contact_info">İletişim Bilgileri</MenuItem>
                              <MenuItem value="social_media">Sosyal Medya</MenuItem>
                              <MenuItem value="quick_links">Hızlı Linkler</MenuItem>
                            </>
                          )}
                          <MenuItem value="custom">Özel Bölüm</MenuItem>
                        </Select>
                        <FormHelperText>
                          {editingContent.page_name === 'contact' && 'İletişim sayfası için önerilen bölümler'}
                          {editingContent.page_name === 'about' && 'Hakkımızda sayfası için önerilen bölümler'}
                          {editingContent.page_name === 'home' && 'Anasayfa için önerilen bölümler'}
                          {editingContent.page_name === 'projects' && 'Projeler sayfası için önerilen bölümler'}
                          {editingContent.page_name === 'footer' && 'Footer için önerilen bölümler'}
                          {!editingContent.page_name && 'Önce sayfa seçin'}
                        </FormHelperText>
                      </FormControl>

                      {/* Başlık */}
                        <TextField
                        label="Başlık" 
                        value={editingContent.title || ''} 
                        onChange={e => setEditingContent({ ...editingContent, title: e.target.value })} 
                          fullWidth
                        required
                      />

                      {/* İçerik */}
                      <TextField 
                        label="İçerik" 
                        value={editingContent.content || ''} 
                        onChange={e => setEditingContent({ ...editingContent, content: e.target.value })} 
                        fullWidth 
                        multiline 
                        minRows={4}
                        maxRows={8}
                        helperText="HTML etiketleri kullanabilirsiniz"
                      />

                      {/* Sıralama */}
                      <TextField 
                        label="Sıralama" 
                        type="number" 
                        value={editingContent.order_index || 0} 
                        onChange={e => setEditingContent({ ...editingContent, order_index: Number(e.target.value) })} 
                        fullWidth
                        helperText="Düşük sayılar önce gösterilir"
                      />

                      {/* Görsel Yönetimi */}
                      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 3, background: '#f8f9fa' }}>
                        <Typography variant="h6" fontWeight={600} mb={2}>
                          Görsel Yönetimi
                        </Typography>
                        
                        {/* URL ile Görsel Ekleme */}
                        <TextField
                          label="Görsel URL'leri (virgülle ayırın)"
                          value={Array.isArray(editingContent.images) ? editingContent.images.join(', ') : ''}
                          onChange={e => setEditingContent({ 
                            ...editingContent, 
                            images: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                          })}
                          fullWidth
                          sx={{ mb: 2 }}
                          helperText="Birden fazla görsel için virgülle ayırın"
                        />

                        {/* Dosya Yükleme */}
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          id="content-image-upload"
                          multiple
                          onChange={async e => {
                            if (e.target.files && e.target.files.length > 0) {
                              const files = Array.from(e.target.files);
                              try {
                                const urls = await uploadProjectImages(files);
                                  setEditingContent({ 
                                    ...editingContent, 
                                    images: [...(editingContent.images || []), ...urls] 
                                  });
                              } catch (err) {
                                alert('Görsel yüklenirken hata oluştu!');
                              }
                            }
                          }}
                        />
                        <label htmlFor="content-image-upload">
                            <Button 
                              variant="outlined" 
                              component="span" 
                              startIcon={<CloudUploadIcon />}
                              sx={{ minWidth: 200 }}
                            >
                              Bilgisayardan Yükle
                            </Button>
                        </label>
                        </Box>

                        {/* Görsel Önizleme */}
                        {Array.isArray(editingContent.images) && editingContent.images.length > 0 && (
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600} mb={2}>
                              Yüklenen Görseller ({editingContent.images.length})
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                              {editingContent.images.map((img, idx) => (
                                <Box key={idx} sx={{ position: 'relative' }}>
                                  <img 
                                    src={img} 
                                    alt={`görsel ${idx + 1}`} 
                                    style={{ 
                                      width: 80, 
                                      height: 80, 
                                      objectFit: 'cover', 
                                      borderRadius: 8,
                                      border: '2px solid #e0e0e0'
                                    }} 
                                  />
                                  <IconButton
                                    size="small"
                                    color="error"
                                    sx={{ 
                                      position: 'absolute', 
                                      top: -8, 
                                      right: -8, 
                                      background: 'white',
                                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                      '&:hover': { background: '#ffebee' }
                                    }}
                                    onClick={() => setEditingContent({ 
                                      ...editingContent, 
                                      images: editingContent.images!.filter((_, i) => i !== idx) 
                                    })}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                          </Box>
                        ))}
                      </Box>
                          </Box>
                        )}
                      </Box>

                      <DialogActions sx={{ pt: 2 }}>
                        <Button 
                          onClick={() => setShowContentModal(false)} 
                          color="secondary"
                          variant="outlined"
                        >
                          İptal
                        </Button>
                        <Button 
                          type="submit" 
                          variant="contained" 
                          sx={{
                            background: MODERN_COLORS.primary,
                            '&:hover': { background: '#1a2236' }
                          }}
                        >
                          {editingContent.id ? 'Güncelle' : 'Kaydet'}
                        </Button>
                      </DialogActions>
                    </Box>
                  </DialogContent>
                </Dialog>
              )}
              <Snackbar open={contentSaved} autoHideDuration={2000} onClose={() => setContentSaved(false)} message="İçerik kaydedildi!" />
            </Box>
          )}

          {/* İstatistikler sekmesi */}
          {activeTab === 4 && (
            <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, background: MODERN_COLORS.card, p: 5, borderRadius: 4, boxShadow: MODERN_COLORS.shadow }}>
              <Typography variant="h4" fontWeight={900} mb={4} sx={{ fontFamily: MODERN_FONT, color: MODERN_COLORS.primary }}>İstatistikler</Typography>
              {/* Haftalık toplam, en çok ziyaret edilen gün, ortalama, son ziyaret, sıfırlama butonu ve grafik */}
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 4 }}>
                <Paper sx={{ flex: 1, minWidth: 180, p: 3, borderRadius: 3, background: '#f7f7fa', color: MODERN_COLORS.primary, boxShadow: 1 }}>
                  <Typography fontWeight={700} fontSize={18}>Haftalık Toplam</Typography>
                  <Typography fontWeight={900} fontSize={28}>{weeklyTotal}</Typography>
                </Paper>
                <Paper sx={{ flex: 1, minWidth: 180, p: 3, borderRadius: 3, background: '#f7f7fa', color: MODERN_COLORS.primary, boxShadow: 1 }}>
                  <Typography fontWeight={700} fontSize={18}>En Çok Ziyaret Edilen Gün</Typography>
                  <Typography fontWeight={900} fontSize={22}>{mostVisited ? `${mostVisited.date} (${mostVisited.count})` : '-'}</Typography>
                </Paper>
                <Paper sx={{ flex: 1, minWidth: 180, p: 3, borderRadius: 3, background: '#f7f7fa', color: MODERN_COLORS.primary, boxShadow: 1 }}>
                  <Typography fontWeight={700} fontSize={18}>Günlük Ortalama</Typography>
                  <Typography fontWeight={900} fontSize={28}>{visitAvg}</Typography>
                </Paper>
                <Paper sx={{ flex: 1, minWidth: 180, p: 3, borderRadius: 3, background: '#f7f7fa', color: MODERN_COLORS.primary, boxShadow: 1 }}>
                  <Typography fontWeight={700} fontSize={18}>Son Ziyaret Tarihi</Typography>
                  <Typography fontWeight={900} fontSize={22}>{lastVisit || '-'}</Typography>
                </Paper>
                <Paper sx={{ flex: 1, minWidth: 180, p: 3, borderRadius: 3, background: '#f7f7fa', color: MODERN_COLORS.primary, boxShadow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <Button variant="outlined" color="error" onClick={handleResetVisits}>Ziyaretçi Verilerini Sıfırla</Button>
                </Paper>
              </Box>
              {/* Haftalık ziyaretçi grafiği */}
              <Box sx={{ width: '100%', mt: 2, background: '#fff', borderRadius: 3, p: 3, boxShadow: 1 }}>
                <Typography fontWeight={700} fontSize={18} mb={2}>Son 7 Günlük Ziyaretçi Grafiği</Typography>
                {Array.isArray(weeklyVisits) && weeklyVisits.length > 1 && weeklyVisits.every(v => typeof v.count === 'number' && !isNaN(v.count)) ? (
                  <svg width="100%" height="60" viewBox="0 0 140 60">
                    <polyline
                      fill="none"
                      stroke={MODERN_COLORS.primary}
                      strokeWidth="3"
                      points={weeklyVisits.map((v, i) => {
                        const max = Math.max(...weeklyVisits.map(x => typeof x.count === 'number' && !isNaN(x.count) ? x.count : 0));
                        const y = max ? 60 - (v.count / max * 50) : 60;
                        return `${i * 20},${isNaN(y) ? 60 : y}`;
                      }).join(' ')}
                    />
                    {weeklyVisits.map((v, i) => {
                      const max = Math.max(...weeklyVisits.map(x => typeof x.count === 'number' && !isNaN(x.count) ? x.count : 0));
                      const y = max ? 60 - (v.count / max * 50) : 60;
                      return (
                        <circle key={i} cx={i * 20} cy={isNaN(y) ? 60 : y} r="3.5" fill={MODERN_COLORS.accent} />
                      );
                    })}
                  </svg>
                ) : (
                  <Typography color="#888" fontSize={14} sx={{ mt: 1, textAlign: 'center' }}>Grafik için yeterli veri yok</Typography>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#888', mt: 1 }}>
                  {weeklyVisits.map((v, i) => (
                    <span key={i}>{v.date.slice(5)}</span>
                  ))}
                </Box>
              </Box>

              {/* WhatsApp İstatistikleri */}
              <Box sx={{ mt: 6, pt: 6, borderTop: '2px solid #f0f0f0' }}>
                <Typography variant="h5" fontWeight={700} mb={4} sx={{ fontFamily: MODERN_FONT, color: MODERN_COLORS.primary, display: 'flex', alignItems: 'center' }}>
                  <WhatsAppIcon sx={{ mr: 2, color: '#25d366' }} />
                  WhatsApp İstatistikleri
                </Typography>
                
                {whatsappLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : whatsappStats ? (
                  <>
                    {/* Genel İstatistikler */}
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 4 }}>
                      <Paper sx={{ flex: 1, minWidth: 180, p: 3, borderRadius: 3, background: '#f7f7fa', color: MODERN_COLORS.primary, boxShadow: 1 }}>
                        <Typography fontWeight={700} fontSize={18}>Toplam Tıklama</Typography>
                        <Typography fontWeight={900} fontSize={28}>{whatsappStats.total_clicks}</Typography>
                      </Paper>
                      <Paper sx={{ flex: 1, minWidth: 180, p: 3, borderRadius: 3, background: '#f7f7fa', color: MODERN_COLORS.primary, boxShadow: 1 }}>
                        <Typography fontWeight={700} fontSize={18}>Bugün</Typography>
                        <Typography fontWeight={900} fontSize={28}>{whatsappStats.today_clicks}</Typography>
                      </Paper>
                      <Paper sx={{ flex: 1, minWidth: 180, p: 3, borderRadius: 3, background: '#f7f7fa', color: MODERN_COLORS.primary, boxShadow: 1 }}>
                        <Typography fontWeight={700} fontSize={18}>Bu Hafta</Typography>
                        <Typography fontWeight={900} fontSize={28}>{whatsappStats.this_week_clicks}</Typography>
                      </Paper>
                      <Paper sx={{ flex: 1, minWidth: 180, p: 3, borderRadius: 3, background: '#f7f7fa', color: MODERN_COLORS.primary, boxShadow: 1 }}>
                        <Typography fontWeight={700} fontSize={18}>Bu Ay</Typography>
                        <Typography fontWeight={900} fontSize={28}>{whatsappStats.this_month_clicks}</Typography>
                      </Paper>
                    </Box>

                    {/* Lokasyona Göre İstatistikler */}
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h6" fontWeight={700} mb={3} sx={{ color: MODERN_COLORS.primary }}>
                        Lokasyona Göre Tıklamalar
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                          <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center', background: '#e8f5e8' }}>
                            <Typography fontWeight={700} fontSize={22} color="#25d366">Footer</Typography>
                            <Typography fontWeight={900} fontSize={28}>{whatsappStats.by_location.footer}</Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center', background: '#fff3e0' }}>
                            <Typography fontWeight={700} fontSize={22} color="#ff9800">Floating</Typography>
                            <Typography fontWeight={900} fontSize={28}>{whatsappStats.by_location.floating}</Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center', background: '#e3f2fd' }}>
                            <Typography fontWeight={700} fontSize={22} color="#2196f3">Proje Detay</Typography>
                            <Typography fontWeight={900} fontSize={28}>{whatsappStats.by_location.project_detail}</Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center', background: '#f3e5f5' }}>
                            <Typography fontWeight={700} fontSize={22} color="#9c27b0">Header</Typography>
                            <Typography fontWeight={900} fontSize={28}>{whatsappStats.by_location.header}</Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Projeye Göre İstatistikler */}
                    {whatsappStats.by_project.length > 0 && (
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" fontWeight={700} mb={3} sx={{ color: MODERN_COLORS.primary }}>
                          Projeye Göre Tıklamalar
                        </Typography>
                        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Proje</TableCell>
                                <TableCell sx={{ fontWeight: 700 }} align="right">Tıklama Sayısı</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {whatsappStats.by_project.map((project, index) => (
                                <TableRow key={index}>
                                  <TableCell>{project.project_title}</TableCell>
                                  <TableCell align="right">{project.clicks}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
            </Box>
          )}

                    {/* Günlük İstatistikler Grafiği */}
                    {whatsappStats.daily_stats.length > 0 && (
                      <Box sx={{ width: '100%', mt: 2, background: '#fff', borderRadius: 3, p: 3, boxShadow: 1 }}>
                        <Typography fontWeight={700} fontSize={18} mb={2}>Son 30 Günlük WhatsApp Tıklama Grafiği</Typography>
                        <svg width="100%" height="120" viewBox="0 0 800 120">
                          <polyline
                            fill="none"
                            stroke="#25d366"
                            strokeWidth="3"
                            points={whatsappStats.daily_stats.map((stat, i) => {
                              const max = Math.max(...whatsappStats.daily_stats.map(s => s.clicks));
                              const y = max ? 120 - (stat.clicks / max * 100) : 120;
                              const x = (i / (whatsappStats.daily_stats.length - 1)) * 800;
                              return `${x},${y}`;
                            }).join(' ')}
                          />
                          {whatsappStats.daily_stats.map((stat, i) => {
                            const max = Math.max(...whatsappStats.daily_stats.map(s => s.clicks));
                            const y = max ? 120 - (stat.clicks / max * 100) : 120;
                            const x = (i / (whatsappStats.daily_stats.length - 1)) * 800;
                            return (
                              <circle key={i} cx={x} cy={y} r="4" fill="#25d366" />
                            );
                          })}
                        </svg>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#888', mt: 1 }}>
                          {whatsappStats.daily_stats.map((stat, i) => (
                            <span key={i}>{stat.date.slice(5)}</span>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </>
                ) : (
                  <Typography color="#888" fontSize={16} sx={{ textAlign: 'center', p: 4 }}>
                    WhatsApp istatistikleri yüklenemedi.
                  </Typography>
                )}
              </Box>
            </Box>
          )}


        </Box>
      </Box>
    );
}

export default Admin; 