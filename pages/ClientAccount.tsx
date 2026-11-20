import React, { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  Ambulance,
  ArrowLeft,
  Check,
  CheckCircle2,
  ClipboardList,
  Copy,
  CreditCard,
  FileText,
  KeyRound,
  LogOut,
  Mail,
  RefreshCw,
  Send,
  UserPlus,
  UserRound,
  XCircle
} from 'lucide-react';
import { Page } from '../App';
import {
  ClienteBoleto,
  ClienteProfile,
  ClienteResumo,
  EdgeFunctionError,
  PortalSolicitacao,
  clearClienteSession,
  clienteAprovar,
  clienteCadastrar,
  clienteEntrar,
  clienteEnviarCodigo,
  clienteRecusar,
  clienteResumo,
  clienteSolicitar,
  loadClienteSession,
  normalizeDigits,
  safeExternalUrl,
  saveClienteSession
} from '../lib/remocoesPro';

interface ClientAccountProps {
  onNavigate: (page: Page) => void;
}

type Tab = 'solicitacoes' | 'boletos' | 'nova' | 'dados';

const inputCls =
  'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-white';
const labelCls = 'block text-xs font-bold text-slate-600 mb-1';

const formatBRL = (v: number | null | undefined) =>
  (Number(v) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const formatDateBR = (d: string | null | undefined) => {
  if (!d) return '—';
  const only = String(d).split('T')[0];
  const [y, m, day] = only.split('-');
  return y && m && day ? `${day}/${m}/${y}` : String(d);
};

const maskDoc = (raw: string) => {
  const d = normalizeDigits(raw).slice(0, 14);
  if (d.length <= 11) {
    return d.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  return d
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
};

const maskPhone = (raw: string) => {
  const d = normalizeDigits(raw).slice(0, 11);
  if (d.length <= 10) return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
  return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
};

const maskCep = (raw: string) => normalizeDigits(raw).slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');

type Tone = 'slate' | 'amber' | 'blue' | 'green' | 'red';
const toneCls: Record<Tone, string> = {
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
  amber: 'bg-amber-50 text-amber-800 border-amber-200',
  blue: 'bg-blue-50 text-blue-800 border-blue-200',
  green: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  red: 'bg-red-50 text-red-700 border-red-200'
};

function solicitacaoStatus(s: PortalSolicitacao, boleto?: ClienteBoleto): { label: string; tone: Tone } {
  if (s.remocao) {
    const st = s.remocao.status || 'Agendada';
    const tone: Tone = /conclu|finaliz/i.test(st) ? 'green' : /cancel/i.test(st) ? 'red' : 'blue';
    return { label: `Remoção: ${st}`, tone };
  }
  if (s.status === 'Recusada') return { label: 'Recusada', tone: 'red' };
  if (s.pode_aprovar) return { label: 'Orçamento disponível', tone: 'amber' };
  if (s.status === 'Aprovada') {
    if (boleto?.status === 'Paga') return { label: 'Pago • aguardando agendamento', tone: 'green' };
    if (boleto?.status === 'Vencida') return { label: 'Boleto vencido', tone: 'red' };
    return { label: 'Aprovado • aguardando pagamento', tone: 'blue' };
  }
  if (s.status === 'Agendado') return { label: 'Agendada', tone: 'blue' };
  if (s.status === 'Concluída') return { label: 'Concluída', tone: 'green' };
  if (s.status === 'Pago') return { label: 'Pago', tone: 'green' };
  return { label: 'Em análise pela equipe', tone: 'slate' };
}

function boletoStatus(b: ClienteBoleto): { label: string; tone: Tone } {
  if (b.status === 'Paga') return { label: 'Pago', tone: 'green' };
  if (b.status === 'Vencida') return { label: 'Vencido', tone: 'red' };
  if (b.status === 'Cancelada') return { label: 'Cancelado', tone: 'slate' };
  return { label: 'Em aberto', tone: 'amber' };
}

const Badge: React.FC<{ tone: Tone; children: React.ReactNode }> = ({ tone, children }) => (
  <span className={`inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${toneCls[tone]}`}>
    {children}
  </span>
);

const Notice: React.FC<{ kind: 'error' | 'success'; children: React.ReactNode }> = ({ kind, children }) => (
  <div
    className={`p-3.5 rounded-xl border text-sm font-medium flex items-start gap-2 ${
      kind === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
    }`}
  >
    {kind === 'error' ? <AlertCircle size={17} className="shrink-0 mt-0.5" /> : <CheckCircle2 size={17} className="shrink-0 mt-0.5" />}
    <span>{children}</span>
  </div>
);

// ============================================================
// Acesso: entrar com código / criar cadastro
// ============================================================

const emptyCadastro = {
  nome: '',
  cpf_cnpj: '',
  email: '',
  telefone: '',
  nascimento: '',
  cep: '',
  endereco: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  uf: '',
  aceite: false
};

const AccessScreen: React.FC<{ onLogged: (token: string, cliente: ClienteProfile, exp: number) => void; onNavigate: (p: Page) => void }> = ({
  onLogged,
  onNavigate
}) => {
  const [mode, setMode] = useState<'entrar' | 'cadastrar'>('entrar');
  const [doc, setDoc] = useState('');
  const [codigo, setCodigo] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [form, setForm] = useState(emptyCadastro);
  const [cepLoading, setCepLoading] = useState(false);

  const set = (k: keyof typeof emptyCadastro, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const lookupCep = async (cep: string) => {
    const d = normalizeDigits(cep);
    if (d.length !== 8) return;
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${d}/json/`);
      const j = await res.json();
      if (!j?.erro) {
        setForm((f) => ({
          ...f,
          endereco: j.logradouro || f.endereco,
          bairro: j.bairro || f.bairro,
          cidade: j.localidade || f.cidade,
          uf: j.uf || f.uf
        }));
      }
    } catch {
      // Preenchimento manual continua disponível
    } finally {
      setCepLoading(false);
    }
  };

  const sendCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const d = normalizeDigits(doc);
    if (d.length !== 11 && d.length !== 14) {
      setError('Informe um CPF ou CNPJ válido.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await clienteEnviarCodigo(d);
      setInfo(res.message);
      setCodeSent(true);
    } catch (err: any) {
      setError(err?.message || 'Não foi possível enviar o código.');
    } finally {
      setLoading(false);
    }
  };

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await clienteEntrar(normalizeDigits(doc), normalizeDigits(codigo));
      onLogged(res.token, res.cliente, res.expiresAt);
    } catch (err: any) {
      setError(err?.message || 'Código inválido.');
    } finally {
      setLoading(false);
    }
  };

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.aceite) {
      setError('É preciso aceitar os Termos de Uso e a Política de Privacidade.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await clienteCadastrar({
        ...form,
        cpf_cnpj: normalizeDigits(form.cpf_cnpj),
        telefone: normalizeDigits(form.telefone),
        cep: normalizeDigits(form.cep)
      });
      setDoc(form.cpf_cnpj);
      setInfo(res.message);
      setCodeSent(true);
      setMode('entrar');
    } catch (err: any) {
      setError(err?.message || 'Não foi possível concluir o cadastro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <button
          type="button"
          onClick={() => onNavigate('client-portal')}
          className="mb-4 text-xs font-bold text-emerald-800 flex items-center gap-1 hover:underline"
        >
          <ArrowLeft size={14} /> Voltar para a Área do Cliente
        </button>
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 md:p-10">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <UserRound size={26} />
            </div>
            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              Remoções Avulsas • Particular
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#0a2619]">Minha Conta</h1>
            <p className="text-sm text-slate-500 mt-1">
              Solicite remoções, aprove orçamentos e pague seus boletos em um só lugar.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-6">
            {(['entrar', 'cadastrar'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setError('');
                }}
                className={`py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                  mode === m ? 'bg-white text-[#0a2619] shadow-sm' : 'text-slate-500'
                }`}
              >
                {m === 'entrar' ? <KeyRound size={16} /> : <UserPlus size={16} />}
                {m === 'entrar' ? 'Entrar' : 'Criar cadastro'}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {error && <Notice kind="error">{error}</Notice>}
            {info && mode === 'entrar' && <Notice kind="success">{info}</Notice>}
          </div>

          {mode === 'entrar' ? (
            <form onSubmit={codeSent ? login : sendCode} className="space-y-4 mt-4">
              <div>
                <label className={labelCls}>CPF ou CNPJ</label>
                <input
                  className={inputCls}
                  inputMode="numeric"
                  autoComplete="username"
                  value={maskDoc(doc)}
                  onChange={(e) => setDoc(e.target.value)}
                  placeholder="000.000.000-00"
                />
              </div>
              {codeSent && (
                <div>
                  <label className={labelCls}>Código recebido por e-mail</label>
                  <input
                    className={`${inputCls} text-center text-2xl font-bold tracking-[0.5em]`}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={codigo}
                    onChange={(e) => setCodigo(normalizeDigits(e.target.value).slice(0, 6))}
                    placeholder="••••••"
                  />
                  <button type="button" onClick={() => sendCode()} disabled={loading} className="mt-2 text-xs font-bold text-emerald-700 hover:underline">
                    Não recebeu? Enviar novo código
                  </button>
                </div>
              )}
              <button
                type="submit"
                disabled={loading || (codeSent && codigo.length !== 6)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
              >
                {codeSent ? <KeyRound size={17} /> : <Mail size={17} />}
                {loading ? 'Aguarde…' : codeSent ? 'Entrar' : 'Receber código por e-mail'}
              </button>
              <p className="text-xs text-slate-500 text-center">
                Sem senha: a cada acesso enviamos um código de 6 dígitos para o e-mail do seu cadastro.
              </p>
            </form>
          ) : (
            <form onSubmit={register} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className={labelCls}>Nome completo / Razão social *</label>
                  <input className={inputCls} value={form.nome} onChange={(e) => set('nome', e.target.value)} required maxLength={150} />
                </div>
                <div>
                  <label className={labelCls}>CPF ou CNPJ *</label>
                  <input className={inputCls} inputMode="numeric" value={maskDoc(form.cpf_cnpj)} onChange={(e) => set('cpf_cnpj', e.target.value)} required />
                </div>
                <div>
                  <label className={labelCls}>Data de nascimento</label>
                  <input type="date" className={inputCls} value={form.nascimento} onChange={(e) => set('nascimento', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>E-mail *</label>
                  <input type="email" className={inputCls} value={form.email} onChange={(e) => set('email', e.target.value)} required maxLength={200} />
                </div>
                <div>
                  <label className={labelCls}>Telefone / WhatsApp *</label>
                  <input className={inputCls} inputMode="tel" value={maskPhone(form.telefone)} onChange={(e) => set('telefone', e.target.value)} required />
                </div>
                <div>
                  <label className={labelCls}>CEP * {cepLoading && <span className="text-emerald-600">buscando…</span>}</label>
                  <input
                    className={inputCls}
                    inputMode="numeric"
                    value={maskCep(form.cep)}
                    onChange={(e) => {
                      set('cep', e.target.value);
                      if (normalizeDigits(e.target.value).length === 8) lookupCep(e.target.value);
                    }}
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>Número *</label>
                  <input className={inputCls} value={form.numero} onChange={(e) => set('numero', e.target.value)} required maxLength={20} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Endereço *</label>
                  <input className={inputCls} value={form.endereco} onChange={(e) => set('endereco', e.target.value)} required maxLength={200} />
                </div>
                <div>
                  <label className={labelCls}>Complemento</label>
                  <input className={inputCls} value={form.complemento} onChange={(e) => set('complemento', e.target.value)} maxLength={100} />
                </div>
                <div>
                  <label className={labelCls}>Bairro *</label>
                  <input className={inputCls} value={form.bairro} onChange={(e) => set('bairro', e.target.value)} required maxLength={100} />
                </div>
                <div>
                  <label className={labelCls}>Cidade *</label>
                  <input className={inputCls} value={form.cidade} onChange={(e) => set('cidade', e.target.value)} required maxLength={100} />
                </div>
                <div>
                  <label className={labelCls}>UF *</label>
                  <input
                    className={inputCls}
                    value={form.uf}
                    onChange={(e) => set('uf', e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2))}
                    required
                    placeholder="SP"
                  />
                </div>
              </div>
              <label className="flex items-start gap-2.5 text-xs text-slate-600">
                <input type="checkbox" className="mt-0.5" checked={form.aceite} onChange={(e) => set('aceite', e.target.checked)} />
                <span>
                  Li e aceito os{' '}
                  <button type="button" onClick={() => onNavigate('terms')} className="font-bold text-emerald-700 underline">
                    Termos de Uso
                  </button>{' '}
                  e a{' '}
                  <button type="button" onClick={() => onNavigate('privacy')} className="font-bold text-emerald-700 underline">
                    Política de Privacidade
                  </button>
                  , e autorizo o uso dos meus dados para atendimento e cobrança dos serviços.
                </span>
              </label>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
              >
                <UserPlus size={17} />
                {loading ? 'Enviando…' : 'Criar cadastro e receber código'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// Painel do cliente
// ============================================================

const emptySolicitacao = {
  paciente_nome: '',
  paciente_idade: '',
  origem: '',
  destino: '',
  data: '',
  hora: '',
  tipo_servico: 'Básica',
  tipo_remocao: 'Ida',
  observacoes: ''
};

const ClientAccount: React.FC<ClientAccountProps> = ({ onNavigate }) => {
  const [session, setSession] = useState(() => loadClienteSession());
  const [tab, setTab] = useState<Tab>('solicitacoes');
  const [data, setData] = useState<ClienteResumo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [nova, setNova] = useState(emptySolicitacao);
  const [sending, setSending] = useState(false);

  const logout = useCallback((msg?: string) => {
    clearClienteSession();
    setSession(null);
    setData(null);
    if (msg) setError(msg);
  }, []);

  const handleApiError = useCallback(
    (err: any, fallback: string) => {
      if (err instanceof EdgeFunctionError && err.status === 401) {
        logout('Sua sessão expirou. Entre novamente.');
        return;
      }
      setError(err?.message || fallback);
    },
    [logout]
  );

  const load = useCallback(
    async (atualizar = false) => {
      if (!session) return;
      setLoading(true);
      setError('');
      try {
        setData(await clienteResumo(session.token, atualizar));
      } catch (err) {
        handleApiError(err, 'Não foi possível carregar seus dados.');
      } finally {
        setLoading(false);
      }
    },
    [session, handleApiError]
  );

  useEffect(() => {
    load();
  }, [load]);

  if (!session) {
    return (
      <AccessScreen
        onNavigate={onNavigate}
        onLogged={(token, cliente, exp) => {
          saveClienteSession(token, cliente, exp);
          setError('');
          setSession({ token, cliente, expiresAt: exp });
        }}
      />
    );
  }

  const cliente = data?.cliente || session.cliente;
  const boletos = data?.boletos || [];
  const solicitacoes = data?.solicitacoes || [];
  const abertos = boletos.filter((b) => b.status === 'Pendente' || b.status === 'Vencida');
  const orcamentos = solicitacoes.filter((s) => s.pode_aprovar);

  const copy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const aprovar = async (s: PortalSolicitacao) => {
    if (!confirm(`Aprovar o orçamento de ${formatBRL(s.valor)}? O boleto será gerado em seguida.`)) return;
    setBusyId(s.id);
    setError('');
    setSuccess('');
    try {
      const res = await clienteAprovar(session.token, s.id);
      setSuccess(res.message);
      await load();
      setTab('boletos');
    } catch (err) {
      handleApiError(err, 'Não foi possível aprovar o orçamento.');
    } finally {
      setBusyId(null);
    }
  };

  const recusar = async (s: PortalSolicitacao) => {
    const motivo = prompt('Deseja informar o motivo da recusa? (opcional)', '');
    if (motivo === null) return;
    setBusyId(s.id);
    setError('');
    setSuccess('');
    try {
      const res = await clienteRecusar(session.token, s.id, motivo);
      setSuccess(res.message);
      await load();
    } catch (err) {
      handleApiError(err, 'Não foi possível recusar o orçamento.');
    } finally {
      setBusyId(null);
    }
  };

  const enviarSolicitacao = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    setSuccess('');
    try {
      const res = await clienteSolicitar(session.token, nova);
      setSuccess(`${res.message} Protocolo: ${res.protocolo}`);
      setNova(emptySolicitacao);
      await load();
      setTab('solicitacoes');
    } catch (err) {
      handleApiError(err, 'Não foi possível enviar a solicitação.');
    } finally {
      setSending(false);
    }
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'solicitacoes', label: 'Solicitações', icon: <ClipboardList size={16} />, count: orcamentos.length || undefined },
    { id: 'boletos', label: 'Boletos', icon: <CreditCard size={16} />, count: abertos.length || undefined },
    { id: 'nova', label: 'Nova Solicitação', icon: <Ambulance size={16} /> },
    { id: 'dados', label: 'Meus Dados', icon: <UserRound size={16} /> }
  ];

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0a2619] text-white rounded-2xl p-6 md:p-8 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Minha Conta</span>
            <h1 className="text-xl md:text-2xl font-extrabold mt-1 truncate">{cliente.nome}</h1>
            <p className="text-xs text-emerald-100/70 mt-0.5">{cliente.documento}</p>
          </div>
          <button
            type="button"
            onClick={() => logout()}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-bold flex items-center gap-2"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 mb-6">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTab(t.id);
                setSuccess('');
              }}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 whitespace-nowrap border transition-colors ${
                tab === t.id ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
              }`}
            >
              {t.icon}
              {t.label}
              {t.count ? (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${tab === t.id ? 'bg-white/25' : 'bg-amber-100 text-amber-800'}`}>{t.count}</span>
              ) : null}
            </button>
          ))}
        </div>

        <div className="space-y-4 mb-4">
          {error && <Notice kind="error">{error}</Notice>}
          {success && <Notice kind="success">{success}</Notice>}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8">
          {tab === 'solicitacoes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[#0a2619]">Minhas Solicitações</h2>
                  <p className="text-xs text-slate-500">Acompanhe o orçamento, o pagamento e a remoção.</p>
                </div>
                <button type="button" onClick={() => load()} disabled={loading} className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600" title="Atualizar">
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                </button>
              </div>

              {loading && !data ? (
                <p className="text-center text-sm text-slate-500 py-10">Carregando…</p>
              ) : solicitacoes.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-slate-500 text-sm mb-4">Você ainda não fez nenhuma solicitação.</p>
                  <button onClick={() => setTab('nova')} className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs">
                    Solicitar uma remoção
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {solicitacoes.map((s) => {
                    const boleto = s.boleto_id ? boletos.find((b) => b.id === s.boleto_id) : undefined;
                    const st = solicitacaoStatus(s, boleto);
                    return (
                      <div key={s.id} className="p-4 rounded-xl border border-slate-200 hover:border-emerald-200 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="font-mono font-bold text-emerald-700 text-sm">{s.remocao?.protocolo || s.protocolo}</span>
                              <Badge tone={st.tone}>{st.label}</Badge>
                            </div>
                            <p className="font-semibold text-[#0a2619] text-sm">
                              {s.paciente} • {s.tipo} • {s.tipo_remocao}
                            </p>
                            <p className="text-xs text-slate-500 break-words">
                              {formatDateBR(s.data)} {s.hora ? `às ${String(s.hora).slice(0, 5)}` : ''} • {s.origem} → {s.destino}
                            </p>
                          </div>
                          {s.valor ? (
                            <div className="text-left md:text-right shrink-0">
                              <p className="text-[10px] font-bold uppercase text-slate-400">Valor</p>
                              <p className="text-lg font-extrabold text-[#0a2619]">{formatBRL(s.valor)}</p>
                            </div>
                          ) : null}
                        </div>

                        {s.pode_aprovar && (
                          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
                            <button
                              type="button"
                              disabled={busyId === s.id}
                              onClick={() => aprovar(s)}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                            >
                              <CheckCircle2 size={16} />
                              {busyId === s.id ? 'Gerando boleto…' : 'Aprovar e gerar boleto'}
                            </button>
                            <button
                              type="button"
                              disabled={busyId === s.id}
                              onClick={() => recusar(s)}
                              className="sm:w-40 bg-white border border-slate-200 hover:bg-red-50 hover:border-red-200 text-slate-600 hover:text-red-700 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                            >
                              <XCircle size={16} /> Recusar
                            </button>
                          </div>
                        )}

                        {boleto && boleto.status !== 'Paga' && boleto.status !== 'Cancelada' && (
                          <div className="mt-3 pt-3 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => setTab('boletos')}
                              className="text-sm font-bold text-emerald-700 hover:underline flex items-center gap-1.5"
                            >
                              <CreditCard size={15} /> Ver boleto de {formatBRL(boleto.valor)} (vence {formatDateBR(boleto.vencimento)})
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {tab === 'boletos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[#0a2619]">Meus Boletos</h2>
                  <p className="text-xs text-slate-500">Pague por boleto ou PIX. O pagamento é confirmado automaticamente.</p>
                </div>
                <button
                  type="button"
                  onClick={() => load(true)}
                  disabled={loading}
                  className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold flex items-center gap-1.5"
                  title="Atualizar e conferir pagamentos"
                >
                  <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Conferir pagamentos
                </button>
              </div>

              {boletos.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-slate-500 text-sm">Nenhum boleto por aqui. Ele aparece assim que você aprovar um orçamento.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {boletos.map((b) => {
                    const st = boletoStatus(b);
                    const pagarUrl = safeExternalUrl(b.pagar_url);
                    const pdfUrl = safeExternalUrl(b.pdf_url);
                    const aberto = b.status === 'Pendente' || b.status === 'Vencida';
                    return (
                      <div key={b.id} className="p-4 rounded-xl border border-slate-200">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="text-lg font-extrabold text-[#0a2619]">{formatBRL(b.valor)}</span>
                              <Badge tone={st.tone}>{st.label}</Badge>
                            </div>
                            {b.descricao && <p className="text-xs text-slate-600 break-words">{b.descricao}</p>}
                            <p className="text-xs text-slate-500 mt-0.5">
                              Vencimento: <strong>{formatDateBR(b.vencimento)}</strong>
                              {b.data_pagamento ? ` • Pago em ${formatDateBR(b.data_pagamento)}` : ''}
                            </p>
                          </div>
                          {aberto && (
                            <div className="flex flex-wrap gap-2 shrink-0">
                              {pagarUrl && (
                                <a
                                  href={pagarUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5"
                                >
                                  <CreditCard size={14} /> Pagar (boleto ou PIX)
                                </a>
                              )}
                              {pdfUrl && (
                                <a
                                  href={pdfUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5"
                                >
                                  <FileText size={14} /> PDF
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                        {aberto && b.linha_digitavel && (
                          <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                            <code className="text-[11px] text-slate-700 break-all flex-1">{b.linha_digitavel}</code>
                            <button
                              type="button"
                              onClick={() => copy(b.id, b.linha_digitavel!)}
                              className="shrink-0 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1"
                            >
                              {copied === b.id ? <Check size={13} /> : <Copy size={13} />}
                              {copied === b.id ? 'Copiado' : 'Copiar'}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {tab === 'nova' && (
            <form onSubmit={enviarSolicitacao} className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-[#0a2619]">Nova Solicitação de Remoção</h2>
                <p className="text-xs text-slate-500">
                  Nossa equipe calcula o orçamento e ele aparece em "Solicitações" para você aprovar. Emergência? Ligue para a central.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Nome do paciente</label>
                  <input
                    className={inputCls}
                    value={nova.paciente_nome}
                    onChange={(e) => setNova({ ...nova, paciente_nome: e.target.value })}
                    placeholder={`Deixe em branco se for ${cliente.nome.split(' ')[0]}`}
                    maxLength={150}
                  />
                </div>
                <div>
                  <label className={labelCls}>Idade do paciente</label>
                  <input className={inputCls} inputMode="numeric" value={nova.paciente_idade} onChange={(e) => setNova({ ...nova, paciente_idade: e.target.value })} maxLength={10} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Endereço de origem *</label>
                  <input className={inputCls} value={nova.origem} onChange={(e) => setNova({ ...nova, origem: e.target.value })} required maxLength={300} placeholder="Rua, número, bairro, cidade (ou hospital)" />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Endereço de destino *</label>
                  <input className={inputCls} value={nova.destino} onChange={(e) => setNova({ ...nova, destino: e.target.value })} required maxLength={300} />
                </div>
                <div>
                  <label className={labelCls}>Data *</label>
                  <input type="date" className={inputCls} value={nova.data} min={new Date().toISOString().split('T')[0]} onChange={(e) => setNova({ ...nova, data: e.target.value })} required />
                </div>
                <div>
                  <label className={labelCls}>Horário *</label>
                  <input type="time" className={inputCls} value={nova.hora} onChange={(e) => setNova({ ...nova, hora: e.target.value })} required />
                </div>
                <div>
                  <label className={labelCls}>Tipo de ambulância</label>
                  <select className={inputCls} value={nova.tipo_servico} onChange={(e) => setNova({ ...nova, tipo_servico: e.target.value })}>
                    <option value="Básica">Básica (simples)</option>
                    <option value="SIV">SIV (intermediária)</option>
                    <option value="UTI">UTI adulto</option>
                    <option value="UTI Pediátrica">UTI pediátrica / neonatal</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Trajeto</label>
                  <select className={inputCls} value={nova.tipo_remocao} onChange={(e) => setNova({ ...nova, tipo_remocao: e.target.value })}>
                    <option value="Ida">Somente ida</option>
                    <option value="Ida e Volta">Ida e volta</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Observações</label>
                  <textarea
                    className={`${inputCls} min-h-[90px]`}
                    value={nova.observacoes}
                    onChange={(e) => setNova({ ...nova, observacoes: e.target.value })}
                    maxLength={2000}
                    placeholder="Condição do paciente, oxigênio, acompanhante, andar/elevador…"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
              >
                <Send size={17} /> {sending ? 'Enviando…' : 'Enviar solicitação'}
              </button>
            </form>
          )}

          {tab === 'dados' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-[#0a2619]">Meus Dados</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                {[
                  ['Nome / Razão social', cliente.nome],
                  ['CPF / CNPJ', cliente.documento],
                  ['E-mail', cliente.email],
                  ['Telefone', cliente.telefone ? maskPhone(cliente.telefone) : null],
                  ['Endereço', [cliente.endereco, cliente.numero, cliente.complemento].filter(Boolean).join(', ')],
                  ['Bairro', cliente.bairro],
                  ['Cidade / UF', [cliente.cidade, cliente.uf].filter(Boolean).join(' / ')],
                  ['CEP', cliente.cep ? maskCep(cliente.cep) : null]
                ].map(([k, v]) => (
                  <div key={k as string} className="border-b border-slate-100 pb-2">
                    <dt className="text-[11px] font-bold uppercase text-slate-400">{k}</dt>
                    <dd className="text-[#0a2619] font-medium break-words">{v || '—'}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-xs text-slate-500">
                Esses dados são usados no boleto e na nota fiscal. Para alterá-los, fale com a nossa central — por segurança, a alteração
                não é feita pelo site.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientAccount;
