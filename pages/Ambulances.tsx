import React from 'react';
import {
  Ambulance,
  Truck,
  HeartPulse,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Stethoscope,
  Building2,
  Home,
  FileSearch,
  MapPin,
  Phone
} from 'lucide-react';
import { Page } from '../App';

interface AmbulancesProps {
  onNavigate: (page: Page, serviceId?: string) => void;
}

const ambulanceTypes = [
  {
    id: 'uti',
    title: 'Ambulância UTI Móvel (Tipo D)',
    tag: 'Suporte Avançado',
    description:
      'Unidade de terapia intensiva móvel equipada para pacientes graves ou instáveis que exigem monitoramento contínuo e intervenções avançadas.',
    team: 'Médico, Enfermeiro e Condutor Socorrista',
    specs: [
      'Respirador mecânico microprocessado',
      'Monitor multiparâmetros e desfibrilador',
      'Bombas de infusão de medicamentos',
      'Kit completo de intubação e vias aéreas'
    ],
    icon: <HeartPulse size={24} className="text-emerald-600" />
  },
  {
    id: 'siv',
    title: 'Suporte Intermediário (SIV)',
    tag: 'Cuidados de Enfermagem',
    description:
      'Unidade com enfermeiro a bordo para pacientes de média complexidade que necessitam de medicação, oxigenoterapia ou monitoramento durante o trajeto.',
    team: 'Enfermeiro e Condutor Socorrista',
    specs: [
      'Monitor multiparâmetros e DEA',
      'Oxigenoterapia completa',
      'Material para curativos e sondagens',
      'Administração de medicações de suporte'
    ],
    icon: <Stethoscope size={24} className="text-emerald-600" />
  },
  {
    id: 'basico',
    title: 'Suporte Básico (Tipo B)',
    tag: 'Pacientes Estáveis',
    description:
      'Indicada para o transporte seguro de pacientes estáveis sem risco imediato de morte, ideal para altas hospitalares, exames e consultas.',
    team: 'Técnico de Enfermagem e Condutor Socorrista',
    specs: [
      'Cilindro de oxigênio e aspirador portátil',
      'Monitor de sinais vitais básico',
      'Maca retrátil articulada e cadeira de rodas',
      'Conforto térmico e acústico'
    ],
    icon: <Ambulance size={24} className="text-emerald-600" />
  }
];

const removalTypes = [
  {
    title: 'Remoção Inter-Hospitalar',
    description:
      'Transferência segura entre hospitais, UTIs ou prontos-socorros, com comunicação direta entre equipes médicas.',
    icon: <Building2 size={22} className="text-emerald-600" />
  },
  {
    title: 'Alta Hospitalar & Domiciliar',
    description:
      'Transporte humanizado do hospital para a residência ou clínicas de repouso, com total cuidado no embarque e desembarque.',
    icon: <Home size={22} className="text-emerald-600" />
  },
  {
    title: 'Exames, Consultas e Procedimentos',
    description:
      'Acompanhamento com ida, espera opcional e retorno para tomografias, ressonâncias, hemodiálise e consultas.',
    icon: <FileSearch size={22} className="text-emerald-600" />
  },
  {
    title: 'Remoções de Longa Distância',
    description:
      'Logística planejada para viagens intermunicipais e interestaduais saindo de Limeira e região para todo o Brasil.',
    icon: <MapPin size={22} className="text-emerald-600" />
  }
];

const Ambulances: React.FC<AmbulancesProps> = ({ onNavigate }) => {
  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center space-x-2 text-emerald-700 hover:text-emerald-900 font-semibold text-sm mb-8 transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Voltar para Início</span>
        </button>

        {/* Cabeçalho */}
        <div className="max-w-3xl mb-14">
          <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            Frota & Operações Médicas
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0a2619] mb-4 leading-tight">
            Nossas Ambulâncias e Tipos de Remoções
          </h1>
          <p className="text-base text-emerald-950/75 leading-relaxed">
            Contamos com frota própria homologada conforme as normas da ANVISA e do Ministério da Saúde, preparada para cada nível de complexidade clínica.
          </p>
        </div>

        {/* Tipos de Ambulâncias */}
        <div className="mb-16">
          <h2 className="text-xl md:text-2xl font-bold text-[#0a2619] mb-6">
            Tipos de Ambulâncias Disponíveis
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {ambulanceTypes.map((amb) => (
              <div
                key={amb.id}
                className="bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-lg transition-all p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                      {amb.icon}
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold">
                      {amb.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#0a2619] mb-2">{amb.title}</h3>
                  <p className="text-sm text-emerald-950/70 leading-relaxed mb-4">
                    {amb.description}
                  </p>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 mb-5">
                    <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                      Equipe a Bordo
                    </p>
                    <p className="text-sm font-semibold text-[#0a2619]">{amb.team}</p>
                  </div>

                  <ul className="space-y-2.5 mb-6">
                    {amb.specs.map((spec, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-emerald-950/80">
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => onNavigate('service-detail', amb.id)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-sm transition-colors"
                  >
                    Ver Detalhes
                  </button>
                  <button
                    onClick={() => onNavigate('schedule')}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#0a2619] hover:bg-emerald-900 text-white font-semibold text-sm flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Solicitar</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tipos de Remoções */}
        <div className="mb-16">
          <h2 className="text-xl md:text-2xl font-bold text-[#0a2619] mb-6">
            Tipos de Remoções Médicas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {removalTypes.map((rem, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 flex items-start gap-4 hover:border-emerald-300 transition-colors"
              >
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                  {rem.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0a2619] mb-1.5">{rem.title}</h3>
                  <p className="text-sm text-emerald-950/70 leading-relaxed">{rem.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Rodapé da Página */}
        <div className="bg-[#0a2619] text-white rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-xl md:text-2xl font-bold mb-2">
              Precisa de orientação para escolher a ambulância ideal?
            </h3>
            <p className="text-sm text-emerald-100/80 max-w-2xl">
              Nossa central médica 24h avalia o quadro clínico do paciente e indica a unidade mais adequada para o transporte.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href="tel:1937923947"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm flex items-center gap-2 transition-colors"
            >
              <Phone size={16} />
              <span>(19) 3792-3947</span>
            </a>
            <button
              onClick={() => onNavigate('schedule')}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0a2619] font-bold text-sm flex items-center gap-2 transition-colors"
            >
              <Truck size={16} />
              <span>Agendar Remoção</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ambulances;
