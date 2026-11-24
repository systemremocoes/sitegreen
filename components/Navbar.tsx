import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Menu, X, Activity, ChevronDown, CalendarPlus, Sparkles, UserCheck } from 'lucide-react';
import { Page } from '../App';

interface NavbarProps {
  scrolled: boolean;
  navigate: (page: Page, serviceId?: string) => void;
  currentPage: Page;
  onOpenQuickModal?: () => void;
}

const WHATSAPP_URL =
  'https://wa.me/5519998049901?text=Ol%C3%A1!%20Encontrei%20a%20Green%20no%20Google%20e%20gostaria%20de%20um%20or%C3%A7amento%20de%20ambul%C3%A2ncia.';

const Navbar: React.FC<NavbarProps> = ({ scrolled, navigate, onOpenQuickModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'services' | 'request' | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const servicesList: Array<{ name: string; page: Page; id?: string; desc: string }> = [
    { name: 'Ambulâncias', page: 'ambulances', desc: 'Tipos de ambulâncias e remoções' },
    { name: 'Área Protegida', page: 'service-detail', id: 'area-protegida', desc: 'Para empresas e condomínios' },
    { name: 'Cobertura de Eventos', page: 'service-detail', id: 'eventos', desc: 'Posto médico e ambulâncias' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLinkClick = (page: Page, serviceId?: string) => {
    navigate(page, serviceId);
    setIsOpen(false);
    setOpenDropdown(null);
  };

  return (
    <nav
      ref={navRef}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-white/85 backdrop-blur-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button onClick={() => handleLinkClick('home')} className="flex items-center space-x-2.5 group">
              <img
                src="/logo-green.svg"
                alt="Logo Green Emergências Médicas"
                className="w-10 h-10 rounded-full shrink-0 shadow-sm group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col text-left leading-none">
                <span className="text-lg font-extrabold italic tracking-tight text-[#0a2619]">
                  Green
                </span>
                <span className="text-[11px] font-semibold italic text-emerald-700 tracking-tight">
                  Emergências Médicas
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            <button
              onClick={() => handleLinkClick('home')}
              className="text-sm font-bold transition-colors hover:text-emerald-600 text-emerald-950"
            >
              Início
            </button>

            {/* Dropdown: Serviços */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('services')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                onClick={() => setOpenDropdown(openDropdown === 'services' ? null : 'services')}
                className="flex items-center space-x-1 text-sm font-bold transition-colors hover:text-emerald-600 text-emerald-950 py-2"
              >
                <span>Serviços</span>
                <ChevronDown size={15} className={`transition-transform duration-200 ${openDropdown === 'services' ? 'rotate-180' : ''}`} />
              </button>

              <div
                className={`absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 transition-all duration-200 origin-top-left ${
                  openDropdown === 'services' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                {servicesList.map((service) => (
                  <button
                    key={service.name}
                    onClick={() => handleLinkClick(service.page, service.id)}
                    className="w-full text-left px-5 py-3 hover:bg-emerald-50 transition-colors block"
                  >
                    <p className="text-sm font-bold text-[#0a2619]">{service.name}</p>
                    <p className="text-xs text-slate-500">{service.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Dropdown: Solicitar Remoção */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('request')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                onClick={() => setOpenDropdown(openDropdown === 'request' ? null : 'request')}
                className="flex items-center space-x-1 text-sm font-bold transition-colors hover:text-emerald-600 text-emerald-950 py-2"
              >
                <span>Solicitar Remoção</span>
                <ChevronDown size={15} className={`transition-transform duration-200 ${openDropdown === 'request' ? 'rotate-180' : ''}`} />
              </button>

              <div
                className={`absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 transition-all duration-200 origin-top-left ${
                  openDropdown === 'request' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                <button
                  onClick={() => {
                    setOpenDropdown(null);
                    onOpenQuickModal?.();
                  }}
                  className="w-full text-left px-5 py-3 hover:bg-emerald-50 transition-colors flex items-start gap-3"
                >
                  <CalendarPlus size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-[#0a2619]">Solicitar Remoção</p>
                    <p className="text-xs text-slate-500">Agendamento e orçamento</p>
                  </div>
                </button>

                <button
                  onClick={() => handleLinkClick('plans')}
                  className="w-full text-left px-5 py-3 hover:bg-emerald-50 transition-colors flex items-start gap-3 border-t border-slate-100"
                >
                  <Sparkles size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-[#0a2619]">Assinar Plano Mensal</p>
                    <p className="text-xs text-slate-500">Cobertura contínua 24h</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Área do Cliente (botão direto que abre os 2 cards de login) */}
            <button
              onClick={() => handleLinkClick('client-portal')}
              className="flex items-center space-x-1.5 text-sm font-bold transition-colors hover:text-emerald-600 text-emerald-950"
            >
              <UserCheck size={16} className="text-emerald-600" />
              <span>Área do Cliente</span>
            </button>

            <button
              onClick={() => handleLinkClick('about')}
              className="text-sm font-bold transition-colors hover:text-emerald-600 text-emerald-950"
            >
              Sobre Nós
            </button>

            {/* Cabeçalho: somente número do WhatsApp */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-emerald-600/20"
            >
              <MessageCircle size={17} />
              <span>(19) 99804-9901</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#0a2619] p-2" aria-label="Menu">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 absolute w-full left-0 shadow-2xl max-h-[85vh] overflow-y-auto">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <button onClick={() => handleLinkClick('home')} className="block w-full text-left px-3 py-3 text-base font-bold text-[#0a2619]">
              Início
            </button>

            <div className="pl-3 py-2 space-y-2 border-t border-slate-100">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Serviços</p>
              {servicesList.map((service) => (
                <button
                  key={service.name}
                  onClick={() => handleLinkClick(service.page, service.id)}
                  className="block w-full text-left text-[#0a2619] font-semibold text-sm py-1"
                >
                  {service.name}
                </button>
              ))}
            </div>

            <div className="pl-3 py-2 space-y-2 border-t border-slate-100">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Solicitar Remoção</p>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenQuickModal?.();
                }}
                className="block w-full text-left text-[#0a2619] font-semibold text-sm py-1"
              >
                Solicitar Remoção
              </button>
              <button onClick={() => handleLinkClick('plans')} className="block w-full text-left text-[#0a2619] font-semibold text-sm py-1">
                Assinar Plano Mensal
              </button>
            </div>

            <button
              onClick={() => handleLinkClick('client-portal')}
              className="block w-full text-left px-3 py-3 text-base font-bold text-emerald-700 border-t border-slate-100"
            >
              Área do Cliente
            </button>

            <button onClick={() => handleLinkClick('about')} className="block w-full text-left px-3 py-3 text-base font-bold text-[#0a2619] border-t border-slate-100">
              Sobre Nós
            </button>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 bg-emerald-600 text-white px-3 py-3.5 rounded-xl font-bold text-sm mt-4 shadow-md"
            >
              <MessageCircle size={18} />
              <span>WhatsApp: (19) 99804-9901</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
