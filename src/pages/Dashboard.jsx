import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Grid, Card, CardActionArea, CardContent, CardHeader, Chip, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import * as UserServices from './../services/auth.services.js';
import videosServices from './../services/videos.services.js';
import LoadingScreen from './../components/LoadingScreen';

// Función para normalizar cadenas: minúsculas y sin acentos
function normalizeString(str) {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Estado para el filtro de categoría; "Todas" muestra todo
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  // Cargar usuario actual
  useEffect(() => {
    const currentUserId = localStorage.getItem('_id');
    if (currentUserId) {
      UserServices.findUserById(currentUserId)
        .then(data => {
          setCurrentUser(data);
          console.log(data);
        })
        .catch(err => setError(err.message));
    }
  }, []);

  // Cargar cursos y marcar si están permitidos según membresía
  useEffect(() => {
    if (!currentUser) return;
    
    // Definición de ranking de membresías
    const membershipRank = {
      gratuito: 1,
      basico: 2,
      elite: 3,
    };
    // Nivel del usuario (normalizado)
    const userLevel = currentUser.category ? normalizeString(currentUser.category) : "gratuito";
    const userRank = membershipRank[userLevel] || 1;

    videosServices.getVideos()
      .then(data => {
        // Se procesa cada curso para determinar:
        // 1. El nivel requerido (calculando el máximo ranking de las opciones que tenga el curso).
        // 2. Si el usuario tiene el nivel suficiente para acceder.
        const processed = data.map(course => {
          let levelsArr = [];
          if (Array.isArray(course.jerarquia)) {
            levelsArr = course.jerarquia.map(j => normalizeString(j));
          } else if (course.jerarquia) {
            levelsArr = [normalizeString(course.jerarquia)];
          }
          // Determinar el nivel más alto requerido (por defecto "gratuito")
          let maxRank = 1;
          levelsArr.forEach(level => {
            const rank = membershipRank[level] || 1;
            if (rank > maxRank) maxRank = rank;
          });
          // Obtener el nivel requerido a partir del ranking
          const requiredLevel = Object.keys(membershipRank).find(key => membershipRank[key] === maxRank) || "gratuito";
          
          const allowed = userRank >= membershipRank[requiredLevel];
          return { ...course, allowed, requiredLevel };
        });
        setCourses(processed);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [currentUser]);

  // Extraer de courses todas las categorías (únicas) que se encuentren
  const allCategories = useMemo(() => {
    const catSet = new Set();
    courses.forEach(course => {
      if (Array.isArray(course.categoria)) {
        course.categoria.forEach(cat => {
          const name = typeof cat === "object" ? cat.name : cat;
          catSet.add(name);
        });
      } else {
        catSet.add(course.categoria);
      }
    });
    // Convertir a array
    let categoriesArray = Array.from(catSet);
    // Buscar y extraer la categoría "gratuito" (sin distinguir mayúsculas)
    let gratuitoIndex = categoriesArray.findIndex(cat => normalizeString(cat) === 'gratuito');
    let gratuito;
    if (gratuitoIndex !== -1) {
      gratuito = categoriesArray.splice(gratuitoIndex, 1)[0];
    }
    // Ordenar alfabéticamente el resto
    categoriesArray.sort((a, b) => a.localeCompare(b));
    // "Todas" siempre va primero, luego "Gratuito" (si existe) y después el resto
    return gratuito ? ["Todas", gratuito, ...categoriesArray] : ["Todas", ...categoriesArray];
  }, [courses]);

  // Filtrar y ordenar cursos según la categoría seleccionada
  const displayCourses = useMemo(() => {
    // Definición de ranking de membresías para ordenar
    const membershipRank = {
      gratuito: 1,
      basico: 2,
      elite: 3,
    };

    if (selectedCategory === "Todas") {
      // Ordenar cursos según el nivel requerido: gratuito -> basico -> elite
      return [...courses].sort((a, b) => {
        return membershipRank[a.requiredLevel] - membershipRank[b.requiredLevel];
      });
    }
    return courses.filter(course => {
      if (Array.isArray(course.categoria)) {
        return course.categoria.some(cat => {
          const name = typeof cat === "object" ? cat.name : cat;
          return normalizeString(name) === normalizeString(selectedCategory);
        });
      }
      return normalizeString(course.categoria) === normalizeString(selectedCategory);
    });
  }, [courses, selectedCategory]);

  // Función para determinar el plan mínimo requerido según jerarquía (para mostrar en el botón)
  const getRequiredMembership = (course) => {
    if (course.requiredLevel) {
      if (course.requiredLevel === "elite") return "Elite";
      if (course.requiredLevel === "basico") return "Básico";
      return "Gratuito";
    }
    return "";
  };

  if (loading) return <LoadingScreen />;
  if (error) return <Box sx={{ textAlign: 'center', p: 4 }}>Error: {error}</Box>;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }} className={'ColorBackground pb-5 text-light'}>
      <Typography variant="h4" align="center" gutterBottom className='pt-5'>
        Biblioteca Strength Vault
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom className='pb-5'>
        Bienvenido <b>{currentUser && `${currentUser.username}`}</b> — Actualmente, tenés acceso a los cursos hasta la categoría <b>{currentUser && `${currentUser.category || 'Gratuito'}`}</b> 
      </Typography>

      {/* Filtros de Categoría */}
      <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, mb: 5 }}>
        {allCategories.map((cat, idx) => (
          <Chip
            key={idx}
            label={cat}
            clickable
            sx={{
              backgroundColor: selectedCategory === cat ? "#e52c24" : "#f5f5f5",
              color: selectedCategory === cat ? "#fff" : "#000",
            }}
            onClick={() => setSelectedCategory(cat)}
          />
        ))}
      </Box>

      <Grid container spacing={3} justifyContent="center" className='pb-5'>
        {displayCourses.map(course => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={course._id}>
            <Card
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                opacity: course.allowed ? 1 : 0.5
              }}
            >
              <CardActionArea
                onClick={() => {
                  if (course.allowed) {
                    navigate(`/video/${currentUser._id}/${course._id}`);
                  } else {
                    alert("No tienes autorización para ver este curso. Si crees que es un error, por favor, contacta al administrador.");
                  }
                }}
                sx={{ flexGrow: 1, p: 0 }}
              >
                <CardHeader 
                  title={course.nombre}
                  titleTypographyProps={{ variant: 'h6', noWrap: true }}
                  sx={{ pb: 0 }}
                />
                <CardContent 
                  sx={{ 
                    overflow: 'hidden', 
                    pt: 1,
                    mb: 2 // margen inferior para separar de las categorías
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {course.descripcion}
                  </Typography>
                </CardContent>
                <Box sx={{ px: 2, pb: 2 }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {Array.isArray(course.categoria)
                      ? course.categoria.map((cat, idx) => (
                          <Chip
                            key={idx}
                            label={typeof cat === "object" ? cat.name : cat}
                            size="small"
                          />
                        ))
                      : (
                        <Chip label={course.categoria} size="small" />
                      )
                    }
                  </Box>
                </Box>
              </CardActionArea>
              <Box sx={{ p: 1, textAlign: 'center' }}>
                {course.allowed ? (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate(`/video/${currentUser._id}/${course._id}`)}
                    className='colorMainRed'
                  >
                    Ver Detalles
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    size="small"
                    disabled
                    className='colorMainRed'
                  >
                    Solo plan {getRequiredMembership(course)}
                  </Button>
                )}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
