
import React from 'react';
import { Phone, MessageCircle, Activity, CalendarClock } from 'lucide-react';
import { Page } from '../App';

interface HeroProps {
  onNavigate?: (page: Page, serviceId?: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <div className="relative min-h-screen flex items-center overflow-hidden bg-[#0a2619]">
      {/* Elementos Decorativos de Ondas (Top Left - Estilo da Marca) */}
      <div className="absolute top-0 left-0 w-96 h-96 opacity-10 pointer-events-none transform -translate-x-1/4 -translate-y-1/4">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path fill="none" stroke="#10b981" strokeWidth="2" d="M0,100 C20,80 40,120 60,100 S100,80 120,100 S160,120 200,100" />
          <path fill="none" stroke="#10b981" strokeWidth="2" d="M0,110 C20,90 40,130 60,110 S100,90 120,110 S160,130 200,110" />
          <path fill="none" stroke="#10b981" strokeWidth="2" d="M0,120 C20,100 40,140 60,120 S100,100 120,120 S160,140 200,120" />
        </svg>
      </div>

      {/* Fundo Curvado Branco */}
      <div className="absolute inset-0 z-0">
        <svg
          className="absolute left-0 top-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,0 L100,0 C95,30 60,80 20,100 L0,100 Z"
            fill="white"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto lg:ml-16 lg:mr-auto px-4 sm:px-6 lg:px-8 py-24 pt-32 lg:py-48 flex flex-col lg:flex-row items-center gap-12">
        <div className="w-full lg:w-1/2">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 px-4 py-1.5 rounded-full mb-8">
            <Activity size={16} className="text-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-widest">Excelência em Remoções e Emergências</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-[900] leading-[0.95] mb-8 tracking-[-0.05em] text-[#0a2619]">
            Sua Vida em
            <br />
            <span className="text-emerald-500 inline-block mt-4">
              Primeiro Lugar.
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-[#0a2619] mb-12 leading-relaxed font-medium max-w-xl opacity-80">
            Segurança, conforto e agilidade no transporte de pacientes.
            Frota moderna de UTI e Suporte Básico com equipe especializada para atender Limeira e região com excelência.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 mb-20 whitespace-nowrap">
            <a
              href="tel:1937923947"
              className="flex items-center justify-center space-x-3 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-5 rounded-2xl text-lg font-extrabold transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-900/40 group"
            >
              <Phone size={24} className="group-hover:animate-bounce flex-shrink-0" />
              <span>(19) 3792-3947</span>
            </a>

            {onNavigate && (
              <button
                onClick={() => onNavigate('schedule')}
                className="flex items-center justify-center space-x-3 bg-white hover:bg-emerald-50 text-[#0a2619] px-8 py-5 rounded-2xl text-lg font-extrabold transition-all transform hover:scale-105 active:scale-95 shadow-xl border border-emerald-100"
              >
                <CalendarClock size={24} className="text-emerald-600 flex-shrink-0" />
                <span>Agendar Online</span>
              </button>
            )}
          </div>

          {/* Seção de Status com 4 colunas incluindo Suporte Básico */}
          <div className="grid grid-cols-2 gap-y-10 md:flex md:flex-row md:items-center md:gap-8 lg:gap-8">
            <div className="flex flex-col border-l-4 border-emerald-500 pl-4 whitespace-nowrap">
              <span className="text-3xl md:text-4xl font-black text-[#0a2619] tracking-tight">24h</span>
              <span className="text-xs md:text-sm uppercase font-bold text-emerald-600 tracking-wider">Atendimento Imediato</span>
            </div>
            <div className="flex flex-col border-l-4 border-emerald-500 pl-4 whitespace-nowrap">
              <span className="text-3xl md:text-4xl font-black text-[#0a2619] tracking-tight">UTI</span>
              <span className="text-xs md:text-sm uppercase font-bold text-emerald-600 tracking-wider">Suporte Avançado</span>
            </div>
            <div className="flex flex-col border-l-4 border-emerald-500 pl-4 whitespace-nowrap">
              <span className="text-3xl md:text-4xl font-black text-[#0a2619] tracking-tight">BÁSICA</span>
              <span className="text-xs md:text-sm uppercase font-bold text-emerald-500 tracking-wider">Remoção Segura</span>
            </div>
            <div className="flex flex-col border-l-4 border-emerald-500 pl-4 whitespace-nowrap">
              <span className="text-3xl md:text-4xl font-black text-white tracking-tight">BASE</span>
              <span className="text-xs md:text-sm uppercase font-bold text-emerald-200 tracking-wider">Própria em Limeira</span>
            </div>
          </div>
        </div>

        {/* Elemento Visual para preencher o espaço à direita */}
        <div className="hidden lg:flex w-1/2 justify-center items-center relative">
          <div className="relative">
            {/* Card Flutuante de Tempo de Resposta */}
            <div className="absolute -top-12 -left-12 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-emerald-100 z-20 transition-transform hover:scale-110 duration-500">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-500 p-3 rounded-2xl text-white">
                  <Activity size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-600 uppercase">Tempo de Resposta</p>
                  <p className="text-xl font-black text-[#0a2619]">Agilidade Máxima</p>
                </div>
              </div>
            </div>

            {/* Imagem Principal da Ambulância em Movimento */}
            <div className="relative z-10 w-full max-w-md">
              <img
                src="/ambulance-sp.png"
                alt="Ambulância Brasileira Green Emergências em São Paulo"
                className="w-full h-auto rounded-[3rem] shadow-2xl rotate-3 hover:rotate-0 transition-all duration-700 border-8 border-white object-cover aspect-[4/3]"
              />
              {/* Overlay suave para melhorar o contraste com os cards */}
              <div className="absolute inset-0 bg-emerald-950/10 rounded-[3rem] pointer-events-none"></div>
            </div>

            {/* Card de Disponibilidade */}
            <div className="absolute -bottom-10 -right-10 bg-[#0a2619] text-white p-8 rounded-3xl shadow-2xl z-20 border border-emerald-500/30">
              <div className="flex flex-col items-center">
                <p className="text-4xl font-black text-emerald-500">24/7</p>
                <p className="text-[10px] font-bold opacity-70 uppercase tracking-[0.2em] text-center">Atendimento<br />Ininterrupto</p>
              </div>
            </div>

            {/* Elemento Decorativo de Círculos */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-500/5 blur-[100px] -z-10 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Transição Suave em Onda para a próxima seção */}
      <div className="absolute bottom-0 left-0 w-full leading-none z-10">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-20">
          <path d="M0,0 C300,100 900,100 1200,0 V120 H0 Z" fill="#ecfdf5"></path>
        </svg>
      </div>
    </div>
  );
};

export default Hero;
