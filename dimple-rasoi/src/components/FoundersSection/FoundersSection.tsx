import React, { useEffect, useRef, useState, memo } from "react";
import { Card, Avatar, Typography, Flex } from "antd";
import { IMAGES } from "../../utils/images";
import "./FoundersSection.css";

const { Title, Text, Paragraph } = Typography;

interface Founder {
  id: string;
  name: string;
  role: string;
  img: string;
  fallbackEmoji: string;
  desc: string;
  socials: string[];
}

const founders: Founder[] = [
  {
    id: "dimple",
    name: "Dimple Narula",
    role: "CEO",
    img: IMAGES.DIMPLE_ROSEI_FOUNDER_IMG,
    fallbackEmoji: "👩‍🍳",
    desc: "With over 19 years of experience in the hospitality industry, I bring my passion and expertise to food production. I believe great food is not just about taste—it is about quality, hygiene, care, and creating happiness in every meal I serve. My journey has been driven by a love for food and a commitment to making every dining experience special.",
    socials: ["instagram", "facebook", "linkedin"],
  },
  {
    id: "rohan",
    name: "Akshay Narula",
    role: "CFO",
    img: IMAGES.DIMPLE_ROSEI_CO_FOUNDER_IMG,
    fallbackEmoji: "👨‍💼",
    desc: "Leading the Finance and Management of Dimple's Rasoi since decades,my focus  has been to bring innovativeness and stability in the business. Good food needs visibility and planning.We at Dimples Rasoi put our heart and soul together to bring the best on the table.",
    socials: ["instagram", "facebook", "linkedin"],
  },
];

const FoundersSection: React.FC = memo(() => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentSection = sectionRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 },
    );

    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  return (
    <section
      id="founders"
      className={`founders-section ${isVisible ? "is-visible" : ""}`}
      ref={sectionRef}
    >
      <div className="founders-bg-overlay" />

      {/* HEADER SECTION */}
      <div className="founders-header-centered">
        <Title level={2} className="title-card">
          MEET OUR FOUNDERS
        </Title>
        <div className="clients-title-divider">
          <span className="clients-divider-line" />
          <img
            src={IMAGES.BRAND_LOGO}
            alt=""
            className="clients-divider-logo"
            aria-hidden="true"
            loading="lazy"
          />
          <span className="clients-divider-line" />
        </div>
      </div>

      {/* GRID CONTAINER */}
      <div className="founders-container">
        {founders.map((founder, index) => {
          // Dynamic slide-in direction based on array index
          const slideClass =
            index % 2 === 0 ? "card-slide-left" : "card-slide-right";

          return (
            <Card
              key={founder.id}
              className={`founder-card ${slideClass}`}
              variant="borderless"
            >
              <Flex className="founder-card-inner" align="center" gap={28}>
                <div className="founder-avatar-wrapper">
                  <Avatar
                    src={founder.img}
                    alt={founder.name}
                    size={160}
                    className="founder-avatar-img"
                    icon={<span>{founder.fallbackEmoji}</span>}
                  />
                </div>

                <Flex
                  vertical
                  className="founder-content"
                  align="flex-start"
                  justify="center"
                >
                  <Title level={3} className="founder-name">
                    {founder.name}
                  </Title>
                  <Text className="founder-role">{founder.role}</Text>
                  <Paragraph className="founder-desc">{founder.desc}</Paragraph>
                </Flex>
              </Flex>
            </Card>
          );
        })}
      </div>
    </section>
  );
});

FoundersSection.displayName = "FoundersSection";

export default FoundersSection;
