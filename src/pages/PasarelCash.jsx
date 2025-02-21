import React, { useState } from 'react';
import * as UserServices from '../services/auth.services.js';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Book, Feed } from '@mui/icons-material';

// Importamos componentes de Material UI para los botones flotantes y diálogos
import { Fab, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { useNavigate } from 'react-router-dom';

const PasarelCash = () => {
  const navigate = useNavigate();

  // Estado para el diálogo de promoción
  const [openPromoDialog, setOpenPromoDialog] = useState(false);
  const handleOpenPromoDialog = () => setOpenPromoDialog(true);
  const handleClosePromoDialog = () => setOpenPromoDialog(false);

  // Estado para el diálogo de WhatsApp
  const [openWhatsAppDialog, setOpenWhatsAppDialog] = useState(false);
  const handleOpenWhatsAppDialog = () => setOpenWhatsAppDialog(true);
  const handleCloseWhatsAppDialog = () => setOpenWhatsAppDialog(false);

  // Estado para el diálogo de compra (se abre si hay sesión iniciada y se presiona el botón)
  const [openPurchaseDialog, setOpenPurchaseDialog] = useState(false);
  const handleOpenPurchaseDialog = () => setOpenPurchaseDialog(true);
  const handleClosePurchaseDialog = () => setOpenPurchaseDialog(false);

  // Verificar si hay un usuario con sesión iniciada
  const isLoggedIn = Boolean(localStorage.getItem('_id'));

  // Función para manejar la acción del botón (comprar o registrarse)
  const handlePlanAction = () => {
    if (isLoggedIn) {
      // Abrir diálogo de compra
      handleOpenPurchaseDialog();
    } else {
      // Redirigir a la página de registro
      navigate('/register');
    }
  };

  return (
    <main className="container-fluid text-white">
      {/* Contenedor de las tarjetas con display flex para que tengan la misma altura */}
      <div className="row justify-content-center ColorBackground pb-5 text-shadow d-flex align-items-stretch">
        <div className="col-10 col-lg-4 mb-3">
          <div className="card ColorBackground text-light shadow-drop-2-center border-0 py-2 h-100">
            <div className="border-0 p-2">
              <h3 className="my-0 open-sans-titles text-center">PLAN GRATUITO</h3>
            </div>
            <div className="row justify-content-center">
              <p className="card-title open-sans-titles fs-5 mt-4 text-center">$0 <span>/ mes</span></p>
              <div className="col-8 text-center">
                <p>Con solo registrarte en nuestra web, tendrás:</p>
                <ul className="list-group list-group-flush text-center">
                  <li className="list-group-item align-items-center bg-transparent text-light">
                    <OndemandVideoIcon /> + 1 Video mensual
                  </li>
                  <li className="list-group-item align-items-center bg-transparent text-light">
                    <OndemandVideoIcon /> Contacto directo con nosotros
                  </li>
                </ul>
                <button 
                  type="button" 
                  onClick={handlePlanAction}
                  className="btn colorButtons border open-sans-titles text-center my-4"
                >
                  {isLoggedIn ? 'COMPRAR' : 'REGISTRARSE'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-10 col-lg-4 mb-3">
          <div className="card ColorBackground text-light shadow-drop-2-center border-0 py-2 h-100">
            <div className="border-0 p-2">
              <h3 className="my-0 open-sans-titles text-center">PLAN STRENGTHVAULT</h3>
            </div>
            <div className="row justify-content-center">
              <p className="card-title open-sans-titles fs-5 mt-4 text-center">$20000 <span>/ mes</span></p>
              <div className="col-10 text-center">
                <ul className="list-group list-group-flush text-center">
                  <li className="list-group-item align-items-center bg-transparent text-light">
                    <OndemandVideoIcon /> + 4 Videos mensuales
                  </li>
                  <li className="list-group-item bg-transparent text-light">
                    <FileDownloadIcon /> Acceso a la comunidad de WhatsApp
                  </li>
                  <li className="list-group-item bg-transparent text-light">
                    <WhatsAppIcon /> Contacto diario con nosotros
                  </li>
                </ul>
                <button 
                  type="button" 
                  onClick={handlePlanAction}
                  className="btn colorButtons border open-sans-titles text-center my-4"
                >
                  {isLoggedIn ? 'COMPRAR' : 'REGISTRARSE'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botón flotante para la promoción (derecha) */}
      <Fab
        color="secondary"
        aria-label="promo"
        onClick={handleOpenPromoDialog}
        style={{ position: 'fixed', bottom: 20, left: 20, zIndex: 1000 }}
      >
        <CardGiftcardIcon />
      </Fab>

      {/* Diálogo de promoción */}
      <Dialog open={openPromoDialog} onClose={handleClosePromoDialog}>
        <DialogTitle>Promoción de lanzamiento</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Promoción de lanzamiento: primer mes. 10% de descuento.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePromoDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de soporte WhatsApp */}
      <Dialog open={openWhatsAppDialog} onClose={handleCloseWhatsAppDialog}>
        <DialogTitle>Soporte WhatsApp</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Necesitas ayuda? Contáctanos a través de WhatsApp.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWhatsAppDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de compra (se abre solo si hay sesión iniciada y se presiona el botón) */}
      <Dialog open={openPurchaseDialog} onClose={handleClosePurchaseDialog}>
        <DialogTitle>Comprar</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Comprar
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePurchaseDialog} color="primary" startIcon={<WhatsAppIcon />}>
            WhatsApp
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
};

export default PasarelCash;
