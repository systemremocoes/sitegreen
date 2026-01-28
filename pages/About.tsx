
import React from 'react';
import { ShieldCheck, Users, Activity, Heart, Award } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="pt-32 pb-24">
      {/* Header da Página */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
        <h1 className="text-4xl md:text-6xl font-black text-[#0a2619] mb-6">Sobre a <span className="text-emerald-500">Green</span></h1>
        <p className="text-emerald-900/70 text-lg md:text-xl max-w-3xl mx-auto font-medium">
          Há anos sendo a referência em agilidade e cuidado humano no interior de São Paulo.
        </p>
      </div>

      {/* Conteúdo Principal com Design de Curvas */}
      <section className="relative overflow-hidden bg-emerald-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-3xl font-extrabold text-[#0a2619]">Nossa Missão é Preservar Vidas</h2>
            <p className="text-emerald-900/80 leading-relaxed font-medium">
              A Green Emergências Médicas nasceu da necessidade de um serviço de saúde pré-hospitalar que unisse tecnologia de ponta com um atendimento verdadeiramente humano. Localizada estrategicamente em Limeira, nossa sede própria permite um despacho rápido para toda a região.
            </p>
            <p className="text-emerald-900/80 leading-relaxed font-medium">
              Contamos com uma frota de ambulâncias Tipo B e Tipo D (UTI), todas equipadas conforme as normas mais rigorosas da ANVISA e do Ministério da Saúde.
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="flex items-center space-x-3 text-[#0a2619] font-bold">
                <ShieldCheck className="text-emerald-500" />
                <span>100% Seguros</span>
              </div>
              <div className="flex items-center space-x-3 text-[#0a2619] font-bold">
                <Users className="text-emerald-500" />
                <span>Equipe de Elite</span>
              </div>
              <div className="flex items-center space-x-3 text-[#0a2619] font-bold">
                <Activity className="text-emerald-500" />
                <span>Prontidão 24h</span>
              </div>
              <div className="flex items-center space-x-3 text-[#0a2619] font-bold">
                <Award className="text-emerald-500" />
                <span>Referência Regional</span>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 rounded-[3rem] rotate-3 -z-10 opacity-20"></div>
              <img 
                src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=1200" 
                alt="Equipe Green Emergências" 
                className="rounded-[3rem] shadow-2xl border-4 border-white"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200';
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Onda decorativa de fundo */}
        <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
           <svg viewBox="0 0 1000 1000" className="w-full h-full"><path d="M0,1000 C300,800 600,900 1000,700 V1000 H0 Z" fill="#10b981" /></svg>
        </div>
      </section>

      {/* Valores */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center p-8 bg-white border border-emerald-100 rounded-3xl shadow-xl shadow-emerald-900/5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Heart size={32} />
            </div>
            <h4 className="text-xl font-bold text-[#0a2619] mb-4">Humanização</h4>
            <p className="text-emerald-900/60 text-sm font-medium">Tratamos cada paciente como se fosse da nossa família, com respeito e empatia total.</p>
          </div>
          <div className="text-center p-8 bg-white border border-emerald-100 rounded-3xl shadow-xl shadow-emerald-900/5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Activity size={32} />
            </div>
            <h4 className="text-xl font-bold text-[#0a2619] mb-4">Agilidade</h4>
            <p className="text-emerald-900/60 text-sm font-medium">Sabemos que cada segundo conta. Nosso processo é otimizado para o menor tempo de resposta.</p>
          </div>
          <div className="text-center p-8 bg-white border border-emerald-100 rounded-3xl shadow-xl shadow-emerald-900/5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={32} />
            </div>
            <h4 className="text-xl font-bold text-[#0a2619] mb-4">Segurança</h4>
            <p className="text-emerald-900/60 text-sm font-medium">Protocolos rigorosos e manutenção preventiva constante de toda nossa frota e equipamentos.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
