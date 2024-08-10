import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Home.module.css';
import depoimento1 from '../assets/home/depoimentos/depoimento1.png';
import depoimento2 from '../assets/home/depoimentos/depoimento2.png';
import depoimento3 from '../assets/home/depoimentos/depoimento3.png';
import depoimento4 from '../assets/home/depoimentos/depoimento4.png';
import creche from '../assets/home/servicos/creche.png';
import hotel from '../assets/home/servicos/hotel.png';
import banho from '../assets/home/servicos/banho.png';
import consulta from '../assets/home/servicos/consulta.png';
import adestramento from '../assets/home/servicos/adestramento.png';
import passeio from '../assets/home/servicos/passeio.png';
import foto1 from '../assets/home/galeria/foto1.png';
import foto2 from '../assets/home/galeria/foto2.png';
import foto3 from '../assets/home/galeria/foto3.png';


const Home = () => {
  return (
    <div className={styles.home}>
      <section className={styles.homeBanner}>
        <div className={styles.bannerContent}>
          <h1>Bem-vindo ao Parque dos Mascotes</h1>
          <p>Onde o seu pet encontra cuidado, diversão e carinho!</p>
          <Link to="/agendar-visita" className={styles.button}>Agende uma visita</Link>
        </div>
      </section>
      <section className={styles.homeAbout}>
        <div className={styles.aboutContent}>
          <h2>Sobre nós</h2>
          <p>O Parque dos Mascotes é um espaço pensado para oferecer o melhor cuidado para o seu pet. Aqui, ele encontra um ambiente seguro e confortável, onde pode brincar, se divertir e fazer novos amigos. Contamos com uma equipe de profissionais qualificados e apaixonados por animais, prontos para atender todas as necessidades do seu pet. Venha nos conhecer e deixe o seu pet em boas mãos!</p>
          <Link to="/sobre" className={styles.button}>Saiba mais</Link>
        </div>
      </section>
      <section className={styles.homeFeatures}>
        <h2>Por que escolher o Parque dos Mascotes?</h2>
        <div className={styles.featuresList}>
          <div className={styles.featureItem}>
            <i className={`fas fa-shield ${styles.featureIcon}`}></i>
            <h3>Ambiente Seguro</h3>
            <p>Contamos com instalações seguras e monitoradas para garantir o bem-estar do seu pet.</p>
          </div>
          <div className={styles.featureItem}>
            <i className={`fas fa-bone ${styles.featureIcon}`}></i>
            <h3>Monitoramento em Tempo Real</h3>
            <p>Fotos e vídeos disponíveis para os tutores.</p>
          </div>
          <div className={styles.featureItem}>
            <i className={`fas fa-qrcode ${styles.featureIcon}`}></i>
            <h3>QR Code Personalizado</h3>
            <p>Cada pet com um QR Code exclusivo para segurança e informação.</p>
          </div>
          <div className={styles.featureItem}>
            <i className={`fas fa-heart ${styles.featureIcon}`}></i>
            <h3>Atendimento Personalizado</h3>
            <p>Tratamos cada pet de forma única e especial.</p>
          </div>
        </div>
      </section>
      <section className={styles.homeContent}>
        <h2>Conheça nossos serviços</h2>
        <div className={styles.services}>
          <div className={styles.service}>
            <img src={creche} alt="Creche" />
            <h3>Creche</h3>
            <p>Seu pet passa o dia brincando e se divertindo com outros pets.</p>
          </div>
          <div className={styles.service}>
            <img src={hotel} alt="Hotel" />
            <h3>Hotel</h3>
            <p>Seu pet se hospeda em um ambiente seguro e confortável.</p>
          </div>
          <div className={styles.service}>
            <img src={banho} alt="Banho" />
            <h3>Banho</h3>
            <p>Seu pet fica limpinho e cheiroso com o serviço do nosso parceiro de banho e tosa.</p>
          </div>
          <div className={styles.service}>
            <img src={consulta} alt="Consulta" />
            <h3>Consulta Veterinária</h3>
            <p>Seu pet recebe atendimento veterinário de qualidade com o nosso parceiro veterinário.</p>
          </div>
          <div className={styles.service}>
            <img src={adestramento} alt="Adestramento" />
            <h3>Adestramento</h3>
            <p>Seu pet aprende com adestradores experientes com uma metodologia que realmente funciona.</p>
          </div>
          <div className={styles.service}>
            <img src={passeio} alt="Passeio" />
            <h3>Passeio</h3>
            <p>Seu pet se diverte e faz exercícios com os nossos passeadores de cães.</p>
          </div>
        </div>
      </section>
      <section className={styles.homeTestimonials}>
        <h2>Depoimentos</h2>
        <div className={styles.testimonialsList}>
          <div className={styles.testimonialItem}>
            <img src={depoimento1} alt="Depoimento 1" />
            <p>“O Parque dos Mascotes é o melhor lugar para deixar o meu pet. Sempre que preciso viajar, sei que ele está em boas mãos e se divertindo muito.”</p>
            <h4>Ana Carla Silva</h4>
          </div>
          <div className={styles.testimonialItem}>
            <img src={depoimento2} alt="Depoimento 2" />
            <p>“A equipe do Parque dos Mascotes é incrível! Eles cuidam do meu pet com muito carinho e atenção, sempre prontos para atender às necessidades dele.”</p>
            <h4>João Pedro Pereira</h4>
          </div>
          <div className={styles.testimonialItem}>
            <img src={depoimento3} alt="Depoimento 3" />
            <p>"Confio totalmente na equipe. Eles realmente amam o que fazem!"</p>
            <h4>Isabela Giovanna</h4>
          </div>
          <div className={styles.testimonialItem}>
            <img src={depoimento4} alt="Depoimento 4" />
            <p>“Meu pet adora o Parque dos Mascotes! Ele sempre volta para casa feliz e cansado de tanto brincar. Recomendo a todos!”</p>
            <h4>Henrique Souza</h4>
          </div>
        </div>
      </section>
      <section className={styles.homeGallery}>
        <h2>Galeria de Fotos</h2>
        <div className={styles.galleryGrid}>
          <img src={foto1} alt="Pet no parque" />
          <img src={foto2} alt="Pet relaxando" />
          <img src={foto3} alt="Pet interagindo" />
        </div>
      </section>
      <section className={styles.homeVisit}>
        <div className={styles.visitContent}>
          <h2>Quer conhecer o Parque dos Mascotes?</h2>
          <p>Conheça o Parque dos Mascotes e descubra tudo o que podemos oferecer para o seu pet. Agende uma visita.</p>
          <Link to="/agendar-visita" className={styles.button}>Agende uma visita</Link>
          <p>R. Viçosa do Ceará, 21 - Vila Mascote, São Paulo - SP, 04363-090</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
