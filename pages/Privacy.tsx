import React from 'react';
import { Shield, Lock, Eye, FileText, ArrowLeft, CheckCircle2, Mail, Phone, MapPin } from 'lucide-react';
import { Page } from '../App';

interface PrivacyProps {
  onNavigate: (page: Page) => void;
}

const Privacy: React.FC<PrivacyProps> = ({ onNavigate }) => {
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
              <Shield size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#0a2619]">Política de Privacidade</h1>
              <p className="text-emerald-700/70 text-sm font-medium">
                Última atualização: 29 de Setembro de 2026 • Em conformidade com a LGPD (Lei nº 13.709/2018)
              </p>
            </div>
          </div>

          <div className="space-y-8 text-emerald-900/80 leading-relaxed font-normal text-sm sm:text-base">
            <section>
              <h2 className="text-xl font-bold text-[#0a2619] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                1. Visão Geral e Compromisso
              </h2>
              <p>
                A <strong>Green Emergências Médicas</strong> tem o compromisso de resguardar a privacidade e a segurança dos dados pessoais de seus pacientes, clientes corporativos e visitantes do site, em estrita conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 - LGPD) e as diretrizes de transparência de publicidade digital do Google.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0a2619] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                2. Dados que Coletamos
              </h2>
              <p className="mb-3">
                Coletamos dados fornecidos diretamente por você ou de forma automática para possibilitar o atendimento de urgência, agendamento de remoções ou cotações corporativas:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Dados de Contato:</strong> Nome, número de telefone/WhatsApp, e-mail e endereço ou trajeto de remoção (origem e destino).</li>
                <li><strong>Dados para Atendimento Médico e Agendamento:</strong> Nome do paciente, idade e observações clínicas relevantes para a correta triagem da ambulância (Suporte Básico ou UTI Móvel).</li>
                <li><strong>Dados de Navegação:</strong> Endereço IP, tipo de navegador, páginas visualizadas, dados de cookies técnicos e identificadores de campanhas publicitárias.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0a2619] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                3. Finalidade do Tratamento de Dados
              </h2>
              <p className="mb-2">Os dados coletados são utilizados exclusivamente para:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm">Triagem de ambulâncias e despacho seguro da equipe de saúde</span>
                </div>
                <div className="flex items-start gap-2 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm">Envio de orçamentos e propostas comerciais solicitadas</span>
                </div>
                <div className="flex items-start gap-2 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm">Confirmação e rastreamento de transporte agendado</span>
                </div>
                <div className="flex items-start gap-2 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm">Medição de desempenho de campanhas no Google Ads</span>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0a2619] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                4. Cookies e Tecnologias de Anúncios (Google Ads)
              </h2>
              <p className="mb-3">
                Utilizamos cookies e tags de conversão para aprimorar a experiência de navegação e avaliar a eficácia dos nossos anúncios no <strong>Google Ads</strong> e ferramentas de análise (Google Analytics).
              </p>
              <p>
                Os cookies ajudam a entender quando um visitante clicou em um anúncio e realizou uma ação relevante (como chamar no WhatsApp ou ligar para a central). Nenhum dado médico confidencial é compartilhado com plataformas de anúncios. Você pode desativar o uso de cookies a qualquer momento nas configurações do seu navegador ou através do Gerenciador de Preferências de Anúncios do Google.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0a2619] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                5. Sigilo Médico e Segurança
              </h2>
              <p>
                Informações de saúde e prontuários vinculados às remoções médicas são tratadas com sigilo profissional rigoroso, em conformidade com as normas do Conselho Federal de Medicina (CFM), Conselho Regional de Enfermagem (COREN) e legislação sanitária vigente. Não comercializamos, alugamos ou repassamos seus dados a terceiros para fins de marketing.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0a2619] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                6. Seus Direitos como Titular de Dados
              </h2>
              <p className="mb-2">Conforme a LGPD, você possui o direito de:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Confirmar a existência de tratamento de seus dados pessoais;</li>
                <li>Acessar, corrigir ou atualizar dados incompletos ou inexatos;</li>
                <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários;</li>
                <li>Revogar o consentimento a qualquer momento.</li>
              </ul>
            </section>

            <section className="bg-emerald-900 text-white p-6 sm:p-8 rounded-2xl">
              <h2 className="text-lg font-bold text-emerald-400 mb-2">Canal do Encarregado de Dados (DPO)</h2>
              <p className="text-emerald-100/80 text-sm mb-4">
                Para exercer seus direitos ou esclarecer dúvidas sobre esta Política de Privacidade, entre em contato diretamente com nossa central de atendimento:
              </p>
              <div className="space-y-2 text-sm text-emerald-200">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-emerald-400" />
                  <span>atendimento@greenemergencias.com.br</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-emerald-400" />
                  <span>(19) 3792-3947 • Central 24h</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-emerald-400" />
                  <span>R. José da Silva Gonçalo, 28 - Jd. Boa Esperança, Limeira - SP</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
