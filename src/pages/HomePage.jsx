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
    { image: Lautaro, text: "LAUTARO ANTONUTCCIO", description: "Soy Lautaro Antonuccio, uno de los creadores de Strength Vault y co-fundador de Strength Is Science. Actualmente soy estudiante de la Licenciatura de Kinesiología y Fisiatria, cuento con +5 años de experiencia como levantador de pesas. Me desarrollo dentro del coaching online con fines de mejora de rendimiento como en readaptación de lesiones." },
    { image: Nicolas, text: "NICOLAS NIETO", description: "Mi nombre es Nicolas Nieto, soy uno de los creadores de Strength Vault, co-fundador y entrenador de Silverbackgym y actualmente estudiante de la Licenciatura en kinesiología y fisioterapia, me especializo en el entrenamiento de Powerlifting, fuerza e hipertrofia muscular." },
    { image: Martin, text: "MARTIN CASANOVA", description: "Mi nombre es Martin Casanova, soy uno de los creadores de Strength Vault, co-fundador y entrenador de Strength is Science y actualmente estudiante de la Licenciatura en Nutricion, me especializo en el entrenamiento de Powerlifting, fuerza y acondicionamiento físico." }
    
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
     
         
          <div className="col-10 col-lg-5 fade-in">
            <h2 className='open-sans-titles text-start'>¿QUIENES SOMOS?</h2>
            <p className='mt-4 '>
            En <b>Strength Vault</b> te ofrecemos acceso exclusivo a contenido académico de entrenamiento de la más alta calidad. Aprenderás de especialistas en <b>powerlifting</b>, <b>entrenamiento de la fuerza</b>, y todas las aristas que lo rodean como pueden ser la <b>nutrición</b>, la <b>fisioterapia</b>, la <b>psicología</b>, la <b>preparación física deportiva</b>, entre otras más. Ofrecemos una amplia variedad de clases basadas en la <b>evidencia científica</b> y en la <b>experiencia de campo</b>. A su vez, te brindaremos el conocimiento y las herramientas necesarias para que puedas aplicarlos dentro de una <b>programación del entrenamiento</b>.

<h3 className='d-block mt-4 mb-3 fs-5'>¿Como es nuestra modalidad de trabajo?</h3>En <b>Strength Vault</b>, encontrarás contenido exclusivo y de la información más actualizada, clases disertadas por profesionales de diferentes áreas ya mencionadas, formando parte de una comunidad académica junto con su respectivo canal de preguntas y respuestas.

<p>Dichas clases se encontrarán divididas por un calendario mensual, conformando un total de al menos 4 videoclases de duración extensiva (1 de cada entrenador + 1 clase especial) por mes sumado al contenido gratuito.</p>

            </p>

            <b className='text-center mt-3'>¿Qué estás esperando para ser parte de esta comunidad?</b>
          </div>

          {largo > 992 &&
          <div className="col-10 col-lg-4 text-center fade-in" >
            <div className='altoImg m-auto text-center'>
              <img src={a} className='img-fluid m-auto ' alt="" />
            </div>
          </div>}
      </section>




      <section className='row justify-content-center text-center ColorBackground-2 '>
        {largo > 992 ? 
        
        <>

        <div className='col-4'>
          <h2>Lautaro Antonuttcio</h2>
          <img src={Lautaro} className=" img-fluid imgCarrousel text-center m-auto" alt={`Lautaro Antonuttcio`} />
          <p className='mx-5 mt-4'>Soy Lautaro Antonuccio, uno de los creadores de Strength Vault y co-fundador de Strength Is Science. Actualmente soy estudiante de la Licenciatura de Kinesiología y Fisiatria, cuento con +5 años de experiencia como levantador de pesas. Me desarrollo dentro del coaching online con fines de mejora de rendimiento como en readaptación de lesiones.</p>
        </div>
        
        <div className='col-4'>
           <h2>Martin Casanova</h2>
          <img src={Martin} className=" img-fluid imgCarrousel text-center m-auto" alt={`Martin Casanova`} />
          <p className='mx-5 mt-4'>Mi nombre es Martin Casanova, soy uno de los creadores de Strength Vault, co-fundador y entrenador de Strength is Science y actualmente estudiante de la Licenciatura en Nutricion, me especializo en el entrenamiento de Powerlifting, fuerza y acondicionamiento físico.</p>
        </div>

        <div className='col-4'>
           <h2>Nicolas Nieto</h2>
          <img src={Nicolas} className=" img-fluid imgCarrousel text-center m-auto" alt={`Nicolas Nieto`} />
          <p className='mx-5 mt-4'>Mi nombre es Nicolas Nieto, soy uno de los creadores de Strength Vault, co-fundador y entrenador de Silverbackgym y actualmente estudiante de la Licenciatura en kinesiología y fisioterapia, me especializo en el entrenamiento de Powerlifting, fuerza e hipertrofia muscular.</p>
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
                  <h5 className="card-title open-sans-titles mt-5">{card.text}</h5>
                  <p className="card-text mt-3 mx-3">{card.description}</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        }
      
    </section>



          <div className="row justify-content-center ColorBackground pb-5 pt-3 text-shadow">
            <div className="col-10 col-lg-4 ">
              <div className="card ColorBackground text-light shadow-drop-2-center border-0 py-2 ">
                <div className=" border-0 p-2">
                  <h3 className="my-0 open-sans-titles text-center ">PLAN STRENGTH VAULT</h3>
                </div>
                <div className="row justify-content-center">
                  <p className="card-title open-sans-titles fs-5 mt-4  text-center">$12000 <span className="">/ mes</span></p>
                  <p className="card-title open-sans-titles fs-5 mt-4  text-center">$30000 <span className="">/ 3 meses</span></p>
                  <p className="card-title open-sans-titles fs-5 mt-4  text-center">$96000 <span className="">/ 12 meses</span></p>
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
