import React, { useEffect, useState } from 'react';
import * as UserServices from './../services/auth.services.js';

const Perfil = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Llamar al servicio para obtener datos del usuario
    UserServices.findUserById(localStorage.getItem('_id'))
      .then((data) => {
        setUserData(data);
        console.log(data);
      })
      .catch((err) => console.error(err));
  }, []);

  if (!userData) {
    // Mientras carga o si no hay datos, muestra un loader o mensaje
    return (
      <div className="text-center text-white mt-5">
        <p>Cargando tu perfil...</p>
      </div>
    );
  }

  return (
    <main className="container-fluid text-white" >
      <section className="row justify-content-center align-items-center py-5 ColorBackground pb-5 text-shadow">
        <div className="col-10 col-md-6">
          {/* CARD principal */}
          <div className="card ColorBackground border-0 shadow-sm text-light">
            <div className="card-body">
              <h2 className="text-center mb-4">Bienvenido a tu perfil {userData.username}!</h2>
              
              {/* Datos principales */}
              <div className="mb-3 text-center">
                <p className=" mb-1" style={{ fontSize: '0.9rem' }}>
                  {userData.email}
                </p>
              </div>

              <hr />

              {/* Sección de detalles */}
              <div className="mb-3">
                {/* Acceso total */}
                <p>
                  <strong>Acceso Total:</strong>{' '}
                  {userData.allowAllAccess ? 'Sí' : 'No'}
                </p>

                {/* Categoría */}
                <p>
                  <strong>Categoría:</strong> {userData.category || 'Gratuito'}
                </p>

                {/* Días restantes */}
                {userData.category === 'Gratuito' ? (
                  <p>
                    <strong>Días Restantes:</strong> Infinito
                  </p>
                ) : (
                  <p>
                    <strong>Días Restantes:</strong> {userData.daysLeft || 0}
                  </p>
                )}
              </div>

              <hr />

              {/* Historial de pagos */}
              <div className="mt-3">
                <h5 className="mb-3">Historial de Pagos</h5>
                {userData.paymentHistory && userData.paymentHistory.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-sm table-bordered table-dark table-striped">
                      <thead>
                        <tr>
                          <th>Fecha de Pago</th>
                          <th>Meses</th>
                          <th>Categoría</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userData.paymentHistory.map((payment, idx) => (
                          <tr key={idx}>
                            <td>
                              {new Date(payment.paymentDate).toLocaleDateString('es-ES')}
                            </td>
                            <td>{payment.months}</td>
                            <td>{payment.category}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="">No hay pagos registrados</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Perfil;
