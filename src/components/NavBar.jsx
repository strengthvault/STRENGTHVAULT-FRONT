import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
    const { isAuthenticated, logout } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/">Inicio</Link>
            <button 
                className="navbar-toggler" 
                type="button" 
                data-toggle="collapse" 
                data-target="#navbarNav" 
                aria-controls="navbarNav" 
                aria-expanded="false" 
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link" to="/login">Login</Link>
                    </li>
                    {isAuthenticated && (
                        <li className="nav-item">
                            <Link className="nav-link" to="/dashboard">Panel de Administración</Link>
                        </li>
                    )}
                    {isAuthenticated && (
                        <li className="nav-item">
                            <button className="nav-link btn btn-link" onClick={logout}>Logout</button>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;
