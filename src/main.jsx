import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import { PrimeReactProvider } from 'primereact/api';

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


//Bootstrapstyles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// propy styles
import '../src/assets/styles.css';   

// Prime react styles

import "primereact/resources/themes/lara-light-indigo/theme.css";     
import "primereact/resources/primereact.min.css";
import 'primeflex/primeflex.css';




ReactDOM.createRoot(document.getElementById('root')).render(
  <PrimeReactProvider>
    <BrowserRouter>
        <App />
    </BrowserRouter>
  </PrimeReactProvider>,
)
