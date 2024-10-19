import { useState, useEffect } from 'react';
import * as UserServices from './../services/auth.services';
import DeleteIcon from '@mui/icons-material/Delete';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';


const Administer = () => {
    const [users, setUsers] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
    const [selectedUser, setSelectedUser] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const [isDeleteButtonEnabled, setIsDeleteButtonEnabled] = useState(false);
    const [timeOptions] = useState([
        { label: '1 mes', value: 1 },
        { label: '2 meses', value: 2 },
        { label: '3 meses', value: 3 },
        { label: 'Personalizado', value: 'custom' }
    ]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 992);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const userId = localStorage.getItem('_id');
        UserServices.getAllUsers(userId)
            .then(data => {
                setUsers(data);
                console.log(data);
            })
            .catch(err => {
                console.error('Error fetching users:', err);
            });
    }, []);

    const handleAllowAllAccessChange = (userId, value) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user._id === userId ? { ...user, allowAllAccess: value } : user
            )
        );
    };

    const handleTimeOptionChange = (userId, value) => {
        setUsers(prevUsers =>
            prevUsers.map(user => 
                user._id === userId ? { ...user, selectedTimeOption: value == null ||value, customTime: '' } : user
            )
        );
    };

    const handleCustomTimeChange = (userId, value) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user._id === userId ? { ...user, customTime: value } : user
            )
        );
    };

    const handleSaveChanges = (user) => {

        let futureDate = new Date();
        
        if (user.selectedTimeOption === 'custom') {
            if (!user.customTime) {
                console.error('Fecha personalizada no definida');
                alert('Por favor ingrese una fecha válida en el campo personalizado.');
                return;
            }
            futureDate = new Date(user.customTime);
        } else {
            const monthsToAdd = parseInt(user.selectedTimeOption);

            if (!isNaN(monthsToAdd)) {
                futureDate.setMonth(futureDate.getMonth() + monthsToAdd);
                console.log(monthsToAdd)
            } else {

                futureDate.setMonth(futureDate.getMonth() + 1);

               
            }
        }
    
        if (isNaN(futureDate.getTime())) {
            console.error('Fecha no válida');
            alert('Por favor ingrese una fecha válida.');
            return;
        }
    
        UserServices.updateUser(user._id, {
            allowAllAccess: user.allowAllAccess,
            futureDate: futureDate.toISOString().split('T')[0]
        })
        .then(() => {
            console.log('Usuario actualizado correctamente');
            return UserServices.getAllUsers(user._id);
        })
        .then(data => {
            setUsers(data);
        })
        .catch(err => {
            console.error('Error al actualizar el usuario:', err);
        });
    };



    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setOpenDialog(true);
    };

    const handleDeleteConfirmationChange = (e) => {
        const input = e.target.value;
        setDeleteConfirmation(input);
        setIsDeleteButtonEnabled(input === 'ELIMINAR');
    };

    const handleDeleteConfirm = () => {
        if (selectedUser) {
            UserServices.deleteUser(selectedUser._id)
                .then(() => {
                    setUsers(users.filter(user => user._id !== selectedUser._id));
                    setOpenDialog(false);
                    setSelectedUser(null);
                    setDeleteConfirmation('');
                    setIsDeleteButtonEnabled(false);
                })
                .catch(err => {
                    console.error('Error al eliminar el usuario:', err);
                });
        }
    };

    addLocale('es', {
        firstDayOfWeek: 1,
        showMonthAfterYear: true,
        dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
        dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
        dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
        monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
        monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
        today: 'Hoy',
        clear: 'Limpiar'
    });

    return (
        <div className="container-fluid ColorBackground">

            <div className='row justiy-content-center text-center mb-5 pt-3'>
            <h2 className=' text-light'>Administrador de Usuarios</h2>
            </div>
            <div className='row justify-content-center text-center '>
                
                {isMobile ? (
                    <div className="row justify-content-center text-center">
                        {users.map(user => (
                            <div key={user._id} className="card text-light bg-dark col-10 mb-4">
                                <div className="card-body">
                                    <h5 className="card-title mb-3">{user.username}</h5>
                                    <p className="card-text mb-3">{user.email}</p>
                                    <div className="form-switch">
                                        <input
                                            className="form-check-input me-4"
                                            type="checkbox"
                                            checked={user.allowAllAccess}
                                            onChange={(e) =>
                                                handleAllowAllAccessChange(user._id, e.target.checked)
                                            }
                                        />
                                        <label className="form-check-label">Permitir acceso</label>
                                    </div>
                                    {user.allowAllAccess == true ? <p className="card-text mt-4 mb-3">Acceso habilitado durante <b>{user.daysLeft || "No disponible"}</b> días</p>:
                                    <p className='card-text mt-4 mb-3'>Acceso inhabilitado</p>}
                                    <p className="card-text mt-4 mb-3">Agregar tiempo</p>
                                    <select
                                        className="form-select my-2"
                                        defaultValue={user.selectedTimeOption || "1"}
                                        onChange={(e) => handleTimeOptionChange(user._id, e.target.value)}
                                    >
                                        {timeOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {user.selectedTimeOption === 'custom' && (
                                        <Calendar
                                            value={user.customTime ? new Date(user.customTime) : null}
                                            onChange={(e) => handleCustomTimeChange(user._id, e.value)}
                                            locale="es"
                                            dateFormat="dd/mm/yy"
                                            placeholder="Selecciona una fecha"
                                            showIcon
                                            className="mt-3 styleCalendar"
                                        />
                                    )}
                                    <div>
                                        <button
                                            className="btn btn-primary me-1"
                                            onClick={() => handleSaveChanges(user)}
                                        >
                                            <SaveIcon />
                                            
                                        </button>
                                        <button
                                            className="btn btn-danger ms-1"
                                            onClick={() => handleDeleteClick(user)}
                                        >
                                            <DeleteIcon /> 
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <table className="background-tr table table-striped align-middle mb-5">
                        <thead>
                            <tr>
                                <th>Nombre de Usuario</th>
                                <th>Email</th>
                                <th>Permitir acceso</th>
                                <th>Tiempo Restante</th>
                                <th>Editar membresía</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={user.allowAllAccess}
                                            className='form-check-input'
                                            onChange={(e) =>
                                                handleAllowAllAccessChange(user._id, e.target.checked)
                                            }
                                        />
                                    </td>
                                    <td>{user.allowAllAccess == true ? <p className="card-text mt-4 mb-3">Acceso habilitado durante <b>{user.daysLeft || "No disponible"}</b> días</p>:
                                    <p className='card-text mt-4 mb-3'>Acceso inhabilitado</p>}</td>
                                    <td>
                                        <select
                                            value={user.selectedTimeOption || 1}
                                            className='form-select'
                                            onChange={(e) =>
                                                handleTimeOptionChange(user._id, e.target.value)
                                            }
                                        >
                                            {timeOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        {user.selectedTimeOption === 'custom' && (
                                            <Calendar
                                                value={user.customTime ? new Date(user.customTime) : null}
                                                onChange={(e) => handleCustomTimeChange(user._id, e.value)}
                                                locale="es"
                                                dateFormat="dd/mm/yy"
                                                placeholder="Selecciona una fecha"
                                                showIcon
                                                className="mt-3"
                                            />
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-primary me-1"
                                            onClick={() => handleSaveChanges(user)}
                                        >
                                            <SaveIcon />
                                            
                                        </button>
                                        <button
                                            className="btn btn-danger ms-1"
                                            onClick={() => handleDeleteClick(user)}
                                        >
                                            <DeleteIcon /> 
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Para eliminar el usuario, por favor escribe ELIMINAR en el siguiente campo de texto.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Escribe ELIMINAR"
                        fullWidth
                        value={deleteConfirmation}
                        onChange={handleDeleteConfirmationChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="primary"
                        disabled={!isDeleteButtonEnabled}
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Administer;
