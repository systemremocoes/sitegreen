
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
    <div className="py-24 bg-[#f8fafc] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl -z-10 -mr-32 -mt-32"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 text-emerald-600 font-bold uppercase tracking-widest text-xs mb-4">
              <span className="w-8 h-px bg-emerald-600"></span>
              <span>Menu de Serviços</span>
            </div>
            <h3 className="text-3xl md:text-5xl font-extrabold text-[#0a2619] mb-6 leading-tight">
              Soluções Sob Medida <br /> para a <span className="text-emerald-500 underline decoration-emerald-200">Sua Saúde</span>
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white rounded-[2rem] p-8 border border-emerald-100 shadow-xl shadow-emerald-900/5 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-500 flex flex-col relative overflow-hidden"
            >
              <div className="absolute top-6 right-6 px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                {service.tag}
              </div>

              <div className="mb-8 w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white group-hover:rotate-6 transition-all duration-500">
                {service.icon}
              </div>

              <h4 className="text-2xl font-bold text-emerald-950 mb-4 group-hover:text-emerald-600 transition-colors">
                {service.title}
              </h4>

              <p className="text-emerald-900/60 mb-8 flex-grow leading-relaxed font-medium text-sm">
                {service.description}
              </p>

              <div className="space-y-3 mb-10">
                {service.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center text-xs text-emerald-950 font-bold">
                    <CheckCircle2 size={14} className="text-emerald-500 mr-2 shrink-0" />
                    {benefit}
                  </div>
                ))}
              </div>

              <button
                onClick={() => onNavigate('service-detail', service.id)}
                className="w-full flex items-center justify-center space-x-2 bg-emerald-50 text-emerald-700 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all transform active:scale-95"
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
