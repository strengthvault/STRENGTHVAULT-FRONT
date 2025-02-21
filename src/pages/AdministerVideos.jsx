import React, { useState, useEffect, useRef } from 'react';
import videosServices from '../services/videos.services';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { MultiSelect } from 'primereact/multiselect';
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
    // Estados para el formulario de creación
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    // Ambos campos ahora se manejan como arrays
    const [category, setCategory] = useState([]);
    const [jerarquia, setJerarquia] = useState([]);
    const [status, setStatus] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState('');
    const [videosData, setVideosData] = useState([]);
    const [editingVideo, setEditingVideo] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const op = useRef(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

    // Opciones para categorías y jerarquía
    const categoriesOptions = [
        { name: 'Gratuito' },
        { name: 'Powerlifting' },
        { name: 'Salud' },
        { name: 'Rendimiento' },
        { name: 'Movilidad' },
        { name: 'Entrenamiento en adultos' },
        { name: 'Entrenamiento en niños' }
    ];

    const jerarquiaOptions = [
        { label: 'Gratuito', value: 'gratuito' },
        { label: 'Basico', value: 'basico' },
        { label: 'Elite', value: 'elite' }
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

    // Para el formulario de creación, usamos MultiSelect para ambas selecciones
    const handleFormChange = (field, value) => {
        switch (field) {
            case 'nombre':
                setNombre(value);
                break;
            case 'descripcion':
                setDescripcion(value);
                break;
            case 'categoria':
                // value viene como array desde el MultiSelect
                setCategory(Array.isArray(value) ? value : []);
                break;
            default:
                break;
        }
    };

    const validateForm = () => {
        if (!nombre || !descripcion || !category.length || !jerarquia.length) {
            toast.error('Todos los campos (nombre, descripción, categoría, jerarquía) son obligatorios');
            return false;
        }
        return true;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        const toastId = toast.loading('Creando...');
        const blogData = {
            nombre,
            descripcion,
            // Se envía el array de categorías y de jerarquías
            categoria: category,
            jerarquia: jerarquia
        };
        videosServices.createVideo(blogData)
            .then(() => {
                // Se invierte el estado para forzar la recarga de los videos,
                // pero no se usa para renderizar el listado.
                setStatus(!status);
                toast.update(toastId, {
                    render: '¡Blog creado con éxito!',
                    type: 'success',
                    isLoading: false,
                    autoClose: 2000
                });
                setNombre('');
                setDescripcion('');
                setCategory([]);
                setJerarquia([]);
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

    const startEditing = (video) => {
        // Aseguramos que ambas propiedades sean arrays
        const videoCategories = Array.isArray(video.categoria)
            ? video.categoria
            : video.categoria
            ? [video.categoria]
            : [];
        const videoJerarquias = Array.isArray(video.jerarquia)
            ? video.jerarquia
            : video.jerarquia
            ? [video.jerarquia]
            : [];
        setEditingVideo({ ...video, categoria: videoCategories, jerarquia: videoJerarquias });
        setOpenEditDialog(true);
    };

    const cancelEditing = () => {
        setEditingVideo(null);
        setOpenEditDialog(false);
    };

    const saveChanges = async () => {
        if (!editingVideo) return;
        const toastId = toast.loading('Editando...');
        try {
            await videosServices.editVideo(editingVideo._id, editingVideo);
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

    const updateEditingField = (field, value) => {
        setEditingVideo((prev) => ({
            ...prev,
            // Para los campos de selección múltiple forzamos que sean arrays
            [field]: (field === 'categoria' || field === 'jerarquia')
              ? (Array.isArray(value) ? value : [])
              : value
        }));
    };

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

    // Rediseño de las acciones con contenedor flex
    const renderActions = (blog) => (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
            <IconButton className='text-light' onClick={() => startEditing(blog)} style={{ padding: '8px' }}>
                <EditIcon style={{ fontSize: '1.6rem' }} />
            </IconButton>
            <IconButton className='text-light' onClick={() => setConfirmDelete(blog)} style={{ padding: '8px' }}>
                <DeleteIcon style={{ fontSize: '1.6rem' }} />
            </IconButton>
        </div>
    );

    const renderVideoIcon = (blog) => (
        <>
            <IconButton
                onClick={(e) => {
                    setSelectedVideo(blog.url);
                    op.current.toggle(e);
                }}
            >
                <YouTubeIcon className='text-light' style={{ fontSize: '1.6rem' }} />
            </IconButton>
            <OverlayPanel ref={op}>
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
                                <td>
                                    {Array.isArray(blog.categoria)
                                      ? blog.categoria.map((cat, idx) => (
                                          <span key={idx}>
                                            {typeof cat === 'object' ? cat.name : cat}
                                            {idx < blog.categoria.length - 1 ? ', ' : ''}
                                          </span>
                                        ))
                                      : blog.categoria}
                                </td>
                                <td>
                                    {Array.isArray(blog.jerarquia)
                                      ? blog.jerarquia.join(', ')
                                      : blog.jerarquia}
                                </td>
                                <td>{renderVideoIcon(blog)}</td>
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
                                <strong className='d-block mb-4'>Categoría </strong>
                                {Array.isArray(blog.categoria)
                                  ? blog.categoria.map((cat, idx) => (
                                      <span key={idx}>
                                        {typeof cat === 'object' ? cat.name : cat}
                                        {idx < blog.categoria.length - 1 ? ', ' : ''}
                                      </span>
                                    ))
                                  : blog.categoria}
                            </div>
                            <div className="mb-4 text-center">
                                <strong className='d-block mb-4'>Jerarquía </strong>
                                {Array.isArray(blog.jerarquia)
                                  ? blog.jerarquia.join(', ')
                                  : blog.jerarquia}
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
            <div className='row justify-content-center'>
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
                                <div className='col-12 col-lg-5'>
                                    <label htmlFor='categoria' className='text-light text-center d-block mb-1'>
                                        Categoría
                                    </label>
                                    <MultiSelect 
                                        value={category} 
                                        options={categoriesOptions} 
                                        optionLabel="name"
                                        onChange={(e) => handleFormChange('categoria', e.value)}
                                        placeholder="Selecciona una o más categorías"
                                    />
                                </div>
                            </div>
                            {/* Nueva fila para JERARQUÍA */}
                            <div className='row mt-3'>
                                <div className='col-12'>
                                    <label htmlFor='jerarquia' className='text-light text-center d-block mb-1'>
                                        Jerarquía
                                    </label>
                                    <MultiSelect
                                        value={jerarquia}
                                        options={jerarquiaOptions}
                                        optionLabel="label"
                                        onChange={(e) => setJerarquia(Array.isArray(e.value) ? e.value : [])}
                                        placeholder="Selecciona una o más jerarquías"
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
                            <button type="submit" className="btn btn-primary mt-4">
                                Crear Blog
                            </button>
                        </form>
                    </div>
                </div>

                {/* LISTADO DE VIDEOS */}
                <div className='ColorBackground-2'>
                    <h2 className="text-center text-light mt-4">Administrar Videos</h2>
                    {isMobile ? renderCards() : renderTable()}
                </div>
            </div>

            {/* DIÁLOGO DE EDICIÓN */}
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
                            <MultiSelect
                                value={
                                  Array.isArray(editingVideo.categoria)
                                  ? editingVideo.categoria
                                  : editingVideo.categoria
                                  ? [editingVideo.categoria]
                                  : []
                                }
                                options={categoriesOptions}
                                optionLabel="name"
                                onChange={(e) => updateEditingField('categoria', e.value)}
                                placeholder="Selecciona una o más categorías"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Jerarquía</label>
                            <MultiSelect
                                value={
                                  Array.isArray(editingVideo.jerarquia)
                                  ? editingVideo.jerarquia
                                  : editingVideo.jerarquia
                                  ? [editingVideo.jerarquia]
                                  : []
                                }
                                options={jerarquiaOptions}
                                optionLabel="label"
                                onChange={(e) => updateEditingField('jerarquia', e.value)}
                                placeholder="Selecciona una o más jerarquías"
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

            {/* DIÁLOGO DE CONFIRMACIÓN DE BORRADO */}
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
