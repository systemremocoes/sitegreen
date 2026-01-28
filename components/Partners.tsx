
import React from 'react';

const partners = [
  { name: 'Unimed', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Unimed_Logo.svg/2560px-Unimed_Logo.svg.png' },
  { name: 'Amil', logo: 'https://upload.wikimedia.org/wikipedia/pt/thumb/6/61/Amil_logo.png/1200px-Amil_logo.png' },
  { name: 'Bradesco Saúde', logo: 'https://upload.wikimedia.org/wikipedia/pt/thumb/a/a2/Bradesco_Sa%C3%BAde_logo.png/1200px-Bradesco_Sa%C3%BAde_logo.png' },
  { name: 'SulAmérica', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/SulAm%C3%A9rica_Sa%C3%BAde_logo.png/1200px-SulAm%C3%A9rica_Sa%C3%BAde_logo.png' },
  { name: 'Porto Seguro', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Porto_Seguro_Sa%C3%BAde_logo.png/1200px-Porto_Seguro_Sa%C3%BAde_logo.png' },
  { name: 'NotreDame Intermédica', logo: 'https://logodownload.org/wp-content/uploads/2018/09/notredame-intermedica-logo.png' },
  { name: 'Saúde Caixa', logo: 'https://upload.wikimedia.org/wikipedia/pt/thumb/1/1a/Logo_Caixa_Econ%C3%B4mica_Federal.svg/1200px-Logo_Caixa_Econ%C3%B4mica_Federal.svg.png' },
  { name: 'Cassi', logo: 'https://upload.wikimedia.org/wikipedia/pt/thumb/e/ef/Logo_Cassi.png/1200px-Logo_Cassi.png' },
  { name: 'Santa Casa Limeira', logo: 'https://santacasadelimeira.com.br/wp-content/uploads/2021/06/Logo-Santa-Casa-Limeira-Horizontal.png' },
  { name: 'Omint', logo: 'https://logodownload.org/wp-content/uploads/2022/08/omint-logo.png' },
  { name: 'Care Plus', logo: 'https://www.careplus.com.br/img/logo-care-plus.png' },
  { name: 'Gama Saúde', logo: 'https://www.gamasaude.com.br/wp-content/themes/gama-saude/assets/img/logo-gama-saude.png' },
  { name: 'Geap', logo: 'https://viva.geap.com.br/wp-content/uploads/2021/03/Logo_Geap_Horizontal-01.png' },
  { name: 'Postal Saúde', logo: 'https://www.postalsaude.com.br/wp-content/uploads/2021/08/logo-postal-saude.png' }
];

const Partners: React.FC = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-280px * ${partners.length})); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
          display: flex;
          width: calc(280px * ${partners.length * 2});
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Fundo sutil para destaque */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-partners" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="40" cy="40" r="1" fill="#10b981" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-partners)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 text-emerald-600 font-bold uppercase tracking-widest text-xs mb-4">
            <span className="w-8 h-px bg-emerald-600"></span>
            <span>Credibilidade no Atendimento</span>
          </div>
          <h3 className="text-3xl md:text-5xl font-extrabold text-[#0a2619] mb-6">
            Convênios Aceitos
          </h3>
          <p className="text-emerald-900/60 max-w-2xl mx-auto text-lg font-medium">
            Atendemos as principais operadoras de saúde do mercado com agilidade total.
          </p>
        </div>
      </div>

      {/* Marquee de Logos */}
      <div className="relative mt-12 overflow-hidden py-8">
        {/* Gradientes Laterais para suavizar entrada/saída */}
        <div className="absolute left-0 top-0 w-32 md:w-64 h-full bg-gradient-to-r from-white via-white/70 to-transparent z-20 pointer-events-none"></div>
        <div className="absolute right-0 top-0 w-32 md:w-64 h-full bg-gradient-to-l from-white via-white/70 to-transparent z-20 pointer-events-none"></div>

        <div className="flex">
          <div className="animate-scroll">
            {[...partners, ...partners].map((partner, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 w-[280px] px-8"
              >
                <div className="flex items-center justify-center p-6 bg-white rounded-3xl border border-emerald-50 shadow-md hover:shadow-xl hover:border-emerald-200 transition-all duration-500 group h-32 relative overflow-hidden bg-gradient-to-br from-white to-emerald-50/20">
                  <img 
                    src={partner.logo} 
                    alt={partner.name} 
                    className="max-h-[70%] max-w-[85%] relative z-10 opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 object-contain"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const fallback = document.createElement('div');
                        fallback.className = 'text-emerald-900 font-extrabold text-sm tracking-tighter text-center uppercase';
                        fallback.innerText = partner.name;
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-center">
        <div className="inline-flex flex-col md:flex-row items-center gap-4 px-8 py-5 bg-emerald-50/50 rounded-3xl border border-emerald-100">
          <span className="text-emerald-950 font-bold">Dúvidas se atendemos seu plano?</span>
          <div className="flex items-center gap-4">
            <a 
              href="https://wa.me/5519982780943" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-black text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
            >
              Validar Plano Agora
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
