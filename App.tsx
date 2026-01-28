
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Schedule from './pages/Schedule';
import ServiceDetail from './pages/ServiceDetail';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

export type Page = 'home' | 'about' | 'service-detail' | 'schedule';

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Função para navegar e rolar para o topo
  const navigate = (page: Page, serviceId: string | null = null) => {
    setCurrentPage(page);
    setSelectedServiceId(serviceId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-white">
      <Navbar scrolled={scrolled} navigate={navigate} currentPage={currentPage} />

      <main className="flex-grow">
        {currentPage === 'home' && <Home onNavigate={navigate} />}
        {currentPage === 'about' && <About />}
        {currentPage === 'schedule' && <Schedule />}
        {currentPage === 'service-detail' && selectedServiceId && (
          <ServiceDetail serviceId={selectedServiceId} onNavigate={navigate} />
        )}
      </main>

      <Footer navigate={navigate} />
      <WhatsAppButton />
    </div>
  );
};

export default App;
