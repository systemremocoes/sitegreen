import React, { useState } from 'react';
import {
    Calendar,
    MapPin,
    User,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    Clock,
    Ambulance,
    Phone,
    X
} from 'lucide-react';

interface ScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        origin: '',
        destination: '',
        date: '',
        time: '',
        patientName: '',
        patientAge: '',
        contactPhone: '',
        observations: '',
        serviceType: ''
    });

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Evita envio prematuro ao dar Enter nas etapas iniciais
        if (step < 3) {
            nextStep();
            return;
        }

        setLoading(true);

        const token = import.meta.env.VITE_SITE_TOKEN;

        // Use the initialized Supabase client
        const { supabase } = await import('../lib/supabase');

        if (!token) {
            throw new Error('Configuração de Token incompleta.');
        }

        const { data: responseData, error } = await supabase.functions.invoke('create-quotation', {
            body: {
                token: token,
                data: formData
            }
        });

        if (error) {
            throw error;
        }

        // A resposta bem-sucedida do Edge Function já é o responseData
        // Se houver erro de negócio (retorno 400 mas não erro de rede), o supabase client trata erros da function também se configurado, mas vamos verificar.



        setSuccess(true);

        const message = `*Solicitação de Cotação (Site)*%0A%0A*Paciente:* ${formData.patientName} (${formData.patientAge} anos)%0A*Origem:* ${formData.origin}%0A*Destino:* ${formData.destination}%0A*Data/Hora:* ${formData.date} às ${formData.time}%0A*Tipo:* ${formData.serviceType}%0A*Contato:* ${formData.contactPhone}%0A*Obs:* ${formData.observations}%0A%0A*Status:* Cotação Criada com Sucesso`;

        // Abre WhatsApp e Fecha Modal
        window.open(`https://wa.me/5519982780943?text=${message}`, '_blank');

        setTimeout(() => {
            onClose();
            setStep(1);
            setFormData({
                origin: '',
                destination: '',
                date: '',
                time: '',
                patientName: '',
                patientAge: '',
                contactPhone: '',
                observations: '',
                serviceType: ''
            });
            setSuccess(false);
        }, 2000);

    } catch (error) {
        console.error('Erro ao agendar:', error);
        alert(`Erro: ${error instanceof Error ? error.message : 'Falha na conexão'}. Tentaremos te encaminhar para o WhatsApp.`);

        // Fallback para WhatsApp mesmo com erro
        const message = `*Erro na Integração do Site - Solicitação Manual*%0A%0A*Paciente:* ${formData.patientName}%0A*Origem:* ${formData.origin}%0A*Destino:* ${formData.destination}`;
        window.open(`https://wa.me/5519982780943?text=${message}`, '_blank');
        onClose();
    } finally {
        setLoading(false);
    }
};

return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onClose}
        ></div>

        <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden animate-scaleIn max-h-[90vh] flex flex-col">
            {/* Header Sticky */}
            <div className="bg-[#0a2619] p-6 text-white flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-500/20 p-2 rounded-lg">
                        <Calendar size={24} className="text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Agendamento Rápido</h3>
                        <p className="text-emerald-100/60 text-xs">Preencha para solicitar sua remoção</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X size={24} />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                {/* Progress */}
                <div className="mb-8 flex items-center justify-center gap-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'w-8 bg-emerald-500' : 'w-2 bg-gray-200'}`}></div>
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Step 1: Origem/Destino */}
                    {step === 1 && (
                        <div className="space-y-4 animate-fadeIn">
                            <h4 className="font-bold text-[#0a2619] mb-4 text-center">Onde será a remoção?</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500">Origem</label>
                                    <input type="text" name="origin" required value={formData.origin} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none bg-gray-50 focus:bg-white transition-all text-sm" placeholder="Retirar em..." />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500">Destino</label>
                                    <input type="text" name="destination" required value={formData.destination} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none bg-gray-50 focus:bg-white transition-all text-sm" placeholder="Levar para..." />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500">Data Preferencial</label>
                                    <input type="date" name="date" required value={formData.date} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none bg-gray-50 focus:bg-white transition-all text-sm" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500">Hora</label>
                                    <input type="time" name="time" required value={formData.time} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none bg-gray-50 focus:bg-white transition-all text-sm" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Paciente */}
                    {step === 2 && (
                        <div className="space-y-4 animate-fadeIn">
                            <h4 className="font-bold text-[#0a2619] mb-4 text-center">Quem é o paciente?</h4>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500">Nome Completo</label>
                                <input type="text" name="patientName" required value={formData.patientName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none bg-gray-50 focus:bg-white transition-all text-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500">Idade</label>
                                    <input type="number" name="patientAge" required value={formData.patientAge} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none bg-gray-50 focus:bg-white transition-all text-sm" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500">Celular</label>
                                    <input type="tel" name="contactPhone" required value={formData.contactPhone} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none bg-gray-50 focus:bg-white transition-all text-sm" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500">Observações</label>
                                <textarea name="observations" value={formData.observations} onChange={handleInputChange} rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none bg-gray-50 focus:bg-white transition-all text-sm resize-none"></textarea>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Tipo */}
                    {step === 3 && (
                        <div className="space-y-4 animate-fadeIn">
                            <h4 className="font-bold text-[#0a2619] mb-4 text-center">Tipo de Ambulância</h4>
                            <div className="space-y-3">
                                {['simples', 'siv', 'uti'].map((type) => (
                                    <label key={type} className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${formData.serviceType === type ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                                        <input type="radio" name="serviceType" value={type} checked={formData.serviceType === type} onChange={handleInputChange} className="hidden" />
                                        <div className="flex-1">
                                            <div className="font-bold text-[#0a2619] text-sm uppercase">
                                                {type === 'simples' ? 'Básica' : type === 'siv' ? 'SIV (Intermediária)' : 'UTI Móvel'}
                                            </div>
                                        </div>
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.serviceType === type ? 'border-emerald-500' : 'border-gray-300'}`}>
                                            {formData.serviceType === type && <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>}
                                        </div>
                                    </label>
                                ))}
                            </div>
                            <div className="text-xs text-center text-gray-500 mt-4 leading-relaxed">
                                Ao confirmar, você será direcionado ao WhatsApp da nossa Central para finalizar.
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
                        {step > 1 ? (
                            <button type="button" onClick={prevStep} className="text-gray-400 font-bold text-sm hover:text-gray-600">Voltar</button>
                        ) : (
                            <div></div>
                        )}
                        {step < 3 ? (
                            <button type="button" onClick={nextStep} className="bg-[#0a2619] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-emerald-900 transition-colors">Continuar</button>
                        ) : (
                            <button type="submit" disabled={loading} className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed">
                                {loading ? 'Enviando...' : 'Enviar Solicitação'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    </div>
);
};

export default ScheduleModal;
