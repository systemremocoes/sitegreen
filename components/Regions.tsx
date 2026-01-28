
import React from 'react';
import { MapPin } from 'lucide-react';

const Regions: React.FC = () => {
  const regions = [
    "Limeira (Sede)", "Cordeirópolis", "Iracemápolis", "Americana", "Santa Bárbara d'Oeste", 
    "Piracicaba", "Araras", "Rio Claro", "Sumaré", "Campinas e Região", "Grande São Paulo", "Litoral Paulista"
  ];

  return (
    <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="mb-16">
        <div className="inline-flex items-center space-x-2 text-emerald-600 font-bold uppercase tracking-widest text-xs mb-4">
          <span className="w-8 h-px bg-emerald-600"></span>
          <span>Cobertura Regional</span>
        </div>
        <h3 className="text-3xl md:text-5xl font-extrabold text-emerald-950 mb-6 leading-tight">
          Atendimento Ágil em <br className="hidden md:block" /> 
          <span className="text-emerald-600">Limeira, Grande SP e Litoral</span>
        </h3>
        <p className="text-emerald-800/70 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
          Logística avançada para garantir o menor tempo de resposta em todo o interior paulista, capital e região litorânea.
        </p>
      </div>

      <div className="relative">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {regions.map((region, i) => (
            <div 
              key={i} 
              className="bg-white p-6 rounded-2xl border border-emerald-100 flex flex-col items-center justify-center hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-900/5 transition-all cursor-default group transform hover:-translate-y-1"
            >
              <div className="mb-3 p-2 bg-emerald-50 rounded-full group-hover:bg-emerald-600 group-hover:text-white transition-all text-emerald-600/70">
                <MapPin size={20} />
              </div>
              <span className="font-bold text-emerald-900 group-hover:text-emerald-600 transition-colors">{region}</span>
            </div>
          ))}
        </div>
        
        {/* Call to action for other regions */}
        <div className="mt-12 p-8 md:p-12 bg-[#0a2619] rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-emerald-950/20 relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          
          <div className="text-left relative z-10">
            <p className="text-2xl md:text-3xl font-black mb-3 tracking-tight">Atendimento imediato ou programado?</p>
            <p className="text-emerald-100/60 font-medium max-w-xl">Consulte nossa central para remoções de longa distância, transferências intermunicipais e suporte para eventos em todo o estado.</p>
          </div>
          
          <a 
            href="tel:1937923947" 
            className="bg-emerald-500 text-white px-10 py-5 rounded-2xl font-black hover:bg-emerald-400 transition-all whitespace-nowrap shadow-xl shadow-emerald-500/20 transform hover:scale-105 active:scale-95 relative z-10"
          >
            Ligar para Central
          </a>
        </div>
      </div>
    </div>
  );
};

export default Regions;
