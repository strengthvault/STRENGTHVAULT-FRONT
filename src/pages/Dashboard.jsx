import { useState, useEffect, useRef } from 'react';
import videosServices from '../services/videos.services';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import FeedIcon from '@mui/icons-material/Feed';

import "primereact/resources/themes/lara-light-indigo/theme.css";     
import "primereact/resources/primereact.min.css";
import 'primeflex/primeflex.css';

import { PanelMenu } from 'primereact/panelmenu';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Navigate, useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

import { Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import InfoIcon from '@mui/icons-material/Info';

const Dashboard = () => {
    const navigate = useNavigate()
    const [videosData, setVideosData] = useState([]);
    const [error, setError] = useState(null);
    const [activeBlog, setActiveBlog] = useState(null);
    const toast = useRef(null);



    const confirm1 = (event, data) => {
        confirmPopup({
            target: event.currentTarget,
            message: data.descripcion,
            acceptLabel:'Ver video',
            rejectLabel: 'Cancelar',
            acceptClassName: 'bg-primary ms-1',
            rejectClassName: 'bg-secondary me-1',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept: () => {navigate(`/video/${data._id}`)},
            onHide: () => {
                // Función opcional para ejecutar cuando se cierre el popup
            }
            
        });
    };

    useEffect(() => {
        videosServices.getVideos()
            .then(async data => {
                const groupedData = data.reduce((acc, video) => {
                    const category = video.categoria;
                    if (!acc[category]) {
                        acc[category] = [];
                    }
                    acc[category].push({
                        label: window.innerWidth > 968 ? 
                            <div className='row justify-content-center '>
                                
                                    <div className='col-10 text-start m-auto'>
                                        <Link to={`/video/${video._id}`}>{video.nombre}</Link>
                                    </div>
                                    <div className='col-2'>
                                        <HtmlTooltip title={video.descripcion}>
                                            <IconButton className='' >
                                                <InfoIcon />
                                            </IconButton>  
                                        </HtmlTooltip>
                                    </div>
                              
                            </div> : 
                        <div className='' onClick={(e) => confirm1(e, video)}>
                            {video.nombre}
                        </div>,
                        icon: <TurnedInNotIcon />, // O cualquier otro ícono si lo deseas
                        command: () => {window.innerWidth < 968 ? <Link to={`/video/${video._id}`}>Abrir</Link> : setActiveBlog(video)} // Acción para abrir el video
                    });
                    return acc;
                }, {});
                
                const menuItems = Object.keys(groupedData).map(category => ({
                    label: category,
                    icon: <TurnedInNotIcon />,
                    items: groupedData[category]
                }));

                setVideosData(menuItems);
           })
            .catch(err => {
                setError(err.message);
            });
    }, []);

    const handleBlogClick = (blog) => {
        setActiveBlog(blog);
    };

    if (error) {
        return <div>Error: {error}</div>;
    }


    const HtmlTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
      ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
          backgroundColor: '#f5f5f9',
          color: 'rgba(0, 0, 0, 0.87)',
          maxWidth: 220,
          fontSize: theme.typography.pxToRem(17),
          border: '1px solid #dadde9',
        },
      }));

    return (
        <div className="container-fluid ColorBackground text-light">
            <div className="row justify-content-center text-center">
                <div className='my-4'>
                    <h2>Bienvenido a la biblioteca <span className='open-sans-titles'>STRENGTHVAULT</span></h2>
                    <p>Acá tendrás todo nuestro contenido, dividido por categorías, simplemente navegá hasta encontrar lo que necesites.</p>
                </div>

                <div className="col-10 col-lg-4 text-center">
                    <div className='row justify-content-center'>
                        <div className='col-10 col-lg-6  w-100'>
                            <PanelMenu model={videosData} className='textFormatedPanel' />
                        </div>
                    </div>
                </div>

                {/* Sección derecha - Contenido del video */}
                <div className="col-10 col-lg-8 text-center">
                    {activeBlog ? (
                        <div className="active-blog text-center">
                            <h3 className='open-sans-titles'>{activeBlog.nombre}</h3>
                            <p>{activeBlog.descripcion}</p>
                            <p><strong>Categoría:</strong> {activeBlog.categoria}</p>
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
                    ) : (
                        <div className="text-center">
                            <h3>Selecciona un video para ver los detalles</h3>
                        </div>
                    )}
                </div>
            </div>
            <ConfirmPopup />
        </div>
    );
};

export default Dashboard;
