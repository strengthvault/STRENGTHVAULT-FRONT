import { useState } from 'react';
import * as authService from './../services/auth.services.js';
import RegisterPage from './../components/Register.jsx'; // Importamos el componente de registro

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function LoginPage({ onLogin, register }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState();
  const [showRegister, setShowRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Nuevo estado para mostrar/ocultar contraseña

  function onSubmit(event) {
    event.preventDefault();
    authService.login(username, password)
      .then(({ user, token }) => {
        onLogin(user, token);
      })
      .catch(err => {
        setError(err.message);
      });
  }

  function onChangeUsername(event) {
    setUsername(event.target.value);
  }

  function onChangePassword(event) {
    setPassword(event.target.value);
  }

  // Alternar entre mostrar/ocultar contraseña
  function togglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  function toggleRegister() {
    setShowRegister(!showRegister);
  }

  return (
    <>
      {showRegister || register == true ? (
        <RegisterPage onRegister={onLogin} />
      ) : (
        <main className='container-fluid d-flex align-items-center justify-content-center ColorBackground'>
          <div className="card shadow-lg p-4 my-5 fade-in" style={{ maxWidth: '400px', width: '100%' }}>
            <h2 className='text-center mb-4 ' style={{ fontWeight: 'bold', color: '#333' }}>Iniciar Sesión</h2>

            {error && 
              <div className="alert alert-danger text-center p-0" role="alert">
                <p className='p-2 m-0'>{error}</p>
              </div>
            }

            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Nombre de usuario</label>
                <input 
                  type="text" 
                  className="form-control" 
                  onChange={onChangeUsername} 
                  value={username} 
                  id="username" 
                  placeholder="Juan" 
                  style={{ borderRadius: '8px', borderColor: '#ddd' }}
                />
              </div>
              <div className="mb-3 position-relative">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <input 
                  type={showPassword ? "text" : "password"} // Cambiar entre texto y password
                  className="form-control" 
                  onChange={onChangePassword} 
                  value={password}
                  id="password" 
                  placeholder="********" 
                  style={{ borderRadius: '8px', borderColor: '#ddd' }}
                />
                <button 
                  type="button" 
                  onClick={togglePasswordVisibility}
                  className="btn btn-link position-absolute" 
                  style={{ top: '72%', right: '10px', transform: 'translateY(-50%)', textDecoration: 'none' }}
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </button>
              </div>
              <button 
                className='btn colorButtons w-100 mt-3' 
                type="submit" 
                style={{ borderRadius: '8px', padding: '10px', fontWeight: 'bold' }}
              >
                Ingresar
              </button>
            </form>

            <div className="text-center mt-3">
              <button 
                className="btn btn-link" 
                onClick={toggleRegister} 
                style={{ textDecoration: 'none', color: '#242424', fontWeight: 'bold' }}
              >
                ¿No tenés cuenta? <span style={{ textDecoration: 'underline' }}>Registrate acá</span>
              </button>
            </div>
          </div>
        </main>
      )}
    </>
  );
}

export default LoginPage;
