
import React from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Stethoscope,
  Ambulance,
  Users,
  ShieldAlert,
  Clock,
  Calendar
} from 'lucide-react';
import { Page } from '../App';

interface ServiceDetailProps {
  serviceId: string;
  onNavigate: (page: Page) => void;
}

const servicesData: Record<string, any> = {
  'uti': {
    title: 'Ambulância UTI (Tipo D)',
    tag: 'Suporte Avançado',
    description: 'Nossa Unidade de Suporte Avançado é um verdadeiro hospital móvel. Projetada para o transporte de pacientes de alto risco, conta com equipamentos de última geração e equipe médica experiente.',
    longDescription: 'A Ambulância UTI Tipo D da Green Emergências é equipada para realizar qualquer tipo de intervenção invasiva e monitoramento crítico durante o trajeto. É a escolha ideal para transferências inter-hospitalares de pacientes instáveis ou atendimentos emergenciais graves.',
    features: [
      'Respirador Mecânico Microprocessado',
      'Monitor Multiparâmetros (ECG, Oximetria, PNI, etc)',
      'Desfibrilador / Cardioversor',
      'Bombas de Infusão de Medicamentos',
      'Kit Completo de Intubação e Vias Aéreas',
      'Equipe: Médico, Enfermeiro e Condutor Socorrista'
    ],
    image: 'https://images.unsplash.com/photo-1513224502586-d1e602410265?auto=format&fit=crop&q=80&w=1200'
  },
  'basico': {
    title: 'Suporte Básico (Tipo B)',
    tag: 'Suporte Intermediário',
    description: 'Ambulâncias destinadas ao transporte de pacientes com risco de vida conhecido, mas estáveis, que necessitam de acompanhamento técnico durante o trajeto.',
    longDescription: 'O Suporte Básico de Vida (Tipo B) é ideal para pacientes que precisam de transporte monitorado, mas que não apresentam necessidade imediata de intervenções invasivas de UTI. É comumente utilizado para altas hospitalares complexas ou transporte para exames específicos.',
    features: [
      'Cilindro de Oxigênio e Inalador',
      'Aspirador de Secreções Portátil',
      'Maleta de Emergência de Vias Aéreas',
      'Maca Retrátil Articulada',
      'Monitor de Sinais Vitais Básico',
      'Equipe: Técnico de Enfermagem e Condutor Socorrista'
    ],
    image: 'https://images.unsplash.com/photo-1587350859728-117622bc73fe?auto=format&fit=crop&q=80&w=1200'
  },
  'remocoes': {
    title: 'Remoções Médicas',
    tag: 'Transferência Segura',
    description: 'Transporte de pacientes estáveis entre residências, clínicas e hospitais. Focado no conforto absoluto e na pontualidade do agendamento.',
    longDescription: 'O serviço de remoção da Green é planejado para oferecer uma experiênca tranquila ao paciente e seus familiares. Seja para uma alta hospitalar, realização de exames ou mudança de domicílio, garantimos um trajeto suave e humanizado.',
    features: [
      'Veículos Modernos e Higienizados',
      'Cadeiras de Rodas e Macas Retráteis',
      'Ar-condicionado e Conforto Acústico',
      'Técnico de Enfermagem e Condutor',
      'Monitoramento de Sinais Vitais',
      'Agendamento Facilitado 24h'
    ],
    image: 'https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?auto=format&fit=crop&q=80&w=1200'
  },
  'area-protegida': {
    title: 'Área Protegida',
    tag: 'Solução Corporativa',
    description: 'Sua empresa ou condomínio sob a guarda da Green. Atendimento médico rápido para colaboradores e visitantes.',
    longDescription: 'A Área Protegida Green oferece segurança jurídica e bem-estar para o seu negócio. No caso de qualquer ocorrência médica no perímetro coberto, nossa central despacha imediatamente a unidade adequada para o socorro no local.',
    features: [
      'Cobertura para Funcionários e Visitantes',
      'Redução de Passivo Trabalhista',
      'Certificado de Empresa Protegida',
      'Atendimento 24h sem limite de chamados',
      'Palestras de Primeiros Socorros (opcional)',
      'Gestão de Saúde Ocupacional'
    ],
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'
  },
  'eventos': {
    title: 'Cobertura Médica para Eventos',
    tag: 'Segurança em Grande Escala',
    description: 'Estrutura completa de ambulâncias e postos médicos para eventos de qualquer porte: shows, feiras, esportes e festas.',
    longDescription: 'Garantimos a segurança de organizadores e público. Nossa logística inclui desde o planejamento preventivo exigido pelos órgãos reguladores até a presença física de UTIs móveis e equipes multidisciplinares prontas para qualquer intercorrência.',
    features: [
      'Postos Médicos Avançados (Ambulatórios local)',
      'Ambulâncias UTI e Básica de prontidão',
      'Equipes: Médicos, Enfermeiros e Socorristas',
      'Atendimento em conformidade com o Corpo de Bombeiros',
      'Logística para rápida evacuação se necessário',
      'Relatórios de atendimentos em tempo real'
    ],
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=1200'
  },
  'siv': {
    title: 'SIV (Suporte Intermediário de Vida)',
    tag: 'Transporte Especializado',
    description: 'A unidade SIV preenche a lacuna entre o suporte básico e a UTI móvel. Conta com enfermeiro a bordo para garantir a segurança em transferências de média complexidade.',
    longDescription: 'O Suporte Intermediário de Vida (SIV) é a escolha inteligente para pacientes que demandam cuidados de enfermagem contínuos (como administração de medicação, aspiração, controle rigoroso de sinais vitais) mas que estão estáveis o suficiente para não requerer a intervenção médica de emergência da UTI. Esta modalidade oferece um excelente equilíbrio entre segurança técnica e custo-benefício.',
    features: [
      'Equipe: Enfermeiro e Condutor Socorrista',
      'Monitor Multiparâmetros',
      'Desfibrilador Externo Automático (DEA)',
      'Material para Curativos e Sondagens',
      'Oxigenoterapia Completa',
      'Medicações de Suporte'
    ],
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200'
  }
};

