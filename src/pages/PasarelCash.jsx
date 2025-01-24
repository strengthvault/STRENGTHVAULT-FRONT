import React, { useEffect, useState } from 'react';
import * as UserServices from '../services/auth.services.js';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { IconButton } from '@mui/material';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FeedIcon from '@mui/icons-material/Feed';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

import { Book, Feed } from '@mui/icons-material'; // Importamos el ícono de Material UI


const PasarelCash = () => {


  return (
    <main className="container-fluid text-white" >
 
        <div className="row justify-content-center ColorBackground pb-5 text-shadow">
            <div className="col-10 col-lg-4 ">
              <div className="card ColorBackground text-light shadow-drop-2-center border-0 py-2 ">
                <div className=" border-0 p-2">
                  <h3 className="my-0 open-sans-titles text-center ">PLAN STRENGTHVAULT</h3>
                </div>
                <div className="row justify-content-center">
                  <p className="card-title open-sans-titles fs-5 mt-4  text-center">$20000 <span className="">/ mes</span></p>
                  <div className='col-8  text-center'>

                  <ul className="list-group list-group-flush text-center ">
                    <li className="list-group-item align-items-center bg-transparent text-light">
                      <span className='text-start '>
                      <IconButton className=' text-light' >
                        <OndemandVideoIcon />
                      </IconButton>
                      </span>


                      Eventos en línea
                      </li>
                    <li className="list-group-item  bg-transparent text-light">
                      <IconButton className=' text-light' >
                        <FileDownloadIcon />
                      </IconButton>
                      Recursos descargables
                      </li>
                    <li className="list-group-item  bg-transparent text-light">
                     <IconButton className=' text-light'>
                        <Feed />
                      </IconButton>
                      Foro de discusión
                      </li>
                    <li className="list-group-item  bg-transparent text-light">
                      <IconButton className=' text-light'>
                        <WhatsAppIcon />
                      </IconButton>
                      Contacto diario con nosotros
                      </li>
                  </ul>

                  <button type="button" className="btn colorButtons border open-sans-titles text-center my-4">COMPRAR</button>
                    
                  </div>

                </div>
              </div>
            </div>
          </div>

    </main>
  );
};

export default PasarelCash;
