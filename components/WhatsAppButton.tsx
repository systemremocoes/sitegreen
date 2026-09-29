
import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end space-y-4">
      {/* Pulse effect hint */}
      <div className="bg-white px-4 py-2 rounded-xl shadow-xl text-sm font-bold text-emerald-950 animate-bounce hidden md:block border border-emerald-100">
        Olá! Como podemos ajudar?
      </div>
      
      <a
        href="https://wa.me/5519998049901?text=Ol%C3%A1!%20Encontrei%20a%20Green%20no%20Google%20e%20gostaria%20de%20um%20or%C3%A7amento%20de%20ambul%C3%A2ncia."
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          if (typeof window !== 'undefined' && (window as any).gtag_report_conversion) {
            (window as any).gtag_report_conversion('whatsapp');
          }
        }}
        className="w-16 h-16 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 active:scale-95 group relative"
        aria-label="Falar no WhatsApp com a Green Emergências"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-25"></span>
        <MessageCircle size={32} className="relative z-10" />
      </a>
    </div>
  );
};

export default WhatsAppButton;
