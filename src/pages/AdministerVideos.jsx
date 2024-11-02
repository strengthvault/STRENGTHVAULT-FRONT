import React, { useState, useEffect, useRef } from 'react';
import videosServices from '../services/videos.services';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Dialog } from 'primereact/dialog'; // Se añade para el popup de confirmación
import { IconButton } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ReactPlayer from 'react-player';
import CancelIcon from '@mui/icons-material/Cancel';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VideoUploader from '../components/UploadVideoToVImeo';
import VideoEmbed from '../components/videoEmbed.jsx';

const AdministerVideos = () => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [categoria, setCategoria] = useState('');
    const [category, setCategory] = useState(null);
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState(true);
    const [videosData, setVideosData] = useState([]);
    const [editingBlog, setEditingBlog] = useState(null);
    const [originalData, setOriginalData] = useState(null); // Para guardar datos originales antes de la edición
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
    const [confirmDelete, setConfirmDelete] = useState(null); // Para mostrar el dialog de confirmación
    const op = useRef(null);
    const [videoFile, setVideoFile] = useState(null);


    const categorys = [
        { name: 'Powerlifting'},
        { name: 'Salud'},
        { name: 'Rendimiento'},
        { name: 'Movilidad'},
        { name: 'Entrenamiento en adultos'},
        { name: 'Entrenamiento en niños'}
    ];

    useEffect(() => {
        const loadVideos = async () => {

            try {
                const data = await videosServices.getVideos();
                setVideosData(data);
                console.log(data)

            } catch (error) {
                console.log(error)
            }
        };
        loadVideos();

        const handleResize = () => setIsMobile(window.innerWidth < 992);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [status]);

    const handleFormChange = (field, value) => {
        switch (field) {
            case 'nombre':
                setNombre(value);
                break;
            case 'descripcion':
                setDescripcion(value);
                break;
            case 'categoria':
                setCategory(typeof value === 'string' ? value : value.name);
                break;
            default:
                break;
        }
    };

    const handleFileChange = (e) => {
        setVideoFile(e.target.files[0]);
    };

    const validateForm = () => {
        if (!nombre || !descripcion || !category || !videoFile) {
            toast.error('Todos los campos y el video son obligatorios');
            return false;
        }
        return true;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const toastId = toast.loading('Creando...');

        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);
        formData.append('categoria', category);
        formData.append('file', videoFile);

        videosServices.createBlogWithVideo(formData)
            .then(() => {
                setStatus(!status);
                toast.update(toastId, { render: '¡Blog creado con éxito!', type: 'success', isLoading: false, autoClose: 2000 });
                setNombre('');
                setDescripcion('');
                setCategory(null);
                setVideoFile(null);
            })
            .catch(() => {
                toast.update(toastId, { render: 'Error al crear el blog', type: 'error', isLoading: false, autoClose: 2000 });
            });
    };

    const startEditing = (blog) => {
        setEditingBlog(blog._id);
        setOriginalData({ ...blog }); // Guardamos los datos originales antes de la edición
    };

    const cancelEditing = () => {
        // Si cancela, restauramos los datos originales 
        setVideosData(videosData.map(b => b._id === originalData._id ? originalData : b));
        setEditingBlog(null);
        setOriginalData(null); // Limpiamos el estado de los datos originales
    };

    const saveChanges = async (blog) => {
        const toastId = toast.loading('Editando...');
        try {
            await videosServices.editVideo(blog._id, blog);
            setEditingBlog(null);
            setOriginalData(null);
            setVideosData(videosData.map(b => (b._id === blog._id ? blog : b)));
            toast.update(toastId, { render: '¡Listo!', type: 'success', isLoading: false, autoClose: 2000 });
        } catch (error) {
            toast.update(toastId, { render: 'Error al editar', type: 'error', isLoading: false, autoClose: 2000 });
        }
    };

    const renderActions = (blog) => (
        <div className="row justify-content-center text-center">
            <div className='col-4'>
                {editingBlog === blog._id ? (
                    <>
                        <IconButton className='border  aaa' onClick={() => saveChanges(blog)}>
                            <SaveIcon className='text-light' />
                        </IconButton>
                    </>
                ) : (
                    <IconButton className='border  aaa' onClick={() => startEditing(blog)}>
                        <EditIcon className='text-light'/>
                    </IconButton>
                )}
            </div>
            {isMobile && <div className='col-4'>
                <>
                    <IconButton className='border ' onClick={(e) => op.current.toggle(e)}>
                        <YouTubeIcon className='text-light' />
                    </IconButton>
                    <OverlayPanel ref={op} >
                        <ReactPlayer
                            className={'aaa'}
                            url={blog.url}
                            config={{
                                youtube: {
                                    playerVars: { showinfo: 1 }
                                }
                            }}
                        />
                    </OverlayPanel>
                </>
            </div>}
            <div className='col-4'>
                {editingBlog !== blog._id ? 
                <IconButton className='border  aaa' onClick={() => setConfirmDelete(blog)}>
                    <DeleteIcon className='text-light' />
                </IconButton> :
                <IconButton className='border  aaa' onClick={cancelEditing} >
                    <CancelIcon className='text-light' />
                </IconButton>
                }
            </div>
        </div>
    );

    const handleDelete = async (blog) => {
        const toastId = toast.loading('Eliminando...');
        try {
            await videosServices.deleteVideo(blog._id);
            setVideosData(videosData.filter(b => b._id !== blog._id));
            toast.update(toastId, { render: '¡Listo!', type: 'success', isLoading: false, autoClose: 2000 });
            setConfirmDelete(null);
        } catch (error) {
            toast.update(toastId, { render: 'Error al eliminar', type: 'error', isLoading: false, autoClose: 2000 });
        }
    };

    const handleInputChange = (id, field, value) => {
        setVideosData(prevData => 
            prevData.map(video => 
                video._id === id ? { ...video, [field]: value } : video
            )
        );
    };

    // Función para manejar cambios en el dropdown de categoría
    const handleCategoryChange = (id, value) => {
        console.log(value)
        const newCategory = typeof value === 'string' ? value : value.name;
        handleInputChange(id, 'categoria', newCategory);
    };


    const renderTable = () => (
        <div className='row justify-content-center'>
            <div className='col-11'>
                <table className="table background-tr text-center align-middle">
                    <thead className=''>
                        <tr className=' '>
                            <th className=' '>Nombre</th>
                            <th className=' largoDesc'>Descripción</th>
                            <th>Categoría</th>
                            <th>Video</th>
                            <th className='largoActions'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {videosData.map(blog => (
                            <tr key={blog._id}>
                                <td>{blog.nombre}</td>
                                <td><span className='cssformated'>{blog.descripcion}</span></td>
                                <td>{blog.categoria}</td>
                                <td>
                                    <VideoEmbed videoUrl={blog.url}/>
                                </td>
                                <td>{renderActions(blog)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

const renderCards = () => (
    <div className="row">
        {videosData.map(blog => (
            <div key={blog._id} className="col-12 mb-4">
                <div className="card background-cards">
                    <div className="card-body">
                        <h5 className="card-title text-center mb-4">
                            <strong className='d-block text-center mb-4'>Nombre </strong>
                            {editingBlog === blog._id ? (
                                <InputText 
                                    value={blog.nombre} 
                                    onChange={(e) => handleInputChange(blog._id, 'nombre', e.target.value)} 
                                />
                            ) : (
                                blog.nombre
                            )}
                        </h5>
                        <p className="card-text">
                            <strong className='d-block text-center mb-4'>Descripción </strong>
                            {editingBlog === blog._id ? (
                                <InputTextarea 
                                    value={blog.descripcion} 
                                    autoResize 
                                    className='w-100' 
                                    onChange={(e) => handleInputChange(blog._id, 'descripcion', e.target.value)} 
                                />
                            ) : (
                                blog.descripcion
                            )}
                        </p>
                        <div className="mb-4 text-center">
                            <strong className='d-block mb-4 '>Categoría </strong>
                            {editingBlog === blog._id ? (
                                <Dropdown 
                                    editable 
                                    value={blog.categoria || ''} 
                                    options={categorys} 
                                    optionLabel="name" 
                                    onChange={(e) => handleCategoryChange(blog._id, e.value)} 
                                    onInput={(e) => handleInputChange(blog._id, 'categoria', e.target.value)} // Aquí estamos forzando la actualización en tiempo real
                                    placeholder="Escribe o selecciona una categoría"
                                />
                            ) : (
                                blog.categoria
                            )}
                        </div>
                        <div className="mb-2 text-center">
                            {editingBlog === blog._id ? (
                                <InputText 
                                    value={blog.url} 
                                    onChange={(e) => handleInputChange(blog._id, 'url', e.target.value)} 
                                />
                            ) : (
                                <>
                                </>
                            )}
                        </div>
                        <div>{renderActions(blog)}</div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);



    function changeName(e) {
        setNombre(e.target.value);
    }

    function changeCategory(e) {
        setCategory(e);
    }

    

    return (
        <div className="container-fluid">
            <div className='row justify-content-center '>
                <div className='ColorBackground'>
                    <h2 className='my-4 text-center text-light'>Agregá un blog con video</h2>
                    <div className='row justify-content-center text-center'>
                        <form className='col-10 col-lg-6' onSubmit={onSubmit}>
                            <div className='row justify-content-between'>
                                <div className='col-12 col-lg-7'>
                                    <label htmlFor='name' className='text-light text-center mb-1'>Nombre</label>
                                    <InputText
                                        value={nombre}
                                        onChange={(e) => handleFormChange('nombre', e.target.value)}
                                        className="form-control"
                                        placeholder="Nombre del blog"
                                    />
                                </div>
                                <div className='col-12 col-lg-5 '>
                                    <label htmlFor='categoria' className='text-light text-center d-block mb-1'>Categoría</label>
                                    <Dropdown
                                        value={category}
                                        onChange={(e) => handleFormChange('categoria', e.value)}
                                        options={categorys}
                                        optionLabel="name"
                                        placeholder="Selecciona una categoría"
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className='my-3'>
                                <label htmlFor='descripcion' className='text-light text-center mb-1'>Descripción</label>
                                <InputTextarea
                                    value={descripcion}
                                    onChange={(e) => handleFormChange('descripcion', e.target.value)}
                                    rows={5}
                                    className="form-control"
                                    placeholder="Descripción del blog"
                                />
                            </div>
                            <div className='my-3'>
                                <label htmlFor='video' className='text-light text-center mb-1'>Subir Video</label>
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={handleFileChange}
                                    className="form-control"
                                />
                            </div>
                            <button type="submit" className="btn btn-primary mt-4">Crear Blog</button>
                        </form>
                    </div>
                </div>
                <div className='ColorBackground-2'>
                    <h2 className=" text-center text-light mt-4">Administrar Videos</h2>
                    {isMobile && status ? renderCards() : status && renderTable()}
                </div>
            </div>
            <ToastContainer position="bottom-center" autoClose={2000} />
        </div>
    );
};

export default AdministerVideos;
