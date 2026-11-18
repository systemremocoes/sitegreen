
import React from 'react';
import { Clock, Shield, Star, Zap, HeartHandshake } from 'lucide-react';

const Differentials: React.FC = () => {
  const diffs = [
    {
      title: 'Tempo de Resposta Recorde',
      desc: 'Central de inteligência para despacho imediato da unidade mais próxima.',
      icon: <Clock className="text-white" size={24} />,
      bg: 'bg-emerald-500'
    },
    {
      title: 'Frota 100% Monitorada',
      desc: 'Veículos novos com tecnologia de rastreamento e telemetria avançada.',
      icon: <Shield className="text-white" size={24} />,
      bg: 'bg-emerald-600'
    },
    {
      title: 'Profissionais de Elite',
      desc: 'Corpo clínico treinado nos mais rigorosos protocolos de trauma e emergência.',
      icon: <Star className="text-white" size={24} />,
      bg: 'bg-emerald-400'
    },
    {
      title: 'Tecnologia Médica',
      desc: 'Equipamentos de última geração para diagnóstico e tratamento móvel.',
      icon: <Zap className="text-white" size={24} />,
      bg: 'bg-teal-500'
    },
    {
      title: 'Foco no Paciente',
      desc: 'Atendimento humanizado que prioriza o bem-estar e a tranquilidade da família.',
      icon: <HeartHandshake className="text-white" size={24} />,
      bg: 'bg-emerald-700'
    }
  ];

  return (
    <div className="py-16 bg-[#0a2619] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <h2 className="text-emerald-400 font-bold uppercase tracking-wider text-xs mb-3">Porque Escolher a Green?</h2>
            <h3 className="text-2xl md:text-3xl font-extrabold mb-5 leading-tight">Compromisso Real com a <span className="text-emerald-400">Preservação da Vida</span></h3>
            <p className="text-emerald-100/70 text-sm md:text-base mb-8 leading-relaxed">
              Atuamos em Limeira e região com uma visão focada no cuidado humano. Não somos apenas transporte, somos a segurança que sua família e empresa precisam.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-emerald-800/20 p-5 rounded-2xl border border-emerald-500/10">
                <p className="text-2xl font-extrabold text-white mb-1">100%</p>
                <p className="text-emerald-300/70 text-xs font-medium">Equipada UTI Móvel</p>
              </div>
              <div className="bg-emerald-800/20 p-5 rounded-2xl border border-emerald-500/10">
                <p className="text-2xl font-extrabold text-white mb-1">24h</p>
                <p className="text-emerald-300/70 text-xs font-medium">Suporte em Limeira e Região</p>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 space-y-3">
            {diffs.map((diff, i) => (
              <div key={i} className="flex items-start space-x-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                <div className={`${diff.bg} p-2.5 rounded-xl shrink-0 shadow-md`}>
                  {diff.icon}
                </div>
                <div>
                  <h4 className="text-base font-bold mb-1">{diff.title}</h4>
                  <p className="text-emerald-100/60 text-sm leading-relaxed">{diff.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Differentials;
