import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Send,
  Users,
  Building2,
  HeartPulse,
  Phone
} from 'lucide-react';
import { Page } from '../App';
import { submitQuotationToRemocoesPro } from '../lib/remocoesPro';

interface PlansProps {
  onNavigate: (page: Page) => void;
}

const planOptions = [
  {
    id: 'Plano Familiar',
    title: 'Plano Familiar',
    subtitle: 'Proteção para você e seus dependentes',
    icon: <HeartPulse className="text-emerald-600" size={28} />,
    tag: 'Mais Procurado',
    features: [
      'Cobertura 24h em Limeira e região',
      'Atendimento com Suporte Básico e UTI Móvel',
      'Acesso ao Portal do Credenciado',
      'Descontos especiais em remoções extras'
    ]
  },
  {
    id: 'Plano Empresarial / Área Protegida',
    title: 'Plano Empresarial',
    subtitle: 'Colaboradores e visitantes protegidos',
    icon: <Building2 className="text-emerald-600" size={28} />,
    tag: 'Corporativo',
    features: [
      'Cobertura integral no perímetro da empresa',
      'Certificado de Área Protegida Green',
      'Gestão de boletos e chamados no Portal',
      'Faturamento mensal simplificado'
    ]
  },
  {
    id: 'Plano Condomínios e Clínicas',
    title: 'Condomínios & Clínicas',
    subtitle: 'Segurança contínua para moradores e pacientes',
    icon: <Users className="text-emerald-600" size={28} />,
    tag: 'Institucional',
    features: [
      'Prontidão 24h sem limite de acionamentos',
      'Remoções inter-hospitalares facilitadas',
      'Relatórios e recibos centralizados',
      'Atendimento prioritário na central'
    ]
  }
];

