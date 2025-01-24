import { useState } from 'react';
import * as authService from './../services/auth.services.js';
import { useNavigate } from 'react-router-dom';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function RegisterPage({ onRegister }) {
  const [username, setUsername] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(event) {
    event.preventDefault();
    
    // 1) Validaciones previas en el frontend
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // 2) Llamada al servicio de registro
    try {
      const { user, token } = await authService.register(username, email, password);
      // Si el backend devuelve "user" y "token" sin errores,
      // guardamos la info y redirigimos
      onRegister(user, token);
      navigate('/');
    } catch (err) {
      // 3) Mostrar mensaje de error proveniente del backend
      //    (por ej. "El nombre de usuario ya está en uso" o "El email ya está registrado")
      let errorMsg = 'Error al registrar';  // default
      // Si tu servicio usa fetch y lanza un Error con `err.message`,
      // este valor puede ser el proveniente del backend
      if (err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    }
  }

  // Handlers de input
  function onChangeUsername(e) { setUsername(e.target.value); }
  function onChangeEmail(e) { setEmail(e.target.value); }
  function onChangePassword(e) { setPassword(e.target.value); }
  function onChangeConfirmPassword(e) { setConfirmPassword(e.target.value); }

  // Alternar visibilidad de contraseña
  function togglePasswordVisibility() {
    setShowPassword(!showPassword);
  }
  function toggleConfirmPasswordVisibility() {
    setShowConfirmPassword(!showConfirmPassword);
  }

  return (
    <main className='container-fluid d-flex align-items-center justify-content-center ColorBackground'>
      <div className="card shadow-lg p-4 my-5 fade-in" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className='text-center mb-4' style={{ fontWeight: 'bold', color: '#333' }}>
          Registrarse
        </h2>

        {/* Mostrar el error si existe */}
        {error && (
          <div className="alert alert-danger text-center p-0" role="alert">
            <p className='p-2 m-0'>{error}</p>
          </div>
        )}

        <form onSubmit={onSubmit}>
          {/* Nombre de usuario */}
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

          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input 
              type="email" 
              className="form-control" 
              onChange={onChangeEmail} 
              value={email} 
              id="email" 
              placeholder="nombre@ejemplo.com" 
              style={{ borderRadius: '8px', borderColor: '#ddd' }}
            />
          </div>

          {/* Contraseña */}
          <div className="mb-3 position-relative">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input 
              type={showPassword ? "text" : "password"} 
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

          {/* Confirmar Contraseña */}
          <div className="mb-3 position-relative">
            <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              className="form-control" 
              onChange={onChangeConfirmPassword} 
              value={confirmPassword} 
              id="confirmPassword" 
              placeholder="********" 
              style={{ borderRadius: '8px', borderColor: '#ddd' }}
            />
            <button 
              type="button" 
              onClick={toggleConfirmPasswordVisibility}
              className="btn btn-link position-absolute" 
              style={{ top: '72%', right: '10px', transform: 'translateY(-50%)', textDecoration: 'none' }}
            >
              {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </button>
          </div>

          {/* Botón de registro */}
          <button 
            className='btn colorButtons w-100 mt-3' 
            type="submit" 
            style={{ borderRadius: '8px', padding: '10px', fontWeight: 'bold' }}
          >
            Registrarse
          </button>
        </form>
      </div>
    </main>
  );
}

export default RegisterPage;
