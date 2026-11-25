import React, { useState } from 'react';
import { Receipt } from 'lucide-react';

/** Dados de quem paga a remoção avulsa (tomador do boleto e da nota fiscal). */
export interface TomadorData {
  tipo: 'paciente' | 'outro';
  nome: string;
  cnpj_cpf: string;
  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
}

export const emptyTomador: TomadorData = {
  tipo: 'paciente', nome: '', cnpj_cpf: '', cep: '', endereco: '', numero: '', bairro: '', cidade: '', uf: ''
};

const digits = (v: string) => String(v || '').replace(/\D/g, '');

/** Campos que faltam para faturar e emitir a nota (vazio = completo). */
export const validarTomador = (t: TomadorData, patientName: string): string[] => {
  const faltando: string[] = [];
  const doc = digits(t.cnpj_cpf);
  if (t.tipo === 'paciente') {
    if (doc.length !== 11) faltando.push('CPF do paciente');
    if (!patientName.trim()) faltando.push('nome do paciente');
  } else {
    if (!t.nome.trim()) faltando.push('nome/razão social do responsável');
    if (doc.length !== 11 && doc.length !== 14) faltando.push('CPF/CNPJ do responsável');
  }
  if (digits(t.cep).length !== 8 || !t.endereco.trim() || !t.numero.trim() || !t.bairro.trim() || !t.cidade.trim() || t.uf.trim().length !== 2) {
    faltando.push('endereço completo para a nota fiscal');
  }
  return faltando;
};

/** Monta o objeto enviado ao Remoções Pro. */
export const tomadorPayload = (t: TomadorData, patientName: string) => ({
  tipo: t.tipo,
  razao_social: (t.tipo === 'paciente' ? patientName : t.nome).trim(),
  cnpj_cpf: digits(t.cnpj_cpf),
  cep: digits(t.cep),
  endereco: t.endereco.trim(),
  numero: t.numero.trim(),
  bairro: t.bairro.trim(),
  cidade: t.cidade.trim(),
  uf: t.uf.trim().toUpperCase()
});

const maskDoc = (raw: string) => {
  const d = digits(raw).slice(0, 14);
  if (d.length <= 11) return d.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  return d.replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\d{4})(\d)/, '$1-$2');
};

const inp = 'w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none text-sm text-[#0a2619]';
const lbl = 'text-xs font-semibold text-slate-600';

const TomadorFields: React.FC<{ value: TomadorData; onChange: (v: TomadorData) => void }> = ({ value: t, onChange }) => {
  const [cepLoading, setCepLoading] = useState(false);
  const set = (k: keyof TomadorData, v: string) => onChange({ ...t, [k]: v });

  const lookupCep = async (raw: string) => {
    const d = digits(raw);
    if (d.length !== 8) return;
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${d}/json/`);
      const j = await res.json();
      if (!j?.erro) {
        onChange({ ...t, cep: raw, endereco: j.logradouro || t.endereco, bairro: j.bairro || t.bairro, cidade: j.localidade || t.cidade, uf: j.uf || t.uf });
      }
    } catch {
      // preenchimento manual continua disponível
    } finally {
      setCepLoading(false);
    }
  };

  return (
    <div className="space-y-3 p-3 rounded-xl border border-emerald-100 bg-emerald-50/40">
      <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
        <Receipt size={14} /> Dados para faturamento e nota fiscal
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {([
          { id: 'paciente', titulo: 'No nome do paciente', desc: 'Usa o CPF do paciente' },
          { id: 'outro', titulo: 'Outro responsável', desc: 'Familiar ou empresa (CPF/CNPJ)' }
        ] as const).map((op) => (
          <button
            key={op.id}
            type="button"
            onClick={() => onChange({ ...t, tipo: op.id })}
            className={`text-left p-2.5 rounded-lg border-2 transition-all ${t.tipo === op.id ? 'border-emerald-500 bg-white' : 'border-slate-200 bg-white/60 hover:border-emerald-200'}`}
          >
            <p className="font-bold text-xs text-[#0a2619]">{op.titulo}</p>
            <p className="text-[11px] text-slate-500">{op.desc}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
        {t.tipo === 'outro' && (
          <div className="space-y-1 sm:col-span-4">
            <label className={lbl}>Nome / Razão social do responsável *</label>
            <input type="text" value={t.nome} onChange={(e) => set('nome', e.target.value)} className={inp} placeholder="Quem vai pagar" />
          </div>
        )}
        <div className={`space-y-1 ${t.tipo === 'outro' ? 'sm:col-span-2' : 'sm:col-span-3'}`}>
          <label className={lbl}>{t.tipo === 'paciente' ? 'CPF do paciente *' : 'CPF / CNPJ *'}</label>
          <input type="text" inputMode="numeric" value={maskDoc(t.cnpj_cpf)} onChange={(e) => set('cnpj_cpf', e.target.value)} className={inp} placeholder={t.tipo === 'paciente' ? '000.000.000-00' : 'CPF ou CNPJ'} />
        </div>
        <div className={`space-y-1 ${t.tipo === 'outro' ? 'sm:col-span-2' : 'sm:col-span-3'}`}>
          <label className={lbl}>CEP * {cepLoading && <span className="text-emerald-600">buscando…</span>}</label>
          <input
            type="text"
            inputMode="numeric"
            value={t.cep}
            onChange={(e) => {
              set('cep', e.target.value);
              if (digits(e.target.value).length === 8) lookupCep(e.target.value);
            }}
            className={inp}
            placeholder="00000-000"
          />
        </div>
        <div className="space-y-1 sm:col-span-3">
          <label className={lbl}>Endereço *</label>
          <input type="text" value={t.endereco} onChange={(e) => set('endereco', e.target.value)} className={inp} />
        </div>
        <div className="space-y-1 sm:col-span-1">
          <label className={lbl}>Número *</label>
          <input type="text" value={t.numero} onChange={(e) => set('numero', e.target.value)} className={inp} />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <label className={lbl}>Bairro *</label>
          <input type="text" value={t.bairro} onChange={(e) => set('bairro', e.target.value)} className={inp} />
        </div>
        <div className="space-y-1 sm:col-span-4">
          <label className={lbl}>Cidade *</label>
          <input type="text" value={t.cidade} onChange={(e) => set('cidade', e.target.value)} className={inp} />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <label className={lbl}>UF *</label>
          <input type="text" maxLength={2} value={t.uf} onChange={(e) => set('uf', e.target.value.toUpperCase())} className={`${inp} uppercase`} />
        </div>
      </div>
      <p className="text-[11px] text-slate-500">Esses dados saem no boleto e na nota fiscal da remoção.</p>
    </div>
  );
};

export default TomadorFields;