const Plans: React.FC<PlansProps> = ({ onNavigate }) => {
  const [selectedPlan, setSelectedPlan] = useState('Plano Familiar');
  const [name, setName] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [livesCount, setLivesCount] = useState('1 a 5 pessoas');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [protocol, setProtocol] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Por favor, informe seu nome/empresa e telefone.');
      return;
    }

    setLoading(true);
    const result = await submitQuotationToRemocoesPro({
      origin: `Adesão ao ${selectedPlan}`,
      destination: `Plano Mensal - ${livesCount}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      patientName: name.trim(),
      patientAge: '',
      contactPhone: phone.trim(),
      email: email.trim(),
      observations: `[ASSINATURA DE PLANO] Plano: ${selectedPlan} | CPF/CNPJ: ${documentId || 'Não informado'} | Qtd: ${livesCount} | Obs: ${notes}`,
      serviceType: selectedPlan,
      source: 'plan_subscription'
    });
    setLoading(false);

    if (result.success) {
      setProtocol(result.protocol);
    } else {
      const msg = encodeURIComponent(
        `*Solicitação de Assinatura - ${selectedPlan}*\n\n*Nome/Empresa:* ${name}\n*CPF/CNPJ:* ${documentId}\n*Telefone:* ${phone}\n*E-mail:* ${email}\n*Vidas:* ${livesCount}\n*Obs:* ${notes}`
      );
      window.open(`https://wa.me/5519998049901?text=${msg}`, '_blank');
    }
  };

  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center space-x-2 text-emerald-700 hover:text-emerald-900 font-bold mb-10 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Voltar para Início</span>
        </button>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4">
            <ShieldCheck size={16} />
            <span>Planos de Remoção Mensal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#0a2619] mb-4 leading-tight">
            Assine seu Plano e Tenha <span className="text-emerald-600">Atendimento Prioritário 24h</span>
          </h1>
          <p className="text-emerald-900/70 text-lg font-medium">
            Escolha a modalidade ideal para sua família, empresa ou condomínio. Todas as solicitações vão direto para nossa central no Remoções Pro.
          </p>
        </div>

        {/* Cards de Planos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {planOptions.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`cursor-pointer rounded-[2rem] p-8 border-2 transition-all flex flex-col justify-between bg-white relative ${
                  isSelected
                    ? 'border-emerald-500 shadow-2xl shadow-emerald-900/10 ring-2 ring-emerald-500/20'
                    : 'border-emerald-100 shadow-lg hover:border-emerald-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
                      {plan.icon}
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-widest rounded-full">
                      {plan.tag}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-[#0a2619] mb-2">{plan.title}</h3>
                  <p className="text-sm text-emerald-900/60 font-medium mb-6">{plan.subtitle}</p>
                  <div className="space-y-3 mb-8">
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start space-x-2.5 text-sm text-[#0a2619] font-medium">
                        <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  {isSelected ? 'Plano Selecionado' : 'Selecionar Este Plano'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Formulário de Assinatura */}
        <div className="max-w-3xl mx-auto bg-white rounded-[2.5rem] shadow-2xl border border-emerald-100 p-8 md:p-12">
          {protocol ? (
            <div className="text-center py-8 animate-fadeIn">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={44} />
              </div>
              <h2 className="text-3xl font-black text-[#0a2619] mb-3">Proposta de Assinatura Enviada!</h2>
              <p className="text-emerald-900/70 max-w-md mx-auto mb-6">
                Sua solicitação para o <strong>{selectedPlan}</strong> já foi registrada no sistema <strong>Remoções Pro</strong>. Nossa equipe comercial entrará em contato para ativar seu cadastro de credenciado.
              </p>
              <div className="bg-emerald-50 border border-dashed border-emerald-300 rounded-2xl p-5 inline-block px-10 mb-8">
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1">Protocolo de Adesão</p>
                <p className="text-2xl font-black text-emerald-600 font-mono">{protocol.split('-')[0].toUpperCase()}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => onNavigate('accredited-area')}
                  className="bg-[#0a2619] text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-900 transition-colors"
                >
                  Ir para Área dos Credenciados
                </button>
                <button
                  onClick={() => setProtocol(null)}
                  className="bg-emerald-50 text-emerald-900 px-8 py-4 rounded-xl font-bold hover:bg-emerald-100 transition-colors"
                >
                  Fazer Outra Cotação
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-6">
              <div className="border-b border-emerald-100 pb-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-[#0a2619]">Solicitar Assinatura: {selectedPlan}</h2>
                  <p className="text-sm text-emerald-900/60">Preencha seus dados para receber o contrato e o primeiro boleto.</p>
                </div>
                <a
                  href="tel:1937923947"
                  className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl"
                >
                  <Phone size={16} />
                  <span>(19) 3792-3947</span>
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-emerald-900">Nome Completo ou Razão Social *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Maria Oliveira / Empresa LTDA"
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none bg-gray-50 focus:bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-emerald-900">CPF ou CNPJ</label>
                  <input
                    type="text"
                    value={documentId}
                    onChange={(e) => setDocumentId(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-emerald-900">Telefone de Contato *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(19) 99999-9999"
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none bg-gray-50 focus:bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-emerald-900">E-mail (para envio de boletos)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="financeiro@empresa.com.br"
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-emerald-900">Quantidade de Pessoas / Vidas</label>
                <select
                  value={livesCount}
                  onChange={(e) => setLivesCount(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none bg-gray-50 focus:bg-white"
                >
                  <option value="1 pessoa (Individual)">1 pessoa (Individual)</option>
                  <option value="2 a 5 pessoas (Familiar)">2 a 5 pessoas (Familiar)</option>
                  <option value="6 a 20 pessoas">6 a 20 pessoas</option>
                  <option value="21 a 100 pessoas">21 a 100 pessoas</option>
                  <option value="Acima de 100 pessoas">Acima de 100 pessoas</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-emerald-900">Observações Adicionais</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Cidade, necessidades específicas, horários..."
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none bg-gray-50 focus:bg-white resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-black text-base flex items-center justify-center space-x-2 transition-all shadow-xl shadow-emerald-600/20 disabled:opacity-50"
              >
                <span>{loading ? 'Enviando para Remoções Pro...' : 'Solicitar Assinatura do Plano'}</span>
                <Send size={18} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Plans;
