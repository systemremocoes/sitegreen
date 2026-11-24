import React from 'react';
import { ShieldCheck, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { Page } from '../App';

interface PlansPromoProps {
  onNavigate: (page: Page) => void;
}

const PlansPromo: React.FC<PlansPromoProps> = ({ onNavigate }) => {
  const highlights = [
    'Atendimento 24h com UTI Móvel e Suporte Básico',
    'Sem surpresas financeiras na hora da emergência',
    'Acesso exclusivo ao Portal do Credenciado (Boletos e Solicitações)',
    'Planos para Famílias, Empresas e Condomínios'
  ];

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#0a2619] via-[#0d3322] to-[#0a2619] rounded-2xl p-7 md:p-10 text-white shadow-xl relative overflow-hidden border border-emerald-500/20">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:w-3/5 space-y-4">
              <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-3 py-1 rounded-full">
                <Sparkles size={14} />
                <span className="text-xs font-bold uppercase tracking-wider">Assinatura Mensal de Remoção</span>
              </div>

              <h3 className="text-2xl md:text-3xl font-extrabold leading-tight tracking-tight">
                Proteja sua Família ou Empresa com o <span className="text-emerald-400">Plano de Remoção Green</span>
              </h3>

              <p className="text-emerald-100/80 text-sm md:text-base leading-relaxed max-w-xl">
                Garanta tranquilidade o ano inteiro com cobertura médica pré-hospitalar programada e emergencial, mensalidade acessível e painel exclusivo para credenciados.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5">
                    <CheckCircle2 size={17} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs md:text-sm font-medium text-emerald-50">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <button
                  onClick={() => onNavigate('plans')}
                  className="bg-emerald-500 hover:bg-emerald-400 text-[#0a2619] px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg"
                >
                  <span>Assinar Plano de Remoção</span>
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>

            <div className="lg:w-2/5 w-full">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 space-y-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 bg-emerald-500 rounded-xl flex items-center justify-center text-[#0a2619] shrink-0">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold tracking-wider text-emerald-300">Plano Credenciado</p>
                    <h4 className="text-lg font-bold">Cobertura Total 24h</h4>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 space-y-2.5 text-xs md:text-sm text-emerald-100/80">
                  <div className="flex justify-between">
                    <span>Remoções Avulsas vs. Plano</span>
                    <span className="font-bold text-emerald-400">Economia de até 60%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Portal do Credenciado</span>
                    <span className="font-semibold text-white">Boletos e Solicitações</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Base em Limeira e Região</span>
                    <span className="font-semibold text-white">Atendimento Imediato</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('accredited-area')}
                  className="w-full py-2.5 rounded-xl bg-white text-[#0a2619] font-bold text-xs md:text-sm hover:bg-emerald-50 transition-colors"
                >
                  Já é Credenciado? Acessar Portal
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlansPromo;