const ServiceDetail: React.FC<ServiceDetailProps> = ({ serviceId, onNavigate }) => {
  const service = servicesData[serviceId] || servicesData['uti'];

  return (
    <div className="pt-32 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center space-x-2 text-emerald-600 font-bold mb-12 hover:text-emerald-800 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Voltar para Início</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Lado Esquerdo: Conteúdo */}
          <div className="lg:w-2/3">
            <div className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-widest rounded-full mb-6">
              {service.tag}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#0a2619] mb-8 leading-tight">
              {service.title}
            </h1>
            <p className="text-xl text-emerald-900/80 mb-8 font-medium leading-relaxed">
              {service.description}
            </p>

            <div className="rounded-[2.5rem] overflow-hidden mb-12 shadow-2xl bg-emerald-50">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&q=80&w=1200';
                }}
              />
            </div>

            <div className="prose prose-emerald lg:prose-xl max-w-none text-emerald-900/70 font-medium leading-relaxed mb-12">
              <h2 className="text-2xl font-bold text-[#0a2619] mb-4">Informações Detalhadas</h2>
              <p>{service.longDescription}</p>
            </div>

            <div className="bg-emerald-50 rounded-[2.5rem] p-10 border border-emerald-100">
              <h3 className="text-2xl font-bold text-[#0a2619] mb-8 flex items-center space-x-3">
                <ShieldAlert className="text-emerald-500" />
                <span>Especificações Técnicas</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {service.features.map((feature: string, i: number) => (
                  <div key={i} className="flex items-start space-x-3">
                    <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-[#0a2619] font-bold text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lado Direito: Sidebar de Orçamento */}
          <div className="lg:w-1/3">
            <div className="sticky top-32 space-y-8">
              <div className="bg-[#0a2619] text-white p-8 rounded-[2rem] shadow-2xl">
                <h3 className="text-2xl font-bold mb-6">Orçamento Rápido</h3>
                <p className="text-emerald-100/60 mb-8 text-sm font-medium">Preencha e nossa central entrará em contato em poucos minutos.</p>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Seu Nome"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-4 text-white placeholder:text-white/40 outline-none focus:border-emerald-500 transition-all"
                  />
                  <input
                    type="tel"
                    placeholder="WhatsApp"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-4 text-white placeholder:text-white/40 outline-none focus:border-emerald-500 transition-all"
                  />
                  <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-5 rounded-xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95">
                    Solicitar Agora
                  </button>
                </form>
                <div className="mt-8 pt-8 border-t border-white/10 text-center">
                  <p className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-2">Emergência? Ligue agora</p>
                  <a href="tel:1937923947" className="text-xl font-black hover:text-emerald-400 transition-colors">(19) 3792-3947</a>
                </div>
              </div>

              <div className="bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100">
                <div className="flex items-center space-x-3 mb-4">
                  <Clock className="text-emerald-600" />
                  <span className="font-bold text-[#0a2619]">Tempo de Resposta</span>
                </div>
                <p className="text-emerald-900/60 text-sm font-medium">Base estratégica em Limeira garantindo agilidade imediata.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
