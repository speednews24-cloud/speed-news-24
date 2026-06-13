import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import NewsletterPopup from '../components/NewsletterPopup.jsx';

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <NewsletterPopup />
      <Footer />
    </>
  );
}
