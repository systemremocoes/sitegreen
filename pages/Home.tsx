import React from 'react';
import Hero from '../components/Hero';
import Contact from '../components/Contact';
import Services from '../components/Services';
import PlansPromo from '../components/PlansPromo';
import Differentials from '../components/Differentials';
import Partners from '../components/Partners';
import Regions from '../components/Regions';
import Testimonials from '../components/Testimonials';
import HomePopup from '../components/HomePopup';
import { Page } from '../App';

interface HomeProps {
  onNavigate: (page: Page, serviceId?: string) => void;
  onOpenRequestModal: () => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, onOpenRequestModal }) => {
  return (
    <>
      <Hero onNavigate={onNavigate} onOpenRequestModal={onOpenRequestModal} />
      <section id="contato" className="bg-emerald-50/70">
        <Contact onOpenRequestModal={onOpenRequestModal} />
      </section>
      <section id="servicos">
        <Services onNavigate={onNavigate} />
      </section>
      <section id="planos">
        <PlansPromo onNavigate={onNavigate} />
      </section>
      <section id="diferenciais">
        <Differentials />
      </section>
      <section id="convenios">
        <Partners />
      </section>
      <section id="regioes" className="bg-emerald-50">
        <Regions onOpenRequestModal={onOpenRequestModal} />
      </section>
      <section id="depoimentos">
        <Testimonials />
      </section>
      <HomePopup onOpenRequestModal={onOpenRequestModal} />
    </>
  );
};

export default Home;
