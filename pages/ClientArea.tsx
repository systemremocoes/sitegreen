import React, { useState, useEffect } from 'react';
import {
  Search,
  ArrowRight,
  ArrowLeft,
  Truck,
  Clock,
  FileText,
  Download,
  DollarSign,
  ClipboardCheck,
  AlertCircle,
  CalendarPlus,
  Phone,
  Lock,
  ShieldCheck
} from 'lucide-react';
import { Page } from '../App';
import {
  fetchRemovalTracking,
  openRemovalDocument,
  normalizeDigits,
  NormalizedTracking
} from '../lib/remocoesPro';

interface ClientAreaProps {
  onNavigate: (page: Page) => void;
  initialProtocol?: string | null;
  initialVerifier?: string | null;
}

const ClientArea: React.FC<ClientAreaProps> = ({
  onNavigate,
  initialProtocol,
  initialVerifier
}) => {
  const [trackingCode, setTrackingCode] = useState(initialProtocol || '');
  const [verifier, setVerifier] = useState(initialVerifier || '');
  const [trackingResult, setTrackingResult] = useState<NormalizedTracking | { error: string } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [downloadingDoc, setDownloadingDoc] = useState<string | null>(null);

  const searchProtocol = async (code: string, verif: string) => {
    setIsSearching(true);
    setTrackingResult(null);
    setTrackingCode(code);
    setVerifier(verif);

    try {
      const data = await fetchRemovalTracking(code, verif);
      setTrackingResult(data);
    } catch (error: any) {
      setTrackingResult({ error: error.message || 'Protocolo não encontrado ou dados incorretos.' });
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (initialProtocol && initialVerifier && normalizeDigits(initialVerifier).length >= 8) {
      searchProtocol(initialProtocol, initialVerifier);
    }
  }, [initialProtocol, initialVerifier]);

  const handleTrackingSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await searchProtocol(trackingCode, verifier);
  };

  const handleClearSession = () => {
    setTrackingCode('');
    setVerifier('');
    setTrackingResult(null);
  };

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck size={14} />
              Remoções Avulsas • Acesso Protegido
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#0a2619]">Área do Cliente</h1>
            <p className="text-slate-600 text-sm md:text-base mt-1">
              Acompanhe suas remoções solicitadas, status do deslocamento, propostas, faturas e recibos.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('schedule')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm transition-all"
            >
              <CalendarPlus size={17} />
              <span>Solicitar Remoção</span>
            </button>
            <a
              href="tel:1937923947"
              className="bg-white border border-slate-200 text-[#0a2619] hover:bg-slate-50 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all"
            >
              <Phone size={15} className="text-emerald-600" />
              <span>(19) 3792-3947</span>
            </a>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 md:p-10 min-h-[420px]">
          {(!trackingResult || 'error' in trackingResult) && (
            <div className="max-w-md mx-auto flex flex-col items-center">
              <div className="bg-emerald-50 p-3.5 rounded-2xl text-emerald-600 mb-5">
                <Lock size={30} />
              </div>
              <h2 className="text-2xl font-bold text-[#0a2619] mb-2 text-center">
                Consultar Remoção & Recibos
              </h2>
              <p className="text-slate-600 text-center mb-6 text-sm">
                Por segurança (LGPD), informe o <strong>Protocolo</strong> e o <strong>Telefone ou CPF</strong> do solicitante.
              </p>

              <form onSubmit={handleTrackingSearch} className="w-full space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Número do Protocolo *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Ex: REM123"
                      value={trackingCode}
                      onChange={(e) => setTrackingCode(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm font-bold uppercase text-[#0a2619]"
                    />
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Telefone (com DDD) ou CPF do Solicitante *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="(19) 99999-9999 ou 000.000.000-00"
                      value={verifier}
                      onChange={(e) => setVerifier(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm font-medium text-[#0a2619]"
                    />
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSearching}
                  className="w-full bg-[#0a2619] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-emerald-900 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span>{isSearching ? 'Validando no Remoções Pro...' : 'Validar e Consultar'}</span>
                  {!isSearching && <ArrowRight size={16} />}
                </button>
              </form>

              {trackingResult && 'error' in trackingResult && (
                <div className="mt-5 flex items-center gap-2 text-red-600 font-semibold bg-red-50 px-4 py-3 rounded-xl text-sm animate-shake">
                  <AlertCircle size={17} className="shrink-0" />
                  <span>{trackingResult.error}</span>
                </div>
              )}
            </div>
          )}

          {trackingResult && 'valid' in trackingResult && trackingResult.valid && (
            <div className="animate-slideUp">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                <button
                  onClick={handleClearSession}
                  className="flex items-center text-slate-500 hover:text-emerald-700 font-bold text-sm transition-colors"
                >
                  <ArrowLeft size={16} className="mr-1" /> Sair / Nova Consulta
                </button>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                  <ShieldCheck size={14} /> Sessão validada • Status: {trackingResult.status}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
                      <div>
                        <span className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase mb-1">
                          Protocolo
                        </span>
                        <p className="text-xl font-extrabold text-[#0a2619] font-mono break-all">{trackingResult.protocol}</p>
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
                      <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl gap-3">
                        <span className="text-slate-500">Unidade / Tipo</span>
                        <span className="text-[#0a2619] font-semibold text-right">
                          {trackingResult.serviceType} ({trackingResult.removalType})
                        </span>
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
                      Andamento da Remoção
                    </h3>
                    <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:h-[88%] before:w-0.5 before:bg-slate-100">
                      {trackingResult.history.map((item, idx) => (
                        <div key={idx} className="relative flex items-start gap-3.5">
                          <div
                            className={`w-6 h-6 rounded-full border-4 shrink-0 z-10 ${
                              item.completed ? 'bg-emerald-500 border-white shadow-sm' : 'bg-slate-200 border-white'
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
                      Documentos e Faturas
                    </h3>
                    <div className="space-y-2.5">
                      {[
                        { key: 'proposal' as const, name: 'Proposta Comercial', icon: FileText },
                        { key: 'fatura' as const, name: 'Fatura / Boleto / Recibo', icon: DollarSign }
                      ].map((doc) => {
                        const IconComp = doc.icon;
                        return (
                          <button
                            key={doc.key}
                            type="button"
                            disabled={downloadingDoc === doc.key}
                            onClick={async () => {
                              try {
                                setDownloadingDoc(doc.key);
                                await openRemovalDocument(trackingResult.protocol, doc.key, verifier);
                              } catch (err: any) {
                                alert(err?.message || 'Documento indisponível no momento.');
                              } finally {
                                setDownloadingDoc(null);
                              }
                            }}
                            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all text-left disabled:opacity-50"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                                <IconComp size={16} />
                              </div>
                              <span className="font-bold text-sm text-[#0a2619]">{doc.name}</span>
                            </div>
                            {downloadingDoc === doc.key ? (
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
      </div>
    </div>
  );
};

export default ClientArea;
