import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom'; // Asegúrate de importar useLocation
import { Sidebar } from 'primereact/sidebar';
import * as authService from './services/auth.services.js';
import { Fab, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';


import Dashboard from './pages/Dashboard';

import HomePage from './pages/HomePage.jsx';
import Login from './pages/Login.jsx';
import StrengthLogo from './assets/logos/strength.png';
import VideoMobile from './pages/VideoMobile.jsx';

import { IconButton } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CallIcon from '@mui/icons-material/Call';

import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import Administer from './pages/Administer.jsx';
import AdministerVideos from './pages/AdministerVideos.jsx';
import Perfil from './pages/Perfil.jsx';
import PasarelCash from './pages/PasarelCash.jsx';

// eslint-disable-next-line react/prop-types
function RoutePrivate({ isAutenticate, children }) {
  return <>{isAutenticate ? children : <Navigate to="/login" />}</>;
}

const App = () => {
  const [user, setUser] = useState();
  const [status, setStatus] = useState();
  const [isAutenticated, setIsAutenticated] = useState(!!localStorage.getItem('token'));
  const [menuSidebar, setMenuSidebar] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Obtén la ubicación actual

  const id = localStorage.getItem('_id');

  useEffect(() => {
    console.log('Current Page:', location.pathname); // Muestra la ruta actual en la consola
  }, [location]); // Ejecuta el efecto cada vez que la ruta cambie

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAutenticated(true);
    } else {
      setIsAutenticated(false);
    }
  }, [user, status]);

  if (isAutenticated === null) {
    return <h1>Carga</h1>;
  }

  function isAdmin() {
    const admin = localStorage.getItem('role');
    return admin === 'admin';
  }

  const handleMenuSidebarOpen = () => {
    setMenuSidebar(true);
  };

  const handleMenuSidebarHide = () => {
    setMenuSidebar(false);
  };

  function onLogin(user, token) {
    setUser(user);
    console.log(user);
    setIsAutenticated(true);
    localStorage.setItem('token', token);
    localStorage.setItem('_id', user._id);
    if(user.role == 'admin'){
      localStorage.setItem('role', user.role);
      localStorage.setItem('price', user.price);
    } else{
      console.log('asd')
    }
    navigate(`/`);
  }

  function onLogout() {
    authService.logout();
    setIsAutenticated(false);
    //localStorage.removeItem('token');
    localStorage.removeItem('role');

    setMenuSidebar(false);
    navigate('/');
  }

  return (
    <div className="container-fluid m-0 p-0">
      <nav className={`navbar navbar-expand-lg navbar-dark colorNavBar w-100 p-4`}>
        <a className="navbar-brand open-sans-titles text-light ms-3" href="/">
          STRENGTH VAULT
        </a>
        <button className="navbar-toggler" type="button" onClick={handleMenuSidebarOpen}>
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav text-center text-light">
            <li className="nav-item ">
              <Link className={`nav-link mx-2 px-3 text-light colorNavLinks rounded-5 ${location.pathname == '/' && 'active'} `} to="/">
                Inicio
              </Link>
            </li>

            <li className="nav-item ">
              <Link className={`nav-link mx-2 px-3 text-light colorNavLinks rounded-5 ${location.pathname == '/planes' && 'active'} `} to="/planes">
                Planes
              </Link>
            </li>

            <li className="nav-item">
              {isAutenticated && isAdmin() && (
                <>
                  <Link className={`nav-link mx-2 text-light colorNavLinks rounded-5 ${location.pathname == '/panel' && 'active'} `} to={`/panel`}>
                    Panel de administración
                  </Link>
                </>
              )}
            </li>

            <li className="nav-item">
              {isAutenticated && isAdmin() && (
                <>
                  <Link className={`nav-link mx-2 text-light colorNavLinks rounded-5 ${location.pathname == '/videos' && 'active'} `} to={`/videos`}>
                    Administración de videos
                  </Link>
                </>
              )}
            </li>

            <li className="nav-item">
              {isAutenticated && (
                <>
                  <Link className={`nav-link mx-2 text-light colorNavLinks rounded-5 ${location.pathname == '/cursos' && 'active'} `} to={`/cursos`}>
                    Cursos
                  </Link>
                </>
              )}
            </li>

            <li className="nav-item">
              {isAutenticated && !isAdmin() && (
                <>
                  <Link className={`nav-link mx-2 text-light colorNavLinks rounded-5 ${location.pathname == '/perfil' && 'active'} `} to={`/perfil`}>
                    Perfil
                  </Link>
                </>
              )}
            </li>

            <li className="nav-item">
              {!isAutenticated && (
                <>
                  <Link className={`nav-link mx-2 text-light colorNavLinks rounded-5 ${location.pathname == '/login' && 'active'}`} to="/login">
                    Iniciar sesión
                  </Link>
                </>
              )}
            </li>

            <li className="nav-item">
              {!isAutenticated && (
                <>
                  <Link className={`nav-link mx-2 text-light colorNavLinks rounded-5 ${location.pathname == '/register' && 'active'}`} to="/register">
                    Registro
                  </Link>
                </>
              )}
            </li>

            <li className="nav-item">
              {isAutenticated && (
                <>
                  <Link className={`nav-link mx-2 text-light colorNavLinks rounded-5 ${location.pathname == '/register' && 'active'}`} onClick={onLogout}>
                    Cerrar sesión
                  </Link>
                </>
              )}
            </li>
          </ul>
        </div>
      </nav>

      <div className="ColorBackground-2 text-center pt-5">


        <img src={StrengthLogo} alt="Academy Logo" className="logo img-fluid mb-5 mt-5 pt-3" />
        <h1 className="text-light open-sans-titles">STRENGTH VAULT</h1>
        <p className="fade-in m-0 pb-5 text-light">Tu Fortaleza en el Mundo de la Fuerza</p>
      </div>



      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login onLogin={onLogin}  />} />
        <Route path="/register" element={<Login onLogin={onLogin} register={true} />} />
        <Route path="/planes" element={<PasarelCash />} />

        <Route
          path="/cursos"
          element={
            <RoutePrivate isAutenticate={isAutenticated}>
              <Dashboard />
            </RoutePrivate>
          }
        />

        <Route
          path="/panel"
          element={
            <RoutePrivate isAutenticate={isAutenticated}>
              <Administer />
            </RoutePrivate>
          }
        />

        <Route
          path="/perfil"
          element={
            <RoutePrivate isAutenticate={isAutenticated}>
              <Perfil />
            </RoutePrivate>
          }
        />

        
        <Route
          path="/videos"
          element={
            <RoutePrivate isAutenticate={isAutenticated}>
              <AdministerVideos />
            </RoutePrivate>
          }
        />

        <Route
          path="/video/:userId/:videoId"
          element={
            <RoutePrivate isAutenticate={isAutenticated}>
              <VideoMobile />
            </RoutePrivate>
          }
        />

        <Route path="*" element={<div><h1>404</h1><p>Esta pagina no se encuentra disponible.</p></div>} />
      </Routes>

      <Sidebar visible={menuSidebar} onHide={handleMenuSidebarHide} blockScroll={true} className="ColorBackground" position="right">
        <ul className="list-group list-group-flush ulDecoration  p-3">
          <li className="list-group-item bg-transparent  p-1">
            <Link className="py-2 nav-link text-light" to="/" onClick={() => setMenuSidebar(false)}>
              Inicio
            </Link>
          </li>

          <li className="list-group-item bg-transparent  p-1">
            <Link className="py-2 nav-link text-light" to="/planes/" onClick={() => setMenuSidebar(false)}>
              Planes
            </Link>
          </li>

          {isAutenticated && (
            <li className="list-group-item bg-transparent p-1">
              <>
                <Link className="py-2 nav-link text-light" to={`/cursos/`} onClick={() => setMenuSidebar(false)}>
                  Cursos
                </Link>
              </>
            
          </li>)}

          
              {isAutenticated && isAdmin() && (
                <li className="list-group-item bg-transparent p-1">
                <>
                  <Link className={`py-2 nav-link text-light  `} to={`/panel`} onClick={() => setMenuSidebar(false)}>
                    Panel de administración
                  </Link>
                </>
                </li>
              )}
            

            
              {isAutenticated && isAdmin() && (
                <li className="list-group-item bg-transparent p-1">
                <>
                  <Link className={`py-2 nav-link text-light `} to={`/videos`} onClick={() => setMenuSidebar(false)}>
                    Administración de videos
                  </Link>
                </>
                </li>
              )}
            

          {!isAutenticated && (
            <li className="list-group-item bg-transparent p-1">
              <Link className="py-2 nav-link text-light" to="/login" onClick={() => setMenuSidebar(false)}>
                Iniciar sesión
              </Link>
            </li>
          )}
          
          {!isAutenticated && (
            <li className="list-group-item bg-transparent p-1">
              <Link className="py-2 nav-link text-light" to="/register" onClick={() => setMenuSidebar(false)}>
                Registro
              </Link>
            </li>
          )}

          {isAutenticated && (
            <li className="list-group-item bg-transparent p-1">
              <Link className="py-2 nav-link text-light" onClick={onLogout}>
                Cerrar sesión
              </Link>
            </li>
          )}
        </ul>
      </Sidebar>

      <footer className="ColorBackground-2 text-white py-4 ">
        <div className="container">
          <div className="row justify-content-around">
            <div className="col-md-4 mb-4">
              <h5>Sobre Nosotros</h5>
              <p>
                Strength Vault es más que un sitio web; es tu compañero en el apasionante mundo del entrenamiento de
                fuerza. Somos tu fuente de información más confiable, actualizada y completa, diseñada para ayudarte a
                alcanzar tus objetivos y a profundizar tus conocimientos en este campo.
              </p>
            </div>

            <div className="col-md-4 mb-4 ">
              <div className="row justify-content-center">
                <h5>
                  <IconButton className={'text-light'}>
                    {' '}
                    <CallIcon />{' '}
                  </IconButton>{' '}
                  Contáctanos
                </h5>

                <ul className="list-unstyled">
                  <li>
                    <IconButton className={'text-light'}>
                      {' '}
                      <WhatsAppIcon />{' '}
                    </IconButton>{' '}
                    +5491123456789
                  </li>
                  <li>
                    <IconButton className={'text-light'}>
                      {' '}
                      <EmailIcon />{' '}
                    </IconButton>{' '}
                    strengthvault@gmail.com
                  </li>
                  <li>
                    <IconButton className={'text-light'}>
                      {' '}
                      <LocationOnIcon />{' '}
                    </IconButton>{' '}
                    Argentina
                  </li>
                </ul>

                <div
                  className={`mt-3 row justify-content-center ${
                    window.innerWidth > 968 ? 'text-start' : 'text-center'
                  }`}
                >
                  <Link to={''} className="text-white col-4 ">
                    <IconButton className={'text-light'}>
                      {' '}
                      <WhatsAppIcon />{' '}
                    </IconButton>
                  </Link>
                  <Link to={''} className="text-white col-4 ">
                    <IconButton className={'text-light'}>
                      {' '}
                      <YouTubeIcon />{' '}
                    </IconButton>
                  </Link>
                  <Link to={''} className="text-white col-4 ">
                    <IconButton className={'text-light'}>
                      {' '}
                      <InstagramIcon />{' '}
                    </IconButton>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center py-2">
          <p className="mb-0 text-ligth">&copy; 2025 Todos los derechos reservados - STRENGTHVAULT</p>
        </div>
      </footer>

      {/* Botón flotante para WhatsApp (izquierda) */}
      <Fab
        color="primary"
        aria-label="whatsapp"

        style={{ position: 'fixed', bottom: 20, right: 20,  zIndex: 1000 }}
      >
        <WhatsAppIcon />
      </Fab>

    </div>
  );
};

export default App;
