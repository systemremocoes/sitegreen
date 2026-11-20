import React, { useState } from 'react';
import {
  Search,
  ShieldCheck,
  Lock,
  ArrowRight,
  FileText,
  Receipt,
  Ambulance,
  AlertCircle,
  Sparkles,
  Phone,
  KeyRound
} from 'lucide-react';
import { Page } from '../App';
import { normalizeDigits, credenciadoLogin, saveCredenciadoSession } from '../lib/remocoesPro';

interface ClientPortalProps {
  onNavigate: (page: Page) => void;
  onSelectRemovalLookup: (protocol: string, verifier: string) => void;
}

const ClientPortal: React.FC<ClientPortalProps> = ({ onNavigate, onSelectRemovalLookup }) => {
  // Card 1: Remoções Avulsas (Protocolo + Telefone/CPF)
  const [protocolInput, setProtocolInput] = useState('');
  const [verifierInput, setVerifierInput] = useState('');
  const [protocolError, setProtocolError] = useState('');

  // Card 2: Credenciado
  const [docInput, setDocInput] = useState('');
  const [contractInput, setContractInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const handleClientSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = normalizeDigits(verifierInput);
    if (!protocolInput.trim()) {
      setProtocolError('Informe o número do protocolo para consultar sua remoção.');
      return;
    }
    if (digits.length < 8) {
      setProtocolError('Informe o Telefone (com DDD) ou CPF completo do solicitante para validar o acesso.');
      return;
    }
    setProtocolError('');
    onSelectRemovalLookup(protocolInput.trim(), verifierInput.trim());
  };

  const handleAccreditedLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docInput.trim() || !contractInput.trim()) {
      setLoginError('Informe o CPF/CNPJ e o código de acesso do portal.');
      return;
    }

    setLoginError('');
    setLoginLoading(true);
    try {
      const auth = await credenciadoLogin(docInput.trim(), contractInput.trim());
      saveCredenciadoSession(auth);
      onNavigate('accredited-area');
    } catch (err: any) {
      setLoginError(err?.message || 'Credenciais inválidas ou contrato inativo.');
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho Padronizado */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            Acesso Protegido • LGPD
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0a2619] mb-3">
            Área do Cliente
          </h1>
          <p className="text-base text-emerald-950/70">
            Selecione o seu perfil de acesso abaixo para acompanhar remoções avulsas com segurança ou gerenciar seu plano mensal de credenciado.
          </p>
        </div>

        {/* Dois Cards de Login Lado a Lado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* CARD 1: CLIENTES (REMOÇÕES AVULSAS) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 pb-6 mb-6 border-b border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <KeyRound size={24} />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                    Remoções Avulsas
                  </span>
                  <h2 className="text-xl font-bold text-[#0a2619]">
                    Consultar Minhas Remoções
                  </h2>
                </div>
              </div>

              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                <p className="text-sm font-bold text-[#0a2619] mb-1">Minha Conta</p>
                <p className="text-xs text-emerald-950/70 mb-3">
                  Cadastre-se para solicitar remoções, aprovar orçamentos e pagar boletos ou PIX. O acesso é por código enviado ao seu e-mail.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('client-account')}
                  className="w-full bg-[#0a2619] hover:bg-emerald-900 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <KeyRound size={16} />
                  <span>Entrar ou criar cadastro</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Ou consulte uma remoção pelo protocolo</p>
              <p className="text-sm text-slate-600 leading-relaxed mb-5">
                Para proteger os dados do paciente, a consulta exige o <strong>Protocolo</strong> junto com o <strong>Telefone ou CPF</strong> informado na solicitação.
              </p>

              {protocolError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{protocolError}</span>
                </div>
              )}

              <form onSubmit={handleClientSearch} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-[#0a2619]">
                    Número do Protocolo *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={protocolInput}
                      onChange={(e) => setProtocolInput(e.target.value)}
                      placeholder="Ex: REM123 ou código do pedido"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 outline-none text-sm font-medium text-[#0a2619] transition-all"
                    />
                    <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-[#0a2619]">
                    Telefone (com DDD) ou CPF do Solicitante *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={verifierInput}
                      onChange={(e) => setVerifierInput(e.target.value)}
                      placeholder="(19) 99999-9999 ou 000.000.000-00"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 outline-none text-sm font-medium text-[#0a2619] transition-all"
                    />
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>Validar e Ver Remoção</span>
                  <ArrowRight size={17} />
                </button>
              </form>

              <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5 text-xs text-slate-500">
                <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Nenhum dado de paciente fica salvo neste computador após fechar a consulta.
                </span>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Precisa agendar uma nova remoção?</span>
              <button
                type="button"
                onClick={() => onNavigate('schedule')}
                className="font-bold text-emerald-700 hover:underline"
              >
                Solicitar Agora
              </button>
            </div>
          </div>

          {/* CARD 2: CREDENCIADOS (PLANO MENSAL) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 pb-6 mb-6 border-b border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-[#0a2619] text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                    Assinantes do Plano Mensal
                  </span>
                  <h2 className="text-xl font-bold text-[#0a2619]">
                    Área dos Credenciados
                  </h2>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Acesso exclusivo para empresas, clínicas, condomínios e famílias credenciadas. Consulte boletos, solicite remoções e acompanhe seu contrato.
              </p>

              <div className="grid grid-cols-3 gap-2.5 mb-6">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-center">
                  <Receipt size={16} className="text-emerald-600 mx-auto mb-1" />
                  <span className="text-xs font-semibold text-slate-700 block">Boletos</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-center">
                  <Ambulance size={16} className="text-emerald-600 mx-auto mb-1" />
                  <span className="text-xs font-semibold text-slate-700 block">Solicitar</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-center">
                  <FileText size={16} className="text-emerald-600 mx-auto mb-1" />
                  <span className="text-xs font-semibold text-slate-700 block">Histórico</span>
                </div>
              </div>

              {loginError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleAccreditedLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-[#0a2619]">
                    CPF ou CNPJ do Titular
                  </label>
                  <input
                    type="text"
                    value={docInput}
                    onChange={(e) => setDocInput(e.target.value)}
                    placeholder="000.000.000-00 ou 00.000.000/0001-00"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 outline-none text-sm font-medium text-[#0a2619] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-[#0a2619]">
                    Código de Acesso do Portal
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={contractInput}
                      onChange={(e) => setContractInput(e.target.value)}
                      placeholder="Ex.: ABCDE-12345"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 outline-none text-sm font-medium text-[#0a2619] transition-all"
                    />
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full bg-[#0a2619] hover:bg-emerald-900 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
                >
                  <span>{loginLoading ? 'Autenticando...' : 'Entrar como Credenciado'}</span>
                  {!loginLoading && <ArrowRight size={17} />}
                </button>
              </form>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Ainda não é credenciado?</span>
              <button
                type="button"
                onClick={() => onNavigate('plans')}
                className="font-bold text-emerald-700 hover:underline"
              >
                Assinar Plano Mensal
              </button>
            </div>
          </div>
        </div>

        {/* Rodapé de Apoio Telefônico */}
        <div className="mt-10 text-center">
          <p className="text-sm text-slate-500 inline-flex items-center gap-2">
            <Phone size={15} className="text-emerald-600" />
            <span>Dúvidas no acesso? Ligue para nossa Central 24h:</span>
            <a href="tel:1937923947" className="font-bold text-[#0a2619] hover:text-emerald-700">
              (19) 3792-3947
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientPortal;
