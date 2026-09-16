import React, { useEffect, useRef, useState, memo } from "react";
import { Typography } from "antd";
import {
  IconChefHat,
  IconBuildingBank,
  IconSchool,
  IconFriends,
  IconHeartHandshake,
  IconCoffee,
  IconRings,
} from "@tabler/icons-react";
import { IMAGES } from "../../utils/images";
import "./OurJourney.css";

const { Title, Paragraph } = Typography;

interface JourneyItem {
  year: string;
  description: string;
  icon: React.ReactNode;
}

const journeyData: JourneyItem[] = [
  {
    year: "2007",
    description: "Started as Catering Service for All Occasions.",
    icon: <IconChefHat size={32} stroke={1.5} />,
  },
  {
    year: "2014",
    description: "Associated with SIDBI for All India Training Programs.",
    icon: <IconBuildingBank size={32} stroke={1.5} />,
  },
  {
    year: "2016",
    description:
      "Associated with Sai International School for Sai Unwind & Sai Ted for 10000 + gathering.",
    icon: <IconSchool size={32} stroke={1.5} />,
  },
  {
    year: "2018",
    description: "Catered at KIIT School for Annual Function of 3000 Pax.",
    icon: <IconFriends size={32} stroke={1.5} />,
  },
  {
    year: "2021",
    description: "Catered to 3000 + COVID Patients.",
    icon: <IconHeartHandshake size={32} stroke={1.5} />,
  },
  {
    year: "2023",
    description: "Introduced Our 1st Retail Outlet D'Cafe.",
    icon: <IconCoffee size={32} stroke={1.5} />,
  },
  {
    year: "2025",
    description: "Catered to 100+ Weddings & Reception.",
    icon: <IconRings size={32} stroke={1.5} />,
  },
];

const OurJourney: React.FC = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = sectionRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.15 },
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    const triggerReplay = () => {
      setIsVisible(false);
      setTimeout(() => {
        setAnimKey((prev) => prev + 1);
        setIsVisible(true);
      }, 50);
    };

    const handleJourneyLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[href*="#journey"]');
      if (target) {
        triggerReplay();
      }
    };

    const handleHashChange = () => {
      if (window.location.hash === "#journey") {
        triggerReplay();
      }
    };

    document.addEventListener("click", handleJourneyLinkClick);
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      document.removeEventListener("click", handleJourneyLinkClick);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <section id="journey" className="our-journey-section" ref={sectionRef}>
      <div className="our-journey-container" key={animKey}>
        {/* HEADER SECTION */}
        <div className={`journey-header ${isVisible ? "animate-header" : ""}`}>
          <Title level={2} className="title-card">
            OUR JOURNEY
          </Title>

          {/* BRAND DIVIDER */}
          <div className="clients-title-divider">
            <span className="clients-divider-line" />
            <img
              src={IMAGES.BRAND_LOGO}
              alt=""
              className="clients-divider-logo"
              aria-hidden="true"
              loading="lazy"
              decoding="async"
            />
            <span className="clients-divider-line" />
          </div>

          <Title level={3} className="journey-subtitle-text">
            19 Years of Taste, Trust & Togetherness
          </Title>
        </div>

        {/* TIMELINE ITEMS */}
        <div className="journey-timeline">
          {/* HORIZONTAL DASHED CONNECTOR */}
          <div
            className={`timeline-connector-line ${isVisible ? "animate-line" : ""}`}
          ></div>

          {journeyData.map((item, index) => (
            <div
              key={index}
              className={`journey-node ${isVisible ? "animate-reveal" : ""}`}
              style={{
                /* Increased initial delay to 0.4s and stagger per item to 0.45s (was 0.22s) */
                animationDelay: isVisible ? `${0.4 + index * 0.45}s` : "0s",
              }}
            >
              {/* 3D GLOW SPHERE ICON WITH PULSING GLOW RINGS */}
              <div className="icon-sphere-wrapper">
                <div className="pulse-ring"></div>
                <div className="icon-sphere">
                  <div className="icon-inner">{item.icon}</div>
                </div>
              </div>

              {/* VERTICAL DROP LINE WITH CONNECTOR DOT */}
              <div className="node-drop-line">
                <span className="node-dot"></span>
              </div>

              {/* YEAR & DESCRIPTION WRAPPER */}
              <div className="node-content">
                <span className="journey-year">{item.year}</span>
                <Paragraph className="journey-desc">
                  {item.description}
                </Paragraph>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

OurJourney.displayName = "OurJourney";

export default OurJourney;
