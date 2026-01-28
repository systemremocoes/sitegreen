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
    Search,
    Truck,
    AlertCircle,
    FileText,
    Download,
    DollarSign,
    ClipboardCheck,
    MessageCircle
} from 'lucide-react';

const Schedule: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'schedule' | 'tracking'>('schedule');
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        origin: '',
        destination: '',
        date: '',
        time: '',
        patientName: '',
        patientAge: '',
        contactPhone: '',
        email: '',
        observations: '',
        serviceType: ''
    });

    const [trackingCode, setTrackingCode] = useState('');
    const [trackingResult, setTrackingResult] = useState<any>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [downloadingDoc, setDownloadingDoc] = useState<number | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => {
        setLoading(false);
        setStep(prev => prev + 1);
    };
    const prevStep = () => setStep(prev => prev - 1);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [successProtocol, setSuccessProtocol] = useState<string | null>(null);

    const handleSubmitSchedule = async (e: React.FormEvent) => {
        e.preventDefault();

        if (step < 3) {
            nextStep();
            return;
        }

        if (!formData.serviceType) {
            alert('Por favor, selecione o tipo de ambulância.');
            return;
        }

        setLoading(true);

        try {
            const token = import.meta.env.VITE_SITE_TOKEN;
            const { supabase } = await import('../lib/supabase');

            if (!token) throw new Error('Configuração de Token incompleta.');

            const { data: responseData, error } = await supabase.functions.invoke('create-quotation', {
                body: { token, data: formData }
            });

            if (error) throw error;

            console.log('Response:', responseData);

            // Tenta pegar o ID retornado. Pode vir como {data: {id: ...}} ou direto se a function retornar o obj.
            // Assumindo responseData.data -> array or object
            const createdData = Array.isArray(responseData.data) ? responseData.data[0] : responseData.data;
            let protocol = createdData?.id || 'Pendente';

            // Se for UUID, formata ou guarda assim mesmo. O backend de rastreio já trata UUID.
            // Mas para exibição, se for muito longo, pode assustar o usuário, mas é o que temos.
            // O sistema Remoção Pro usa UUID para cotações e ID numérico para remoções.
            // O 'protocolo' citado pelo user é esse ID.

            setSuccessProtocol(protocol);
            setSuccess(true);
            // Não redireciona mais para o WhatsApp automaticamente, nem reseta sozinho.

        } catch (error) {
            console.error('Erro ao agendar:', error);
            alert(`Erro ao processar: ${error instanceof Error ? error.message : 'Falha desconhecida'}.`);

            // Fallback WhatsApp em caso de erro
            const message = `*Erro Site - Solicitação Manual*%0A%0A*Paciente:* ${formData.patientName}%0A*Origem:* ${formData.origin}%0A*Destino:* ${formData.destination}`;
            window.open(`https://wa.me/5519982780943?text=${message}`, '_blank');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setSuccess(false);
        setSuccessProtocol(null);
        setStep(1);
        setFormData({
            origin: '',
            destination: '',
            date: '',
            time: '',
            patientName: '',
            patientAge: '',
            contactPhone: '',
            email: '',
            observations: '',
            serviceType: ''
        });
    };

    const handleTrackingSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSearching(true);
        setTrackingResult(null);

        try {
            const token = import.meta.env.VITE_SITE_TOKEN;
            const { supabase } = await import('../lib/supabase');

            if (!trackingCode.trim()) {
                throw new Error('Digite o número do protocolo.');
            }

            const { data, error } = await supabase.functions.invoke('get-removal-tracking', {
                body: {
                    token: token,
                    protocol: trackingCode.trim()
                }
            });

            if (error) {
                // Tenta ler o body de erro se disponivel, senao usa o erro padrao
                try {
                    const errBody = await error.context.json();
                    throw new Error(errBody.error || error.message);
                } catch {
                    throw new Error('Erro ao buscar protocolo. Verifique o código.');
                }
            }

            if (data.error) {
                throw new Error(data.error);
            }

            setTrackingResult(data);

        } catch (error: any) {
            console.error(error);
            setTrackingResult({ error: error.message || 'Protocolo não encontrado ou sistema indisponível.' });
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-black text-[#0a2619] mb-4">Central do Cliente</h1>
                    <p className="text-emerald-900/60 text-lg">Gerencie seus agendamentos e acompanhe remoções em tempo real.</p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-emerald-100 flex items-center gap-2">
                        <button
                            onClick={() => setActiveTab('schedule')}
                            className={`px-8 py-3 rounded-xl font-bold flex items-center transition-all ${activeTab === 'schedule' ? 'bg-[#0a2619] text-white shadow-md' : 'text-emerald-900 hover:bg-emerald-50'}`}
                        >
                            <Calendar className="mr-2" size={18} />
                            Novo Agendamento
                        </button>
                        <button
                            onClick={() => setActiveTab('tracking')}
                            className={`px-8 py-3 rounded-xl font-bold flex items-center transition-all ${activeTab === 'tracking' ? 'bg-[#0a2619] text-white shadow-md' : 'text-emerald-900 hover:bg-emerald-50'}`}
                        >
                            <Search className="mr-2" size={18} />
                            Minhas Remoções
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="relative bg-white rounded-[2.5rem] shadow-xl border border-emerald-100 overflow-hidden min-h-[500px]">

                    {/* TAB: AGENDAMENTO */}
                    {activeTab === 'schedule' && (
                        <div className="p-8 md:p-12 animate-fadeIn max-w-3xl mx-auto">
                            {/* Progress Bar */}
                            <div className="mb-8">
                                <div className="flex justify-between mb-4 px-2">
                                    <span className={`text-xs uppercase font-bold tracking-wider ${step >= 1 ? 'text-emerald-600' : 'text-gray-300'}`}>1. Trajeto</span>
                                    <span className={`text-xs uppercase font-bold tracking-wider ${step >= 2 ? 'text-emerald-600' : 'text-gray-300'}`}>2. Paciente</span>
                                    <span className={`text-xs uppercase font-bold tracking-wider ${step >= 3 ? 'text-emerald-600' : 'text-gray-300'}`}>3. Serviço</span>
                                </div>
                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 transition-all duration-500 ease-out"
                                        style={{ width: `${(step / 3) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmitSchedule}>
                                {/* Step 1: Trajeto */}
                                {step === 1 && (
                                    <div className="space-y-6 animate-fadeIn">
                                        <h2 className="text-2xl font-bold text-[#0a2619] mb-6">Dados da Viagem</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-500">Origem</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        name="origin"
                                                        value={formData.origin}
                                                        onChange={handleInputChange}
                                                        placeholder="Endereço de retirada"
                                                        className="w-full pl-10 pr-4 py-4 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all bg-gray-50 focus:bg-white"
                                                    />
                                                    <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-500">Destino</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        name="destination"
                                                        value={formData.destination}
                                                        onChange={handleInputChange}
                                                        placeholder="Endereço de destino"
                                                        className="w-full pl-10 pr-4 py-4 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all bg-gray-50 focus:bg-white"
                                                    />
                                                    <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-500">Data</label>
                                                <input
                                                    type="date"
                                                    name="date"
                                                    value={formData.date}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all bg-gray-50 focus:bg-white"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-500">Horário</label>
                                                <div className="relative">
                                                    <input
                                                        type="time"
                                                        name="time"
                                                        value={formData.time}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all bg-gray-50 focus:bg-white"
                                                    />
                                                    <Clock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Paciente */}
                                {step === 2 && (
                                    <div className="space-y-6 animate-fadeIn">
                                        <h2 className="text-2xl font-bold text-[#0a2619] mb-6">Dados do Paciente</h2>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-500">Nome Completo</label>
                                            <input
                                                type="text"
                                                name="patientName"
                                                value={formData.patientName}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all bg-gray-50 focus:bg-white"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-500">Idade</label>
                                                <input
                                                    type="number"
                                                    name="patientAge"
                                                    value={formData.patientAge}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all bg-gray-50 focus:bg-white"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-500">Telefone Responsável</label>
                                                <div className="relative">
                                                    <input
                                                        type="tel"
                                                        name="contactPhone"
                                                        value={formData.contactPhone}
                                                        onChange={handleInputChange}
                                                        className="w-full pl-10 pr-4 py-4 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all bg-gray-50 focus:bg-white"
                                                    />
                                                    <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                </div>
                                            </div>

                                            <div className="space-y-2 col-span-1 md:col-span-2">
                                                <label className="text-sm font-bold text-gray-500">E-mail para Confirmação</label>
                                                <div className="relative">
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        placeholder="exemplo@email.com"
                                                        className="w-full pl-10 pr-4 py-4 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all bg-gray-50 focus:bg-white"
                                                    />
                                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">@</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-500">Observações Médicas</label>
                                            <textarea
                                                name="observations"
                                                value={formData.observations}
                                                onChange={handleInputChange}
                                                rows={3}
                                                className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none bg-gray-50 focus:bg-white"
                                            ></textarea>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Serviço */}
                                {step === 3 && (
                                    <div className="space-y-6 animate-fadeIn">
                                        <h2 className="text-2xl font-bold text-[#0a2619] mb-6">Tipo de Ambulância</h2>
                                        <div className="grid grid-cols-1 gap-4">
                                            {['simples', 'siv', 'uti'].map((type) => (
                                                <label key={type} className={`relative flex items-center p-5 border rounded-2xl cursor-pointer transition-all ${formData.serviceType === type ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-1 ring-emerald-500' : 'border-gray-100 hover:border-emerald-200 hover:bg-gray-50'}`}>
                                                    <input
                                                        type="radio"
                                                        name="serviceType"
                                                        value={type}
                                                        checked={formData.serviceType === type}
                                                        onChange={handleInputChange}
                                                        className="hidden"
                                                    />
                                                    <div className={`p-3 rounded-xl mr-4 ${formData.serviceType === type ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                        <Ambulance size={24} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-bold text-[#0a2619] text-lg">
                                                            {type === 'simples' ? 'Suporte Básico' : type === 'siv' ? 'Suporte Intermediário (SIV)' : 'UTI Móvel (Tipo D)'}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {type === 'simples' ? 'Para altas e exames simples.' : type === 'siv' ? 'Com enfermeiro. Medicação e oxigênio.' : 'Com médico. Casos graves.'}
                                                        </div>
                                                    </div>
                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.serviceType === type ? 'border-emerald-500' : 'border-gray-200'}`}>
                                                        {formData.serviceType === type && <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>}
                                                    </div>
                                                </label>
                                            ))}
                                        </div>

                                        <div className="bg-emerald-50 p-6 rounded-2xl text-sm text-emerald-900 leading-relaxed text-center">
                                            <p>Ao solicitar, você será direcionado ao nosso WhatsApp para validação imediata.</p>
                                        </div>
                                    </div>
                                )}

                                {/* Nav Buttons */}
                                <div className="flex justify-between mt-12 pt-8 border-t border-gray-100">
                                    {step > 1 ? (
                                        <button type="button" onClick={prevStep} className="flex items-center text-gray-400 font-bold hover:text-gray-600 transition-colors">
                                            <ArrowLeft size={18} className="mr-2" /> Voltar
                                        </button>
                                    ) : (<div></div>)}

                                    {step < 3 ? (
                                        <button type="button" onClick={nextStep} className="bg-[#0a2619] text-white px-8 py-3 rounded-xl font-bold flex items-center hover:bg-emerald-900 transition-colors shadow-lg">
                                            Próximo <ArrowRight size={18} className="ml-2" />
                                        </button>
                                    ) : (
                                        <button type="submit" disabled={loading} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold flex items-center hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed">
                                            {loading ? 'Enviando...' : 'Confirmar Solicitação'} <CheckCircle2 size={18} className="ml-2" />
                                        </button>
                                    )}
                                </div>
                            </form>
                            {loading && (
                                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
                                    <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-6"></div>
                                    <h3 className="text-2xl font-bold text-[#0a2619] mb-2">Processando solicitação...</h3>
                                    <p className="text-gray-500">Estamos conectando com nossa central de operações.</p>
                                </div>
                            )}

                            {success && (
                                <div className="absolute inset-0 bg-white z-50 rounded-[2.5rem] flex flex-col animate-fadeIn">
                                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                                        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 animate-bounce">
                                            <CheckCircle2 size={48} />
                                        </div>
                                        <h3 className="text-3xl font-black text-[#0a2619] mb-4">Solicitação Enviada!</h3>
                                        <p className="text-gray-500 max-w-md mb-8">
                                            Recebemos seu pedido de agendamento. Nossa equipe já está analisando a disponibilidade e requisitos.
                                        </p>

                                        {successProtocol && (
                                            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-6 mb-6 w-full max-w-sm">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Protocolo de Rastreamento</p>
                                                <p className="text-2xl font-black text-emerald-600 break-all select-all font-mono">{successProtocol.split('-')[0].toUpperCase()}</p>
                                                {successProtocol.includes('-') && <p className="text-[10px] text-gray-400 mt-1">{successProtocol}</p>}
                                            </div>
                                        )}

                                        <div className="flex flex-col gap-3 w-full max-w-xs">
                                            <button
                                                onClick={() => {
                                                    const message = `*Nova Solicitação (Site)*%0A%0A*Protocolo:* ${successProtocol}%0A*Paciente:* ${formData.patientName}%0A*Origem:* ${formData.origin}%0A*Destino:* ${formData.destination}%0A*Data:* ${formData.date} às ${formData.time}%0A*Tipo:* ${formData.serviceType}`;
                                                    window.open(`https://wa.me/5519982780943?text=${message}`, '_blank');
                                                }}
                                                className="bg-green-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-600 transition-colors shadow-lg flex items-center justify-center gap-2"
                                            >
                                                <MessageCircle size={20} />
                                                Enviar no WhatsApp
                                            </button>

                                            <button
                                                onClick={resetForm}
                                                className="bg-emerald-900/10 text-emerald-900 px-8 py-4 rounded-xl font-bold hover:bg-emerald-900/20 transition-colors"
                                            >
                                                Fechar / Nova Solicitação
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-emerald-50 p-6 text-center border-t border-emerald-100 rounded-b-[2.5rem]">
                                        <p className="text-sm text-emerald-800 font-medium flex items-center justify-center gap-2">
                                            <Search size={16} />
                                            Utilize este protocolo na aba "Rastreamento" para acompanhar o status em tempo real.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB: RASTREAMENTO E DOCUMENTOS */}
                    {activeTab === 'tracking' && (
                        <div className="p-8 md:p-12 animate-fadeIn flex flex-col items-center min-h-[400px]">

                            {/* Busca */}
                            {(!trackingResult || (trackingResult && trackingResult.error)) && (
                                <div className="w-full max-w-md flex flex-col items-center">
                                    <div className="bg-emerald-50 p-4 rounded-full text-emerald-600 mb-6">
                                        <Search size={48} />
                                    </div>
                                    <h2 className="text-3xl font-black text-[#0a2619] mb-4 text-center">Rastreamento & Faturas</h2>
                                    <p className="text-emerald-900/60 text-center max-w-md mb-10">
                                        Digite o número do protocolo da remoção para acompanhar o status e acessar documentos.
                                    </p>

                                    <form onSubmit={handleTrackingSearch} className="w-full">
                                        <div className="relative mb-6">
                                            <input
                                                type="text"
                                                placeholder="Ex: REM123"
                                                value={trackingCode}
                                                onChange={(e) => setTrackingCode(e.target.value)}
                                                className="w-full text-center text-2xl font-black tracking-widest uppercase px-6 py-5 rounded-2xl border-2 border-emerald-100 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-300 placeholder:font-normal placeholder:tracking-normal"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isSearching}
                                            className="w-full bg-[#0a2619] text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-900 transition-colors shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                        >
                                            {isSearching ? 'Buscando protocolo...' : 'Localizar Transporte'}
                                            {!isSearching && <ArrowRight size={20} />}
                                        </button>
                                    </form>

                                    {trackingResult && trackingResult.error && (
                                        <div className="mt-8 flex items-center gap-2 text-red-500 font-bold bg-red-50 px-6 py-3 rounded-xl animate-shake">
                                            <AlertCircle size={20} />
                                            {trackingResult.error}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Resultado Detalhado */}
                            {trackingResult && trackingResult.valid && (
                                <div className="w-full animate-slideUp">
                                    {/* Botão Nova Busca */}
                                    <button
                                        onClick={() => { setTrackingCode(''); setTrackingResult(null); }}
                                        className="mb-8 flex items-center text-gray-400 hover:text-emerald-600 font-bold text-sm transition-colors"
                                    >
                                        <ArrowLeft size={16} className="mr-1" /> Nova Pesquisa
                                    </button>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                                        {/* Status e Info */}
                                        <div className="space-y-8">
                                            {/* Card Principal */}
                                            <div className="bg-white border border-emerald-100 rounded-[2rem] p-8 shadow-xl">
                                                <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-100">
                                                    <div>
                                                        <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-wider mb-2">Protocolo</div>
                                                        <p className="text-3xl font-black text-[#0a2619]">{trackingResult.protocol}</p>
                                                    </div>
                                                    <div className="bg-emerald-500/10 p-3 rounded-2xl">
                                                        <Truck size={32} className="text-emerald-600" />
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-xl">
                                                        <span className="text-gray-500 font-medium">Paciente</span>
                                                        <span className="text-[#0a2619] font-bold">{trackingResult.patient}</span>
                                                    </div>
                                                    {trackingResult.status !== 'finished' && (
                                                        <>
                                                            <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-xl">
                                                                <span className="text-gray-500 font-medium">Veículo</span>
                                                                <span className="text-[#0a2619] font-bold">{trackingResult.vehicle}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-xl">
                                                                <span className="text-gray-500 font-medium">Localização</span>
                                                                <span className="text-[#0a2619] font-bold">{trackingResult.location}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                                                <span className="text-emerald-700 font-bold">Chegada Estimada</span>
                                                                <span className="text-emerald-700 font-black">{trackingResult.eta}</span>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Proposta Comercial / Valor */}
                                            <div className="bg-[#0a2619] text-white rounded-[2rem] p-8 shadow-xl relative overflow-hidden">
                                                <div className="relative z-10 flex justify-between items-center">
                                                    <div>
                                                        <p className="text-emerald-400 text-sm font-bold uppercase tracking-wider mb-1">Valor do Serviço</p>
                                                        <p className="text-4xl font-black">{trackingResult.value}</p>
                                                    </div>
                                                    <div className="bg-emerald-500/20 p-3 rounded-xl">
                                                        <DollarSign size={24} className="text-emerald-400" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Linha do Tempo e Documentos */}
                                        <div className="space-y-8">

                                            {/* Linha do Tempo */}
                                            <div className="bg-white border border-gray-200 rounded-[2rem] p-8">
                                                <h3 className="font-bold text-[#0a2619] mb-6 flex items-center gap-2">
                                                    <Clock size={20} className="text-emerald-500" />
                                                    Andamento
                                                </h3>
                                                <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:h-[90%] before:w-0.5 before:bg-gray-100">
                                                    {trackingResult.history.map((item: any, idx: number) => (
                                                        <div key={idx} className="relative flex items-start gap-4">
                                                            <div className={`w-7 h-7 rounded-full border-4 shrink-0 z-10 ${item.completed ? 'bg-emerald-500 border-white shadow-md' : 'bg-gray-200 border-white'}`}></div>
                                                            <div className={`${!item.completed && 'opacity-40'}`}>
                                                                <p className="font-bold text-[#0a2619] text-sm">{item.label}</p>
                                                                <p className="text-xs text-gray-500 font-medium">{item.date}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Documentos */}
                                            <div className="bg-white border border-gray-200 rounded-[2rem] p-8">
                                                <h3 className="font-bold text-[#0a2619] mb-6 flex items-center gap-2">
                                                    <FileText size={20} className="text-emerald-500" />
                                                    Documentos
                                                </h3>
                                                <div className="space-y-3">
                                                    {trackingResult.documents.map((doc: any, idx: number) => (
                                                        <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`p-2 rounded-lg ${doc.available ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                                                                    {doc.type === 'invoice' ? <DollarSign size={18} /> : doc.type === 'receipt' ? <ClipboardCheck size={18} /> : <FileText size={18} />}
                                                                </div>
                                                                <div>
                                                                    <p className={`font-bold text-sm ${doc.available ? 'text-[#0a2619]' : 'text-gray-400'}`}>{doc.name}</p>
                                                                    {!doc.available && <p className="text-[10px] text-gray-400">Indisponível no momento</p>}
                                                                </div>
                                                            </div>

                                                            {doc.available ? (
                                                                <button
                                                                    onClick={async () => {
                                                                        try {
                                                                            setDownloadingDoc(idx);
                                                                            const token = import.meta.env.VITE_SITE_TOKEN;
                                                                            const { supabase } = await import('../lib/supabase');

                                                                            let endpoint = '';
                                                                            let body = {};

                                                                            if (doc.type === 'proposal') {
                                                                                endpoint = 'view-proposal';
                                                                                body = { token, protocol: trackingResult.protocol };
                                                                            } else if (doc.type === 'invoice' || doc.type === 'receipt') {
                                                                                endpoint = 'view-invoice';
                                                                                body = { token, protocol: trackingResult.protocol, docType: doc.type };
                                                                            }

                                                                            if (!endpoint) return;

                                                                            const { data, error } = await supabase.functions.invoke(endpoint, {
                                                                                body: body
                                                                            });

                                                                            if (error) throw new Error('Erro ao gerar documento');

                                                                            const blob = new Blob([data], { type: 'text/html' });
                                                                            const url = URL.createObjectURL(blob);
                                                                            window.open(url, '_blank');
                                                                        } catch (e) {
                                                                            console.error(e);
                                                                            alert('Não foi possível abrir o documento.');
                                                                        } finally {
                                                                            setDownloadingDoc(null);
                                                                        }
                                                                    }}
                                                                    disabled={downloadingDoc === idx}
                                                                    className="text-emerald-600 hover:text-emerald-800 transition-colors disabled:opacity-50"
                                                                >
                                                                    {downloadingDoc === idx ? (
                                                                        <div className="w-5 h-5 flex items-center justify-center">
                                                                            <span className="block w-4 h-4 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin"></span>
                                                                        </div>
                                                                    ) : (
                                                                        <Download size={20} />
                                                                    )}
                                                                </button>
                                                            ) : (
                                                                <div className="text-gray-300">
                                                                    <Download size={20} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Schedule;
