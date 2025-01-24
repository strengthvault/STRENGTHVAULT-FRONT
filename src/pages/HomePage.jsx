/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import Tvideo from './../assets/videos/try.mp4';


import a from './../assets/designs/designBook.png';
import { Book, Feed } from '@mui/icons-material'; // Importamos el ícono de Material UI
import Slider from "react-slick";

import ReactPlayer from 'react-player';

import PlayCircleIcon from '@mui/icons-material/PlayCircle';

import Lautaro from './../assets/trainers/Lautaro-antonuttcio.jpg';
import Nicolas from './../assets/trainers/Nicolas.jpg';
import Martin from './../assets/trainers/trainer.jpg';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { IconButton } from '@mui/material';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FeedIcon from '@mui/icons-material/Feed';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const HomePage = () => {

  const [largo, setLargo] = useState(window.innerWidth)

  const videoRef = React.useRef(null);

  useEffect(() =>{

  },[])


  const cards = [
    { image: Lautaro, text: "LAUTARO ANTONUTCCIO", description: "Entrenador de fuerza, powerlifting, Kineseologo, " },
    { image: Nicolas, text: "NICOLAS NIETO", description: "Entrenador de fuerza, Personal trainer" },
    { image: Martin, text: "MARTIN CASANOVA", description: "Entrenador de fuerza, Personal trainer" }
    
  ];

  let sliderRef = useRef(null);
  const play = () => {
    sliderRef.slickPlay();
  };
  const pause = () => {
    sliderRef.slickPause();
  };

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,

    cssEase: "linear"
  };

  return (
    <main className='container-fluid x text-white'>
      {/* Video de fondo y contenido centrado */}




      
      {/* Nueva sección con texto a la izquierda y el ícono a la derecha */}
      <section className="row justify-content-center ColorBackground align-items-center  align-center  py-5">
     
          <div className="col-10 col-lg-4 text-center fade-in" >
            <div className='altoImg m-auto text-center'>
              <img src={a} className='img-fluid m-auto ' alt="" />
            </div>
          </div>
          <div className="col-10 col-lg-5 fade-in">
            <h2 className='open-sans-titles text-center'>¿POR QUÉ ELEGIR STRENGTHVAULT?</h2>
            <p className='mt-4 '>
              <span className='d-block'>
              <b>Contenido de calidad:</b> Accede a artículos científicos, reseñas de libros, entrevistas a expertos y mucho más. Nuestro equipo de editores selecciona cuidadosamente cada contenido para garantizar su relevancia y rigor.
              </span>
              <span className='d-block'>
              <b>Actualizaciones constantes:</b> Mantente al día con las últimas tendencias y descubrimientos en el mundo del fitness. Publicamos nuevos artículos y entrevistas cada mes para que siempre tengas algo nuevo que aprender.
              </span>
              <span className='d-block'>
              <b>Comunidad activa:</b> Únete a nuestra comunidad de apasionados del entrenamiento de fuerza. Intercambia conocimientos, comparte experiencias y encuentra inspiración en otros miembros.
              </span>
              <span className='d-block'>
              <b>Diversidad de temas:</b> Desde las últimas técnicas de entrenamiento hasta la nutrición deportiva y la psicología del ejercicio, en StrengthVault encontrarás todo lo que necesitas para mejorar tu rendimiento.
              </span>
            </p>
          </div>

       
      </section>




      <section className='row justify-content-center text-center ColorBackground-2 '>
        {largo > 992 ? 
        
        <>

        <div className='col-4'>
          <h2>Lautaro Antonuttcio</h2>
          <img src={Lautaro} className=" img-fluid imgCarrousel text-center m-auto" alt={`Lautaro Antonuttcio`} />
        </div>
        
        <div className='col-4'>
           <h2>Martin Casanova</h2>
          <img src={Martin} className=" img-fluid imgCarrousel text-center m-auto" alt={`Martin Casanova`} />
        </div>

        <div className='col-4'>
           <h2>Nicolas Nieto</h2>
          <img src={Nicolas} className=" img-fluid imgCarrousel text-center m-auto" alt={`Nicolas Nieto`} />
        </div>
        
        </> :
        
        <div className='col-8 text-center'>
          <Slider {...settings}>
            {cards.map((card, index) => (
              <div key={index} className="border-0 text-center my-5">
                <div  className='card-img-top'>
                <img src={card.image} className=" img-fluid imgCarrousel text-center m-auto" alt={`card-${index}`} />

                </div>
                <div className="card-body text-center">
                  <h5 className="card-title open-sans-titles">{card.text}</h5>
                  <p className="card-text">{card.description}</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        }
      
    </section>



          <div className="row justify-content-center ColorBackground pb-5 pt-5 text-shadow">
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

export default HomePage;
