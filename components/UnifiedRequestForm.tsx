import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle2,
  Ambulance,
  MapPin,
  Clock,
  User,
  Phone,
  Stethoscope,
  HeartPulse,
  Copy,
  Check,
  Zap,
  Users,
  Mail,
  Sparkles
} from 'lucide-react';
import { submitQuotationToRemocoesPro } from '../lib/remocoesPro';

export type RequestFormMode = 'removal' | 'event';

export interface LiveSummaryData {
  mode: RequestFormMode;
  origin: string;
  destination: string;
  date: string;
  time: string;
  patientName: string;
  serviceLabel: string;
  audience: string;
}

interface UnifiedRequestFormProps {
  initialMode?: RequestFormMode;
  sourcePrefix?: string;
  onSummaryChange?: (summary: LiveSummaryData) => void;
  onSuccess?: (protocol: string) => void;
  compact?: boolean;
}

const ambulanceOptions = [
  { id: 'simples', title: 'Básica (Tipo B)', team: 'Téc. Enfermagem + Condutor', icon: Ambulance },
  { id: 'siv', title: 'Intermediária (SIV)', team: 'Enfermeiro + Condutor', icon: Stethoscope },
  { id: 'uti', title: 'UTI Móvel (Tipo D)', team: 'Médico + Enfermeiro', icon: HeartPulse }
];

const eventStructureOptions = [
  { id: 'Ambulância Básica (Tipo B)', title: 'Ambulância Básica', team: 'Téc. Enfermagem + Condutor', icon: Ambulance },
  { id: 'Ambulância UTI Móvel (Tipo D)', title: 'UTI Móvel (Tipo D)', team: 'Médico + Enfermeiro', icon: HeartPulse },
  { id: 'Posto Médico + Ambulância', title: 'Posto Médico Completo', team: 'Ambulatório + Ambulância', icon: Sparkles }
];

