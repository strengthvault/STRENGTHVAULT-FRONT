import React, { useState, useEffect } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';

import IconButton from '@mui/material/IconButton';
import PersonIcon from '@mui/icons-material/Person';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';


export default function PrimeReactTable({ videosData, refresh }) {

    const [searchText, setSearchText] = useState('');



    const [widthPage, setWidthPage] = useState();

    const [inputValue, setInputValue] = useState('');
    const isInputValid = inputValue === 'ELIMINAR';


    useEffect(() => {
        setWidthPage(window.innerWidth)

    }, [window.innerWidth]);


    const onSearchChange = (event) => {
        setSearchText(event.target.value);
    };

    const actionsTemplate = (user) => {
        return <div className=''>
            <Link className={`LinkDays iconButtons `} to={`/user/routine/${user._id}/${user.name}`}>
                <IconButton
                    aria-label="delete"
                    className='btn p-1 my-2 '
                >   
                    <EditIcon className='text-dark ' />
            </IconButton>
            </Link>
            <IconButton
                aria-label="video"
                onClick={() => openDialog(user._id, user.name)}
                className='btn p-1 my-2'
            >
                <PersonIcon className='text-dark ' />
            </IconButton>

            <IconButton
                aria-label="delete"
                onClick={() => showDialogDelete(user._id, user.name)}
                className='btn p-1 my-2'
            >
                <CancelIcon className='colorIconYoutube ' />
            </IconButton>


        </div>;
    };

    const linksTemplate = (user,e) => {
        if(e.field == 'email'){
            return <Link className='LinkDays p-3 w-100 ClassBGHover text-start' to={`/user/routine/${user._id}/${user.name}`}>{user.email}</Link>;
        } else{
            return <Link className='LinkDays p-3 w-100 ClassBGHover text-start' to={`/user/routine/${user._id}/${user.name}`}>{user.name}</Link>;

        }
    };








    return (
        <div className='row justify-content-center '>
            <div className='col-12 col-lg-4 text-center m-0'>

                <div className="p-inputgroup mb-4">
                    <InputText 
                        value={searchText}
                        onChange={onSearchChange}
                        placeholder="Buscar usuarios..." 
                    />
                </div>
            </div>
            <div className='col-12 col-sm-10 m-0 mb-5 fontUsersList'>
                
                <DataTable className='usersListTable alignDatatable  pt-0' paginator rows={10} value={filteredUsers} >
                    <Column body={linksTemplate} field="name" header="Nombre" />
                    {widthPage > 600 ? <Column body={linksTemplate} field="email" header="Email"/> : null}
                    <Column body={actionsTemplate} header="Acciones" />
                </DataTable>

                <ToastContainer />

                <Dialog header={`${nameUser}`} visible={visible} onHide={() => closeDialog()} className={`${widthPage > 900 ? 'col-8' : 'col-10'}`} >
                    {renderProfileData()}
                </Dialog>

                <Dialog header={`${nameUser}`} visible={showDialog} onHide={() => hideDialog()} style={{ width: `${widthPage > 900 ? 'w-50' : 'w-100'}` }} >
                <div className='row justify-content-center'>
                    <div className='col-10 col-sm-6 mb-3'>
                    <label htmlFor="inputDelete" className='text-center mb-4'>Por favor, escriba <b>"ELIMINAR"</b> si desea eliminar permanentemente el usuario <b>{nameUser}</b></label>
                    <input
                        id='inputDelete'
                        type="text"
                        className='form-control'
                        value={inputValue}
                        onChange={(event) => setInputValue(event.target.value)}
                    />
                    </div>
                    <div className='col-12 text-center'>
                    <button className="btn btn-sseccon m-3" onClick={handleCancel} >Cancelar</button>
                    <button className={isInputValid ? 'btn btn-danger m-3' : 'btn btn-secondary m-3'} disabled={!isInputValid} onClick={handleAccept}>Eliminar</button>

                    </div>
                </div>
                </Dialog>

            </div>
        </div>
    );
}
