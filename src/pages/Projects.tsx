import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { projectService, Project } from '../services/supabaseService';
import { useNavigate } from 'react-router-dom';

const categories = [
  { key: 'devam', title: 'Devam Eden Projeler', color: '#1e88e5' },
  { key: 'bitmis', title: 'Tamamlanan Projeler', color: '#43a047' },
  { key: 'baslayan', title: 'Başlanacak Projeler', color: '#ff9800' },
];

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.getAll();
      setProjects(data);
    } catch (err) {
      setError('Projeler yüklenirken hata oluştu');
      if (err instanceof Error) {
        console.error('Projeler yüklenirken hata:', err.message);
      } else {
        console.error('Projeler yüklenirken hata:', JSON.stringify(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const getProjectsByStatus = (status: string) =>
    projects.filter((project) => project.status === status);

  // Proje kartı görsel alanı: 2 görsel varsa özel grid
  const ProjectImages: React.FC<{ images: string[]; title: string }> = ({ images, title }) => {
    if (images.length === 2) {
      return (
        <Box sx={{
          width: '100%',
          height: 220,
          position: 'relative',
          display: 'block',
          overflow: 'hidden',
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          background: '#f7f7f7'
        }}>
          <img
            className="project-image"
            src={images[0]}
            alt={title}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '50%',
              height: '100%',
              objectFit: 'cover',
              borderTopLeftRadius: 4,
              borderBottomLeftRadius: 4,
              display: 'block'
            }}
          />
          <img
            className="project-image"
            src={images[1]}
            alt={title}
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              width: '50%',
              height: '100%',
              objectFit: 'cover',
              borderTopRightRadius: 4,
              borderBottomRightRadius: 4,
              display: 'block'
            }}
          />
        </Box>
      );
    }
    // Diğer durumlar
    return (
      <Box sx={{ width: '100%', height: 220, overflow: 'hidden', position: 'relative', background: '#f7f7f7' }}>
        <img
          className="project-image"
          src={images && images.length > 0 ? images[0] : '/front/gorsel/genel/logo.png'}
          alt={title}
          style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block', borderTopLeftRadius: 4, borderTopRightRadius: 4 }}
        />
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(180deg,rgba(30,136,229,0.08),rgba(67,160,71,0.10))', pointerEvents: 'none' }} />
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ py: 8, backgroundColor: '#f5f5f5', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography>Projeler yükleniyor...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 8, backgroundColor: '#f5f5f5', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', pb: 4, pt: { xs: '110px', sm: '110px' } }}>
      {/* Üst başlık ve breadcrumb kutusu */}
      <Box sx={{
        background: '#f7f7f7',
        boxShadow: '0 2px 12px #0001',
        borderRadius: 0,
        px: { xs: 2, md: 0 },
        py: 3,
        mb: 5,
        borderBottom: '1px solid #ececec',
        marginTop: '140px'
      }}>
        <Container maxWidth="lg">
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2,
          }}>
            <Typography variant="h4" sx={{ fontWeight: 900, fontSize: { xs: 22, md: 28 }, fontFamily: 'Tenor Sans, Arbutus Slab, serif', color: '#232526', mb: { xs: 1, sm: 0 } }}>
              Tüm Projeler
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', fontSize: 15, color: '#888', fontFamily: 'Montserrat, Arial', mt: { xs: 1, sm: 0 } }}>
              <a href="/" style={{ color: '#1e88e5', textDecoration: 'none', fontWeight: 600 }}>Anasayfa</a>
              <span style={{ margin: '0 8px', fontSize: 18, color: '#bbb' }}>&gt;</span>
              <span style={{ color: '#232526', fontWeight: 700 }}>Tüm Projeler</span>
            </Box>
          </Box>
        </Container>
      </Box>
      <Container maxWidth="lg">
        {categories.map((cat) => (
          <Box key={cat.key} sx={{ mb: 8 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: 20, md: 28 }, color: cat.color, mb: 3, fontFamily: 'Tenor Sans, Arbutus Slab, serif', letterSpacing: 0.5 }}>
              {cat.title}
            </Typography>
            <Grid container spacing={4}>
              {getProjectsByStatus(cat.key).length > 0 ? (
                getProjectsByStatus(cat.key).map((project) => {
                  const filteredImages = (project.images || []).filter(Boolean);
                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={project.id} sx={{ width: '100%', display: 'flex', alignItems: 'stretch' }}>
                      <Box
                        className="modern-card"
                        sx={{
                          width: '100%',
                          minWidth: 0,
                          flex: 1,
                          cursor: 'pointer',
                          borderRadius: 4,
                          overflow: 'hidden',
                          boxShadow: '0 4px 24px #0001',
                          background: '#fff',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'transform 0.18s cubic-bezier(.4,2,.6,1), box-shadow 0.18s cubic-bezier(.4,2,.6,1)',
                          '&:hover': {
                            transform: 'scale(1.035)',
                            boxShadow: `0 8px 36px ${cat.color}33`,
                          },
                        }}
                        onClick={() => navigate(`/proje/${project.id}`)}
                      >
                        <ProjectImages images={filteredImages} title={project.title} />
                        <Box sx={{ width: '100%', background: '#232526', borderRadius: '0 0 4px 4px', p: '12px 0 10px 0', minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography sx={{ fontWeight: 700, fontSize: '1.13rem', color: '#e3eafc', textAlign: 'center', letterSpacing: '0.5px', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', px: 1, m: 0, lineHeight: 1.2, fontFamily: 'Montserrat, Tenor Sans, Arial' }}>
                            {project.title}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  );
                })
              ) : (
                <Grid item xs={12}>
                  <Typography variant="body1" color="text.secondary" align="center">
                    Bu kategoride henüz proje bulunmuyor.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        ))}
      </Container>
      <style>{`
  @media (max-width: 1200px) {
    .modern-card { max-width: 100% !important; }
  }
  @media (max-width: 900px) {
    .modern-card { max-width: 100% !important; }
    .project-title { font-size: 0.95rem !important; }
    .prj-img { height: 120px !important; }
  }
  @media (max-width: 600px) {
    .modern-card { max-width: 100% !important; }
    .project-title { font-size: 0.9rem !important; }
    .prj-img { height: 80px !important; }
  }
`}</style>
    </Box>
  );
};

export default Projects; 