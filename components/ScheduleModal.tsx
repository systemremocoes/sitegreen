import React, { useState } from 'react';
import {
  Calendar,
  X,
  CheckCircle2,
  Ambulance,
  MapPin,
  Clock,
  ShieldCheck,
  User,
  Phone,
  Stethoscope,
  HeartPulse,
  Copy,
  Check,
  Zap
} from 'lucide-react';
import { submitQuotationToRemocoesPro } from '../lib/remocoesPro';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ambulanceOptions = [
  {
    id: 'simples',
    title: 'Básica (Tipo B)',
    team: 'Téc. Enfermagem + Condutor',
    icon: Ambulance
  },
  {
    id: 'siv',
    title: 'Intermediária (SIV)',
    team: 'Enfermeiro + Condutor',
    icon: Stethoscope
  },
  {
    id: 'uti',
    title: 'UTI Móvel (Tipo D)',
    team: 'Médico + Enfermeiro',
    icon: HeartPulse
  }
];

const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [protocol, setProtocol] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    date: '',
    time: '',
    patientName: '',
    patientAge: '',
    contactPhone: '',
    observations: '',
    serviceType: 'simples'
  });

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fillNow = () => {
    const now = new Date();
    setFormData((prev) => ({
      ...prev,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5)
    }));
  };

  const handleResetAndClose = () => {
    setProtocol(null);
    setCopied(false);
    setFormData({
      origin: '',
      destination: '',
      date: '',
      time: '',
      patientName: '',
      patientAge: '',
      contactPhone: '',
      observations: '',
      serviceType: 'simples'
    });
    onClose();
  };

  const handleCopyProtocol = () => {
    if (!protocol) return;
    navigator.clipboard.writeText(protocol.split('-')[0].toUpperCase());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.origin.trim() || !formData.destination.trim() || !formData.patientName.trim() || !formData.contactPhone.trim()) {
      alert('Preencha origem, destino, nome do paciente e telefone de contato.');
      return;
    }

    setLoading(true);
    try {
      const result = await submitQuotationToRemocoesPro({
        ...formData,
        date: formData.date || new Date().toISOString().split('T')[0],
        time: formData.time || new Date().toTimeString().slice(0, 5),
        email: '',
        source: 'schedule_modal'
      });

      if (!result.success) {
        throw new Error(result.error || 'Falha na conexão');
      }

      setProtocol(result.protocol);
    } catch (error) {
      console.error('Erro ao agendar:', error);
      const message = `*Solicitação de Remoção (Site)*%0A%0A*Paciente:* ${formData.patientName}%0A*Telefone:* ${formData.contactPhone}%0A*Origem:* ${formData.origin}%0A*Destino:* ${formData.destination}%0A*Data/Hora:* ${formData.date} ${formData.time}%0A*Tipo:* ${formData.serviceType}`;
      window.open(`https://wa.me/5519998049901?text=${message}`, '_blank');
      handleResetAndClose();
    } finally {
      setLoading(false);
    }
  };

  const selectedUnit = ambulanceOptions.find((o) => o.id === formData.serviceType);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm transition-opacity"
        onClick={handleResetAndClose}
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

            <h3 className="text-lg font-bold leading-snug mb-1">Solicitar Remoção</h3>
            <p className="text-xs text-emerald-100/70 mb-5">
              Preencha tudo em uma única tela. Envio direto para o sistema Remoções Pro.
            </p>

            <div className="hidden md:block space-y-2 text-xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Resumo em Tempo Real
              </p>
              <div className="bg-white/5 rounded-xl p-3.5 space-y-2 text-emerald-100/85">
                <p className="truncate">
                  <span className="text-emerald-300 font-semibold">Origem:</span>{' '}
                  {formData.origin || '—'}
                </p>
                <p className="truncate">
                  <span className="text-emerald-300 font-semibold">Destino:</span>{' '}
                  {formData.destination || '—'}
                </p>
                <p>
                  <span className="text-emerald-300 font-semibold">Data/Hora:</span>{' '}
                  {formData.date ? `${formData.date} ${formData.time}` : 'Imediato / A definir'}
                </p>
                <p className="truncate">
                  <span className="text-emerald-300 font-semibold">Paciente:</span>{' '}
                  {formData.patientName || '—'}
                </p>
                <p className="truncate">
                  <span className="text-emerald-300 font-semibold">Unidade:</span>{' '}
                  {selectedUnit ? selectedUnit.title : '—'}
                </p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-[11px] text-emerald-100/60 pt-4 border-t border-white/10">
            <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
            <span>Sigilo médico • LGPD</span>
          </div>
        </div>

        {/* Painel Direito (Formulário Único) */}
        <div className="md:w-8/12 p-6 overflow-y-auto">
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
            <div>
              <h4 className="text-base font-bold text-[#0a2619]">
                {protocol ? 'Pedido Registrado' : 'Dados da Remoção Médica'}
              </h4>
              <p className="text-xs text-slate-500">
                {protocol ? 'Protocolo gerado na central' : 'Preencha os dados abaixo para despacho ou orçamento'}
              </p>
            </div>
            <button
              onClick={handleResetAndClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Fechar"
            >
              <X size={18} />
            </button>
          </div>

          {protocol ? (
            <div className="py-6 text-center space-y-4 animate-fadeIn">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 size={30} />
              </div>
              <div>
                <h5 className="text-lg font-bold text-[#0a2619]">Solicitação Enviada à Central!</h5>
                <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                  Nossa equipe já recebeu os dados no <strong>Remoções Pro</strong> e dará prosseguimento ao atendimento.
                </p>
              </div>

              <div className="bg-slate-50 border border-dashed border-emerald-300 rounded-xl p-4 max-w-xs mx-auto">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                  Protocolo de Atendimento
                </span>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg font-extrabold text-[#0a2619] font-mono">
                    {protocol.split('-')[0].toUpperCase()}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyProtocol}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:border-emerald-400 text-slate-600 transition-colors"
                    title="Copiar protocolo"
                  >
                    {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <a
                  href={`https://wa.me/5519998049901?text=${encodeURIComponent(
                    `*Solicitação de Remoção (Site)*\nProtocolo: ${protocol}\nPaciente: ${formData.patientName}\nOrigem: ${formData.origin}\nDestino: ${formData.destination}\nData: ${formData.date} às ${formData.time}\nTipo: ${formData.serviceType}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-colors text-center"
                >
                  Acompanhar via WhatsApp
                </a>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors"
                >
                  Concluir
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Origem & Destino */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Origem *</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="origin"
                      required
                      value={formData.origin}
                      onChange={handleInputChange}
                      placeholder="Endereço ou hospital de saída"
                      className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                    />
                    <MapPin size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-emerald-600" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Destino *</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="destination"
                      required
                      value={formData.destination}
                      onChange={handleInputChange}
                      placeholder="Endereço ou hospital de destino"
                      className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                    />
                    <MapPin size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Paciente, Idade, Telefone */}
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
                <div className="space-y-1 sm:col-span-3">
                  <label className="text-xs font-semibold text-slate-600">Nome do Paciente *</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="patientName"
                      required
                      value={formData.patientName}
                      onChange={handleInputChange}
                      placeholder="Nome completo"
                      className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                    />
                    <User size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-1 sm:col-span-1">
                  <label className="text-xs font-semibold text-slate-600">Idade</label>
                  <input
                    type="number"
                    name="patientAge"
                    value={formData.patientAge}
                    onChange={handleInputChange}
                    placeholder="Ex: 68"
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-600">Telefone *</label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="contactPhone"
                      required
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      placeholder="(19) 99999-9999"
                      className="w-full pl-8 pr-2.5 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                    />
                    <Phone size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Data e Horário */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 items-end">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Data</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full pl-8 pr-2 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                    />
                    <Calendar size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Horário</label>
                  <div className="relative">
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full pl-8 pr-2 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                    />
                    <Clock size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={fillNow}
                  className="col-span-2 sm:col-span-1 py-2 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold inline-flex items-center justify-center gap-1.5 border border-emerald-200 transition-colors"
                >
                  <Zap size={13} />
                  <span>Agora (Urgente)</span>
                </button>
              </div>

              {/* Tipo de Ambulância */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 block">Tipo de Ambulância *</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {ambulanceOptions.map((opt) => {
                    const active = formData.serviceType === opt.id;
                    const IconComp = opt.icon;
                    return (
                      <label
                        key={opt.id}
                        className={`flex flex-col p-2.5 border rounded-xl cursor-pointer transition-all ${
                          active
                            ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600'
                            : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="serviceType"
                          value={opt.id}
                          checked={active}
                          onChange={handleInputChange}
                          className="hidden"
                        />
                        <div className="flex items-center gap-2 mb-1">
                          <IconComp size={15} className={active ? 'text-emerald-700' : 'text-slate-500'} />
                          <span className="font-bold text-[#0a2619] text-xs">{opt.title}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 leading-tight">{opt.team}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Observações */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Observações Clínicas (Opcional)</label>
                <textarea
                  name="observations"
                  value={formData.observations}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Uso de oxigênio, acamado, andar sem elevador..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-md shadow-emerald-600/20 disabled:opacity-50"
              >
                <span>{loading ? 'Enviando para Remoções Pro...' : 'Confirmar Solicitação de Remoção'}</span>
                <CheckCircle2 size={16} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
