import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  Receipt,
  Ambulance,
  ClipboardList,
  LogOut,
  Copy,
  Check,
  ExternalLink,
  Search,
  Send,
  CheckCircle2,
  CreditCard,
  AlertCircle,
  Lock,
  RefreshCw,
  QrCode,
  FileText
} from 'lucide-react';
import { Page } from '../App';
import {
  submitQuotationToRemocoesPro,
  formatProtocol,
  fetchRemovalTracking,
  openRemovalDocument,
  getAccreditedProtocols,
  SavedProtocol,
  credenciadoLogin,
  fetchCredenciadoBoletos,
  CredenciadoLoginResult,
  CredenciadoBoletosResponse,
  NormalizedTracking,
  saveCredenciadoSession,
  loadCredenciadoSession,
  clearCredenciadoSession,
  maskSecret,
  safeExternalUrl,
  EdgeFunctionError,
  fetchCredenciadoRemocoes,
  credenciadoEnviarCodigo,
  verificarCobrancaExtra,
  CobrancaExtraCheck,
  QuotationPayload,
  CredenciadoPlano,
  CredenciadoTitular,
  PortalSolicitacao
} from '../lib/remocoesPro';

interface AccreditedAreaProps {
  onNavigate: (page: Page) => void;
}

function formatBRL(value: number | null | undefined): string {
  return (Number(value) || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function formatDateBR(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  } catch {
    return dateStr;
  }
}

const AccreditedArea: React.FC<AccreditedAreaProps> = ({ onNavigate }) => {
  const [session, setSession] = useState<CredenciadoLoginResult | null>(null);
  const [docInput, setDocInput] = useState('');
  const [contractInput, setContractInput] = useState('');
  const [codeRequesting, setCodeRequesting] = useState(false);
  const [codeMessage, setCodeMessage] = useState('');
  const [plano, setPlano] = useState<CredenciadoPlano | null>(null);
  // Remoção fora do plano: aviso e aceite da cobrança à parte
  const [extraAviso, setExtraAviso] = useState<{ check: CobrancaExtraCheck; payload: QuotationPayload } | null>(null);
  // Titular do plano (cadastro do sistema) e para quem é a remoção
  // Pessoas do plano (titular + dependentes do plano familiar): a remoção só pode ser para uma delas
  const [beneficiarios, setBeneficiarios] = useState<CredenciadoTitular[]>([]);
  const [selectedBenefId, setSelectedBenefId] = useState<string>('');
  const pessoaSel = beneficiarios.find((b) => b.id === selectedBenefId) || null;
  const temPlano = beneficiarios.length > 0;
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<'overview' | 'boletos' | 'request' | 'history'>('overview');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Boletos & Faturas reais do Remoções Pro
  const [boletosData, setBoletosData] = useState<CredenciadoBoletosResponse | null>(null);
  const [boletosLoading, setBoletosLoading] = useState(false);
  const [boletosError, setBoletosError] = useState<string | null>(null);
  const [boletoStatusFilter, setBoletoStatusFilter] = useState<'Todos' | 'Pendente' | 'Pago' | 'Atrasado'>('Todos');

  // Formulário de solicitação do credenciado
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [serviceType, setServiceType] = useState('simples');
  const [observations, setObservations] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [createdProtocol, setCreatedProtocol] = useState<string | null>(null);

  // Histórico & consulta ao vivo
  const [protocols, setProtocols] = useState<SavedProtocol[]>([]);
  const [searchCode, setSearchCode] = useState('');
  const [trackingData, setTrackingData] = useState<NormalizedTracking | { error: string } | null>(null);
  const [searching, setSearching] = useState(false);

  // Solicitações e remoções do contrato, direto do sistema
  const [solicitacoes, setSolicitacoes] = useState<PortalSolicitacao[] | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  useEffect(() => {
    const stored = loadCredenciadoSession();
    if (stored) setSession(stored);
    setProtocols(getAccreditedProtocols());
  }, []);

  const handleLogout = useCallback(() => {
    clearCredenciadoSession();
    setSession(null);
    setBoletosData(null);
  }, []);

  const loadHistory = useCallback(
    async (token: string) => {
      setHistoryLoading(true);
      setHistoryError(null);
      try {
        const res = await fetchCredenciadoRemocoes(token);
        setSolicitacoes(res.solicitacoes);
        setPlano(res.plano);
        setBeneficiarios(res.beneficiarios || []);
      } catch (err: any) {
        if (err instanceof EdgeFunctionError && (err.status === 401 || err.status === 403)) {
          handleLogout();
          setLoginError('Sua sessão expirou. Entre novamente.');
          return;
        }
        setHistoryError(err?.message || 'Não foi possível carregar as remoções.');
      } finally {
        setHistoryLoading(false);
      }
    },
    [handleLogout]
  );

  // Carrega ao entrar (o plano aparece na Visão Geral) e de novo ao abrir a aba de remoções.
  useEffect(() => {
    if (session?.token && (activeTab === 'history' || activeTab === 'overview' || activeTab === 'request')) {
      loadHistory(session.token);
    }
  }, [session?.token, activeTab, loadHistory]);

  const loadBoletos = useCallback(
    async (token: string, status: 'Todos' | 'Pendente' | 'Pago' | 'Atrasado', atualizar = false) => {
      setBoletosLoading(true);
      setBoletosError(null);
      try {
        const res = await fetchCredenciadoBoletos(token, status, atualizar);
        setBoletosData(res);
      } catch (err: any) {
        if (err instanceof EdgeFunctionError && (err.status === 401 || err.status === 403)) {
          handleLogout();
          setLoginError('Sua sessão expirou. Entre novamente.');
          return;
        }
        setBoletosError(err?.message || 'Não foi possível carregar boletos e faturas.');
      } finally {
        setBoletosLoading(false);
      }
    },
    [handleLogout]
  );

  useEffect(() => {
    if (session?.token) {
      loadBoletos(session.token, boletoStatusFilter);
    }
  }, [session?.token, boletoStatusFilter, loadBoletos]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docInput.trim() || contractInput.replace(/\D/g, '').length !== 6) {
      setLoginError('Informe seu CPF/CNPJ e o código de 6 dígitos recebido por e-mail.');
      return;
    }

    setLoginError('');
    setLoginLoading(true);
    try {
      const auth = await credenciadoLogin(docInput.trim(), contractInput.trim());
      saveCredenciadoSession(auth);
      setSession(auth);
      setContractInput('');
    } catch (err: any) {
      setLoginError(err?.message || 'Credenciais inválidas ou contrato inativo.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRequestCode = async () => {
    const digits = docInput.replace(/\D/g, '');
    if (digits.length !== 11 && digits.length !== 14) {
      setLoginError('Informe o CPF ou CNPJ do titular para receber um novo código.');
      return;
    }
    setLoginError('');
    setCodeMessage('');
    setCodeRequesting(true);
    try {
      const res = await credenciadoEnviarCodigo(digits);
      setCodeMessage(res.message);
    } catch (err: any) {
      setLoginError(err?.message || 'Não foi possível enviar o código agora.');
    } finally {
      setCodeRequesting(false);
    }
  };

  // Preenche o formulário com os dados do cadastro da pessoa escolhida (titular ou dependente).
  const aplicarPessoa = useCallback((p: CredenciadoTitular | null, titularPhone: string) => {
    if (!p) return;
    setPatientName(p.nome || '');
    setPatientAge(p.idade || '');
    setContactPhone(p.telefone || titularPhone || '');
    setOrigin(p.endereco || '');
  }, []);

  // Seleciona o titular por padrão quando a lista chega (ou a pessoa escolhida saiu do plano).
  useEffect(() => {
    if (beneficiarios.length && !beneficiarios.some((b) => b.id === selectedBenefId)) {
      setSelectedBenefId(beneficiarios[0].id);
    }
  }, [beneficiarios, selectedBenefId]);

  useEffect(() => {
    aplicarPessoa(pessoaSel, beneficiarios[0]?.telefone || '');
  }, [selectedBenefId, beneficiarios, aplicarPessoa]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  const handleRequestRemoval = async (e: React.FormEvent) => {
    e.preventDefault();
    if (temPlano && !pessoaSel) {
      alert('Selecione para quem é a remoção (pessoas cadastradas no seu plano).');
      return;
    }
    if (!patientName.trim() || !origin.trim() || !destination.trim() || !contactPhone.trim()) {
      alert('Preencha paciente, telefone, origem e destino.');
      return;
    }

    const payload: QuotationPayload = {
      origin: origin.trim(),
      destination: destination.trim(),
      date: date || new Date().toISOString().split('T')[0],
      time: time || new Date().toTimeString().slice(0, 5),
      patientName: patientName.trim(),
      patientAge: patientAge.trim(),
      contactPhone: contactPhone.trim(),
      email: session?.credenciado.email || '',
      cpf: session?.credenciado.cnpj || '',
      observations: `[CREDENCIADO: ${session?.credenciado.name} | CNPJ/CPF: ${session?.credenciado.cnpj}] ${observations.trim()}`,
      serviceType,
      source: 'portal_credenciado',
      credenciadoToken: session?.token,
      beneficiarioId: temPlano && pessoaSel ? pessoaSel.id : undefined
    };

    // Plano com cota/cobertura: avisa antes de enviar se a remoção será cobrada à parte.
    if (temPlano) {
      setSubmitting(true);
      try {
        const check = await verificarCobrancaExtra(payload);
        if (check.extra) {
          setSubmitting(false);
          setExtraAviso({ check, payload });
          return;
        }
      } catch (err: any) {
        setSubmitting(false);
        if (err instanceof EdgeFunctionError && err.status === 401) {
          handleLogout();
          setLoginError('Sua sessão expirou. Entre novamente para solicitar a remoção.');
          return;
        }
        alert(err?.message || 'Não foi possível verificar seu plano agora. Tente novamente.');
        return;
      }
    }
    await enviarSolicitacao(payload);
  };

  const enviarSolicitacao = async (payload: QuotationPayload) => {
    setSubmitting(true);
    const result = await submitQuotationToRemocoesPro(payload);
    setSubmitting(false);

    if (result.status === 401) {
      handleLogout();
      setLoginError('Sua sessão expirou. Entre novamente para solicitar a remoção.');
      return;
    }

    // Erro de validação (ex.: plano suspenso, paciente fora do plano): mostra a mensagem em vez de abrir o WhatsApp.
    if (!result.success && result.status && result.status < 500) {
      alert(result.error || 'Não foi possível registrar a solicitação.');
      return;
    }

    if (result.success) {
      setExtraAviso(null);
      setCreatedProtocol(result.protocol);
      setProtocols(getAccreditedProtocols());
      setDestination('');
      setObservations('');
      aplicarPessoa(pessoaSel, beneficiarios[0]?.telefone || '');
    } else {
      const msg = encodeURIComponent(
        `*Solicitação Credenciado (${session?.credenciado.name} - ${session?.credenciado.cnpj})*\n\n*Paciente:* ${patientName}\n*Telefone:* ${contactPhone}\n*Origem:* ${origin}\n*Destino:* ${destination}\n*Tipo:* ${serviceType}`
      );
      window.open(`https://wa.me/5519998049901?text=${msg}`, '_blank');
    }
  };

  const handleSearchProtocol = async (codeToSearch: string) => {
    setSearching(true);
    setTrackingData(null);
    setSearchCode(codeToSearch);
    try {
      const verifier = session?.credenciado.cnpj || session?.credenciado.phone || '';
      const data = await fetchRemovalTracking(codeToSearch, verifier, { credenciadoToken: session?.token });
      setTrackingData(data);
    } catch (err: any) {
      setTrackingData({ error: err.message || 'Protocolo não encontrado.' });
    } finally {
      setSearching(false);
    }
  };

  if (!session) {
    return (
      <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
        <div className="max-w-lg mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-[#0a2619] text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <Lock size={26} />
              </div>
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                Plano de Remoção Mensal
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#0a2619]">Área dos Credenciados</h1>
              <p className="text-slate-600 text-sm mt-2">
                Acesse seus boletos, faturas, NFS-e e solicite remoções diretamente pelo Remoções Pro.
              </p>
            </div>

            {loginError && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2">
                <AlertCircle size={17} className="shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0a2619]">CPF ou CNPJ do Titular</label>
                <input
                  type="text"
                  required
                  value={docInput}
                  onChange={(e) => setDocInput(e.target.value)}
                  placeholder="000.000.000-00 ou 00.000.000/0001-00"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none bg-slate-50 focus:bg-white text-sm"
                />
              </div>

              {!codeMessage ? (
                <>
                  <button
                    type="button"
                    onClick={handleRequestCode}
                    disabled={codeRequesting}
                    className="w-full bg-[#0a2619] hover:bg-emerald-900 text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-md disabled:opacity-50"
                  >
                    {codeRequesting ? 'Enviando código…' : 'Receber código de acesso por e-mail'}
                  </button>
                  <p className="text-xs text-slate-500 text-center">
                    A cada acesso enviamos um código de 6 dígitos para o e-mail cadastrado. Ele vale por 10 minutos.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-lg p-2.5">{codeMessage}</p>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#0a2619]">Código recebido por e-mail</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      required
                      maxLength={6}
                      value={contractInput}
                      onChange={(e) => setContractInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="••••••"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none bg-slate-50 focus:bg-white text-center text-2xl font-bold tracking-[0.5em]"
                    />
                    <button
                      type="button"
                      onClick={handleRequestCode}
                      disabled={codeRequesting}
                      className="text-xs font-bold text-emerald-700 hover:underline disabled:opacity-50"
                    >
                      {codeRequesting ? 'Enviando…' : 'Não recebeu? Enviar novo código'}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loginLoading || contractInput.length !== 6}
                    className="w-full bg-[#0a2619] hover:bg-emerald-900 text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-md disabled:opacity-50"
                  >
                    {loginLoading ? 'Entrando…' : 'Entrar no Portal do Credenciado'}
                  </button>
                </>
              )}
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                Ainda não possui um plano mensal?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('plans')}
                  className="text-emerald-700 font-bold hover:underline"
                >
                  Assinar Plano de Remoção
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const cred = session.credenciado;
  const summary = boletosData?.summary || { totalEmAberto: 0, totalVencido: 0, totalPago: 0, count: 0 };

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="bg-[#0a2619] text-white rounded-2xl p-6 md:p-8 mb-6 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-[#0a2619] shrink-0">
              <ShieldCheck size={26} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-[11px] font-bold uppercase tracking-wider">
                  {cred.status}
                </span>
                <span className="text-xs text-emerald-200/80 font-mono">Contrato: {maskSecret(cred.contractCode)}</span>
              </div>
              <h1 className="text-xl md:text-2xl font-extrabold mt-1">{cred.name}</h1>
              <p className="text-xs text-emerald-100/75">
                CNPJ/CPF: {cred.cnpj} {cred.city ? `• ${cred.city}/${cred.state}` : ''}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleLogout}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
            >
              <LogOut size={14} />
              <span>Sair</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'overview' as const, label: 'Meu Plano', icon: CreditCard },
            { id: 'boletos' as const, label: 'Boletos & Faturas', icon: Receipt },
            { id: 'request' as const, label: 'Solicitar Remoção', icon: Ambulance },
            { id: 'history' as const, label: 'Remoções Solicitadas', icon: ClipboardList }
          ].map((tab) => {
            const IconComp = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-[#0a2619] border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <IconComp size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 md:p-8">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              {plano && (
                <div className="p-5 rounded-2xl border border-emerald-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Meu plano</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-extrabold text-[#0a2619]">{plano.nome}</h3>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${
                          plano.status === 'Ativo'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : plano.status === 'Suspenso'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {plano.status}
                      </span>
                    </div>
                    {plano.descricao && <p className="text-xs text-slate-500 mt-0.5">{plano.descricao}</p>}
                    <p className="text-xs text-slate-600 mt-1">
                      {formatBRL(plano.valor_mensal)}/mês • vencimento todo dia {plano.dia_vencimento}
                      {plano.tipos_cobertos?.length ? ` • cobre: ${plano.tipos_cobertos.join(', ')}` : ''}
                    </p>
                  </div>
                  <div className="shrink-0 text-left md:text-right">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Remoções neste mês</p>
                    <p className="text-2xl font-extrabold text-[#0a2619]">
                      {plano.usadas_mes}
                      {plano.remocoes_incluidas !== null && <span className="text-base text-slate-400"> / {plano.remocoes_incluidas}</span>}
                    </p>
                    <p className="text-xs text-slate-500">
                      {plano.remocoes_incluidas === null
                        ? 'Remoções ilimitadas'
                        : plano.restantes_mes && plano.restantes_mes > 0
                          ? `${plano.restantes_mes} restante(s) na franquia`
                          : `Franquia usada • excedente ${formatBRL(plano.valor_excedente)} por remoção`}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">Em Aberto</p>
                  <p className="text-2xl font-extrabold text-[#0a2619]">{formatBRL(summary.totalEmAberto)}</p>
                  <button
                    onClick={() => setActiveTab('boletos')}
                    className="text-xs font-bold text-emerald-700 hover:underline mt-1"
                  >
                    Ver boletos →
                  </button>
                </div>
                <div className="p-5 rounded-xl bg-amber-50 border border-amber-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">Vencido</p>
                  <p className="text-2xl font-extrabold text-[#0a2619]">{formatBRL(summary.totalVencido)}</p>
                  <p className="text-xs text-amber-800/70 mt-1">{summary.count} registros vinculados</p>
                </div>
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Total Pago</p>
                  <p className="text-2xl font-extrabold text-[#0a2619]">{formatBRL(summary.totalPago)}</p>
                  <p className="text-xs text-slate-500 mt-1">Situação: {cred.status}</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#0a2619] to-emerald-900 text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-wider font-bold text-emerald-300 mb-1">
                    Carteirinha Digital do Credenciado
                  </p>
                  <h3 className="text-xl font-bold mb-1">{cred.name}</h3>
                  <p className="text-xs md:text-sm text-emerald-100/80">
                    Contrato: {maskSecret(cred.contractCode)} • CNPJ/CPF: {cred.cnpj}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('request')}
                  className="bg-emerald-500 hover:bg-emerald-400 text-[#0a2619] px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-colors"
                >
                  Solicitar Remoção Prioritária
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: BOLETOS & FATURAS (DADOS REAIS) */}
          {activeTab === 'boletos' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#0a2619]">Boletos e Faturas</h2>
                  <p className="text-xs text-slate-500">
                    Dados financeiros sincronizados em tempo real com o Remoções Pro.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={boletoStatusFilter}
                    onChange={(e) => setBoletoStatusFilter(e.target.value as any)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-[#0a2619] bg-slate-50 outline-none"
                  >
                    <option value="Todos">Todos os Status</option>
                    <option value="Pendente">Pendentes</option>
                    <option value="Pago">Pagos</option>
                    <option value="Atrasado">Atrasados</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => loadBoletos(session.token, boletoStatusFilter, true)}
                    disabled={boletosLoading}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600"
                    title="Atualizar e conferir pagamentos"
                  >
                    <RefreshCw size={16} className={boletosLoading ? 'animate-spin' : ''} />
                  </button>
                </div>
              </div>

              {boletosError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2">
                  <AlertCircle size={17} />
                  <span>{boletosError}</span>
                </div>
              )}

              {boletosLoading ? (
                <div className="py-12 text-center text-sm text-slate-500">Carregando boletos e faturas...</div>
              ) : (
                <div className="space-y-4">
                  {/* Boletos */}
                  {boletosData?.boletos && boletosData.boletos.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Boletos Emitidos</h3>
                      {boletosData.boletos.map((boleto) => (
                        <div
                          key={boleto.id}
                          className="p-5 rounded-xl border border-slate-200 hover:border-emerald-200 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2.5">
                              <span className="font-bold text-[#0a2619] text-base">{boleto.sacado_nome}</span>
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-emerald-50 text-emerald-800">
                                {boleto.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">
                              Vencimento: <strong>{formatDateBR(boleto.vencimento)}</strong> • Valor:{' '}
                              <strong className="text-[#0a2619]">{formatBRL(boleto.valor)}</strong>
                            </p>
                            {boleto.linha_digitavel && (
                              <p className="text-xs font-mono text-slate-400 break-all">{boleto.linha_digitavel}</p>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2 shrink-0">
                            {boleto.linha_digitavel && (
                              <button
                                type="button"
                                onClick={() => handleCopy(`lin-${boleto.id}`, boleto.linha_digitavel!)}
                                className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5"
                              >
                                {copiedId === `lin-${boleto.id}` ? <Check size={14} /> : <Copy size={14} />}
                                <span>{copiedId === `lin-${boleto.id}` ? 'Copiado!' : 'Linha Digitável'}</span>
                              </button>
                            )}
                            {boleto.qr_code_pix && (
                              <button
                                type="button"
                                onClick={() => handleCopy(`pix-${boleto.id}`, boleto.qr_code_pix!)}
                                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0a2619] font-bold text-xs flex items-center gap-1.5"
                              >
                                {copiedId === `pix-${boleto.id}` ? <Check size={14} /> : <QrCode size={14} />}
                                <span>{copiedId === `pix-${boleto.id}` ? 'PIX Copiado!' : 'Copiar PIX'}</span>
                              </button>
                            )}
                            {safeExternalUrl(boleto.pdf_url) && (
                              <a
                                href={safeExternalUrl(boleto.pdf_url)!}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3.5 py-2 rounded-xl bg-[#0a2619] hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5"
                              >
                                <ExternalLink size={14} />
                                <span>PDF Boleto</span>
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Faturas / Invoices */}
                  {boletosData?.invoices && boletosData.invoices.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Faturas & Notas Fiscais (NFS-e)</h3>
                      {boletosData.invoices.map((inv) => (
                        <div
                          key={inv.id}
                          className="p-5 rounded-xl border border-slate-200 hover:border-emerald-200 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2.5">
                              <span className="font-bold text-[#0a2619] text-sm">
                                {inv.description || inv.company_name}
                              </span>
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-slate-100 text-slate-700">
                                {inv.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">
                              Vencimento: <strong>{formatDateBR(inv.due_date)}</strong> • Valor:{' '}
                              <strong className="text-[#0a2619]">{formatBRL(inv.amount)}</strong>
                              {inv.nfse_numero ? ` • NFS-e nº ${inv.nfse_numero}` : ''}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2 shrink-0">
                            {inv.linha_digitavel && (
                              <button
                                type="button"
                                onClick={() => handleCopy(`inv-lin-${inv.id}`, inv.linha_digitavel!)}
                                className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5"
                              >
                                {copiedId === `inv-lin-${inv.id}` ? <Check size={14} /> : <Copy size={14} />}
                                <span>{copiedId === `inv-lin-${inv.id}` ? 'Copiado!' : 'Linha Digitável'}</span>
                              </button>
                            )}
                            {safeExternalUrl(inv.boleto_pdf_url) && (
                              <a
                                href={safeExternalUrl(inv.boleto_pdf_url)!}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3.5 py-2 rounded-xl bg-[#0a2619] text-white font-bold text-xs flex items-center gap-1.5"
                              >
                                <ExternalLink size={14} />
                                <span>Boleto PDF</span>
                              </a>
                            )}
                            {safeExternalUrl(inv.nfse_pdf_url) && (
                              <a
                                href={safeExternalUrl(inv.nfse_pdf_url)!}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0a2619] font-bold text-xs flex items-center gap-1.5"
                              >
                                <FileText size={14} />
                                <span>NFS-e PDF</span>
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {(!boletosData?.boletos?.length && !boletosData?.invoices?.length) && (
                    <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-sm text-slate-500">
                      Nenhum boleto ou fatura encontrado para o filtro selecionado.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SOLICITAR REMOÇÃO */}
          {activeTab === 'request' && (
            <div className="max-w-3xl mx-auto animate-fadeIn">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-[#0a2619]">Solicitar Remoção (Credenciado)</h2>
                <p className="text-xs text-slate-500">
                  Pedido prioritário integrado diretamente ao sistema <strong>Remoções Pro</strong>.
                </p>
              </div>

              {createdProtocol ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                  <CheckCircle2 size={40} className="text-emerald-600 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-[#0a2619] mb-2">Remoção Solicitada com Sucesso!</h3>
                  <p className="text-sm text-slate-600 mb-5">
                    Sua solicitação já aparece no painel do <strong>Remoções Pro</strong> com prioridade de credenciado.
                  </p>
                  <div className="bg-white border border-dashed border-emerald-300 rounded-xl p-4 inline-block px-8 mb-6">
                    <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-1">Protocolo</p>
                    <p className="text-lg font-extrabold text-[#0a2619] font-mono">{formatProtocol(createdProtocol)}</p>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button
                      onClick={() => {
                        setCreatedProtocol(null);
                        setActiveTab('history');
                      }}
                      className="bg-[#0a2619] text-white px-5 py-2.5 rounded-xl font-bold text-xs"
                    >
                      Ver em Remoções Solicitadas
                    </button>
                    <button
                      onClick={() => setCreatedProtocol(null)}
                      className="bg-white border border-emerald-200 text-emerald-900 px-5 py-2.5 rounded-xl font-bold text-xs"
                    >
                      Nova Solicitação
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRequestRemoval} className="space-y-4">
                  {extraAviso && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
                      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div className="px-5 py-4 bg-amber-50 border-b border-amber-100">
                          <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
                            {extraAviso.check.motivo === 'excedente' ? 'Cota do plano utilizada' : 'Remoção não coberta pelo plano'}
                          </p>
                          <h3 className="text-lg font-extrabold text-[#0a2619]">Esta remoção será cobrada à parte</h3>
                        </div>
                        <div className="p-5 space-y-3 text-sm text-slate-700">
                          <p>{extraAviso.check.mensagem}</p>
                          {extraAviso.check.valor ? (
                            <p className="text-2xl font-extrabold text-[#0a2619]">{formatBRL(extraAviso.check.valor)}</p>
                          ) : (
                            <p className="font-semibold">O valor será informado pela central antes de gerar o boleto.</p>
                          )}
                          <p className="text-xs text-slate-500">
                            Ao concordar, a solicitação vai para a central, que confirma o valor e gera o boleto. Ele aparecerá na aba
                            "Boletos e Faturas".
                          </p>
                        </div>
                        <div className="px-5 py-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
                          <button
                            type="button"
                            onClick={() => setExtraAviso(null)}
                            className="flex-1 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-bold text-sm"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            disabled={submitting}
                            onClick={() => enviarSolicitacao({ ...extraAviso.payload, aceiteCobrancaExtra: true })}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm disabled:opacity-50"
                          >
                            {submitting ? 'Enviando…' : 'Concordo e solicitar'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {temPlano && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Para quem é a remoção? {plano?.tipo === 'Familiar' ? '(pessoas do seu plano familiar)' : '(plano individual)'}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {beneficiarios.map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setSelectedBenefId(b.id)}
                            className={`text-left p-4 rounded-xl border-2 transition-all ${
                              selectedBenefId === b.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-200'
                            }`}
                          >
                            <p className="font-bold text-sm text-[#0a2619] truncate">{b.nome}</p>
                            <p className="text-xs text-slate-500">{b.titular ? 'Titular do plano' : b.parentesco}{b.idade ? ` • ${b.idade} anos` : ''}</p>
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-lg p-2.5">
                        Os dados do paciente vêm do cadastro do plano. Confira a origem (vem com o endereço cadastrado) e informe o destino.
                        {plano?.tipo === 'Familiar'
                          ? ' Para incluir outra pessoa no plano, fale com a central.'
                          : ' Seu plano é individual: cobre somente o titular.'}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Origem *</label>
                      <input
                        type="text"
                        required
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        placeholder="Endereço ou Hospital de origem"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Destino *</label>
                      <input
                        type="text"
                        required
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="Endereço ou Hospital de destino"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Data</label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Horário</label>
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Tipo de Unidade</label>
                      <select
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm"
                      >
                        <option value="simples">Suporte Básico</option>
                        <option value="siv">Suporte Intermediário (SIV)</option>
                        <option value="uti">UTI Móvel (Tipo D)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-600">Nome do Paciente *</label>
                      <input
                        type="text"
                        required
                        value={patientName}
                        readOnly={temPlano}
                        onChange={(e) => setPatientName(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none text-sm ${temPlano ? 'bg-slate-100 text-slate-600' : 'bg-slate-50 focus:bg-white focus:border-emerald-500'}`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Idade</label>
                      <input
                        type="number"
                        value={patientAge}
                        readOnly={temPlano && !!pessoaSel?.idade}
                        onChange={(e) => setPatientAge(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none text-sm ${temPlano && pessoaSel?.idade ? 'bg-slate-100 text-slate-600' : 'bg-slate-50 focus:bg-white focus:border-emerald-500'}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Telefone do Responsável *</label>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="(19) 99999-9999"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Observações Clínicas</label>
                    <textarea
                      rows={2}
                      value={observations}
                      onChange={(e) => setObservations(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                  >
                    <span>{submitting ? 'Enviando para Remoções Pro...' : 'Confirmar Solicitação Prioritária'}</span>
                    <Send size={16} />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 4: REMOÇÕES SOLICITADAS */}
          {activeTab === 'history' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#0a2619]">Remoções Solicitadas</h2>
                  <p className="text-xs text-slate-500">Consulte o andamento e baixe documentos diretamente do Remoções Pro.</p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchCode.trim()) handleSearchProtocol(searchCode.trim());
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    placeholder="Buscar protocolo..."
                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={searching}
                    className="bg-[#0a2619] text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5"
                  >
                    <Search size={14} />
                    <span>{searching ? '...' : 'Buscar'}</span>
                  </button>
                </form>
              </div>

              {trackingData && (
                <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/40">
                  {'error' in trackingData ? (
                    <p className="text-red-600 font-bold text-sm">{trackingData.error}</p>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex flex-wrap justify-between items-center gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase text-emerald-700">
                            Protocolo {formatProtocol(trackingData.protocol)} • {trackingData.status}
                          </p>
                          <h3 className="text-lg font-bold text-[#0a2619]">{trackingData.patient}</h3>
                          <p className="text-xs text-slate-600">
                            {trackingData.origin} → {trackingData.destination}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => openRemovalDocument(trackingData.protocol, 'proposal', cred.cnpj, { credenciadoToken: session.token }).catch((err) => alert(err?.message || 'Documento indisponível no momento.'))}
                            className="px-3.5 py-2 rounded-xl bg-white border border-emerald-200 text-xs font-bold text-emerald-800 hover:bg-emerald-100"
                          >
                            Ver Proposta
                          </button>
                          <button
                            onClick={() => openRemovalDocument(trackingData.protocol, 'fatura', cred.cnpj, { credenciadoToken: session.token }).catch((err) => alert(err?.message || 'Documento indisponível no momento.'))}
                            className="px-3.5 py-2 rounded-xl bg-white border border-emerald-200 text-xs font-bold text-emerald-800 hover:bg-emerald-100"
                          >
                            Ver Fatura
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Solicitações do contrato {solicitacoes ? `(${solicitacoes.length})` : ''}
                </p>
                <button
                  type="button"
                  onClick={() => loadHistory(session.token)}
                  disabled={historyLoading}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600"
                  title="Atualizar"
                >
                  <RefreshCw size={16} className={historyLoading ? 'animate-spin' : ''} />
                </button>
              </div>

              {historyError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2">
                  <AlertCircle size={17} />
                  <span>{historyError}</span>
                </div>
              )}

              {historyLoading && !solicitacoes ? (
                <p className="text-center text-sm text-slate-500 py-10">Carregando remoções…</p>
              ) : !solicitacoes || solicitacoes.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-slate-500 text-sm mb-4">Nenhuma solicitação registrada para este contrato ainda.</p>
                  <button
                    onClick={() => setActiveTab('request')}
                    className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs"
                  >
                    Solicitar Primeira Remoção
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {solicitacoes.map((item) => {
                    const status = item.remocao?.status || item.status;
                    const protocolo = item.remocao?.protocolo || item.protocolo;
                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-200 transition-all"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-mono font-bold text-emerald-700 text-sm">{formatProtocol(protocolo)}</p>
                            <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
                              {status}
                            </span>
                            {item.cobranca_extra && (
                              <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                                Cobrança à parte: {item.cobranca_extra.status === 'aguardando_aprovacao' ? 'aguardando central' : item.cobranca_extra.status === 'aprovada' ? (item.cobranca_extra.boleto_gerado ? 'boleto gerado' : 'aprovada') : 'recusada'}
                                {item.cobranca_extra.valor ? ` (${formatBRL(item.cobranca_extra.valor)})` : ''}
                              </span>
                            )}
                          </div>
                          <p className="font-semibold text-[#0a2619] text-sm truncate">
                            {item.paciente} • {item.tipo}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {formatDateBR(item.data)} {item.hora ? `às ${String(item.hora).slice(0, 5)}` : ''} • {item.origem} → {item.destino}
                          </p>
                        </div>
                        <button
                          onClick={() => handleSearchProtocol(item.remocao?.protocolo || item.id)}
                          className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs shrink-0"
                        >
                          Consultar Status & Documentos
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccreditedArea;
