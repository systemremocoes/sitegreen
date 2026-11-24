import React, { useState } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import UnifiedRequestForm, { LiveSummaryData, RequestFormMode } from './UnifiedRequestForm';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: RequestFormMode;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose, initialMode = 'removal' }) => {
  const [summary, setSummary] = useState<LiveSummaryData>({
    mode: initialMode,
    origin: '',
    destination: '',
    date: '',
    time: '',
    patientName: '',
    serviceLabel: 'Básica (Tipo B)',
    audience: 'Até 500 pessoas'
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative z-10 overflow-hidden animate-scaleIn max-h-[92vh] flex flex-col md:flex-row border border-slate-200">
        {/* Painel Lateral Esquerdo (Resumo ao Vivo) */}
        <div className="md:w-4/12 bg-[#0a2619] text-white p-6 flex flex-col justify-between shrink-0">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-400/25 px-2.5 py-1 rounded-full mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                Central 24h Online
              </span>
            </div>

            <h3 className="text-lg font-bold leading-snug mb-1">
              {summary.mode === 'removal' ? 'Solicitar Remoção' : 'Cotação para Eventos'}
            </h3>
            <p className="text-xs text-emerald-100/70 mb-5">
              Formulário único integrado diretamente ao sistema Remoções Pro.
            </p>

            <div className="hidden md:block space-y-2 text-xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Resumo em Tempo Real
              </p>
              <div className="bg-white/5 rounded-xl p-3.5 space-y-2 text-emerald-100/85">
                <p className="truncate">
                  <span className="text-emerald-300 font-semibold">
                    {summary.mode === 'removal' ? 'Origem:' : 'Evento:'}
                  </span>{' '}
                  {summary.origin || '—'}
                </p>
                <p className="truncate">
                  <span className="text-emerald-300 font-semibold">
                    {summary.mode === 'removal' ? 'Destino:' : 'Local:'}
                  </span>{' '}
                  {summary.destination || '—'}
                </p>
                <p>
                  <span className="text-emerald-300 font-semibold">Data/Hora:</span>{' '}
                  {summary.date ? `${summary.date} ${summary.time}`.trim() : 'Imediato / A definir'}
                </p>
                <p className="truncate">
                  <span className="text-emerald-300 font-semibold">
                    {summary.mode === 'removal' ? 'Paciente:' : 'Responsável:'}
                  </span>{' '}
                  {summary.patientName || '—'}
                </p>
                <p className="truncate">
                  <span className="text-emerald-300 font-semibold">Unidade:</span>{' '}
                  {summary.serviceLabel || '—'}
                </p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-[11px] text-emerald-100/60 pt-4 border-t border-white/10">
            <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
            <span>Sigilo médico • LGPD</span>
          </div>
        </div>

        {/* Painel Direito (Formulário Unificado) */}
        <div className="md:w-8/12 p-6 overflow-y-auto">
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
            <div>
              <h4 className="text-base font-bold text-[#0a2619]">
                {summary.mode === 'removal' ? 'Dados da Remoção Médica' : 'Dados do Evento'}
              </h4>
              <p className="text-xs text-slate-500">
                Preencha os dados abaixo para despacho ou cotação imediata
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Fechar"
            >
              <X size={18} />
            </button>
          </div>

          <UnifiedRequestForm
            initialMode={initialMode}
            sourcePrefix="modal"
            onSummaryChange={setSummary}
            compact
          />
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
