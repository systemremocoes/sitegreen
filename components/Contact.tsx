import React, { useState } from 'react';
import {
  Mail,
  MapPin,
  Phone,
  Send,
  CheckCircle2,
  MessageCircle,
  Ambulance,
  Building2,
  Zap,
  Copy,
  Check
} from 'lucide-react';
import { submitQuotationToRemocoesPro } from '../lib/remocoesPro';

const Contact: React.FC = () => {
  const [mode, setMode] = useState<'removal' | 'commercial'>('removal');

  // Campos comuns / comerciais
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [messageText, setMessageText] = useState('');

  // Campos específicos de remoção
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [ambulanceType, setAmbulanceType] = useState('simples');

  const [loading, setLoading] = useState(false);
  const [protocol, setProtocol] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fillNow = () => {
    const now = new Date();
    setDate(now.toISOString().split('T')[0]);
    setTime(now.toTimeString().slice(0, 5));
  };

  const handleCopyProtocol = () => {
    if (!protocol) return;
    navigator.clipboard.writeText(protocol.split('-')[0].toUpperCase());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !phone.trim()) {
      setErrorMsg('Por favor, informe o nome e o telefone de contato.');
      return;
    }

    if (mode === 'removal' && (!origin.trim() || !destination.trim())) {
      setErrorMsg('Por favor, informe os endereços de origem e destino da remoção.');
      return;
    }

    setLoading(true);

    const payload =
      mode === 'removal'
        ? {
            origin: origin.trim(),
            destination: destination.trim(),
            date: date || new Date().toISOString().split('T')[0],
            time: time || new Date().toTimeString().slice(0, 5),
            patientName: name.trim(),
            patientAge: '',
            contactPhone: phone.trim(),
            email: '',
            observations: messageText.trim(),
            serviceType: ambulanceType,
            source: 'home_removal_form'
          }
        : {
            origin: 'Contato Comercial (Site)',
            destination: serviceType || 'Orçamento Comercial',
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().slice(0, 5),
            patientName: name.trim(),
            patientAge: '',
            contactPhone: phone.trim(),
            email: '',
            observations: `[Orçamento Comercial - ${serviceType || 'Geral'}] ${messageText.trim()}`,
            serviceType: serviceType || 'Orçamento Comercial',
            source: 'contact_form'
          };

    const result = await submitQuotationToRemocoesPro(payload);
    setLoading(false);

    if (result.success) {
      setProtocol(result.protocol);
      setName('');
      setPhone('');
      setServiceType('');
      setMessageText('');
      setOrigin('');
      setDestination('');
      setDate('');
      setTime('');
    } else {
      setErrorMsg('Não foi possível registrar automaticamente. Redirecionando para o WhatsApp da central.');
      const waText =
        mode === 'removal'
          ? `*Solicitação de Remoção (Site)*\n\n*Paciente/Solicitante:* ${name}\n*Telefone:* ${phone}\n*Origem:* ${origin}\n*Destino:* ${destination}\n*Data/Hora:* ${date} ${time}\n*Unidade:* ${ambulanceType}\n*Obs:* ${messageText}`
          : `*Orçamento Comercial (Site)*\n\n*Nome:* ${name}\n*Telefone:* ${phone}\n*Serviço:* ${serviceType}\n*Mensagem:* ${messageText}`;
      window.open(`https://wa.me/5519998049901?text=${encodeURIComponent(waText)}`, '_blank');
    }
  };

  return (
    <div className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col lg:flex-row border border-slate-200">
          {/* Info Side */}
          <div className="lg:w-5/12 bg-[#0a2619] p-8 md:p-10 text-white flex flex-col justify-between">
            <div>
              <span className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-400/25 text-emerald-300 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Central 24h • Limeira e Região
              </span>

              <h3 className="text-2xl font-bold mb-3 tracking-tight">Atendimento Imediato</h3>
              <p className="text-emerald-100/75 mb-8 text-sm leading-relaxed">
                Solicite uma remoção com ambulância ou peça um orçamento comercial para sua empresa, condomínio ou evento. Tudo integrado ao Remoções Pro.
              </p>

              <div className="space-y-5">
                <div className="flex items-start space-x-3.5">
                  <div className="bg-emerald-800/50 p-2.5 rounded-xl text-emerald-400 shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-400 uppercase text-[11px] tracking-wider mb-0.5">Central Telefônica 24h</h4>
                    <a href="tel:1937923947" className="text-white text-lg font-bold hover:text-emerald-300 transition-colors">
                      (19) 3792-3947
                    </a>
                  </div>
                </div>

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

            <div className="mt-8 pt-6 border-t border-white/10 text-xs text-emerald-100/60">
              Frota própria homologada (UTI Móvel Tipo D, SIV e Suporte Básico Tipo B).
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:w-7/12 p-8 md:p-10 relative">
            {/* Switcher de Modo */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-[#0a2619]">
                  {mode === 'removal' ? 'Solicitar Remoção' : 'Solicitar Orçamento Comercial'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {mode === 'removal'
                    ? 'Preencha os dados do trajeto para envio imediato à central.'
                    : 'Para planos mensais, área protegida e cobertura de eventos.'}
                </p>
              </div>

              <div className="inline-flex bg-slate-100 p-1 rounded-xl shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setMode('removal');
                    setProtocol(null);
                    setErrorMsg(null);
                  }}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    mode === 'removal'
                      ? 'bg-[#0a2619] text-white shadow-sm'
                      : 'text-slate-600 hover:text-[#0a2619]'
                  }`}
                >
                  <Ambulance size={14} />
                  <span>Remoção</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('commercial');
                    setProtocol(null);
                    setErrorMsg(null);
                  }}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    mode === 'commercial'
                      ? 'bg-[#0a2619] text-white shadow-sm'
                      : 'text-slate-600 hover:text-[#0a2619]'
                  }`}
                >
                  <Building2 size={14} />
                  <span>Comercial</span>
                </button>
              </div>
            </div>

            {protocol ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-7 text-center animate-fadeIn">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 size={30} />
                </div>
                <h4 className="text-xl font-bold text-[#0a2619] mb-1.5">Solicitação Registrada!</h4>
                <p className="text-slate-600 text-sm mb-5 max-w-md mx-auto">
                  Seu pedido já foi enviado para a nossa central no sistema <strong>Remoções Pro</strong>. Nossa equipe dará prosseguimento ao atendimento em instantes.
                </p>

                <div className="bg-white border border-dashed border-emerald-300 rounded-xl p-4 mb-6 inline-flex items-center gap-3 px-6">
                  <div className="text-left">
                    <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Protocolo</p>
                    <p className="text-lg font-extrabold text-[#0a2619] font-mono">
                      {protocol.split('-')[0].toUpperCase()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyProtocol}
                    className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-emerald-400 text-slate-600 transition-colors"
                    title="Copiar protocolo"
                  >
                    {copied ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={`https://wa.me/5519998049901?text=${encodeURIComponent(
                      `Olá! Acabei de enviar uma solicitação pelo site. Protocolo: ${protocol}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={16} />
                    <span>Acompanhar no WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setProtocol(null)}
                    className="bg-white text-[#0a2619] border border-slate-200 px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-50 transition-colors"
                  >
                    Nova Solicitação
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">
                      {mode === 'removal' ? 'Nome do Paciente / Solicitante *' : 'Seu Nome ou Empresa *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: João Silva"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Telefone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(19) 99999-9999"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                    />
                  </div>
                </div>

                {mode === 'removal' ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">Endereço / Hospital de Origem *</label>
                        <input
                          type="text"
                          required
                          value={origin}
                          onChange={(e) => setOrigin(e.target.value)}
                          placeholder="Local de retirada"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">Endereço / Hospital de Destino *</label>
                        <input
                          type="text"
                          required
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          placeholder="Local de destino"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-slate-600">Data</label>
                          <button
                            type="button"
                            onClick={fillNow}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900"
                          >
                            <Zap size={11} />
                            <span>Agora</span>
                          </button>
                        </div>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">Horário</label>
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">Tipo de Ambulância</label>
                        <select
                          value={ambulanceType}
                          onChange={(e) => setAmbulanceType(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                        >
                          <option value="simples">Suporte Básico (Tipo B)</option>
                          <option value="siv">Intermediário (SIV)</option>
                          <option value="uti">UTI Móvel (Tipo D)</option>
                        </select>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Tipo de Serviço</label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                    >
                      <option value="">Selecione uma opção</option>
                      <option value="Área Protegida para Empresa">Área Protegida para Empresa</option>
                      <option value="Plano de Remoção Mensal">Plano de Remoção Mensal (Assinatura)</option>
                      <option value="Cobertura de Eventos">Cobertura de Eventos</option>
                      <option value="Remoção Programada">Remoção Programada</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">
                    {mode === 'removal' ? 'Observações Clínicas (Opcional)' : 'Detalhes da Solicitação'}
                  </label>
                  <textarea
                    rows={2}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={
                      mode === 'removal'
                        ? 'Paciente acamado, uso de oxigênio, andar sem elevador...'
                        : 'Conte-nos como podemos ajudar sua empresa ou evento...'
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md shadow-emerald-600/20 text-sm disabled:opacity-50"
                >
                  <span>
                    {loading
                      ? 'Enviando para Remoções Pro...'
                      : mode === 'removal'
                      ? 'Solicitar Remoção Agora'
                      : 'Enviar Orçamento Comercial'}
                  </span>
                  <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
