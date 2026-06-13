import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { LanguageProvider } from './contexts/LanguageContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import Home from './pages/Home.jsx';
import ArticlePage from './pages/ArticlePage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminArticles from './pages/admin/AdminArticles.jsx';
import AdminCategories from './pages/admin/AdminCategories.jsx';
import AdminAds from './pages/admin/AdminAds.jsx';
import StaticPage from './pages/StaticPage.jsx';
import AdSenseScript from './components/AdSenseScript.jsx';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <AdSenseScript />
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/category/:slug" element={<SearchPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/article/:slug" element={<ArticlePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<StaticPage type="about" />} />
                <Route path="/contact" element={<StaticPage type="contact" />} />
                <Route path="/privacy-policy" element={<StaticPage type="privacy-policy" />} />
                <Route path="/terms" element={<StaticPage type="terms" />} />
                <Route path="/disclaimer" element={<StaticPage type="disclaimer" />} />
              </Route>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="articles" element={<AdminArticles />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="ads" element={<AdminAds />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
