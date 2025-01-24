import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import videosServices from '../services/videos.services';

import "primereact/resources/themes/lara-light-indigo/theme.css";     
import "primereact/resources/primereact.min.css";
import 'primeflex/primeflex.css';

import ReactPlayer from 'react-player';

const VideoMobile = () => {
    const { id } = useParams();
    const [error, setError] = useState(null);
    const [activeBlog, setActiveBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        videosServices.findByVideoId(id)
            .then(async data => {
                console.log(data);
                setActiveBlog(data); // Configura el primer video disponible
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);



    return (
        <div className="container-fluid ColorBackground text-light">
            <div className="row justify-content-center text-center">

                <div className='my-4'>
                    <h2>Bienvenido a la biblioteca <span className='open-sans-titles'>STRENGTHVAULT</span></h2>
                    <p>Acá tendrás todo nuestro contenido, dividido por categorías, simplemente navegá hasta encontrar lo que necesites.</p>
                </div>

                {/* Sección derecha - Contenido del video */}
                <div className="col-10 col-lg-6 text-center">
                    {activeBlog ? (
                        <div className="active-blog" style={{ textAlign: 'center' }}>
                            <h3>{activeBlog.nombre}</h3>
                            <p>{activeBlog.descripcion}</p>
                            <p><strong>Categoría:</strong> {activeBlog.categoria}</p>

                            <div className='row justify-content-center'>
                                <div className='col-12'>
                                {activeBlog.url == '' ? 
                                <p>El blog se está subiendo... Por favor, vuelva más tarde.</p> 
                                : 
                                <ReactPlayer
                                    url={activeBlog.url} // Usando directamente la URL
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
                            />}
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
