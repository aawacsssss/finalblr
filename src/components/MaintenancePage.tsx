import React from 'react';
import { Box, Typography, Paper, Button, Container, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ConstructionIcon from '@mui/icons-material/Construction';

// Styled bileşenler
const MaintenanceContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)',
    animation: 'float 6s ease-in-out infinite'
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 150,
    height: 150,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.08)',
    animation: 'float 8s ease-in-out infinite reverse'
  }
}));

const MaintenanceCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  borderRadius: 16,
  boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
  background: 'rgba(255,255,255,0.98)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.2)',
  position: 'relative',
  zIndex: 1,
  maxWidth: 600,
  width: '100%',
  textAlign: 'center'
}));

const ContactButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  borderRadius: 25,
  padding: theme.spacing(1.5, 3),
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
  }
}));

interface MaintenancePageProps {
  settings: {
    maintenance_title?: string;
    maintenance_message?: string;
    contact_phone?: string;
    contact_email?: string;
    estimated_duration?: string;
  };
}

const MaintenancePage: React.FC<MaintenancePageProps> = ({ settings }) => {
  const handlePhoneClick = () => {
    if (settings.contact_phone) {
      window.location.href = `tel:${settings.contact_phone}`;
    }
  };

  const handleEmailClick = () => {
    if (settings.contact_email) {
      window.location.href = `mailto:${settings.contact_email}`;
    }
  };

  return (
    <MaintenanceContainer>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          body, html {
            margin: 0 !important;
            padding: 0 !important;
            height: 100% !important;
            overflow-x: hidden !important;
          }
        `}
      </style>
      
      <Container maxWidth="md">
        <MaintenanceCard>
          {/* Logo */}
          <Box sx={{ mb: 4 }}>
            <img 
              src="/front/gorsel/genel/logo.png" 
              alt="BLR İnşaat Logo" 
              style={{ 
                width: 180, 
                height: 'auto',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
              }} 
            />
          </Box>

          {/* Bakım İkonu */}
          <Box sx={{ mb: 3 }}>
            <ConstructionIcon 
              sx={{ 
                fontSize: 80, 
                color: '#ff9800',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
              }} 
            />
          </Box>

          {/* Başlık */}
          <Typography 
            variant="h3" 
            fontWeight={900} 
            sx={{ 
              mb: 3, 
              color: '#1a2236',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            {settings.maintenance_title || 'BLR İNŞAAT - Bakım Modu'}
          </Typography>

          {/* Mesaj */}
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              mb: 4, 
              lineHeight: 1.6,
              fontSize: { xs: '1rem', md: '1.1rem' }
            }}
          >
            {settings.maintenance_message || 'Sitemiz şu anda bakım modunda. Lütfen daha sonra tekrar deneyiniz.'}
          </Typography>

          {/* Tahmini Süre */}
          {settings.estimated_duration && (
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AccessTimeIcon sx={{ mr: 1, color: '#ff9800' }} />
              <Typography variant="body1" color="text.secondary">
                Tahmini süre: <strong>{settings.estimated_duration}</strong>
              </Typography>
            </Box>
          )}

          {/* İletişim Butonları */}
          <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
            {settings.contact_phone && (
              <Grid item>
                <ContactButton
                  variant="contained"
                  color="primary"
                  startIcon={<PhoneIcon />}
                  onClick={handlePhoneClick}
                  sx={{ 
                    background: 'linear-gradient(45deg, #25d366 30%, #128c7e 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #128c7e 30%, #25d366 90%)'
                    }
                  }}
                >
                  {settings.contact_phone}
                </ContactButton>
              </Grid>
            )}
            
            {settings.contact_email && (
              <Grid item>
                <ContactButton
                  variant="outlined"
                  color="primary"
                  startIcon={<EmailIcon />}
                  onClick={handleEmailClick}
                  sx={{ 
                    borderColor: '#1a2236',
                    color: '#1a2236',
                    '&:hover': {
                      borderColor: '#1a2236',
                      backgroundColor: 'rgba(26, 34, 54, 0.04)'
                    }
                  }}
                >
                  {settings.contact_email}
                </ContactButton>
              </Grid>
            )}
          </Grid>

          {/* Alt Bilgi */}
          <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
            <Typography variant="body2" color="text.secondary">
              BLR İNŞAAT - Kaliteli ve güvenilir inşaat hizmetleri
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              © 2024 BLR İnşaat. Tüm hakları saklıdır.
            </Typography>
          </Box>
        </MaintenanceCard>
      </Container>
    </MaintenanceContainer>
  );
};

export default MaintenancePage; 