import React from 'react';
import { Mail, MapPin, ShieldCheck } from 'lucide-react';
import UnifiedRequestForm from './UnifiedRequestForm';

interface ContactProps {
  onOpenRequestModal?: () => void;
}

const Contact: React.FC<ContactProps> = () => {
  return (
    <div className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col lg:flex-row border border-slate-200">
          {/* Info Side */}
          <div className="lg:w-4/12 bg-[#0a2619] p-8 md:p-10 text-white flex flex-col justify-between">
            <div>
              <span className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-400/25 text-emerald-300 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Central 24h • Limeira e Região
              </span>

              <h3 className="text-2xl font-bold mb-3 tracking-tight">Solicitar Remoção ou Evento</h3>
              <p className="text-emerald-100/75 mb-8 text-sm leading-relaxed">
                Preencha o formulário ao lado para solicitar ambulância (UTI Móvel, SIV ou Básica) ou cotação médica para eventos diretamente pelo Remoções Pro.
              </p>

              <div className="space-y-5">
                <div className="flex items-start space-x-3.5">
                  <div className="bg-emerald-800/50 p-2.5 rounded-xl text-emerald-400 shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-400 uppercase text-[11px] tracking-wider mb-0.5">E-mail</h4>
                    <p className="text-white text-sm font-medium break-all">atendimento@greenemergencias.com.br</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="bg-emerald-800/50 p-2.5 rounded-xl text-emerald-400 shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-400 uppercase text-[11px] tracking-wider mb-0.5">Base Operacional</h4>
                    <p className="text-white text-sm leading-relaxed">
                      R. José da Silva Gonçalo, 28<br />Jardim Boa Esperança, Limeira - SP
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-2 text-xs text-emerald-100/65">
              <ShieldCheck size={15} className="text-emerald-400 shrink-0" />
              <span>Frota própria homologada • Sigilo médico LGPD</span>
            </div>
          </div>

          {/* Form Side (Mesmo formulário unificado de remoção/evento) */}
          <div className="lg:w-8/12 p-8 md:p-10">
            <div className="mb-5 pb-4 border-b border-slate-100">
              <h3 className="text-xl font-bold text-[#0a2619]">Solicitar Remoção</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Envio direto para nossa central de operações no Remoções Pro.
              </p>
            </div>

            <UnifiedRequestForm initialMode="removal" sourcePrefix="home_body" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
