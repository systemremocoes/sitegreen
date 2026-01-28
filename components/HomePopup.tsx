import React, { useState, useEffect } from 'react';
import { X, CalendarCheck, ArrowRight } from 'lucide-react';
import { Page } from '../App';

interface HomePopupProps {
    onNavigate: (page: Page) => void;
}

const HomePopup: React.FC<HomePopupProps> = ({ onNavigate }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show popup after 3 seconds
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-6 pointer-events-none">
            {/* Backdrop (Optional, keeping it transparent/clickable through for now, or minimal) */}
            <div className="absolute inset-0 pointer-events-auto bg-black/20 backdrop-blur-sm transition-opacity opacity-100" onClick={() => setIsVisible(false)}></div>

            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md relative pointer-events-auto transform transition-all duration-500 animate-slideUp border border-emerald-100 overflow-hidden">

                {/* Close Button */}
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-20"
                >
                    <X size={20} className="text-gray-500" />
                </button>

                {/* Content */}
                <div className="flex flex-col">
                    {/* Image/Banner section */}
                    <div className="h-32 bg-[#0a2619] relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-emerald-600/20 mix-blend-overlay"></div>
                        {/* Decorative circles */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/30 rounded-full blur-2xl"></div>
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl"></div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md mb-2 border border-white/20">
                                <CalendarCheck size={32} className="text-emerald-400" />
                            </div>
                        </div>
                    </div>

                    <div className="p-8 text-center">
                        <h3 className="text-2xl font-black text-[#0a2619] mb-3 leading-tight">Agende Online Agora</h3>
                        <p className="text-emerald-900/60 mb-8 text-sm font-medium leading-relaxed">
                            Precisa de uma ambulância com data e hora marcada? Utilize nosso sistema de agendamento online. É rápido, fácil e seguro.
                        </p>

                        <button
                            onClick={() => {
                                setIsVisible(false);
                                onNavigate('schedule');
                            }}
                            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/30 flex items-center justify-center space-x-2 group"
                        >
                            <span>Acessar Agendamento</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                            onClick={() => setIsVisible(false)}
                            className="mt-4 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            Não, obrigado
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePopup;