const UnifiedRequestForm: React.FC<UnifiedRequestFormProps> = ({
  initialMode = 'removal',
  sourcePrefix = 'unified_form',
  onSummaryChange,
  compact = false
}) => {
  const [mode, setMode] = useState<RequestFormMode>(initialMode);
  const [loading, setLoading] = useState(false);
  const [protocol, setProtocol] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Campos Remoção
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [serviceType, setServiceType] = useState('simples');
  const [observations, setObservations] = useState('');

  // Campos Evento
  const [eventName, setEventName] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventType, setEventType] = useState('Esportivo');
  const [audience, setAudience] = useState('Até 500 pessoas');
  const [duration, setDuration] = useState('Até 6 horas');
  const [eventStructure, setEventStructure] = useState('Ambulância Básica (Tipo B)');
  const [email, setEmail] = useState('');

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (!onSummaryChange) return;
    const selectedAmb = ambulanceOptions.find((a) => a.id === serviceType);
    onSummaryChange({
      mode,
      origin: mode === 'removal' ? origin : eventName,
      destination: mode === 'removal' ? destination : eventLocation,
      date,
      time,
      patientName,
      serviceLabel: mode === 'removal' ? (selectedAmb?.title || serviceType) : eventStructure,
      audience
    });
  }, [mode, origin, destination, eventName, eventLocation, date, time, patientName, serviceType, eventStructure, audience, onSummaryChange]);

  const fillNow = () => {
    const now = new Date();
    setDate(now.toISOString().split('T')[0]);
    setTime(now.toTimeString().slice(0, 5));
  };

  const handleReset = () => {
    setProtocol(null);
    setCopied(false);
    setOrigin('');
    setDestination('');
    setDate('');
    setTime('');
    setPatientName('');
    setPatientAge('');
    setContactPhone('');
    setServiceType('simples');
    setObservations('');
    setEventName('');
    setEventLocation('');
    setEmail('');
  };

  const handleCopyProtocol = () => {
    if (!protocol) return;
    navigator.clipboard.writeText(protocol.split('-')[0].toUpperCase());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'removal') {
      if (!origin.trim() || !destination.trim() || !patientName.trim() || !contactPhone.trim()) {
        alert('Preencha origem, destino, nome do paciente e telefone de contato.');
        return;
      }
    } else {
      if (!eventName.trim() || !eventLocation.trim() || !patientName.trim() || !contactPhone.trim() || !date) {
        alert('Preencha nome do evento, local, data, responsável e telefone.');
        return;
      }
    }

    setLoading(true);
    try {
      const payload =
        mode === 'removal'
          ? {
              origin: origin.trim(),
              destination: destination.trim(),
              date: date || new Date().toISOString().split('T')[0],
              time: time || new Date().toTimeString().slice(0, 5),
              patientName: patientName.trim(),
              patientAge: patientAge.trim(),
              contactPhone: contactPhone.trim(),
              email: '',
              observations: observations.trim(),
              serviceType,
              source: `${sourcePrefix}_removal`
            }
          : {
              origin: `Evento: ${eventName.trim()} - ${eventLocation.trim()}`,
              destination: `Cobertura de Evento (${eventType})`,
              date,
              time: time || '08:00',
              patientName: patientName.trim(),
              patientAge: '',
              contactPhone: contactPhone.trim(),
              email: email.trim(),
              observations: [
                `[COTAÇÃO DE EVENTO]`,
                `Evento: ${eventName.trim()}`,
                `Tipo: ${eventType}`,
                `Público: ${audience}`,
                `Duração: ${duration}`,
                `Estrutura: ${eventStructure}`,
                observations.trim() ? `Obs: ${observations.trim()}` : ''
              ]
                .filter(Boolean)
                .join(' | '),
              serviceType: 'eventos',
              source: `${sourcePrefix}_event`
            };

      const result = await submitQuotationToRemocoesPro(payload);
      if (!result.success) {
        throw new Error(result.error || 'Falha na conexão com o Remoções Pro.');
      }

      setProtocol(result.protocol);
    } catch (error: any) {
      console.error('Erro ao enviar solicitação:', error);
      alert(error?.message || 'Não foi possível registrar no momento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (protocol) {
    return (
      <div className="py-6 text-center space-y-4 animate-fadeIn">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
          <CheckCircle2 size={30} />
        </div>
        <div>
          <h5 className="text-lg font-bold text-[#0a2619]">
            {mode === 'removal' ? 'Solicitação de Remoção Enviada!' : 'Cotação de Evento Enviada!'}
          </h5>
          <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
            Sua solicitação já foi registrada no sistema <strong>Remoções Pro</strong>. Nossa central dará prosseguimento em instantes.
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

        <button
          type="button"
          onClick={handleReset}
          className="bg-[#0a2619] hover:bg-emerald-900 text-white py-2.5 px-6 rounded-xl text-xs font-bold transition-colors"
        >
          Nova Solicitação
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Seletor Unificado: Remoção ou Evento */}
      <div className="inline-flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
        <button
          type="button"
          onClick={() => setMode('removal')}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            mode === 'removal' ? 'bg-[#0a2619] text-white shadow-sm' : 'text-slate-600 hover:text-[#0a2619]'
          }`}
        >
          <Ambulance size={14} />
          <span>Solicitar Remoção</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('event')}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            mode === 'event' ? 'bg-[#0a2619] text-white shadow-sm' : 'text-slate-600 hover:text-[#0a2619]'
          }`}
        >
          <Sparkles size={14} />
          <span>Cotação para Eventos</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className={compact ? 'space-y-3.5' : 'space-y-4'}>
        {mode === 'removal' ? (
          <>
            {/* Origem & Destino */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Origem *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
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
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
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
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
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
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  placeholder="Ex: 68"
                  className="w-full px-2.5 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-600">Telefone *</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="(19) 99999-9999"
                    className="w-full pl-8 pr-2.5 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                  />
                  <Phone size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Data, Horário e Agora */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 items-end">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Data</label>
                <div className="relative">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
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
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
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
                  const active = serviceType === opt.id;
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
                        onChange={(e) => setServiceType(e.target.value)}
                        className="hidden"
                      />
                      <div className="flex items-center gap-2 mb-0.5">
                        <IconComp size={15} className={active ? 'text-emerald-700' : 'text-slate-500'} />
                        <span className="font-bold text-[#0a2619] text-xs">{opt.title}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 leading-tight">{opt.team}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Evento e Local */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Nome do Evento *</label>
                <input
                  type="text"
                  required
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="Ex: Corrida, Show, Feira..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Local / Cidade *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="Endereço ou espaço do evento"
                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                  />
                  <MapPin size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-emerald-600" />
                </div>
              </div>
            </div>

            {/* Tipo, Público, Duração */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Tipo de Evento</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                >
                  <option value="Esportivo">Esportivo</option>
                  <option value="Show / Festival">Show / Festival</option>
                  <option value="Corporativo">Corporativo</option>
                  <option value="Feira / Exposição">Feira / Exposição</option>
                  <option value="Religioso / Social">Religioso / Social</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Público Estimado</label>
                <div className="relative">
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full pl-8 pr-2 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                  >
                    <option value="Até 500 pessoas">Até 500 pessoas</option>
                    <option value="500 a 2.000 pessoas">500 a 2.000 pessoas</option>
                    <option value="2.000 a 10.000 pessoas">2.000 a 10.000 pessoas</option>
                    <option value="Acima de 10.000 pessoas">Acima de 10.000</option>
                  </select>
                  <Users size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Duração</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                >
                  <option value="Até 6 horas">Até 6 horas</option>
                  <option value="6 a 12 horas">6 a 12 horas</option>
                  <option value="Diária 24h">Diária 24h</option>
                  <option value="Múltiplos dias">Múltiplos dias</option>
                </select>
              </div>
            </div>

            {/* Data, Horário, Responsável, Telefone, Email */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Data *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Início</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                />
              </div>
              <div className="space-y-1 col-span-2">
                <label className="text-xs font-semibold text-slate-600">Responsável / Empresa *</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Nome ou razão social"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Telefone *</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="(19) 99999-9999"
                    className="w-full pl-8 pr-2.5 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                  />
                  <Phone size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">E-mail (Opcional)</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contato@evento.com"
                    className="w-full pl-8 pr-2.5 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                  />
                  <Mail size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Estrutura do Evento */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 block">Estrutura Desejada</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {eventStructureOptions.map((opt) => {
                  const active = eventStructure === opt.id;
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
                        name="eventStructure"
                        value={opt.id}
                        checked={active}
                        onChange={(e) => setEventStructure(e.target.value)}
                        className="hidden"
                      />
                      <div className="flex items-center gap-2 mb-0.5">
                        <IconComp size={15} className={active ? 'text-emerald-700' : 'text-slate-500'} />
                        <span className="font-bold text-[#0a2619] text-xs">{opt.title}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 leading-tight">{opt.team}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Observações */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600">
            {mode === 'removal' ? 'Observações Clínicas (Opcional)' : 'Observações Adicionais (Opcional)'}
          </label>
          <textarea
            rows={2}
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder={
              mode === 'removal'
                ? 'Uso de oxigênio, acamado, andar sem elevador...'
                : 'Exigências de alvará, quantidade de dias, necessidades específicas...'
            }
            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619] resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-md shadow-emerald-600/20 disabled:opacity-50"
        >
          <span>
            {loading
              ? 'Enviando para Remoções Pro...'
              : mode === 'removal'
              ? 'Confirmar Solicitação de Remoção'
              : 'Solicitar Cotação de Evento'}
          </span>
          <CheckCircle2 size={16} />
        </button>
      </form>
    </div>
  );
};

export default UnifiedRequestForm;
