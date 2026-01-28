
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
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-emerald-600 font-bold uppercase tracking-widest text-sm mb-4">Depoimentos</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-emerald-950 mb-6">Confiança Que Salva Vidas</h3>
          <p className="text-emerald-800/70 max-w-2xl mx-auto text-lg leading-relaxed">
            A opinião de quem confiou na nossa equipe em momentos de necessidade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <div key={i} className="bg-emerald-50 p-8 rounded-3xl relative">
              <Quote className="absolute top-6 right-8 text-emerald-200" size={48} />
              <p className="text-emerald-900/70 italic mb-8 relative z-10 leading-relaxed font-light text-lg">
                "{review.text}"
              </p>
              <div className="flex items-center space-x-4">
                <img src={review.image} alt={review.name} className="w-14 h-14 rounded-full border-2 border-white shadow-md" />
                <div>
                  <h4 className="font-bold text-emerald-950">{review.name}</h4>
                  <p className="text-emerald-600 text-sm font-medium">{review.role}</p>
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
