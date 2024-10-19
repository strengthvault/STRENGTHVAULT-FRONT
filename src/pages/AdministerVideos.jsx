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

            } catch (error) {
                console.log(error)
            }
        };
        loadVideos();

        const handleResize = () => setIsMobile(window.innerWidth < 992);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [status]);

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
                    <IconButton className='border  aaa' onClick={() => startEditing(blog)} >
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
                            <td>
                                {editingBlog === blog._id ? (
                                    <InputText 
                                        value={blog.nombre} 
                                        onChange={(e) => handleInputChange(blog._id, 'nombre', e.target.value)}
                                    />
                                ) : (
                                    blog.nombre
                                )}
                            </td>
                            <td>
                                {editingBlog === blog._id ? (
                                    <InputTextarea 
                                        value={blog.descripcion} 
                                        className='w-100' 
                                        onChange={(e) => handleInputChange(blog._id, 'descripcion', e.target.value)}
                                    />
                                ) : (
                                    <span className='cssformated'>{blog.descripcion}</span>
                                )}
                            </td>
                            <td>
                                {editingBlog === blog._id ? (
                                    <Dropdown 
                                        value={categorys.find(cat => cat.name === blog.categoria) || blog.categoria} 
                                        options={categorys} 
                                        optionLabel="name" 
                                        onChange={(e) => handleCategoryChange(blog._id, e.value)} 
                                        editable
                                    />
                                ) : (
                                    blog.categoria
                                )}
                            </td>
                            <td>
                                {editingBlog === blog._id ? (
                                    <InputText 
                                        value={blog.url} 
                                        onChange={(e) => handleInputChange(blog._id, 'url', e.target.value)}
                                    />
                                ) : (
                                    <>
                                    <IconButton className='border  aaa' onClick={(e) => op.current.toggle(e)}>
                                        <YouTubeIcon className='text-light ' />
                                    </IconButton>
                                    <OverlayPanel ref={op}>
                                        <ReactPlayer
                                            className={'w-100'}
                                            url={blog.url}
                                            config={{
                                                youtube: {
                                                    playerVars: { showinfo: 1 }
                                                }
                                            }}
                                        />
                                    </OverlayPanel>
                                    </>
                                )}
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

    const handleFormChange = (field, value) => {
        switch (field) {
            case 'nombre':
                setNombre(value);
                break;
            case 'descripcion':
                setDescripcion(value);
                break;
            case 'categoria':
                // Si el valor es un objeto de categoría (selección) o un string (manual), lo manejamos apropiadamente
                setCategory(typeof value === 'string' ? value : value.name);
                break;
            case 'url':
                setUrl(value);
                break;
            default:
                break;
        }
    };
    
    const validateForm = () => {
        if (!nombre || !descripcion || !category ) {
            toast.error('Todos los campos son obligatorios');
            return false;
        }
        return true;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return; // Si no pasa la validación, no hacemos submit
    
        const toastId = toast.loading('Creando...');
        videosServices.createVideo({ nombre, descripcion, categoria: category, url })
            .then(() => {
                setStatus(status + 1);
                toast.update(toastId, { render: '¡Listo!', type: 'success', isLoading: false, autoClose: 2000 });
                // Limpiar los campos después de crear
                setNombre('');
                setDescripcion('');
                setCategory(null);
                setUrl('');
            })
            .catch(() => {
                toast.update(toastId, { render: 'Error al crear', type: 'error', isLoading: false, autoClose: 2000 });
            });
    };

    return (
        <div className="container-fluid">
        <div className='row justify-content-center '>
            <div className='ColorBackground'>
                <h2 className='my-4 text-center text-light'>
                    Agregá un blog
                </h2>
                <div className='row justify-content-center text-center'>
                    <form className='col-10 col-lg-6' onSubmit={onSubmit}>
                        <div className='row justify-content-between'>
                            <div className='col-12 col-lg-7'>
                                <label htmlFor='name' className='text-light text-center mb-1'>
                                    Nombre 
                                </label>
                                <input
                                    type='text'
                                    className='form-control altoInputName'
                                    id='name'
                                    name='name'
                                    onChange={(e) => handleFormChange('nombre', e.target.value)}
                                    value={nombre}
                                    placeholder='Nombre'
                                />
                            </div>
                            <div className='col-12 col-lg-5 '>
                                <label htmlFor='categoria' className='text-light text-center d-block mb-1'>
                                    Categoría 
                                </label>

                                <Dropdown 
                                    value={category} 
                                    onChange={(e) => handleFormChange('categoria', e.value)} 
                                    options={categorys} 
                                    optionLabel="name"
                                    editable 
                                    placeholder="Categoría" 
                                    className="w-100" 
                                />
                            </div>
                        </div>
                        <div className='my-3'>
                            <label htmlFor='descripcion' className='text-light text-center mb-1'>
                                Descripción 
                            </label>
                            <InputTextarea 
                                autoResize 
                                value={descripcion} 
                                onChange={(e) => handleFormChange('descripcion', e.target.value)} 
                                rows={5} 
                                className='w-100' 
                            />
                        </div>
                        {/*<div className='my-3'>
                            <label htmlFor='url' className='text-light text-center mb-1'>
                                Video 
                            </label>
                            <input
                                type='text'
                                className='form-control h-100'
                                id='url'
                                name='url'
                                onChange={(e) => handleFormChange('url', e.target.value)}
                                value={url}
                                placeholder='Video'
                            />
                        </div>*/}
                        <button className='input-group-text btn btn-primary my-4'>Crear blog</button>
                    </form>
                </div>
                </div>
            <div className='ColorBackground-2 '>

                <h2 className=" text-center text-light mt-4">Administrar Videos</h2>
                {isMobile && status ? renderCards() : status && renderTable()}
            </div>

            <div className='ColorBackground py-5'>

            </div>

        </div>
            {/* Popup de confirmación para eliminar */}
            <Dialog visible={!!confirmDelete} onHide={() => setConfirmDelete(null)} header="Confirmación de eliminación" footer={
                <>
                    <button className="btn btn-danger" onClick={() => handleDelete(confirmDelete)}>Eliminar</button>
                    <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancelar</button>
                </>
            }>
                <p>¿Deseas eliminar el blog {confirmDelete?.nombre}?</p>
            </Dialog>
            <ToastContainer
                position="bottom-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                theme="light"
                transition: Bounce
                />
        </div>
    );
};

export default AdministerVideos;
