import React, { useState } from 'react';
import { login, register } from '../services/auth.services.js';
import { useAuth } from '../context/AuthContext';


const Auth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const { login: loginContext } = useAuth();


    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await login(email, password);
            loginContext();
            setMessage('Login exitoso');
        } catch (error) {
            setMessage(error.message);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await register(email, password);
            setMessage('Registro exitoso');
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card p-4 shadow-sm" style={{ maxWidth: '400px', width: '100%' }}>
                {isLogin ? (
                    <div>
                        <h2 className="text-center mb-4">Iniciar Sesión</h2>
                        <form onSubmit={handleLogin}>
                            <div className="form-group mb-3">
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    placeholder="Email" 
                                    required 
                                />
                            </div>
                            <div className="form-group mb-3">
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    placeholder="Password" 
                                    required 
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Login</button>
                        </form>
                        <p className="text-center mt-3">
                            ¿No tienes una cuenta? <button onClick={() => setIsLogin(false)} className="btn btn-link p-0">Regístrate</button>
                        </p>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-center mb-4">Registrarse</h2>
                        <form onSubmit={handleRegister}>
                            <div className="form-group mb-3">
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    placeholder="Email" 
                                    required 
                                />
                            </div>
                            <div className="form-group mb-3">
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    placeholder="Password" 
                                    required 
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Register</button>
                        </form>
                        <p className="text-center mt-3">
                            ¿Ya tienes una cuenta? <button onClick={() => setIsLogin(true)} className="btn btn-link p-0">Inicia Sesión</button>
                        </p>
                    </div>
                )}
                {message && <p className="text-danger text-center mt-3">{message}</p>}
            </div>
        </div>
    );
};

export default Auth;
