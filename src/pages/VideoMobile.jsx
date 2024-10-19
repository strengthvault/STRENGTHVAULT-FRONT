import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import videosServices from '../services/videos.services';


import "primereact/resources/themes/lara-light-indigo/theme.css";     
import "primereact/resources/primereact.min.css";
import 'primeflex/primeflex.css';


import ReactPlayer from 'react-player';



const VideoMobile = () => {
    const {id} = useParams()
    const [error, setError] = useState(null);
    const [activeBlog, setActiveBlog] = useState(null);


    useEffect(() => {
        videosServices.findByVideoId(id)
            .then(async data => {
                console.log(data)
                           
                setActiveBlog(data);

                /*const oEmbedDataArray = await Promise.all(data.map(async (video) => {
                    if (video.videoStatus === 'available') {
                        const oEmbedHtml = await videosServices.getOEmbed(video.url);
                        return {
                            id: video.id,
                            name: video.nombre,
                            description: video.descripcion,
                            category: video.categoria,
                            html: oEmbedHtml,
                            status: video.videoStatus
                        };
                    } else {
                        return {
                            id: video.id,
                            name: video.nombre,
                            description: video.descripcion,
                            category: video.categoria,
                            status: video.videoStatus
                        };
                    }
                }));
*/

            
           })
            .catch(err => {
                setError(err.message);
            });
    }, [id]);


    if (error) {
        return <div>Error: {error}</div>;
    }

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
                               
                                    <ReactPlayer
                                    url={activeBlog.url}
                                    config={{
                                        youtube: {
                                        playerVars: { showinfo: 1 }
                                        }
                                    }}
                                    className={'m-auto'}
                                    />

                                
                            </div>
                            
                            
                            {/*activeBlog.status === 'available' ? (
                                <div dangerouslySetInnerHTML={{ __html: activeBlog.html || activeBlog.error }} />
                            ) : (
                                <div><em>El video aún se está procesando...</em></div>
                            )*/}
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
