import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Ambulance,
  Phone,
  Search,
  Truck,
  AlertCircle,
  FileText,
  Download,
  DollarSign,
  ClipboardCheck,
  MessageCircle,
  User,
  Zap,
  Stethoscope,
  HeartPulse,
  Copy,
  Check
} from 'lucide-react';
import {
  submitQuotationToRemocoesPro,
  fetchRemovalTracking,
  formatProtocol,
  openRemovalDocument,
  TrackingCodeRequiredError
} from '../lib/remocoesPro';
import TomadorFields, { TomadorData, emptyTomador, validarTomador, tomadorPayload } from '../components/TomadorFields';

interface ScheduleProps {
  initialTab?: 'schedule' | 'tracking';
}

const ambulanceTypes = [
  {
    id: 'simples',
    title: 'Suporte Básico (Tipo B)',
    desc: 'Téc. Enfermagem + Condutor • Altas e exames',
    icon: Ambulance
  },
  {
    id: 'siv',
    title: 'Intermediário (SIV)',
    desc: 'Enfermeiro + Condutor • Medicação e oxigênio',
    icon: Stethoscope
  },
  {
    id: 'uti',
    title: 'UTI Móvel (Tipo D)',
    desc: 'Médico + Enfermeiro • Casos graves',
    icon: HeartPulse
  }
];

