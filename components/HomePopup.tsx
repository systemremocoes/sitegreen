import React, { useState, useEffect } from 'react';
import { X, CalendarCheck, ArrowRight, Phone, ShieldCheck } from 'lucide-react';
import { Page } from '../App';

interface HomePopupProps {
  onNavigate: (page: Page) => void;
}

const HomePopup: React.FC<HomePopupProps> = ({ onNavigate }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('green_popup_dismissed') === '1') {
      return;
    }
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('green_popup_dismissed', '1');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 pointer-events-none">
      <div
        className="absolute inset-0 pointer-events-auto bg-slate-950/40 backdrop-blur-sm transition-opacity"
        onClick={handleDismiss}
      />

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm relative pointer-events-auto animate-scaleIn border border-slate-200 overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-teal-500" />

        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1.5 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors text-slate-500"
          aria-label="Fechar"
        >
          <X size={16} />
        </button>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-[#0a2619] text-emerald-400 flex items-center justify-center shrink-0">
              <CalendarCheck size={22} />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
                Atendimento 24h
              </span>
              <h3 className="text-lg font-bold text-[#0a2619] leading-tight">
                Agende sua Remoção Online
              </h3>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed mb-5">
            Solicite ambulância UTI Móvel ou Suporte Básico com data e hora marcada diretamente pela nossa central digital.
          </p>

          <div className="space-y-2.5">
            <button
              onClick={() => {
                handleDismiss();
                onNavigate('schedule');
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-md shadow-emerald-600/20"
            >
              <span>Solicitar Remoção Agora</span>
              <ArrowRight size={16} />
            </button>

            <a
              href="tel:1937923947"
              onClick={handleDismiss}
              className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#0a2619] py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Phone size={14} className="text-emerald-600" />
              <span>Emergência? Ligue (19) 3792-3947</span>
            </a>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck size={13} className="text-emerald-600" />
              Remoções Pro
            </span>
            <button onClick={handleDismiss} className="hover:text-slate-600 font-semibold">
              Agora não
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePopup;
