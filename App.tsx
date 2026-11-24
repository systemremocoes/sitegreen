import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Schedule from './pages/Schedule';
import ServiceDetail from './pages/ServiceDetail';
import Ambulances from './pages/Ambulances';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Plans from './pages/Plans';
import ClientPortal from './pages/ClientPortal';
import ClientArea from './pages/ClientArea';
import AccreditedArea from './pages/AccreditedArea';
import ClientAccount from './pages/ClientAccount';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ScheduleModal from './components/ScheduleModal';
import EventQuoteModal from './components/EventQuoteModal';

export type Page =
  | 'home'
  | 'about'
  | 'service-detail'
  | 'ambulances'
  | 'schedule'
  | 'plans'
  | 'client-portal'
  | 'client-area'
  | 'accredited-area'
  | 'client-account'
  | 'privacy'
  | 'terms';

function getInitialRoute(): { page: Page; serviceId: string | null } {
  const params = new URLSearchParams(window.location.search);
  const pageParam = params.get('page') as Page | null;
  const serviceParam = params.get('service');

  const validPages: Page[] = [
    'home',
    'about',
    'service-detail',
    'ambulances',
    'schedule',
    'plans',
    'client-portal',
    'client-area',
    'accredited-area',
    'client-account',
    'privacy',
    'terms'
  ];

  if (pageParam && validPages.includes(pageParam)) {
    return { page: pageParam, serviceId: serviceParam };
  }
  return { page: 'home', serviceId: null };
}

const App: React.FC = () => {
  const initial = getInitialRoute();
  const [scrolled, setScrolled] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>(initial.page);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(initial.serviceId);
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);
  const [selectedVerifier, setSelectedVerifier] = useState<string | null>(null);
  const [isQuickModalOpen, setIsQuickModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const route = getInitialRoute();
      setCurrentPage(route.page);
      setSelectedServiceId(route.serviceId);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (page: Page, serviceId: string | null = null) => {
    setCurrentPage(page);
    setSelectedServiceId(serviceId);
    if (page !== 'client-area') {
      setSelectedProtocol(null);
      setSelectedVerifier(null);
    }

    const url = new URL(window.location.href);
    if (page === 'home') {
      url.searchParams.delete('page');
      url.searchParams.delete('service');
    } else {
      url.searchParams.set('page', page);
      if (serviceId) {
        url.searchParams.set('service', serviceId);
      } else {
        url.searchParams.delete('service');
      }
    }
    window.history.pushState({}, '', url.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRemovalLookup = (protocol: string, verifier: string) => {
    setSelectedProtocol(protocol);
    setSelectedVerifier(verifier);
    navigate('client-area');
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-white">
      <Navbar
        scrolled={scrolled}
        navigate={navigate}
        currentPage={currentPage}
        onOpenQuickModal={() => setIsQuickModalOpen(true)}
        onOpenEventModal={() => setIsEventModalOpen(true)}
      />

      <main className="flex-grow">
        {currentPage === 'home' && (
          <Home onNavigate={navigate} onOpenRequestModal={() => setIsQuickModalOpen(true)} />
        )}
        {currentPage === 'about' && <About />}
        {currentPage === 'schedule' && <Schedule />}
        {currentPage === 'ambulances' && (
          <Ambulances onNavigate={navigate} onOpenRequestModal={() => setIsQuickModalOpen(true)} />
        )}
        {currentPage === 'plans' && <Plans onNavigate={navigate} />}
        {currentPage === 'client-portal' && (
          <ClientPortal
            onNavigate={navigate}
            onSelectRemovalLookup={handleSelectRemovalLookup}
            onOpenRequestModal={() => setIsQuickModalOpen(true)}
          />
        )}
        {currentPage === 'client-area' && (
          <ClientArea
            onNavigate={navigate}
            initialProtocol={selectedProtocol}
            initialVerifier={selectedVerifier}
            onOpenRequestModal={() => setIsQuickModalOpen(true)}
          />
        )}
        {currentPage === 'accredited-area' && <AccreditedArea onNavigate={navigate} />}
        {currentPage === 'client-account' && <ClientAccount onNavigate={navigate} />}
        {currentPage === 'privacy' && <Privacy onNavigate={navigate} />}
        {currentPage === 'terms' && <Terms onNavigate={navigate} />}
        {currentPage === 'service-detail' && selectedServiceId && (
          <ServiceDetail
            serviceId={selectedServiceId}
            onNavigate={navigate}
            onOpenRequestModal={() => setIsQuickModalOpen(true)}
            onOpenEventModal={() => setIsEventModalOpen(true)}
          />
        )}
      </main>

      <Footer navigate={navigate} />
      <WhatsAppButton />
      <ScheduleModal isOpen={isQuickModalOpen} onClose={() => setIsQuickModalOpen(false)} />
      <EventQuoteModal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} />
    </div>
  );
};

export default App;
