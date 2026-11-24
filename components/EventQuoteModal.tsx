import React, { useState } from 'react';
import {
  Calendar,
  X,
  CheckCircle2,
  MapPin,
  Clock,
  ShieldCheck,
  User,
  Phone,
  Users,
  Copy,
  Check,
  Sparkles,
  Ambulance,
  Mail
} from 'lucide-react';
import { submitQuotationToRemocoesPro } from '../lib/remocoesPro';

interface EventQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const structureOptions = [
  { id: 'Ambulância Básica (Tipo B)', title: 'Ambulância Básica', desc: 'Téc. Enfermagem + Condutor' },
  { id: 'Ambulância UTI Móvel (Tipo D)', title: 'Ambulância UTI Móvel', desc: 'Médico + Enfermeiro + Condutor' },
  { id: 'Posto Médico + Ambulância', title: 'Posto Médico Completo', desc: 'Ambulatório local + Ambulância' }
];

const EventQuoteModal: React.FC<EventQuoteModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [protocol, setProtocol] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [eventName, setEventName] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventType, setEventType] = useState('Esportivo');
  const [audience, setAudience] = useState('Até 500 pessoas');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('Até 6 horas');
  const [structure, setStructure] = useState('Ambulância Básica (Tipo B)');
  const [organizerName, setOrganizerName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [email, setEmail] = useState('');
  const [observations, setObservations] = useState('');

  if (!isOpen) return null;

  const handleResetAndClose = () => {
    setProtocol(null);
    setCopied(false);
    setEventName('');
    setEventLocation('');
    setEventType('Esportivo');
    setAudience('Até 500 pessoas');
    setDate('');
    setTime('');
    setDuration('Até 6 horas');
    setStructure('Ambulância Básica (Tipo B)');
    setOrganizerName('');
    setContactPhone('');
    setEmail('');
    setObservations('');
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

    if (!eventName.trim() || !eventLocation.trim() || !organizerName.trim() || !contactPhone.trim() || !date) {
      alert('Por favor, preencha o nome do evento, local, data, responsável e telefone.');
      return;
    }

    setLoading(true);
    try {
      const formattedObs = [
        `[COTAÇÃO DE EVENTO]`,
        `Evento: ${eventName.trim()}`,
        `Tipo: ${eventType}`,
        `Público Estimado: ${audience}`,
        `Duração: ${duration}`,
        `Estrutura: ${structure}`,
        observations.trim() ? `Obs: ${observations.trim()}` : ''
      ]
        .filter(Boolean)
        .join(' | ');

      const result = await submitQuotationToRemocoesPro({
        origin: `Evento: ${eventName.trim()} - ${eventLocation.trim()}`,
        destination: `Cobertura de Evento (${eventType})`,
        date,
        time: time || '08:00',
        patientName: organizerName.trim(),
        patientAge: '',
        contactPhone: contactPhone.trim(),
        email: email.trim(),
        observations: formattedObs,
        serviceType: 'eventos',
        source: 'event_quote_modal'
      });

      if (!result.success) {
        throw new Error(result.error || 'Falha na conexão com o Remoções Pro.');
      }

      setProtocol(result.protocol);
    } catch (error: any) {
      console.error('Erro ao enviar cotação de evento:', error);
      alert(error?.message || 'Não foi possível registrar a cotação no momento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

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
              <Sparkles size={12} className="text-emerald-400" />
              <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                Cobertura de Eventos
              </span>
            </div>

            <h3 className="text-lg font-bold leading-snug mb-1">Cotação para Eventos</h3>
            <p className="text-xs text-emerald-100/70 mb-5">
              Estrutura médica em conformidade com o Corpo de Bombeiros, integrada ao Remoções Pro.
            </p>

            <div className="hidden md:block space-y-2 text-xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Resumo do Evento
              </p>
              <div className="bg-white/5 rounded-xl p-3.5 space-y-2 text-emerald-100/85">
                <p className="truncate">
                  <span className="text-emerald-300 font-semibold">Evento:</span>{' '}
                  {eventName || '—'}
                </p>
                <p className="truncate">
                  <span className="text-emerald-300 font-semibold">Local:</span>{' '}
                  {eventLocation || '—'}
                </p>
                <p>
                  <span className="text-emerald-300 font-semibold">Data:</span>{' '}
                  {date ? `${date} ${time || ''}`.trim() : '—'}
                </p>
                <p className="truncate">
                  <span className="text-emerald-300 font-semibold">Público:</span>{' '}
                  {audience}
                </p>
                <p className="truncate">
                  <span className="text-emerald-300 font-semibold">Estrutura:</span>{' '}
                  {structure}
                </p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-[11px] text-emerald-100/60 pt-4 border-t border-white/10">
            <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
            <span>Envio direto • Remoções Pro</span>
          </div>
        </div>

        {/* Painel Direito (Formulário Único de Evento) */}
        <div className="md:w-8/12 p-6 overflow-y-auto">
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
            <div>
              <h4 className="text-base font-bold text-[#0a2619]">
                {protocol ? 'Cotação Registrada' : 'Dados do Evento'}
              </h4>
              <p className="text-xs text-slate-500">
                {protocol ? 'Protocolo gerado na central' : 'Informe os detalhes para dimensionamento da equipe'}
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
                <h5 className="text-lg font-bold text-[#0a2619]">Cotação de Evento Enviada!</h5>
                <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                  Sua solicitação já foi registrada no sistema <strong>Remoções Pro</strong>. Nossa equipe comercial retornará com a proposta.
                </p>
              </div>

              <div className="bg-slate-50 border border-dashed border-emerald-300 rounded-xl p-4 max-w-xs mx-auto">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                  Protocolo da Cotação
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
                onClick={handleResetAndClose}
                className="bg-[#0a2619] hover:bg-emerald-900 text-white py-2.5 px-8 rounded-xl text-xs font-bold transition-colors"
              >
                Concluir
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Nome e Local do Evento */}
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

              {/* Data e Horário de Início */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Data do Evento *</label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-8 pr-2 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                    />
                    <Calendar size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Horário de Início</label>
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
              </div>

              {/* Estrutura Solicitada */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 block">Estrutura Desejada</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {structureOptions.map((opt) => {
                    const active = structure === opt.id;
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
                          name="structure"
                          value={opt.id}
                          checked={active}
                          onChange={(e) => setStructure(e.target.value)}
                          className="hidden"
                        />
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <Ambulance size={14} className={active ? 'text-emerald-700' : 'text-slate-500'} />
                          <span className="font-bold text-[#0a2619] text-xs">{opt.title}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 leading-tight">{opt.desc}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Responsável, Telefone e E-mail */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Responsável *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={organizerName}
                      onChange={(e) => setOrganizerName(e.target.value)}
                      placeholder="Nome ou empresa"
                      className="w-full pl-8 pr-2.5 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                    />
                    <User size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

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
                  <label className="text-xs font-semibold text-slate-600">E-mail</label>
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

              {/* Observações */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Observações Adicionais (Opcional)</label>
                <textarea
                  rows={2}
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Exigências de alvará, quantidade de dias, necessidades específicas..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-md shadow-emerald-600/20 disabled:opacity-50"
              >
                <span>{loading ? 'Enviando para Remoções Pro...' : 'Solicitar Cotação de Evento'}</span>
                <CheckCircle2 size={16} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventQuoteModal;
