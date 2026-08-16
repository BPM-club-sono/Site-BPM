import { useMemo, useState, type MouseEvent } from "react";
import logoImage from "@/assets/BPM_logo.png";
import sideLogoLeft from "@/assets/egeggg.jpg";
import sideLogoRight from "@/assets/egeg.jpg";
import bentoSideLeft from "@/assets/ec2.jpg";
import bentoSideRight from "@/assets/ec1.jpg";
import lightBackgroundImage from "@/assets/light.png";
import mxBackgroundImage from "@/assets/mx.png";
import EventCarousel from "@/features/home/components/EventCarousel";
import EquipmentGrid from "@/features/home/components/EquipmentGrid";
import LogoMarquee from "@/features/home/components/LogoMarquee";
import RevealText from "@/features/home/components/RevealText";
import { contactSectionContent } from "@/features/home/data/contact";
import { equipmentCards } from "@/features/home/data/equipmentCards";
import { eventSlides } from "@/features/home/data/eventSlides";
import { softwareLogos, trustLogos } from "@/features/home/data/logos";
import PageShell from "@/shared/components/layout/PageShell";
import InlineNav from "@/shared/components/navigation/InlineNav";
import "./HomePage.css";

type HeroVariant = "light" | "mx";

type LogoTilt = {
  x: number;
  y: number;
};

const HomePage = () => {
  const heroVariant = useMemo<HeroVariant>(() => (Math.random() < 0.5 ? "mx" : "light"), []);
  const heroSide = heroVariant === "mx" ? "left" : "right";
  const [logoTilt, setLogoTilt] = useState<LogoTilt>({ x: 0, y: 0 });

  const handleLogoTilt = (event: MouseEvent<HTMLDivElement>) => {
    const container = event.currentTarget;
    const bounds = container.getBoundingClientRect();

    const normalizedX = (event.clientX - (bounds.left + bounds.width / 2)) / (bounds.width / 2);
    const normalizedY = (event.clientY - (bounds.top + bounds.height / 2)) / (bounds.height / 2);

    setLogoTilt({
      x: Math.max(-8, Math.min(8, -normalizedY * 10)),
      y: Math.max(-8, Math.min(8, normalizedX * 10))
    });
  };

  const resetLogoTilt = () => setLogoTilt({ x: 0, y: 0 });

  return (
    <PageShell pageClassName="home" hideToggleAtTop data-hero-side={heroSide} data-hero-variant={heroVariant}>
      <section className="hero noselect">
        <img
          className="hero__backdrop"
          style={heroVariant === "mx" ? { right: 0 } : { left: 0 }}
          src={heroVariant === "mx" ? mxBackgroundImage : lightBackgroundImage}
          alt=""
          aria-hidden="true"
          loading="eager"
        />

        <div className="hero__content">
          <InlineNav className="hero__nav" />

          <div className="hero__title">
            <h1>
              <span className="hero__big">BPM</span>
              <span className="hero__sub">Light & Sono</span>
            </h1>
          </div>

          <div className="hero__logo">
            <div className="hero__tilt" onMouseMove={handleLogoTilt} onMouseLeave={resetLogoTilt}>
              <img
                src={logoImage}
                draggable={false}
                alt="Logo BPM"
                loading="eager"
                style={{ transform: `rotateX(${logoTilt.x}deg) rotateY(${logoTilt.y}deg)` }}
              />
            </div>
          </div>

          <div className="scroll-cue">
            <span>Scroll Down</span>
            <span className="scroll-cue__arrow" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="bento-section-block">
        <img
          className="bento-side bento-side--right"
          src={bentoSideRight}
          alt=""
          aria-hidden="true"
          loading="lazy"
        />
        <img
          className="bento-side bento-side--left"
          src={bentoSideLeft}
          alt=""
          aria-hidden="true"
          loading="lazy"
        />

        <div className="bento-section-inner">
          <h2 className="section-title noselect">
            <RevealText text="Notre Équipement" />
          </h2>
          <EquipmentGrid cards={equipmentCards} />
          <p className="bento-more">et bien plus encore...</p>
        </div>
      </section>

      <section className="events-section">
        <h2 className="section-title noselect">
          <RevealText text="Nos Événements" />
        </h2>
        <EventCarousel slides={eventSlides} moreLinkTo="/event" />
      </section>

      <section className="logo-section">
        <img
          className="section-side section-side--right"
          src={sideLogoRight}
          alt=""
          aria-hidden="true"
          loading="lazy"
        />
        <img
          className="section-side section-side--left"
          src={sideLogoLeft}
          alt=""
          aria-hidden="true"
          loading="lazy"
        />

        <div className="logo-section__group">
          <h2 className="section-title noselect">
            <RevealText text="Logiciels que nous maîtrisons" />
          </h2>
          <LogoMarquee items={softwareLogos} animationDurationInSeconds={42} />
        </div>

        <div className="logo-section__group">
          <h2 className="section-title noselect">
            <RevealText text="Ils nous font confiance" />
          </h2>
          <LogoMarquee items={trustLogos} animationDurationInSeconds={48} hideTitle />
        </div>
      </section>

      <section className="contact">
        <div>
          <p className="contact__title">{contactSectionContent.title}</p>
          <a className="contact__link" href={contactSectionContent.mailtoHref}>
            {contactSectionContent.actionLabel}
          </a>
          <p className="contact__meta">{contactSectionContent.metaText}</p>
        </div>
      </section>
    </PageShell>
  );
};

export default HomePage;
