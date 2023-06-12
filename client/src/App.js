import {useEffect} from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './scenes/home/Home';
import Navbar from './scenes/global/Navbar';
import CartMenu from './scenes/global/CartMenu';
import Footer from './scenes/global/Footer';
import Table from './scenes/overview/Table';

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
          <Route path="/overview" element={<Table />} />
        </Routes>
        <CartMenu/>
        {/* <Footer /> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
