
import React from 'react';
import {
  Ambulance,
  Stethoscope,
  Truck,
  ShieldCheck,
  CalendarCheck,
  Users,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { Page } from '../App';

interface ServicesProps {
  onNavigate: (page: Page, serviceId?: string) => void;
}

const services = [
  {
    id: 'uti',
    title: 'Ambulância UTI (Tipo D)',
    description: 'Suporte Avançado de Vida (SAV) com respiradores, desfibriladores e equipe médica completa para casos de alta complexidade.',
    benefits: ['Médico e Enfermeiro a bordo', 'Monitoramento Multiparâmetro', 'Protocolos Internacionais'],
    icon: <Ambulance className="text-emerald-600" size={32} />,
    tag: 'Emergência'
  },
  {
    id: 'remocoes',
    title: 'Remoções Médicas',
    description: 'Transporte inter-hospitalar ou domiciliar com segurança, focado no conforto e estabilidade do paciente durante o trajeto.',
    benefits: ['Agendamento 24 Horas', 'Equipe de Apoio Treinada', 'Veículos Higienizados'],
    icon: <Truck className="text-emerald-600" size={32} />,
    tag: 'Transferência'
  },
  {
    id: 'area-protegida',
    title: 'Área Protegida',
    description: 'Solução para empresas, condomínios e escolas. Atendimento médico imediato em caso de emergências no local.',
    benefits: ['Redução de Riscos', 'Certificação Técnica', 'Custo Fixo Mensal'],
    icon: <ShieldCheck className="text-emerald-600" size={32} />,
    tag: 'Corporativo'
  },
  {
    id: 'eventos',
    title: 'Cobertura de Eventos',
    description: 'Posto médico avançado e ambulâncias de prontidão para garantir a segurança em shows, feiras e eventos esportivos.',
    benefits: ['Conformidade Legal', 'Equipe Multidisciplinar', 'Logística de Resgate'],
    icon: <Users className="text-emerald-600" size={32} />,
    tag: 'Eventos'
  },
  {
    id: 'siv',
    title: 'SIV (Suporte Intermediário)',
    description: 'Suporte Intermediário de Vida. Transporte com enfermeiro a bordo, ideal para pacientes de média complexidade.',
    benefits: ['Enfermeiro a Bordo', 'Suporte Técnico Avançado', 'Segurança Assegurada'],
    icon: <Ambulance className="text-emerald-600" size={32} />,
    tag: 'Intermediário'
  },
  {
    id: 'basico',
    title: 'Suporte Básico (Tipo B)',
    description: 'Transporte para pacientes estáveis que necessitam de acompanhamento técnico simples para exames ou altas.',
    benefits: ['Rapidez no Despacho', 'Preço Acessível', 'Cordialidade'],
    icon: <CalendarCheck className="text-emerald-600" size={32} />,
    tag: 'Convencional'
  }
];

const Services: React.FC<ServicesProps> = ({ onNavigate }) => {
  return (
    <div className="py-16 bg-[#f8fafc] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl -z-10 -mr-32 -mt-32"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 text-emerald-700 font-bold uppercase tracking-wider text-xs mb-2">
              <span className="w-8 h-px bg-emerald-600"></span>
              <span>Menu de Serviços</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#0a2619] leading-tight">
              Soluções Sob Medida para a <span className="text-emerald-600">Sua Saúde</span>
            </h3>
          </div>
          <button
            onClick={() => onNavigate('ambulances')}
            className="inline-flex items-center space-x-2 text-sm font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
          >
            <span>Ver todos os tipos de ambulâncias e remoções</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 flex flex-col relative"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  {service.icon}
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-full">
                  {service.tag}
                </span>
              </div>

              <h4 className="text-lg font-bold text-[#0a2619] mb-2 group-hover:text-emerald-700 transition-colors">
                {service.title}
              </h4>

              <p className="text-slate-600 mb-5 flex-grow leading-relaxed text-sm">
                {service.description}
              </p>

              <div className="space-y-2 mb-5 pt-3 border-t border-slate-100">
                {service.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center text-xs text-[#0a2619] font-medium">
                    <CheckCircle2 size={14} className="text-emerald-600 mr-2 shrink-0" />
                    {benefit}
                  </div>
                ))}
              </div>

              <button
                onClick={() => onNavigate('service-detail', service.id)}
                className="w-full flex items-center justify-center space-x-2 bg-slate-50 border border-slate-200 text-[#0a2619] py-2.5 rounded-xl font-bold text-xs hover:bg-[#0a2619] hover:text-white hover:border-[#0a2619] transition-all"
              >
                <span>Ver Detalhes</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
