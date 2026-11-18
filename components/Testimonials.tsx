
import React from 'react';
import { Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: "Mariana Silva",
      role: "Fisioterapeuta",
      text: "A Green Emergências salvou a vida do meu pai em uma madrugada crítica. A equipe da UTI móvel foi impecável no atendimento e na calma que nos passaram.",
      image: "https://i.pravatar.cc/150?u=mariana"
    },
    {
      name: "Carlos Eduardo",
      role: "Diretor de Eventos",
      text: "Contratamos a cobertura para um festival de 3 dias. Foram extremamente profissionais e preparados para qualquer intercorrência. Recomendo fortemente.",
      image: "https://i.pravatar.cc/150?u=carlos"
    },
    {
      name: "Dra. Helena Souza",
      role: "Diretora Hospitalar",
      text: "A pontualidade e a qualidade das ambulâncias da Green são o nosso diferencial nas remoções inter-hospitalares de alta complexidade.",
      image: "https://i.pravatar.cc/150?u=helena"
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-emerald-700 font-bold uppercase tracking-wider text-xs mb-2">Depoimentos</h2>
          <h3 className="text-2xl md:text-3xl font-extrabold text-emerald-950 mb-3">Confiança Que Salva Vidas</h3>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            A opinião de quem confiou na nossa equipe em momentos de necessidade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <div key={i} className="bg-emerald-50/70 border border-emerald-100 p-6 rounded-2xl relative flex flex-col justify-between">
              <Quote className="absolute top-5 right-6 text-emerald-200" size={32} />
              <p className="text-emerald-950/80 italic mb-6 relative z-10 leading-relaxed text-sm">
                "{review.text}"
              </p>
              <div className="flex items-center space-x-3">
                <img src={review.image} alt={review.name} className="w-11 h-11 rounded-full border-2 border-white shadow-sm" />
                <div>
                  <h4 className="font-bold text-sm text-emerald-950">{review.name}</h4>
                  <p className="text-emerald-700 text-xs font-medium">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
