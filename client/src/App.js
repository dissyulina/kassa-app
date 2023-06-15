import {useEffect} from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './scenes/home/Home';
import Navbar from './scenes/global/Navbar';
import CartMenu from './scenes/global/CartMenu';
import Footer from './scenes/global/Footer';
import OrderOverview from './scenes/overview/AllOrders';
import Admin from './scenes/admin/Admin';
import Retur from './scenes/retur/Retur';
import SalesOverview from './scenes/overview/SalesOverview';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0,0);
  }, [pathname])
}

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Navbar/>
        <ScrollToTop/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/allorders" element={<OrderOverview />} />
          <Route path="/retur" element={<Retur />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/overview" element={<SalesOverview />} />
        </Routes>
        <CartMenu/>
        {/* <Footer /> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
