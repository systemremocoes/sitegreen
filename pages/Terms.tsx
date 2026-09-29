import React from 'react';
import { FileCheck, AlertTriangle, ArrowLeft, Shield, Clock, Phone, MapPin } from 'lucide-react';
import { Page } from '../App';

interface TermsProps {
  onNavigate: (page: Page) => void;
}

const Terms: React.FC<TermsProps> = ({ onNavigate }) => {
  return (
    <div className="pt-28 pb-20 bg-emerald-50/40 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Botão Voltar */}
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center space-x-2 text-emerald-800 hover:text-emerald-600 font-bold mb-8 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Voltar ao início</span>
        </button>

        {/* Card Principal */}
        <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 p-8 sm:p-12 text-emerald-950">
          <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-emerald-100">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center shrink-0">
              <FileCheck size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#0a2619]">Termos e Condições de Uso</h1>
              <p className="text-emerald-700/70 text-sm font-medium">
                Última atualização: 29 de Setembro de 2026 • Green Emergências Médicas
              </p>
            </div>
          </div>

          <div className="space-y-8 text-emerald-900/80 leading-relaxed font-normal text-sm sm:text-base">
            <section>
              <h2 className="text-xl font-bold text-[#0a2619] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                1. Aceitação dos Termos
              </h2>
              <p>
                Ao acessar o site da <strong>Green Emergências Médicas</strong> ou solicitar nossos serviços de atendimento pré-hospitalar, remoção em ambulância (Suporte Básico ou UTI Móvel), cobertura de eventos ou área protegida, você declara concordar integralmente com estes Termos de Uso e com a nossa Política de Privacidade.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0a2619] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                2. Natureza dos Serviços
              </h2>
              <p className="mb-3">
                A Green Emergências Médicas é uma empresa privada de atendimento médico pré-hospitalar e transporte de pacientes em Limeira e região paulista.
              </p>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3 text-amber-900 text-sm">
                <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Aviso de Urgência Pública:</strong> Em situações de risco iminente de morte em via pública ou catástrofes sem contratação prévia, os serviços públicos de emergência (SAMU 192 e Corpo de Bombeiros 193) também constituem canais de socorro imediato.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0a2619] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                3. Agendamento e Solicitação de Remoções
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>O preenchimento do formulário de agendamento online constitui uma solicitação de reserva sujeita à confirmação de disponibilidade da frota e da equipe técnica.</li>
                <li>O contratante é responsável pela exatidão das informações fornecidas (endereço de origem, destino e condições clínicas gerais do paciente) para que a ambulância adequada (Tipo B ou Tipo D - UTI) seja despachada.</li>
                <li>Cancelamentos de remoções programadas devem ser comunicados com antecedência à nossa central de atendimento telefônico.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0a2619] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                4. Segurança e Propriedade Intelectual
              </h2>
              <p>
                Todo o conteúdo deste site (textos, logotipos, elementos visuais e marcas) é de propriedade exclusiva da Green Emergências Médicas. É proibida qualquer reprodução ou cópia não autorizada para fins comerciais.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0a2619] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                5. Contato e Esclarecimentos
              </h2>
              <p className="mb-3">
                Para dúvidas contratuais, faturamento ou orçamentos para eventos e empresas, utilize nossos canais oficiais:
              </p>
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-sm space-y-1 text-emerald-950 font-medium">
                <p>• <strong>Central 24h:</strong> (19) 3792-3947</p>
                <p>• <strong>Plantão WhatsApp:</strong> (19) 99804-9901</p>
                <p>• <strong>E-mail:</strong> atendimento@greenemergencias.com.br</p>
                <p>• <strong>Endereço:</strong> R. José da Silva Gonçalo, 28 - Jardim Boa Esperança, Limeira - SP</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
