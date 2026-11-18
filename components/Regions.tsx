
import React from 'react';
import { MapPin } from 'lucide-react';

const Regions: React.FC = () => {
  const regions = [
    "Limeira (Sede)", "Cordeirópolis", "Iracemápolis", "Americana", "Santa Bárbara d'Oeste", 
    "Piracicaba", "Araras", "Rio Claro", "Sumaré", "Campinas e Região", "Grande São Paulo", "Litoral Paulista"
  ];

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="mb-10">
        <div className="inline-flex items-center space-x-2 text-emerald-700 font-bold uppercase tracking-wider text-xs mb-3">
          <span className="w-8 h-px bg-emerald-600"></span>
          <span>Cobertura Regional</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-extrabold text-emerald-950 mb-3 leading-tight">
          Atendimento Ágil em <span className="text-emerald-600">Limeira, Grande SP e Litoral</span>
        </h3>
        <p className="text-emerald-900/70 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Logística avançada para garantir o menor tempo de resposta em todo o interior paulista, capital e região litorânea.
        </p>
      </div>

      <div className="relative">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {regions.map((region, i) => (
            <div 
              key={i} 
              className="bg-white p-4 rounded-xl border border-emerald-100 flex flex-col items-center justify-center hover:border-emerald-400 hover:shadow-md transition-all cursor-default group"
            >
              <div className="mb-2 p-2 bg-emerald-50 rounded-full group-hover:bg-emerald-600 group-hover:text-white transition-all text-emerald-600">
                <MapPin size={17} />
              </div>
              <span className="font-bold text-sm text-emerald-950 group-hover:text-emerald-700 transition-colors">{region}</span>
            </div>
          ))}
        </div>
        
        {/* Call to action for other regions */}
        <div className="mt-10 p-7 md:p-9 bg-[#0a2619] rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="text-left relative z-10">
            <p className="text-xl md:text-2xl font-bold mb-1.5">Atendimento imediato ou programado?</p>
            <p className="text-emerald-100/70 text-sm max-w-xl">Consulte nossa central para remoções de longa distância, transferências intermunicipais e suporte para eventos em todo o estado.</p>
          </div>
          
          <a 
            href="tel:1937923947" 
            className="bg-emerald-500 text-[#0a2619] px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-emerald-400 transition-all whitespace-nowrap shadow-lg relative z-10"
          >
            Ligar: (19) 3792-3947
          </a>
        </div>
      </div>
    </div>
  );
};

export default Regions;
