
import React from 'react';
import { Facebook, Instagram, Activity, Heart, MapPin, Phone, Mail } from 'lucide-react';
import { Page } from '../App';

interface FooterProps {
  navigate: (page: Page, serviceId?: string) => void;
}

const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="bg-[#0a2619] pt-20 pb-10 text-emerald-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <button onClick={() => navigate('home')} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                <Activity size={18} />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                GREEN<span className="text-emerald-500">EMERGÊNCIAS</span>
              </span>
            </button>
            <p className="leading-relaxed font-light text-sm">
              Líder regional em atendimento pré-hospitalar e transporte médico em Limeira e interior paulista. Sua segurança é nossa missão.
            </p>
            <div className="flex space-x-4">
              <a href="#" target="_blank" className="p-2 bg-emerald-900/50 rounded-lg hover:bg-emerald-600 hover:text-white transition-all"><Instagram size={20} /></a>
              <a href="#" className="p-2 bg-emerald-900/50 rounded-lg hover:bg-emerald-600 hover:text-white transition-all"><Facebook size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Navegação</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><button onClick={() => navigate('home')} className="hover:text-emerald-400 transition-colors">Início</button></li>
              <li><button onClick={() => navigate('about')} className="hover:text-emerald-400 transition-colors">Quem Somos</button></li>
              <li><button onClick={() => navigate('service-detail', 'uti')} className="hover:text-emerald-400 transition-colors">Ambulância UTI</button></li>
              <li><button onClick={() => navigate('service-detail', 'eventos')} className="hover:text-emerald-400 transition-colors">Cobertura de Eventos</button></li>
              <li><button onClick={() => navigate('service-detail', 'area-protegida')} className="hover:text-emerald-400 transition-colors">Área Protegida</button></li>
            </ul>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Onde Estamos</h4>
            <div className="space-y-4 text-sm font-medium">
              <div className="flex items-start space-x-2">
                <MapPin size={16} className="text-emerald-500 shrink-0 mt-1" />
                <p>R. José da Silva Gonçalo, 28<br/>Jardim Boa Esperança, Limeira - SP</p>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Central 24h</h4>
            <div className="space-y-4 text-sm font-medium">
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-emerald-500" />
                <p>(19) 3792-3947</p>
              </div>
              <div className="flex items-center space-x-2">
                <Activity size={16} className="text-emerald-500" />
                <p>WhatsApp: (19) 98278-0943</p>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-emerald-500" />
                <p>atendimento@greenemergencias.com.br</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-emerald-900 flex flex-col md:flex-row justify-between items-center text-xs font-light">
          <p>© 2024 Green Emergências Médicas. Todos os direitos reservados.</p>
          <div className="mt-4 md:mt-0 flex items-center">
            Feito com <Heart size={12} className="mx-1 text-emerald-500 fill-emerald-500" /> preservando a vida.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
