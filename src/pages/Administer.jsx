import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';  // npm install uuid
import * as UserServices from './../services/auth.services';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from '@mui/material';

const Administer = () => {
    const [users, setUsers] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

    // Diálogo de edición de membresía
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);

    // Diálogo de confirmación de eliminación de usuario
    const [selectedUser, setSelectedUser] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const [isDeleteButtonEnabled, setIsDeleteButtonEnabled] = useState(false);

    // Diálogo de confirmación para eliminar RECIBO
    const [openDeleteReceiptDialog, setOpenDeleteReceiptDialog] = useState(false);
    const [receiptToDelete, setReceiptToDelete] = useState(null);

    // Nuevo: Diálogo de confirmación para agregar recibo
    const [openConfirmReceiptDialog, setOpenConfirmReceiptDialog] = useState(false);

    // Opciones de categoría (jerarquía)
    const categories = ['Gratuito', 'Básico', 'Elite'];

    // Manejo de la responsividad
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 992);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Cargar usuarios al montar el componente
    useEffect(() => {
        const userId = localStorage.getItem('_id');
        UserServices.getAllUsers(userId)
            .then(data => {
                setUsers(data);
                console.log('Usuarios cargados:', data);
            })
            .catch(err => {
                console.error('Error fetching users:', err);
            });
    }, []);

    // -------------------------------------------------
    //  Abrir/Cerrar diálogo de edición (membresía/pagos)
    // -------------------------------------------------
    const handleOpenEditDialog = (user) => {
        // Aseguramos que paymentHistory sea un array y que cada recibo tenga un ID único.
        let safePaymentHistory = [];
        if (Array.isArray(user.paymentHistory)) {
            safePaymentHistory = user.paymentHistory.map((receipt) => ({
                ...receipt,
                _id: receipt._id || uuidv4() // si no tiene _id, generamos uno
            }));
        }

        // PREPARAMOS el price:
        // - Si ya existe user.price, usamos ese.
        // - Caso contrario, usamos el localStorage.getItem('price').
        const defaultPrice = localStorage.getItem('price') || ''; 
        const userPrice = (typeof user.price !== 'undefined') ? user.price : defaultPrice;

        setUserToEdit({
            ...user,
            paymentHistory: safePaymentHistory,
            category: user.category || 'Gratuito',
            selectedMonth: user.selectedMonth ?? 1,
            // Asignamos userPrice como price por default.
            price: userPrice
        });
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setUserToEdit(null);
    };

    // ----------------------------------
    //   Marcar un solo mes a la vez
    // ----------------------------------
    const handleMonthChange = (month) => {
        setUserToEdit(prev => ({
            ...prev,
            selectedMonth: prev.selectedMonth === month ? null : month
        }));
    };

    // ----------------------------------
    //   Confirmación antes de Eliminar un Recibo
    // ----------------------------------
    const handleOpenDeleteReceiptDialog = (receiptId) => {
        setReceiptToDelete(receiptId);
        setOpenDeleteReceiptDialog(true);
    };

    const handleCloseDeleteReceiptDialog = () => {
        setReceiptToDelete(null);
        setOpenDeleteReceiptDialog(false);
    };

    const handleConfirmDeleteReceipt = () => {
        if (!receiptToDelete) return;
        // Eliminamos el recibo
        setUserToEdit(prev => ({
            ...prev,
            paymentHistory: prev.paymentHistory.filter(r => r._id !== receiptToDelete)
        }));
        // Cerramos el diálogo
        setReceiptToDelete(null);
        setOpenDeleteReceiptDialog(false);
    };

    // ----------------------------------
    //   Agregar un nuevo recibo y GUARDAR de inmediato
    // ----------------------------------
    const handleAddAndSaveReceipt = () => {
        // 1) Creamos el nuevo objeto de pago
        const monthsToAdd = parseInt(userToEdit.selectedMonth) || 1;
        const newReceipt = {
            _id: uuidv4(),
            paymentDate: new Date().toISOString(), // fecha/hora actual
            months: monthsToAdd,
            category: userToEdit.category || 'Gratuito',
            // OJO: usamos userToEdit.price (que ya tenía el default)
            price: userToEdit.price || ''
        };

        // 2) Actualizamos "userToEdit" localmente con el nuevo recibo
        const updatedUser = {
            ...userToEdit,
            paymentHistory: [...userToEdit.paymentHistory, newReceipt]
        };
        setUserToEdit(updatedUser);

        // 3) Guardamos inmediatamente con el updatedUser
        handleSaveChanges(updatedUser);
    };

    // Nuevo: Funciones para abrir/cerrar el diálogo de confirmación para agregar recibo
    const handleOpenConfirmReceiptDialog = () => {
        setOpenConfirmReceiptDialog(true);
    };

    const handleCloseConfirmReceiptDialog = () => {
        setOpenConfirmReceiptDialog(false);
    };

    const handleConfirmReceipt = () => {
        setOpenConfirmReceiptDialog(false);
        handleAddAndSaveReceipt();
    };

    // ----------------------------------
    //   Guardar Cambios
    // ----------------------------------
    const handleSaveChanges = (userOverride = null) => {
        const currentUser = userOverride || userToEdit;
        if (!currentUser) return;

        // Si es "Gratuito", le ponemos un futuro "infinito"
        let futureDate = new Date();
        if (currentUser.category === 'Gratuito') {
            // Si la categoría es 'Gratuito' => acceso infinito
            futureDate = new Date(9999, 11, 31); // 9999-12-31
        } else {
            // Caso contrario => calculamos según selectedMonth
            const monthsToAdd = parseInt(currentUser.selectedMonth);
            if (!isNaN(monthsToAdd)) {
                futureDate.setMonth(futureDate.getMonth() + monthsToAdd);
            } else {
                futureDate.setMonth(futureDate.getMonth() + 1);
            }
        }

        if (isNaN(futureDate.getTime())) {
            alert('Por favor ingrese un mes válido.');
            return;
        }

        // Creamos updateData
        const updateData = {
            allowAllAccess: currentUser.allowAllAccess,
            futureDate: futureDate.toISOString().split('T')[0],
            paymentHistory: currentUser.paymentHistory,
            selectedMonth: currentUser.selectedMonth,
            category: currentUser.category,
            price: currentUser.price // Se guarda el price a nivel user si tu backend lo permite
        };

        // Actualizar en el backend
        UserServices.updateUser(currentUser._id, updateData)
            .then(() => {
                // Luego recargamos la lista de usuarios
                return UserServices.getAllUsers(localStorage.getItem('_id'));
            })
            .then(data => {
                setUsers(data);
                // Si es un guardado normal (no userOverride), cerramos el diálogo
                if (!userOverride) {
                    setOpenEditDialog(false);
                    setUserToEdit(null);
                } else {
                    // Si venimos de "AddAndSaveReceipt", re-abrimos el diálogo 
                    // con la data actualizada para que el usuario vea 
                    // reflejada la info final
                    const foundUpdatedUser = data.find(u => u._id === currentUser._id);
                    if (foundUpdatedUser) {
                        handleOpenEditDialog(foundUpdatedUser);
                    }
                }
            })
            .catch(err => {
                console.error('Error al actualizar el usuario:', err);
            });
    };

    // Manejo del precio (input)
    const handlePriceChange = (e) => {
        const newPrice = e.target.value;
        setUserToEdit(prev => ({
            ...prev,
            price: newPrice
        }));
    };

    // ---------------------------------------------------
    //  Eliminar un Usuario (no un recibo)
    // ---------------------------------------------------
    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setOpenDeleteDialog(true);
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
                    setUsers(prev => prev.filter(u => u._id !== selectedUser._id));
                    setOpenDeleteDialog(false);
                    setSelectedUser(null);
                    setDeleteConfirmation('');
                    setIsDeleteButtonEnabled(false);
                })
                .catch(err => {
                    console.error('Error al eliminar el usuario:', err);
                });
        }
    };

    return (
        <div className="container-fluid ColorBackground">
            <div className='row justiy-content-center text-center mb-5 pt-3'>
                <h2 className='text-light'>Administrador de Usuarios</h2>
            </div>

            {/* Renderizado Condicional (Tarjetas Móvil o Tabla Escritorio) */}
            <div className='row justify-content-center text-center '>
                {isMobile ? (
                    // Versión Móvil
                    <div className="row justify-content-center text-center">
                        {users.map(user => (
                            <div key={user._id} className="card text-light bg-dark col-10 mb-4">
                                <div className="card-body">
                                    <h5 className="card-title mb-3">{user.username}</h5>
                                    <p className="card-text mb-3">{user.email}</p>
                                    {user.allowAllAccess
                                        ? <p className="card-text mt-4 mb-3">
                                            Acceso habilitado durante <b>{user.daysLeft || "No disponible"}</b> días
                                          </p>
                                        : <p className='card-text mt-4 mb-3'>Acceso inhabilitado</p>
                                    }

                                    <p className='card-text mt-2 mb-3'>
                                        <b>Jerarquía:</b> {user.category || 'Gratuito'}
                                    </p>

                                    <div>
                                        <button
                                            className="btn btn-primary me-1"
                                            onClick={() => handleOpenEditDialog(user)}
                                        >
                                            <EditIcon />
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
                    // Versión Escritorio
                    <table className="background-tr table table-striped align-middle mb-5">
                        <thead>
                            <tr>
                                <th>Nombre de Usuario</th>
                                <th>Email</th>
                                <th>Jerarquía</th>
                                <th>Estado de Acceso</th>
                                <th>Días Restantes</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.category || 'Gratuito'}</td>
                                    <td>{user.allowAllAccess ? 'Habilitado' : 'Inhabilitado'}</td>
                                    <td>
                                        {user.allowAllAccess
                                            ? <b>{user.daysLeft || "No disponible"}</b>
                                            : '---'
                                        }
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-primary me-1"
                                            onClick={() => handleOpenEditDialog(user)}
                                        >
                                            <EditIcon />
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

            {/* Diálogo Confirmar Eliminación de Usuario */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
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
                    <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
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

            {/* Diálogo Confirmar Eliminación de Recibo */}
            <Dialog open={openDeleteReceiptDialog} onClose={handleCloseDeleteReceiptDialog}>
                <DialogTitle>Eliminar Recibo</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro de que deseas eliminar este recibo?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteReceiptDialog} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmDeleteReceipt} color="primary">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Nuevo: Diálogo Confirmación para Agregar Recibo */}
            <Dialog open={openConfirmReceiptDialog} onClose={handleCloseConfirmReceiptDialog}>
                <DialogTitle>Confirmar acción</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro de que deseas habilitar acceso y generar recibo?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmReceiptDialog} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmReceipt} color="primary">
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Diálogo Edición Membresía + Historial de Pagos */}
            {userToEdit && (
                <Dialog
                    open={openEditDialog}
                    onClose={handleCloseEditDialog}
                    fullWidth
                    maxWidth="md"
                >
                    <DialogTitle>Editar Membresía</DialogTitle>
                    <DialogContent>
                        {/* Tabla con Nombre, Permitir Acceso y Jerarquía */}
                        <table className="table table-sm table-bordered text-center align-middle">
                            <thead>
                                <tr>
                                    <th className='widthName'>Usuario</th>
                                    <th className='widthAccess'>Permitir Acceso</th>
                                    <th>Jerarquía</th>
                                    <th className='widthPrice'>Precio</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className='text-dark'>{userToEdit.username}</td>
                                    <td className="text-center">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={userToEdit.allowAllAccess || false}
                                            onChange={(e) =>
                                                setUserToEdit(prev => ({
                                                    ...prev,
                                                    allowAllAccess: e.target.checked
                                                }))
                                            }
                                        />
                                    </td>
                                    <td className='widthJerarquy'>
                                        <select
                                            className="form-select border-0"
                                            value={userToEdit.category || 'Gratuito'}
                                            onChange={(e) =>
                                                setUserToEdit(prev => ({ ...prev, category: e.target.value }))
                                            }
                                        >
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            className="form-control border-0"
                                            placeholder="Ingresa el precio"
                                            value={userToEdit.price || ''}
                                            onChange={handlePriceChange}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="text-center">
                            <p className="card-text mt-4 mb-2">Seleccionar meses de acceso (1 - 12)</p>
                            <div className="mb-3">
                                {[...Array(12)].map((_, idx) => {
                                    const month = idx + 1;
                                    return (
                                        <div key={month} className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                disabled={userToEdit.category === 'Gratuito'}
                                                checked={userToEdit.selectedMonth === month}
                                                onChange={() => handleMonthChange(month)}
                                            />
                                            <label className="form-check-label">{month}</label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Botón para AGREGAR y GUARDAR un nuevo recibo directamente */}
                        <div className="mb-2 text-center">
                            <button 
                                className="btn btn-success btn-sm"
                                onClick={handleOpenConfirmReceiptDialog}
                            >
                                Habilitar acceso y generar recibo
                            </button>
                        </div>

                        <hr />
                        <h5 className="mb-3">Historial de pagos</h5>
                        {userToEdit.paymentHistory && userToEdit.paymentHistory.length > 0 ? (
                            <table className="table table-sm table-bordered text-center align-middle">
                                <thead>
                                    <tr>
                                        <th>Fecha de Pago</th>
                                        <th>Meses</th>
                                        <th>Precio</th>
                                        <th>Jerarquía</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userToEdit.paymentHistory.map((receipt) => (
                                        <tr key={receipt._id}>
                                            <td className="text-dark">
                                                {new Date(receipt.paymentDate).toLocaleDateString('es-ES')}
                                            </td>
                                            <td className="text-dark">{receipt.months}</td>
                                            <td className="text-dark">
                                                $ {receipt.price || ''}
                                            </td>
                                            <td className="text-dark">{receipt.category || 'Gratuito'}</td>
                                            <td>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleOpenDeleteReceiptDialog(receipt._id)}
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-muted">No hay registros de pago</p>
                        )}
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleCloseEditDialog} color="primary">
                            Cancelar
                        </Button>
                        {/* Botón GUARDAR principal */}
                        <Button onClick={() => handleSaveChanges()} color="primary">
                            Guardar
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </div>
    );
};

export default Administer;