const Schedule: React.FC<ScheduleProps> = ({ initialTab = 'schedule' }) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'tracking'>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    date: '',
    time: '',
    patientName: '',
    patientAge: '',
    contactPhone: '',
    email: '',
    observations: '',
    serviceType: 'simples'
  });

  // Quem paga a remoção (boleto e nota fiscal)
  const [tomador, setTomador] = useState<TomadorData>(emptyTomador);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successProtocol, setSuccessProtocol] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [trackingCode, setTrackingCode] = useState('');
  const [trackingVerifier, setTrackingVerifier] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [downloadingDoc, setDownloadingDoc] = useState<number | null>(null);

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

  const handleCopyProtocol = () => {
    if (!successProtocol) return;
    navigator.clipboard.writeText(formatProtocol(successProtocol));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitSchedule = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.origin.trim() || !formData.destination.trim() || !formData.patientName.trim() || !formData.contactPhone.trim()) {
      alert('Por favor, preencha origem, destino, nome do paciente e telefone de contato.');
      return;
    }
    const faltaTomador = validarTomador(tomador, formData.patientName);
    if (faltaTomador.length) {
      alert(`Para faturar e emitir a nota fiscal, preencha: ${faltaTomador.join(', ')}.`);
      return;
    }

    setLoading(true);
    try {
      const result = await submitQuotationToRemocoesPro({
        ...formData,
        cpf: tomador.cnpj_cpf.replace(/\D/g, ''),
        tomador: tomadorPayload(tomador, formData.patientName),
        date: formData.date || new Date().toISOString().split('T')[0],
        time: formData.time || new Date().toTimeString().slice(0, 5),
        source: 'schedule_page'
      });

      if (!result.success) {
        throw new Error(result.error || 'Falha desconhecida');
      }

      setSuccessProtocol(result.protocol);
      setSuccess(true);
    } catch (error) {
      console.error('Erro ao agendar:', error);
      alert(`Erro ao processar: ${error instanceof Error ? error.message : 'Falha desconhecida'}.`);
      const message = `*Solicitação de Remoção (Site)*%0A%0A*Paciente:* ${formData.patientName}%0A*Telefone:* ${formData.contactPhone}%0A*Origem:* ${formData.origin}%0A*Destino:* ${formData.destination}%0A*Data/Hora:* ${formData.date} ${formData.time}%0A*Tipo:* ${formData.serviceType}`;
      window.open(`https://wa.me/5519998049901?text=${message}`, '_blank');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setSuccessProtocol(null);
    setCopied(false);
    setFormData({
      origin: '',
      destination: '',
      date: '',
      time: '',
      patientName: '',
      patientAge: '',
      contactPhone: '',
      email: '',
      observations: '',
      serviceType: 'simples'
    });
  };

  // Segunda etapa da consulta: código enviado ao e-mail cadastrado na solicitação
  const [trackCodeStep, setTrackCodeStep] = useState<string | null>(null);
  const [trackCodeInput, setTrackCodeInput] = useState('');

  const runTrackingSearch = async (codigo?: string) => {
    setIsSearching(true);
    setTrackingResult(null);

    try {
      const data = await fetchRemovalTracking(trackingCode, trackingVerifier, codigo ? { codigo } : {});
      setTrackingResult(data);
      setTrackCodeStep(null);
      setTrackCodeInput('');
    } catch (error: any) {
      if (error instanceof TrackingCodeRequiredError) {
        setTrackCodeStep(error.message);
        setTrackCodeInput('');
      } else {
        console.error(error);
        setTrackingResult({ error: error.message || 'Protocolo não encontrado ou dados de verificação incorretos.' });
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleTrackingSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await runTrackingSearch(trackCodeStep ? trackCodeInput : undefined);
  };

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0a2619] mb-2">
            Solicitação de Remoção Online
          </h1>
          <p className="text-slate-600 text-sm md:text-base">
            Preencha os dados em uma única tela ou acompanhe sua remoção pelo protocolo.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1.5 rounded-xl shadow-sm border border-slate-200 flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-6 py-2.5 rounded-lg font-bold text-sm flex items-center transition-all ${activeTab === 'schedule'
                ? 'bg-[#0a2619] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              <Calendar className="mr-2" size={16} />
              Solicitar Remoção
            </button>
            <button
              onClick={() => setActiveTab('tracking')}
              className={`px-6 py-2.5 rounded-lg font-bold text-sm flex items-center transition-all ${activeTab === 'tracking'
                ? 'bg-[#0a2619] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              <Search className="mr-2" size={16} />
              Acompanhar Protocolo
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="relative bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {/* TAB: AGENDAMENTO ÚNICO */}
          {activeTab === 'schedule' && (
            <div className="p-6 md:p-10 animate-fadeIn">
              {success ? (
                <div className="py-8 text-center space-y-5 animate-fadeIn">
                  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto">
                    <CheckCircle2 size={36} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-[#0a2619] mb-2">Solicitação Enviada!</h3>
                    <p className="text-slate-600 text-sm max-w-md mx-auto">
                      Recebemos seu pedido no sistema <strong>Remoções Pro</strong>. Nossa central já está analisando a disponibilidade.
                    </p>
                  </div>

                  {successProtocol && (
                    <div className="bg-slate-50 border border-dashed border-emerald-300 rounded-xl p-5 inline-flex items-center gap-3 px-8">
                      <div className="text-left">
                        <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                          Protocolo de Rastreamento
                        </p>
                        <p className="text-xl font-extrabold text-[#0a2619] font-mono">
                          {formatProtocol(successProtocol)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyProtocol}
                        className="p-2 rounded-lg bg-white border border-slate-200 hover:border-emerald-400 text-slate-600"
                        title="Copiar protocolo"
                      >
                        {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                      </button>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                    <button
                      onClick={() => {
                        const message = `*Nova Solicitação (Site)*%0A%0A*Protocolo:* ${formatProtocol(successProtocol)}%0A*Paciente:* ${formData.patientName}%0A*Origem:* ${formData.origin}%0A*Destino:* ${formData.destination}%0A*Data:* ${formData.date} às ${formData.time}%0A*Tipo:* ${formData.serviceType}`;
                        window.open(`https://wa.me/5519998049901?text=${message}`, '_blank');
                      }}
                      className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={18} />
                      <span>Enviar no WhatsApp</span>
                    </button>

                    <button
                      onClick={resetForm}
                      className="bg-slate-100 text-slate-800 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
                    >
                      Nova Solicitação
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitSchedule} className="space-y-6">
                  {/* Bloco 1: Trajeto & Horário */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h2 className="text-base font-bold text-[#0a2619]">1. Trajeto e Horário</h2>
                      <button
                        type="button"
                        onClick={fillNow}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-lg transition-colors"
                      >
                        <Zap size={13} />
                        <span>Atendimento Imediato (Agora)</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">Origem *</label>
                        <div className="relative">
                          <input
                            type="text"
                            name="origin"
                            required
                            value={formData.origin}
                            onChange={handleInputChange}
                            placeholder="Endereço ou hospital de retirada"
                            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                          />
                          <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600" />
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
                            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                          />
                          <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">Data</label>
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">Horário</label>
                        <input
                          type="time"
                          name="time"
                          value={formData.time}
                          onChange={handleInputChange}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bloco 2: Dados do Paciente */}
                  <div className="space-y-4">
                    <h2 className="text-base font-bold text-[#0a2619] border-b border-slate-100 pb-2">
                      2. Dados do Paciente e Contato
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div className="space-y-1 md:col-span-3">
                        <label className="text-xs font-semibold text-slate-600">Nome Completo do Paciente *</label>
                        <div className="relative">
                          <input
                            type="text"
                            name="patientName"
                            required
                            value={formData.patientName}
                            onChange={handleInputChange}
                            placeholder="Nome completo"
                            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                          />
                          <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>

                      <div className="space-y-1 md:col-span-1">
                        <label className="text-xs font-semibold text-slate-600">Idade</label>
                        <input
                          type="number"
                          name="patientAge"
                          value={formData.patientAge}
                          onChange={handleInputChange}
                          placeholder="Ex: 65"
                          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                        />
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="text-xs font-semibold text-slate-600">Telefone Responsável *</label>
                        <div className="relative">
                          <input
                            type="tel"
                            name="contactPhone"
                            required
                            value={formData.contactPhone}
                            onChange={handleInputChange}
                            placeholder="(19) 99999-9999"
                            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                          />
                          <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">E-mail para Confirmação (Opcional)</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="exemplo@email.com"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                        />
                      </div>

                      <TomadorFields value={tomador} onChange={setTomador} />

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">Observações Médicas (Opcional)</label>
                        <input
                          type="text"
                          name="observations"
                          value={formData.observations}
                          onChange={handleInputChange}
                          placeholder="Uso de oxigênio, acamado, andar sem elevador..."
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bloco 3: Tipo de Ambulância */}
                  <div className="space-y-3">
                    <h2 className="text-base font-bold text-[#0a2619] border-b border-slate-100 pb-2">
                      3. Tipo de Ambulância *
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {ambulanceTypes.map((amb) => {
                        const active = formData.serviceType === amb.id;
                        const IconComp = amb.icon;
                        return (
                          <label
                            key={amb.id}
                            className={`flex items-start p-3.5 border rounded-xl cursor-pointer transition-all ${active
                              ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600'
                              : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                              }`}
                          >
                            <input
                              type="radio"
                              name="serviceType"
                              value={amb.id}
                              checked={active}
                              onChange={handleInputChange}
                              className="hidden"
                            />
                            <div
                              className={`p-2 rounded-lg mr-3 shrink-0 ${active ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                                }`}
                            >
                              <IconComp size={18} />
                            </div>
                            <div>
                              <p className="font-bold text-[#0a2619] text-sm">{amb.title}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{amb.desc}</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                  >
                    <span>{loading ? 'Enviando para Remoções Pro...' : 'Confirmar Solicitação de Remoção'}</span>
                    <CheckCircle2 size={18} />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB: RASTREAMENTO E DOCUMENTOS */}
          {activeTab === 'tracking' && (
            <div className="p-8 md:p-10 animate-fadeIn flex flex-col items-center min-h-[400px]">
              {(!trackingResult || trackingResult.error) && (
                <div className="w-full max-w-md flex flex-col items-center">
                  <div className="bg-emerald-50 p-3.5 rounded-full text-emerald-600 mb-4">
                    <Search size={32} />
                  </div>
                  <h2 className="text-2xl font-extrabold text-[#0a2619] mb-2 text-center">Rastreamento & Documentos</h2>
                  <p className="text-slate-600 text-center text-sm mb-6">
                    Por segurança (LGPD), digite o número do <strong>Protocolo</strong> e o <strong>Telefone ou CPF</strong> do solicitante.
                  </p>

                  <form onSubmit={handleTrackingSearch} className="w-full space-y-3">
                    <input
                      type="text"
                      required
                      placeholder="Protocolo (Ex: #1A2B3C4D)"
                      value={trackingCode}
                      onChange={(e) => setTrackingCode(e.target.value)}
                      className="w-full text-center text-base font-bold tracking-wider uppercase px-5 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none bg-slate-50 focus:bg-white"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Telefone (com DDD) ou CPF do solicitante"
                      value={trackingVerifier}
                      disabled={!!trackCodeStep}
                      onChange={(e) => setTrackingVerifier(e.target.value)}
                      className="w-full text-center text-sm font-medium px-5 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none bg-slate-50 focus:bg-white"
                    />
                    {trackCodeStep && (
                      <div className="space-y-2">
                        <p className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-lg p-2.5">{trackCodeStep}</p>
                        <input
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          required
                          maxLength={6}
                          value={trackCodeInput}
                          onChange={(e) => setTrackCodeInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="Código do e-mail"
                          className="w-full text-center text-2xl font-bold tracking-[0.4em] px-5 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none bg-slate-50 focus:bg-white"
                        />
                        <div className="flex justify-between text-xs font-bold">
                          <button type="button" disabled={isSearching} onClick={() => runTrackingSearch()} className="text-emerald-700 hover:underline disabled:opacity-50">
                            Reenviar código
                          </button>
                          <button type="button" onClick={() => { setTrackCodeStep(null); setTrackCodeInput(''); }} className="text-slate-500 hover:underline">
                            Corrigir dados
                          </button>
                        </div>
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isSearching || (!!trackCodeStep && trackCodeInput.length !== 6)}
                      className="w-full bg-[#0a2619] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-emerald-900 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <span>{isSearching ? 'Validando...' : trackCodeStep ? 'Confirmar código' : 'Localizar Transporte'}</span>
                      {!isSearching && <ArrowRight size={16} />}
                    </button>
                  </form>

                  {trackingResult?.error && (
                    <div className="mt-6 flex items-center gap-2 text-red-600 font-semibold bg-red-50 px-4 py-2.5 rounded-xl text-sm">
                      <AlertCircle size={18} />
                      <span>{trackingResult.error}</span>
                    </div>
                  )}
                </div>
              )}

              {trackingResult && trackingResult.valid && (
                <div className="w-full animate-slideUp">
                  <button
                    onClick={() => {
                      setTrackingCode('');
                      setTrackingVerifier('');
                      setTrackingResult(null);
                    }}
                    className="mb-6 flex items-center text-slate-500 hover:text-emerald-600 font-bold text-sm transition-colors"
                  >
                    <ArrowLeft size={16} className="mr-1" /> Nova Pesquisa
                  </button>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
                          <div>
                            <span className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase mb-1">
                              Protocolo • {trackingResult.status}
                            </span>
                            <p className="text-xl font-extrabold text-[#0a2619] font-mono break-all">{formatProtocol(trackingResult.protocol)}</p>
                          </div>
                          <div className="bg-emerald-50 p-2.5 rounded-xl shrink-0">
                            <Truck size={24} className="text-emerald-600" />
                          </div>
                        </div>

                        <div className="space-y-2.5 text-sm">
                          <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl gap-3">
                            <span className="text-slate-500">Paciente</span>
                            <span className="text-[#0a2619] font-bold text-right">{trackingResult.patient}</span>
                          </div>
                          <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl gap-3">
                            <span className="text-slate-500">Origem</span>
                            <span className="text-[#0a2619] font-semibold text-right">{trackingResult.origin}</span>
                          </div>
                          <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl gap-3">
                            <span className="text-slate-500">Destino</span>
                            <span className="text-[#0a2619] font-semibold text-right">{trackingResult.destination}</span>
                          </div>
                          <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-xl border border-emerald-100 gap-3">
                            <span className="text-emerald-700 font-bold">Ambulância</span>
                            <span className="text-emerald-800 font-bold text-right">{trackingResult.vehicle}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-white border border-slate-200 rounded-2xl p-6">
                        <h3 className="font-bold text-[#0a2619] mb-4 flex items-center gap-2 text-sm">
                          <Clock size={18} className="text-emerald-600" />
                          Andamento
                        </h3>
                        <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:h-[88%] before:w-0.5 before:bg-slate-100">
                          {trackingResult.history?.map((item: any, idx: number) => (
                            <div key={idx} className="relative flex items-start gap-3.5">
                              <div
                                className={`w-6 h-6 rounded-full border-4 shrink-0 z-10 ${item.completed ? 'bg-emerald-500 border-white shadow-sm' : 'bg-slate-200 border-white'
                                  }`}
                              />
                              <div className={!item.completed ? 'opacity-45' : ''}>
                                <p className="font-bold text-[#0a2619] text-sm">{item.label}</p>
                                <p className="text-xs text-slate-500">{item.date}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-2xl p-6">
                        <h3 className="font-bold text-[#0a2619] mb-4 flex items-center gap-2 text-sm">
                          <FileText size={18} className="text-emerald-600" />
                          Documentos
                        </h3>
                        <div className="space-y-2.5">
                          {[
                            { key: 'proposal' as const, name: 'Proposta Comercial', icon: FileText },
                            { key: 'fatura' as const, name: 'Fatura / Boleto / Recibo', icon: DollarSign }
                          ].map((doc, idx) => {
                            const IconComp = doc.icon;
                            return (
                              <button
                                key={doc.key}
                                type="button"
                                disabled={downloadingDoc === idx}
                                onClick={async () => {
                                  try {
                                    setDownloadingDoc(idx);
                                    await openRemovalDocument(trackingResult.protocol, doc.key, trackingVerifier, { accessToken: trackingResult.accessToken });
                                  } catch (err: any) {
                                    alert(err?.message || 'Documento indisponível no momento.');
                                  } finally {
                                    setDownloadingDoc(null);
                                  }
                                }}
                                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-emerald-200 transition-all text-left disabled:opacity-50"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                                    <IconComp size={16} />
                                  </div>
                                  <span className="font-bold text-sm text-[#0a2619]">{doc.name}</span>
                                </div>
                                {downloadingDoc === idx ? (
                                  <span className="block w-4 h-4 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
                                ) : (
                                  <Download size={18} className="text-emerald-600" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
