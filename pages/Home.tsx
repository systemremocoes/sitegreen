import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Differentials from '../components/Differentials';
import Partners from '../components/Partners';
import Regions from '../components/Regions';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import HomePopup from '../components/HomePopup';
import { Page } from '../App';

interface HomeProps {
  onNavigate: (page: Page, serviceId?: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <>
      <Hero onNavigate={onNavigate} />
      <section id="servicos">
        <Services onNavigate={onNavigate} />
      </section>
      <section id="diferenciais">
        <Differentials />
      </section>
      <section id="convenios">
        <Partners />
      </section>
      <section id="regioes" className="bg-emerald-50">
        <Regions />
      </section>
      <section id="depoimentos">
        <Testimonials />
      </section>
      <section id="contato" className="bg-emerald-50">
        <Contact />
      </section>
      <HomePopup onNavigate={onNavigate} />
    </>
  );
};

export default Home;
