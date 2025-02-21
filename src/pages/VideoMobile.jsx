import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import videosServices from '../services/videos.services';
import * as UserServices from '../services/auth.services.js';
import LoadingScreen from './../components/LoadingScreen';

import "primereact/resources/themes/lara-light-indigo/theme.css";     
import "primereact/resources/primereact.min.css";
import 'primeflex/primeflex.css';

import ReactPlayer from 'react-player';

const VideoMobile = () => {
    const { userId, videoId } = useParams();
    const [error, setError] = useState(null);
    const [activeBlog, setActiveBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Se solicitan el blog y el usuario actual de forma simultánea.
        Promise.all([
            videosServices.findByVideoId(userId, videoId),
            UserServices.findUserById(userId)
        ])
        .then(([blog, user]) => {
            // Se obtiene el nivel de membresía del usuario en minúsculas.
            const userLevel = user.category ? user.category.toLowerCase() : 'gratuito';

            // Se obtienen los niveles requeridos del blog. Se asume que blog.jerarquia es un array; 
            // si no lo fuera, se convierte a array.
            let blogLevels = [];
            if (Array.isArray(blog.jerarquia)) {
                blogLevels = blog.jerarquia.map(j => j.toLowerCase());
            } else if (blog.jerarquia) {
                blogLevels = [blog.jerarquia.toLowerCase()];
            }

            // Se definen los niveles permitidos según la membresía del usuario.
            let allowedLevels = [];
            if (userLevel === 'elite') {
                allowedLevels = ['gratuito', 'basico', 'elite'];
            } else if (userLevel === 'basico') {
                allowedLevels = ['gratuito', 'basico'];
            } else {
                allowedLevels = ['gratuito'];
            }

            // Se chequea si alguno de los niveles requeridos del blog está permitido.
            const isAllowed = blogLevels.some(level => allowedLevels.includes(level));
            if (!isAllowed) {
                setError("No tienes autorización para ver el video");
            }
            setActiveBlog(blog);
            setLoading(false);
        })
        .catch(err => {
            setError(err.message);
            setLoading(false);
        });
    }, [userId, videoId]);

    if (loading) {
        return <LoadingScreen />;
    }

    if (error) {
        return (
            <div className="container-fluid ColorBackground text-light">
                <div className="row justify-content-center text-center">
                    <div className="col-12 my-5">
                        <h3>No tienes autorización para ver el video</h3>
                        <p>Si crees que es un error, por favor, contacta al administrador.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid ColorBackground text-light">
            <div className="row justify-content-center text-center">
                <div className='my-4'>
                    <h2>Bienvenido a la biblioteca <span className='open-sans-titles'>STRENGTHVAULT</span></h2>
                    <p>Acá tendrás todo nuestro contenido, dividido por categorías, simplemente navegá hasta encontrar lo que necesites.</p>
                </div>

                <div className="col-10 col-lg-6 text-center">
                    {activeBlog ? (
                        <div className="active-blog" style={{ textAlign: 'center' }}>
                            <h3>{activeBlog.nombre}</h3>
                            <p>{activeBlog.descripcion}</p>
                            <p>
                              <strong>Categoría:</strong>{" "}
                              {Array.isArray(activeBlog.categoria)
                                ? activeBlog.categoria.map(cat => typeof cat === 'object' ? cat.name : cat).join(", ")
                                : activeBlog.categoria}
                            </p>
                            <div className='row justify-content-center'>
                                <div className='col-12'>
                                    {activeBlog.url === '' ? 
                                        <p>El blog se está subiendo... Por favor, vuelva más tarde.</p> 
                                        : 
                                        <ReactPlayer
                                            url={activeBlog.url}
                                            className="w-100"
                                            controls
                                            muted={false}
                                            playing={false}
                                            config={{
                                                vimeo: {
                                                    playerOptions: {
                                                        title: true,
                                                        byline: false,
                                                        portrait: false,
                                                        dnt: true,
                                                    },
                                                },
                                            }}
                                            onError={(e) => console.error("Error en ReactPlayer:", e)}
                                        />
                                    }
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <h3>Selecciona un video para ver los detalles</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoMobile;
