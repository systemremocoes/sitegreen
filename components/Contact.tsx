import React, { useState } from 'react';
import {
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  Ambulance,
  Copy,
  Check
} from 'lucide-react';
import { submitQuotationToRemocoesPro } from '../lib/remocoesPro';

interface ContactProps {
  onOpenRequestModal?: () => void;
}

const Contact: React.FC<ContactProps> = ({ onOpenRequestModal }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [messageText, setMessageText] = useState('');

  const [loading, setLoading] = useState(false);
  const [protocol, setProtocol] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

    setLoading(true);

    const result = await submitQuotationToRemocoesPro({
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
    });

    setLoading(false);

    if (result.success) {
      setProtocol(result.protocol);
      setName('');
      setPhone('');
      setServiceType('');
      setMessageText('');
    } else {
      setErrorMsg('Não foi possível registrar automaticamente. Tente novamente em instantes.');
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

              <h3 className="text-2xl font-bold mb-3 tracking-tight">Atendimento Comercial & Corporativo</h3>
              <p className="text-emerald-100/75 mb-8 text-sm leading-relaxed">
                Solicite propostas para Área Protegida, cobertura médica de eventos ou planos mensais diretamente para nossa central no Remoções Pro.
              </p>

              <div className="space-y-5">
                <div className="flex items-start space-x-3.5">
                  <div className="bg-emerald-800/50 p-2.5 rounded-xl text-emerald-400 shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-400 uppercase text-[11px] tracking-wider mb-0.5">E-mail Comercial</h4>
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

            {onOpenRequestModal && (
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-xs text-emerald-100/75 mb-3">Precisa de uma ambulância ou remoção agora?</p>
                <button
                  type="button"
                  onClick={onOpenRequestModal}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#0a2619] py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Ambulance size={16} />
                  <span>Abrir Formulário de Remoção</span>
                </button>
              </div>
            )}
          </div>

          {/* Form Side */}
          <div className="lg:w-7/12 p-8 md:p-10 relative">
            <div className="mb-6 pb-4 border-b border-slate-100">
              <h3 className="text-xl font-bold text-[#0a2619]">Solicitar Orçamento Comercial</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Para empresas, condomínios, planos mensais e cobertura de eventos.
              </p>
            </div>

            {protocol ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-7 text-center animate-fadeIn">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 size={30} />
                </div>
                <h4 className="text-xl font-bold text-[#0a2619] mb-1.5">Solicitação Registrada!</h4>
                <p className="text-slate-600 text-sm mb-5 max-w-md mx-auto">
                  Seu pedido comercial foi enviado para nossa central no sistema <strong>Remoções Pro</strong>. Nossa equipe dará prosseguimento em instantes.
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

                <div>
                  <button
                    type="button"
                    onClick={() => setProtocol(null)}
                    className="bg-[#0a2619] text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-emerald-900 transition-colors"
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
                    <label className="text-xs font-semibold text-slate-600">Seu Nome ou Empresa *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: João Silva / Empresa LTDA"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Telefone para Contato *</label>
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
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Detalhes da Solicitação</label>
                  <textarea
                    rows={3}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Conte-nos como podemos ajudar sua empresa ou evento..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md shadow-emerald-600/20 text-sm disabled:opacity-50"
                >
                  <span>{loading ? 'Enviando para Remoções Pro...' : 'Enviar Orçamento Comercial'}</span>
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
