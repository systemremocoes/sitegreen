const FUNCTIONS_BASE_URL =
  import.meta.env.VITE_FUNCTIONS_BASE_URL ||
  'https://kijwizzgbrytvgseixme.supabase.co/functions/v1';

/** Protocolo no mesmo formato do sistema Remoções Pro: # + 8 primeiros caracteres do ID, em maiúsculas. */
export function formatProtocol(id: string | null | undefined): string {
  const v = String(id || '').trim().replace(/^#/, '');
  if (!v) return '';
  // Número de remoção (ex.: 20260316) fica como está
  if (/^\d{8}$/.test(v)) return `#${v}`;
  return `#${v.replace(/-/g, '').slice(0, 8).toUpperCase()}`;
}

export interface QuotationPayload {
  /** Remoção avulsa: quem paga (boleto e nota fiscal) */
  tomador?: {
    tipo: 'paciente' | 'outro';
    razao_social: string;
    cnpj_cpf: string;
    cep: string;
    endereco: string;
    numero: string;
    bairro: string;
    cidade: string;
    uf: string;
  };
  /** 'evento' grava no módulo Eventos do sistema */
  kind?: 'evento';
  event?: {
    nome: string;
    local: string;
    tipo: string;
    publico: string;
    estrutura: string;
    data_fim?: string;
    hora_fim?: string;
    quantidade_viaturas?: number;
  };
  /** Dados do contratante usados pelo sistema para emitir o contrato do evento */
  contratante?: {
    empresa: string;
    cnpj_cpf: string;
    cep: string;
    endereco: string;
    numero: string;
    bairro: string;
    cidade: string;
    uf: string;
    representante_nome: string;
    representante_cpf: string;
    representante_rg?: string;
  };
  origin: string;
  destination: string;
  date: string;
  time: string;
  patientName: string;
  patientAge: string;
  contactPhone: string;
  email: string;
  observations: string;
  serviceType: string;
  source?: string;
  removalType?: string;
  cpf?: string;
  credenciadoToken?: string;
  /** Credenciado pedindo para o próprio titular do plano (cadastro do sistema) */
  paraTitular?: boolean;
  /** Pessoa do plano (titular ou beneficiário) para quem é a remoção */
  beneficiarioId?: string;
  /** Credenciado aceitou pagar à parte a remoção fora do plano (acima da cota ou tipo não coberto) */
  aceiteCobrancaExtra?: boolean;
}

export interface QuotationResult {
  success: boolean;
  protocol: string;
  raw?: any;
  error?: string;
  status?: number;
}

export interface TrackingTimelineItem {
  label: string;
  date: string;
  completed: boolean;
}

export interface NormalizedTracking {
  valid: boolean;
  id: string;
  protocol: string;
  status: string;
  date: string;
  timeOrigin: string;
  origin: string;
  destination: string;
  serviceType: string;
  removalType: string;
  patient: string;
  vehicle: string;
  updatedAt: string;
  history: TrackingTimelineItem[];
  /** Acesso liberado após o código (para abrir proposta/fatura sem pedir de novo) */
  accessToken?: string | null;
}

export interface CredenciadoProfile {
  id: string;
  name: string;
  cnpj: string;
  contractCode: string;
  status: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
}

export interface CredenciadoLoginResult {
  token: string;
  credenciado: CredenciadoProfile;
}

export interface BoletoItem {
  id: string;
  invoice_id: string | null;
  sacado_nome: string;
  sacado_cnpj_cpf: string;
  valor: number;
  data_emissao: string;
  vencimento: string;
  data_pagamento: string | null;
  status: string;
  linha_digitavel: string | null;
  codigo_barras: string | null;
  qr_code_pix: string | null;
  pdf_url: string | null;
}

export interface InvoiceItem {
  id: string;
  company_name: string;
  description: string;
  amount: number;
  status: string;
  due_date: string;
  boleto_status: string | null;
  boleto_pdf_url: string | null;
  linha_digitavel: string | null;
  codigo_barras: string | null;
  qr_code_pix: string | null;
  nfse_numero: string | null;
  nfse_status: string | null;
  nfse_pdf_url: string | null;
}

export interface CredenciadoBoletosResponse {
  credenciado: {
    id: string;
    name: string;
    cnpj: string;
    contractCode: string;
  };
  summary: {
    totalEmAberto: number;
    totalVencido: number;
    totalPago: number;
    count: number;
  };
  invoices: InvoiceItem[];
  boletos: BoletoItem[];
}

const ACCREDITED_PROTOCOLS_KEY = 'green_accredited_protocols';

export interface SavedProtocol {
  protocol: string;
  serviceType: string;
  createdAt: string;
}

export function saveAccreditedProtocol(entry: SavedProtocol): void {
  try {
    const existing = getAccreditedProtocols();
    const updated = [entry, ...existing.filter((p) => p.protocol !== entry.protocol)].slice(0, 15);
    localStorage.setItem(ACCREDITED_PROTOCOLS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
}

export function getAccreditedProtocols(): SavedProtocol[] {
  try {
    const raw = localStorage.getItem(ACCREDITED_PROTOCOLS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function normalizeDigits(value: string): string {
  return value.replace(/\D/g, '');
}

const CREDENCIADO_SESSION_KEY = 'green_accredited_session';
const CREDENCIADO_SESSION_TTL_MS = 8 * 60 * 60 * 1000;

interface StoredCredenciadoSession extends CredenciadoLoginResult {
  expiresAt: number;
}

export function saveCredenciadoSession(auth: CredenciadoLoginResult): void {
  try {
    const stored: StoredCredenciadoSession = { ...auth, expiresAt: Date.now() + CREDENCIADO_SESSION_TTL_MS };
    localStorage.setItem(CREDENCIADO_SESSION_KEY, JSON.stringify(stored));
  } catch {
    // Ignore storage errors
  }
}

export function loadCredenciadoSession(): CredenciadoLoginResult | null {
  try {
    const raw = localStorage.getItem(CREDENCIADO_SESSION_KEY);
    if (!raw) return null;
    const parsed: Partial<StoredCredenciadoSession> = JSON.parse(raw);
    if (!parsed?.token || !parsed?.credenciado || !parsed.expiresAt || parsed.expiresAt < Date.now()) {
      localStorage.removeItem(CREDENCIADO_SESSION_KEY);
      return null;
    }
    return { token: parsed.token, credenciado: parsed.credenciado };
  } catch {
    clearCredenciadoSession();
    return null;
  }
}

export function clearCredenciadoSession(): void {
  try {
    localStorage.removeItem(CREDENCIADO_SESSION_KEY);
  } catch {
    // Ignore storage errors
  }
}

export function maskSecret(value: string | null | undefined, visible = 3): string {
  if (!value) return '—';
  const v = String(value);
  if (v.length <= visible) return '•'.repeat(v.length);
  return `${'•'.repeat(Math.min(6, v.length - visible))}${v.slice(-visible)}`;
}

export function safeExternalUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url, window.location.href);
    return parsed.protocol === 'https:' ? parsed.href : null;
  } catch {
    return null;
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

export class EdgeFunctionError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'EdgeFunctionError';
    this.status = status;
  }
}

async function callEdgeFunction<T = any>(slug: string, body: Record<string, any>, bearerToken?: string): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (bearerToken) {
    headers['Authorization'] = `Bearer ${bearerToken}`;
  }

  const res = await fetch(`${FUNCTIONS_BASE_URL}/${slug}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { html: text };
  }

  if (!res.ok) {
    throw new EdgeFunctionError(json?.error || json?.message || `Erro HTTP ${res.status}`, res.status);
  }

  if (json?.error) {
    throw new EdgeFunctionError(json.error, res.status);
  }

  return json as T;
}

function formatIsoDateTime(iso: string | null | undefined): string {
  if (!iso) return 'Aguardando';
  try {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return iso;
  }
}

export interface CobrancaExtraCheck {
  extra: boolean;
  motivo: 'excedente' | 'nao_coberto' | null;
  valor: number | null;
  mensagem: string | null;
}

/** Verifica, sem gravar nada, se a remoção do credenciado está fora do plano (cota do mês ou tipo não coberto). */
export async function verificarCobrancaExtra(data: QuotationPayload): Promise<CobrancaExtraCheck> {
  const res = await callEdgeFunction<any>('create-quotation', { ...data, precheck: true });
  return { extra: !!res.extra, motivo: res.motivo ?? null, valor: res.valor ?? null, mensagem: res.mensagem ?? null };
}

/** Credenciado aprova (gera boleto e agenda a remoção) ou recusa o orçamento de remoção fora do plano. */
export async function responderCobrancaExtra(
  token: string,
  quotationId: string,
  acao: 'aceitar' | 'recusar'
): Promise<{ message: string; remocao?: string }> {
  return callEdgeFunction('credenciado-cobranca-extra', { token, quotation_id: quotationId, acao }, token);
}

export async function submitQuotationToRemocoesPro(data: QuotationPayload): Promise<QuotationResult> {
  const token = import.meta.env.VITE_SITE_TOKEN || '';

  try {
    const responseData = await callEdgeFunction<any>('create-quotation', {
      token,
      ...data
    });

    const createdData = Array.isArray(responseData?.data) ? responseData.data[0] : responseData?.data;
    const protocol = createdData?.protocol || createdData?.id || responseData?.id || 'Pendente';

    if (protocol && protocol !== 'Pendente' && data.source === 'portal_credenciado') {
      saveAccreditedProtocol({
        protocol: String(protocol),
        serviceType: data.serviceType || 'Remoção',
        createdAt: new Date().toISOString()
      });
    }

    if (typeof window !== 'undefined' && (window as any).gtag_report_conversion) {
      (window as any).gtag_report_conversion(data.source || 'quotation_submit');
    }

    return { success: true, protocol: String(protocol), raw: responseData };
  } catch (err: any) {
    console.error('Erro ao enviar para Remoções Pro:', err);
    return {
      success: false,
      protocol: '',
      error: err instanceof Error ? err.message : 'Falha na conexão com o sistema Remoções Pro.',
      status: err instanceof EdgeFunctionError ? err.status : undefined
    };
  }
}

/** A consulta exige o código enviado ao e-mail da solicitação (segunda etapa de segurança). */
export class TrackingCodeRequiredError extends Error {
  email: string;
  constructor(message: string, email: string) {
    super(message);
    this.name = 'TrackingCodeRequiredError';
    this.email = email;
  }
}

export interface TrackingAuth {
  /** Código de 6 dígitos recebido por e-mail */
  codigo?: string;
  /** Acesso já liberado (devolvido após o código; vale 1 hora) */
  accessToken?: string | null;
  /** Credenciado logado no portal */
  credenciadoToken?: string | null;
}

export async function fetchRemovalTracking(protocol: string, verifier: string, auth: TrackingAuth = {}): Promise<NormalizedTracking> {
  const token = import.meta.env.VITE_SITE_TOKEN || '';
  const trimmedProtocol = protocol.trim();
  const verifierDigits = normalizeDigits(verifier);

  if (!trimmedProtocol) {
    throw new Error('Digite o número do protocolo.');
  }
  if (verifierDigits.length < 8) {
    throw new Error('Informe o Telefone (com DDD) ou CPF válido do solicitante.');
  }

  const res = await callEdgeFunction<any>('get-removal-tracking', {
    token,
    protocol: trimmedProtocol,
    verifier: verifierDigits,
    contactPhone: verifierDigits,
    cpf: verifierDigits.length >= 11 ? verifierDigits : '',
    ...(auth.codigo ? { codigo: normalizeDigits(auth.codigo) } : {}),
    ...(auth.accessToken ? { accessToken: auth.accessToken } : {}),
    ...(auth.credenciadoToken ? { credenciadoToken: auth.credenciadoToken } : {})
  });

  if (res?.requires_code) {
    throw new TrackingCodeRequiredError(res.message || 'Enviamos um código para o e-mail cadastrado.', res.email || '');
  }

  const d = res?.data || res;
  if (!d || (!d.protocol && !d.id)) {
    throw new Error('Protocolo não encontrado.');
  }

  const ts = d.timestamps || {};
  const history: TrackingTimelineItem[] = [
    { label: 'Solicitação Registrada', date: d.date ? `${d.date} ${d.time_origin || ''}`.trim() : 'Confirmada', completed: true },
    { label: 'Ambulância Despachada', date: formatIsoDateTime(ts.ts_dispatch), completed: Boolean(ts.ts_dispatch) },
    { label: 'Chegada na Origem', date: formatIsoDateTime(ts.ts_arrival_origin), completed: Boolean(ts.ts_arrival_origin) },
    { label: 'Saída da Origem', date: formatIsoDateTime(ts.ts_departure_origin), completed: Boolean(ts.ts_departure_origin) },
    { label: 'Chegada no Destino', date: formatIsoDateTime(ts.ts_arrival_dest), completed: Boolean(ts.ts_arrival_dest) },
    { label: 'Atendimento Finalizado', date: formatIsoDateTime(ts.ts_finished), completed: Boolean(ts.ts_finished) }
  ];

  return {
    valid: true,
    id: d.id || trimmedProtocol,
    protocol: d.protocol || trimmedProtocol,
    status: d.status || 'Em andamento',
    date: d.date || '',
    timeOrigin: d.time_origin || '',
    origin: d.origin || '—',
    destination: d.destination || '—',
    serviceType: d.service_type || '—',
    removalType: d.removal_type || '—',
    patient: d.patient_name || '—',
    vehicle: d.ambulance || 'Aguardando despacho',
    updatedAt: formatIsoDateTime(d.updated_at),
    history,
    accessToken: res?.access_token || auth.accessToken || null
  };
}

export async function openRemovalDocument(
  protocol: string,
  docType: 'proposal' | 'invoice' | 'receipt' | 'fatura',
  verifier: string,
  auth: TrackingAuth = {}
): Promise<void> {
  const token = import.meta.env.VITE_SITE_TOKEN || '';
  const verifierDigits = normalizeDigits(verifier);

  if (verifierDigits.length < 8) {
    throw new Error('Informe o Telefone ou CPF válido para abrir o documento.');
  }

  const endpoint = docType === 'proposal' ? 'view-proposal' : 'view-invoice';
  const mappedDocType = docType === 'invoice' ? 'fatura' : docType;

  const authFields = {
    ...(auth.accessToken ? { accessToken: auth.accessToken } : {}),
    ...(auth.credenciadoToken ? { credenciadoToken: auth.credenciadoToken } : {})
  };
  const body =
    docType === 'proposal'
      ? { token, protocol, verifier: verifierDigits, ...authFields }
      : { token, protocol, verifier: verifierDigits, docType: mappedDocType, ...authFields };

  const res = await callEdgeFunction<any>(endpoint, body);
  if (res?.requires_code) {
    throw new TrackingCodeRequiredError('Consulte o protocolo novamente e informe o código enviado por e-mail para abrir o documento.', res.email || '');
  }
  const d = res?.data || res;

  const pdfUrl = safeExternalUrl(d?.boleto_pdf_url);
  if (pdfUrl) {
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    return;
  }

  const htmlContent = d?.html || (typeof d === 'string' ? d : null);
  if (htmlContent) {
    // O documento herda a origem do site (blob:), então a CSP abaixo impede qualquer script
    // embutido no HTML vindo do servidor de rodar e acessar a sessão do usuário.
    const csp =
      "default-src 'none'; img-src https: data:; style-src 'unsafe-inline' https:; font-src https: data:; form-action 'none'; base-uri 'none'";
    const fullHtml = `<!DOCTYPE html><html lang="pt-BR"><head><meta http-equiv="Content-Security-Policy" content="${csp}"><meta charset="UTF-8"><meta name="referrer" content="no-referrer"><title>Documento - ${escapeHtml(String(protocol))}</title><style>body{font-family:system-ui,sans-serif;padding:24px;color:#0f172a;max-width:860px;margin:0 auto;}</style></head><body>${htmlContent}</body></html>`;
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
    return;
  }

  throw new Error('Documento ainda não disponível para este protocolo.');
}

export async function credenciadoLogin(cpfCnpj: string, contractCode: string): Promise<CredenciadoLoginResult> {
  const res = await callEdgeFunction<any>('credenciado-login', {
    cpfCnpj: cpfCnpj.trim(),
    contractCode: contractCode.trim()
  });

  const token = res?.token || res?.data?.token;
  const credenciado = res?.data?.credenciado || res?.credenciado;

  if (!token || !credenciado) {
    throw new Error('Resposta inválida do servidor de autenticação.');
  }

  return { token, credenciado };
}

export async function fetchCredenciadoBoletos(
  token: string,
  status: 'Todos' | 'Pendente' | 'Pago' | 'Atrasado' = 'Todos',
  atualizar = false
): Promise<CredenciadoBoletosResponse> {
  const res = await callEdgeFunction<any>(
    'credenciado-boletos',
    { token, status, atualizar },
    token
  );

  const d = res?.data || res;
  return {
    credenciado: d.credenciado,
    summary: d.summary || { totalEmAberto: 0, totalVencido: 0, totalPago: 0, count: 0 },
    invoices: d.invoices || [],
    boletos: d.boletos || []
  };
}

// ============================================================
// Portal do Credenciado — solicitações e remoções do contrato (direto do sistema)
// ============================================================

export interface PortalRemocaoResumo {
  protocolo: string;
  status: string;
  data: string | null;
}

export interface PortalSolicitacao {
  id: string;
  protocolo: string;
  criado_em: string;
  data: string | null;
  hora: string | null;
  paciente: string;
  origem: string;
  destino: string;
  tipo: string;
  tipo_remocao: string;
  status: string;
  remocao: PortalRemocaoResumo | null;
  /** Cobrança extra do credenciado (remoção fora do plano) */
  cobranca_extra?: { motivo: 'excedente' | 'nao_coberto'; valor: number | null; status: string; boleto_gerado: boolean } | null;
  // Somente na Área do Cliente
  valor?: number | null;
  pode_aprovar?: boolean;
  pode_recusar?: boolean;
  aprovado_em?: string | null;
  boleto_id?: string | null;
}

export interface CredenciadoRemocao {
  protocolo: string;
  criado_em: string;
  data: string | null;
  hora: string | null;
  paciente: string;
  origem: string;
  destino: string;
  tipo: string;
  tipo_remocao: string;
  status: string;
  faturada: boolean;
}

export interface CredenciadoPlano {
  tipo?: "Individual" | "Familiar";
  nome: string | null;
  descricao: string | null;
  status: string;
  inicio: string | null;
  dia_vencimento: number;
  valor_mensal: number;
  remocoes_incluidas: number | null;
  valor_excedente: number;
  tipos_cobertos: string[];
  usadas_mes: number;
  restantes_mes: number | null;
}

/** Titular do plano, com os dados do cadastro no sistema (preenche a solicitação "para mim"). */
export interface CredenciadoTitular {
  id: string;
  nome: string;
  idade: string;
  telefone: string;
  endereco: string;
  parentesco: string;
  titular: boolean;
}

export async function fetchCredenciadoRemocoes(token: string): Promise<{
  solicitacoes: PortalSolicitacao[];
  remocoes: CredenciadoRemocao[];
  plano: CredenciadoPlano | null;
  titular: CredenciadoTitular | null;
  beneficiarios: CredenciadoTitular[];
}> {
  const res = await callEdgeFunction<any>('credenciado-remocoes', { token }, token);
  return { solicitacoes: res.solicitacoes || [], remocoes: res.remocoes || [], plano: res.plano || null, titular: res.titular || null, beneficiarios: res.beneficiarios || [] };
}

/** O credenciado pede um novo código de acesso (enviado ao e-mail cadastrado no contrato). */
export async function credenciadoEnviarCodigo(cpfCnpj: string): Promise<{ message: string }> {
  return callEdgeFunction('credenciado-login', { action: 'enviar-codigo', cpfCnpj: normalizeDigits(cpfCnpj) });
}

// ============================================================
// Área do Cliente (cliente avulso) — cadastro, código por e-mail e sessão
// ============================================================

export interface ClienteProfile {
  nome: string;
  documento: string;
  email: string | null;
  telefone: string | null;
  cep: string | null;
  endereco: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  uf: string | null;
}

export interface ClienteBoleto {
  id: string;
  descricao: string | null;
  valor: number;
  vencimento: string | null;
  emissao: string | null;
  status: string;
  data_pagamento: string | null;
  linha_digitavel: string | null;
  pdf_url: string | null;
  pagar_url: string | null;
}

export interface ClienteResumo {
  cliente: ClienteProfile;
  solicitacoes: PortalSolicitacao[];
  boletos: ClienteBoleto[];
}

export interface ClienteCadastroPayload {
  nome: string;
  cpf_cnpj: string;
  email: string;
  telefone: string;
  nascimento?: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  aceite: boolean;
}

export interface ClienteSolicitacaoPayload {
  paciente_nome?: string;
  paciente_idade?: string;
  origem: string;
  destino: string;
  data: string;
  hora: string;
  tipo_servico: string;
  tipo_remocao: string;
  observacoes?: string;
}

const CLIENTE_SESSION_KEY = 'green_client_session';

interface StoredClienteSession {
  token: string;
  cliente: ClienteProfile;
  expiresAt: number;
}

export function saveClienteSession(token: string, cliente: ClienteProfile, expiresAt: number): void {
  try {
    localStorage.setItem(CLIENTE_SESSION_KEY, JSON.stringify({ token, cliente, expiresAt }));
  } catch {
    // Ignore storage errors
  }
}

export function loadClienteSession(): StoredClienteSession | null {
  try {
    const raw = localStorage.getItem(CLIENTE_SESSION_KEY);
    if (!raw) return null;
    const parsed: Partial<StoredClienteSession> = JSON.parse(raw);
    if (!parsed?.token || !parsed.cliente || !parsed.expiresAt || parsed.expiresAt < Date.now()) {
      localStorage.removeItem(CLIENTE_SESSION_KEY);
      return null;
    }
    return parsed as StoredClienteSession;
  } catch {
    clearClienteSession();
    return null;
  }
}

export function clearClienteSession(): void {
  try {
    localStorage.removeItem(CLIENTE_SESSION_KEY);
  } catch {
    // Ignore storage errors
  }
}

export async function clienteCadastrar(payload: ClienteCadastroPayload): Promise<{ message: string; novo: boolean }> {
  return callEdgeFunction('cliente-portal', { action: 'cadastrar', ...payload });
}

export async function clienteEnviarCodigo(cpfCnpj: string): Promise<{ message: string }> {
  return callEdgeFunction('cliente-portal', { action: 'enviar-codigo', cpf_cnpj: cpfCnpj });
}

export async function clienteEntrar(
  cpfCnpj: string,
  codigo: string
): Promise<{ token: string; expiresAt: number; cliente: ClienteProfile }> {
  return callEdgeFunction('cliente-portal', { action: 'entrar', cpf_cnpj: cpfCnpj, codigo });
}

export async function clienteResumo(token: string, atualizar = false): Promise<ClienteResumo> {
  const res = await callEdgeFunction<any>('cliente-portal', { action: 'resumo', token, atualizar }, token);
  return { cliente: res.cliente, solicitacoes: res.solicitacoes || [], boletos: res.boletos || [] };
}

export async function clienteSolicitar(
  token: string,
  payload: ClienteSolicitacaoPayload
): Promise<{ protocolo: string; message: string }> {
  return callEdgeFunction('cliente-portal', { action: 'solicitar', token, ...payload }, token);
}

export async function clienteAprovar(
  token: string,
  quotationId: string
): Promise<{ message: string; boleto: { pdf_url: string | null; pagar_url: string | null; linha_digitavel: string | null } }> {
  return callEdgeFunction('cliente-portal', { action: 'aprovar', token, quotation_id: quotationId }, token);
}

export async function clienteRecusar(token: string, quotationId: string, motivo?: string): Promise<{ message: string }> {
  return callEdgeFunction('cliente-portal', { action: 'recusar', token, quotation_id: quotationId, motivo }, token);
}
