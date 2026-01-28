
import React from 'react';
import { Mail, MapPin, Phone, Send, MessageCircle } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-emerald-100">
          {/* Info Side */}
          <div className="lg:w-2/5 bg-[#0a2619] p-12 text-white">
            <h3 className="text-3xl font-bold mb-6 tracking-tight">Atendimento Imediato.</h3>
            <p className="text-emerald-100/60 mb-12 text-lg font-light leading-relaxed">
              Base técnica em Limeira com prontidão total. Ligue agora para emergências ou solicite orçamento para eventos e áreas protegidas.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-emerald-800/50 p-3 rounded-xl shadow-inner text-emerald-400">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-400 uppercase text-xs tracking-widest mb-1">Telefone Fixo</h4>
                  <p className="text-white text-lg font-semibold">(19) 3792-3947</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-emerald-800/50 p-3 rounded-xl shadow-inner text-emerald-400">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-400 uppercase text-xs tracking-widest mb-1">WhatsApp Emergência</h4>
                  <p className="text-white text-lg font-semibold">(19) 98278-0943</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-emerald-800/50 p-3 rounded-xl shadow-inner text-emerald-400">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-400 uppercase text-xs tracking-widest mb-1">E-mail</h4>
                  <p className="text-white text-lg font-semibold">atendimento@greenemergencias.com.br</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-emerald-800/50 p-3 rounded-xl shadow-inner text-emerald-400">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-400 uppercase text-xs tracking-widest mb-1">Endereço</h4>
                  <p className="text-white text-sm leading-relaxed">R. José da Silva Gonçalo, 28<br/>Jardim Boa Esperança, Limeira - SP</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:w-3/5 p-12">
            <h3 className="text-2xl font-bold text-emerald-950 mb-8">Solicitar Orçamento Comercial</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-emerald-800">Seu Nome</label>
                  <input 
                    type="text" 
                    placeholder="Ex: João Silva"
                    className="w-full px-5 py-4 rounded-xl bg-emerald-50/50 border border-emerald-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-emerald-950"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-emerald-800">Seu WhatsApp</label>
                  <input 
                    type="tel" 
                    placeholder="(19) 99999-9999"
                    className="w-full px-5 py-4 rounded-xl bg-emerald-50/50 border border-emerald-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-emerald-950"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-emerald-800">Tipo de Serviço</label>
                <div className="relative">
                  <select className="w-full px-5 py-4 rounded-xl bg-emerald-50/50 border border-emerald-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all appearance-none cursor-pointer text-emerald-950">
                    <option>Selecione uma opção</option>
                    <option>Área Protegida para Empresa</option>
                    <option>Cobertura de Eventos</option>
                    <option>Remoção Programada</option>
                    <option>Outros</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-emerald-800">Sua Mensagem</label>
                <textarea 
                  rows={4}
                  placeholder="Conte-nos como podemos ajudar..."
                  className="w-full px-5 py-4 rounded-xl bg-emerald-50/50 border border-emerald-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none text-emerald-950"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 rounded-xl flex items-center justify-center space-x-3 transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-emerald-600/20 group"
              >
                <span>Enviar Solicitação</span>
                <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
