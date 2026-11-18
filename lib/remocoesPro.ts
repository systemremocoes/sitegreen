const FUNCTIONS_BASE_URL =
  import.meta.env.VITE_FUNCTIONS_BASE_URL ||
  'https://kijwizzgbrytvgseixme.supabase.co/functions/v1';

export interface QuotationPayload {
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
}

export interface QuotationResult {
  success: boolean;
  protocol: string;
  raw?: any;
  error?: string;
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
    throw new Error(json?.error || json?.message || `Erro HTTP ${res.status}`);
  }

  if (json?.error) {
    throw new Error(json.error);
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
      error: err instanceof Error ? err.message : 'Falha na conexão com o sistema Remoções Pro.'
    };
  }
}

export async function fetchRemovalTracking(protocol: string, verifier: string): Promise<NormalizedTracking> {
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
    cpf: verifierDigits.length >= 11 ? verifierDigits : ''
  });

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
    history
  };
}

export async function openRemovalDocument(
  protocol: string,
  docType: 'proposal' | 'invoice' | 'receipt' | 'fatura',
  verifier: string
): Promise<void> {
  const token = import.meta.env.VITE_SITE_TOKEN || '';
  const verifierDigits = normalizeDigits(verifier);

  if (verifierDigits.length < 8) {
    throw new Error('Informe o Telefone ou CPF válido para abrir o documento.');
  }

  const endpoint = docType === 'proposal' ? 'view-proposal' : 'view-invoice';
  const mappedDocType = docType === 'invoice' ? 'fatura' : docType;

  const body =
    docType === 'proposal'
      ? { token, protocol, verifier: verifierDigits }
      : { token, protocol, verifier: verifierDigits, docType: mappedDocType };

  const res = await callEdgeFunction<any>(endpoint, body);
  const d = res?.data || res;

  if (d?.boleto_pdf_url) {
    window.open(d.boleto_pdf_url, '_blank');
    return;
  }

  const htmlContent = d?.html || (typeof d === 'string' ? d : null);
  if (htmlContent) {
    const fullHtml = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Documento - ${protocol}</title><style>body{font-family:system-ui,sans-serif;padding:24px;color:#0f172a;max-width:860px;margin:0 auto;}</style></head><body>${htmlContent}</body></html>`;
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
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
  status: 'Todos' | 'Pendente' | 'Pago' | 'Atrasado' = 'Todos'
): Promise<CredenciadoBoletosResponse> {
  const res = await callEdgeFunction<any>(
    'credenciado-boletos',
    { token, status },
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
