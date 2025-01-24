import React, { useState, useEffect, useRef } from 'react';
import videosServices from '../services/videos.services';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Dialog } from 'primereact/dialog';
import { IconButton } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ReactPlayer from 'react-player';
import CancelIcon from '@mui/icons-material/Cancel';
import AddToDriveIcon from '@mui/icons-material/AddToDrive';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const AdministerVideos = () => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [categoria, setCategoria] = useState('');
    const [category, setCategory] = useState(null);
    const [url, setUrl] = useState('');

    // Nuevo estado para jerarquía en el formulario de creación
    const [jerarquia, setJerarquia] = useState('');

    // Para forzar recarga de datos
    const [status, setStatus] = useState(true);

    const [selectedVideo, setSelectedVideo] = useState('');
    const [videosData, setVideosData] = useState([]);

    // Para edición en diálogo
    const [editingVideo, setEditingVideo] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);

    // Confirmación de borrado
    const [confirmDelete, setConfirmDelete] = useState(null);

    // Para OverlayPanel (mostrar video al hacer click)
    const op = useRef(null);

    // Para detectar si está en mobile
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

    // Listas de opciones
    const categories = [
        { name: 'Powerlifting' },
        { name: 'Salud' },
        { name: 'Rendimiento' },
        { name: 'Movilidad' },
        { name: 'Entrenamiento en adultos' },
        { name: 'Entrenamiento en niños' }
    ];

    // Opciones de jerarquía
    const jerarquiaOptions = [
        { label: 'Gratuito', value: 'gratuito' },
        { label: 'Básico', value: 'basico' },
        { label: 'Elite',  value: 'elite' }
    ];

    useEffect(() => {
        const loadVideos = async () => {
            try {
                const data = await videosServices.getVideos();
                setVideosData(data);
            } catch (error) {
                console.log(error);
            }
        };
        loadVideos();

        const handleResize = () => setIsMobile(window.innerWidth < 992);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [status]);

    // Maneja los inputs del formulario de creación
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

    // Validación básica
    const validateForm = () => {
        if (!nombre || !descripcion || !category || !jerarquia) {
            toast.error('Todos los campos (nombre, descripción, categoría, jerarquía) son obligatorios');
            return false;
        }
        return true;
    };

    // Crear un nuevo blog con video
    const onSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const toastId = toast.loading('Creando...');

        // Armamos un objeto normal (JSON) con los campos
        const blogData = {
            nombre,
            descripcion,
            categoria: category,
            jerarquia
        };

        videosServices.createVideo(blogData)
            .then(() => {
                setStatus(!status);
                toast.update(toastId, {
                    render: '¡Blog creado con éxito!',
                    type: 'success',
                    isLoading: false,
                    autoClose: 2000
                });
                setNombre('');
                setDescripcion('');
                setCategory(null);
                setJerarquia('');
            })
            .catch(() => {
                toast.update(toastId, {
                    render: 'Error al crear el blog',
                    type: 'error',
                    isLoading: false,
                    autoClose: 2000
                });
            });
    };

    // Abre el diálogo de edición con los datos del video seleccionado
    const startEditing = (video) => {
        // Clonamos el objeto para no mutar directamente
        setEditingVideo({ ...video });
        setOpenEditDialog(true);
    };

    // Cierra el diálogo de edición
    const cancelEditing = () => {
        setEditingVideo(null);
        setOpenEditDialog(false);
    };

    // Guarda los cambios (edición) en la base
    const saveChanges = async () => {
        if (!editingVideo) return;
        const toastId = toast.loading('Editando...');

        try {
            await videosServices.editVideo(editingVideo._id, editingVideo);
            // Actualizamos la lista local
            setVideosData((prevData) =>
                prevData.map((b) => (b._id === editingVideo._id ? editingVideo : b))
            );
            toast.update(toastId, {
                render: '¡Listo!',
                type: 'success',
                isLoading: false,
                autoClose: 2000
            });
            setOpenEditDialog(false);
            setEditingVideo(null);
        } catch (error) {
            toast.update(toastId, {
                render: 'Error al editar',
                type: 'error',
                isLoading: false,
                autoClose: 2000
            });
        }
    };

    // Función que actualiza el estado local del video en edición
    const updateEditingField = (field, value) => {
        setEditingVideo((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    // Diálogo de confirmación de borrado
    const handleDelete = async (video) => {
        const toastId = toast.loading('Eliminando...');
        try {
            await videosServices.deleteVideo(video._id);
            setVideosData((prevData) => prevData.filter((b) => b._id !== video._id));
            toast.update(toastId, {
                render: '¡Listo!',
                type: 'success',
                isLoading: false,
                autoClose: 2000
            });
            setConfirmDelete(null);
        } catch (error) {
            toast.update(toastId, {
                render: 'Error al eliminar',
                type: 'error',
                isLoading: false,
                autoClose: 2000
            });
        }
    };

    // Renderizado de íconos de acción para cada video
    const renderActions = (blog) => (
        <div className="row justify-content-center text-center">
            {/* Editar */}
            <div className='col-6'>
                <IconButton className='border aaa' onClick={() => startEditing(blog)}>
                    <EditIcon className='text-light' />
                </IconButton>
            </div>
            {/* Eliminar */}
            <div className='col-6'>
                <IconButton
                    className='border aaa'
                    onClick={() => setConfirmDelete(blog)}
                >
                    <DeleteIcon className='text-light' />
                </IconButton>
            </div>
        </div>
    );

    // Ícono para reproducir el video en un OverlayPanel
    const renderVideoIcon = (blog) => (
        <>
            <IconButton
                className='border'
                onClick={(e) => {
                    setSelectedVideo(blog.url);
                    op.current.toggle(e);
                }}
            >
                <YouTubeIcon className='text-light' />
            </IconButton>
            <OverlayPanel ref={op} >
                <ReactPlayer
                    url={selectedVideo}
                    className="m-auto"
                    controls
                    volume={0.8}
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
                    onError={(err) => console.error('Error en ReactPlayer:', err)}
                />
            </OverlayPanel>
        </>
    );

    // Tabla para pantallas grandes
    const renderTable = () => (
        <div className='row justify-content-center'>
            <div className='col-11'>
                <table className="table background-tr text-center align-middle">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th className='largoDesc'>Descripción</th>
                            <th>Categoría</th>
                            <th>Jerarquía</th>
                            <th>Video</th>
                            <th className='largoActions'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {videosData.map((blog) => (
                            <tr key={blog._id}>
                                <td>{blog.nombre}</td>
                                <td>
                                    <span className='cssformated'>{blog.descripcion}</span>
                                </td>
                                <td>{blog.categoria}</td>
                                <td>{blog.jerarquia}</td>
                                <td>{renderVideoIcon(blog)}</td>
                                <td>{renderActions(blog)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // Cards para pantallas móviles
    const renderCards = () => (
        <div className="row">
            {videosData.map((blog) => (
                <div key={blog._id} className="col-12 mb-4">
                    <div className="card background-cards">
                        <div className="card-body">
                            <h5 className="card-title text-center mb-4">
                                <strong className='d-block text-center mb-4'>Nombre </strong>
                                {blog.nombre}
                            </h5>
                            <p className="card-text">
                                <strong className='d-block text-center mb-4'>Descripción </strong>
                                {blog.descripcion}
                            </p>
                            <div className="mb-4 text-center">
                                <strong className='d-block mb-4 '>Categoría </strong>
                                {blog.categoria}
                            </div>
                            <div className="mb-4 text-center">
                                <strong className='d-block mb-4 '>Jerarquía </strong>
                                {blog.jerarquia}
                            </div>
                            <div className="mb-2 text-center">
                                {renderVideoIcon(blog)}
                            </div>
                            <div>{renderActions(blog)}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="container-fluid">
            {/* FORMULARIO CREAR VIDEO */}
            <div className='row justify-content-center '>
                <div className='ColorBackground'>
                    <h2 className='my-4 text-center text-light'>Agregá un blog con video</h2>
                    <div className='row justify-content-center text-center'>
                        <form className='col-10 col-lg-6' onSubmit={onSubmit}>
                            <div className='row justify-content-between'>
                                <div className='col-12 col-lg-7'>
                                    <label htmlFor='name' className='text-light text-center mb-1'>
                                        Nombre
                                    </label>
                                    <InputText
                                        value={nombre}
                                        onChange={(e) => handleFormChange('nombre', e.target.value)}
                                        className="form-control altoName"
                                        placeholder="Nombre del blog"
                                    />
                                </div>
                                <div className='col-12 col-lg-5 '>
                                    <label htmlFor='categoria' className='text-light text-center d-block mb-1'>
                                        Categoría
                                    </label>
                                    <Dropdown 
                                        editable 
                                        value={category || ''} 
                                        options={categories} 
                                        optionLabel="name"
                                        onChange={(e) => handleFormChange('categoria', e.value)}
                                        className='border-0'
                                        placeholder="Escribe o selecciona una categoría"
                                    />
                                </div>
                            </div>
                            {/* Nueva fila para JERARQUÍA */}
                            <div className='row mt-3'>
                                <div className='col-12'>
                                    <label htmlFor='jerarquia' className='text-light text-center d-block mb-1'>
                                        Jerarquía
                                    </label>
                                    <Dropdown
                                        value={jerarquia}
                                        options={jerarquiaOptions}
                                        onChange={(e) => setJerarquia(e.value)}
                                        placeholder="Selecciona la jerarquía"
                                        className='w-100'
                                    />
                                </div>
                            </div>
                            <div className='my-3'>
                                <label htmlFor='descripcion' className='text-light text-center mb-1'>
                                    Descripción
                                </label>
                                <InputTextarea
                                    value={descripcion}
                                    onChange={(e) => handleFormChange('descripcion', e.target.value)}
                                    rows={5}
                                    className="form-control"
                                    placeholder="Descripción del blog"
                                />
                            </div>
                            <div className='my-3'>
                                <Link
                                    target='blank'
                                    to={`https://drive.google.com/drive/folders/1a_mkhgOC9rgLwYEwHsZ7jPxdWm0PeAC7`}
                                    className='btn colorDrive text-light'
                                >
                                    <IconButton>
                                        <AddToDriveIcon />
                                    </IconButton>  
                                    Cargar video al drive
                                </Link>
                            </div>
                            {/* Ya no se usa file; no hay formData */}
                            <button type="submit" className="btn btn-primary mt-4">
                                Crear Blog
                            </button>
                        </form>
                    </div>
                </div>

                {/* LISTADO DE VIDEOS */}
                <div className='ColorBackground-2'>
                    <h2 className=" text-center text-light mt-4">Administrar Videos</h2>
                    {isMobile && status ? renderCards() : status && renderTable()}
                </div>
            </div>

            {/* DIALOGO DE EDICIÓN */}
            <Dialog
                visible={openEditDialog}
                onHide={cancelEditing}
                header="Editar Video"
                className="p-fluid w-50"
                modal
            >
                {editingVideo && (
                    <div>
                        <div className="mb-3">
                            <label className="form-label">Nombre</label>
                            <InputText
                                value={editingVideo.nombre}
                                onChange={(e) => updateEditingField('nombre', e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Descripción</label>
                            <InputTextarea
                                rows={4}
                                value={editingVideo.descripcion}
                                onChange={(e) => updateEditingField('descripcion', e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Categoría</label>
                            <Dropdown
                                editable
                                value={editingVideo.categoria || ''}
                                options={categories}
                                optionLabel="name"
                                onChange={(e) => {
                                    const newValue = (typeof e.value === 'string') ? e.value : e.value.name;
                                    updateEditingField('categoria', newValue);
                                }}
                                placeholder="Escribe o selecciona una categoría"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Jerarquía</label>
                            <Dropdown
                                value={editingVideo.jerarquia || ''}
                                options={jerarquiaOptions}
                                onChange={(e) => updateEditingField('jerarquia', e.value)}
                                placeholder="Selecciona la jerarquía"
                            />
                        </div>
                    </div>
                )}
                <div className="d-flex justify-content-end mt-4">
                    <button
                        type="button"
                        className="btn btn-secondary me-2"
                        onClick={cancelEditing}
                    >
                        <CancelIcon /> Cancelar
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={saveChanges}
                    >
                        <SaveIcon /> Guardar
                    </button>
                </div>
            </Dialog>

            {/* DIALOGO DE CONFIRMACIÓN DE BORRADO */}
            <Dialog
                visible={!!confirmDelete}
                onHide={() => setConfirmDelete(null)}
                header="Confirmar eliminación"
                modal
            >
                {confirmDelete && (
                    <div>
                        <p>
                            ¿Estás seguro de que deseas eliminar el video{' '}
                            <strong>{confirmDelete.nombre}</strong>?
                        </p>
                        <div className="d-flex justify-content-end">
                            <button
                                type="button"
                                className="btn btn-secondary me-2"
                                onClick={() => setConfirmDelete(null)}
                            >
                                <CancelIcon /> Cancelar
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => handleDelete(confirmDelete)}
                            >
                                <DeleteIcon /> Eliminar
                            </button>
                        </div>
                    </div>
                )}
            </Dialog>

            <ToastContainer position="bottom-center" autoClose={2000} />
        </div>
    );
};

export default AdministerVideos;
