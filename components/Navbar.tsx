
import React, { useState, useRef, useEffect } from 'react';
import { Phone, Menu, X, Activity, ChevronDown } from 'lucide-react';
import { Page } from '../App';

interface NavbarProps {
  scrolled: boolean;
  navigate: (page: Page, serviceId?: string) => void;
  currentPage: Page;
}

const Navbar: React.FC<NavbarProps> = ({ scrolled, navigate, currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const servicesList = [
    { name: 'Ambulância UTI', id: 'uti' },
    { name: 'Remoções Médicas', id: 'remocoes' },
    { name: 'Área Protegida', id: 'area-protegida' },
    { name: 'Cobertura de Eventos', id: 'eventos' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLinkClick = (page: Page, serviceId?: string) => {
    navigate(page, serviceId);
    setIsOpen(false);
    setIsServicesOpen(false);
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button onClick={() => handleLinkClick('home')} className="flex items-center space-x-2 group">
              <div className="relative w-10 h-10 bg-[#0a2619] rounded-lg flex items-center justify-center text-white group-hover:bg-emerald-800 transition-all transform group-hover:scale-110">
                <Activity size={24} className="animate-pulse text-emerald-400" />
              </div>
              <span className={`text-2xl font-black tracking-tighter text-[#0a2619]`}>
                GREEN<span className="text-emerald-500">EMERGÊNCIAS</span>
              </span>
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleLinkClick('home')}
              className={`text-base font-black transition-colors hover:text-emerald-500 text-emerald-950`}
            >
              Início
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onMouseEnter={() => setIsServicesOpen(true)}
                className={`flex items-center space-x-1 text-base font-black transition-colors hover:text-emerald-500 text-emerald-950`}
              >
                <span>Serviços</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} />
              </button>

              <div
                onMouseLeave={() => setIsServicesOpen(false)}
                className={`absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-emerald-50 py-3 transition-all duration-200 origin-top-left ${isServicesOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                  }`}
              >
                {servicesList.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleLinkClick('service-detail', service.id)}
                    className="w-full text-left px-6 py-3 text-sm font-bold text-emerald-950 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                  >
                    {service.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleLinkClick('about')}
              className={`text-base font-black transition-colors hover:text-emerald-500 text-emerald-950`}
            >
              Sobre Nós
            </button>

            <button
              onClick={() => handleLinkClick('schedule')}
              className={`text-base font-black transition-colors hover:text-emerald-500 text-emerald-950 mr-4`}
            >
              Agendar Online
            </button>

            <a
              href="tel:1937923947"
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-2xl text-sm font-extrabold transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-emerald-600/30"
            >
              <Phone size={16} />
              <span>(19) 3792-3947</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#0a2619] p-2"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-emerald-100 absolute w-full left-0 shadow-2xl">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <button onClick={() => handleLinkClick('home')} className="block w-full text-left px-3 py-4 text-base font-black text-emerald-950">Início</button>
            <div className="pl-3 py-2 space-y-3">
              <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">Nossos Serviços</p>
              {servicesList.map((service) => (
                <button key={service.id} onClick={() => handleLinkClick('service-detail', service.id)} className="block w-full text-left text-emerald-900 font-bold">{service.name}</button>
              ))}
            </div>
            <button onClick={() => handleLinkClick('about')} className="block w-full text-left px-3 py-4 text-base font-black text-emerald-950">Sobre Nós</button>
            <button onClick={() => handleLinkClick('schedule')} className="block w-full text-left px-3 py-4 text-base font-black text-emerald-950">Agendar Online</button>
            <a href="tel:1937923947" className="flex items-center justify-center space-x-2 bg-emerald-600 text-white px-3 py-4 rounded-xl font-extrabold mt-4 shadow-lg">
              <Phone size={18} />
              <span>(19) 3792-3947</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
