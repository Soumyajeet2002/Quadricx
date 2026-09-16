import React, { useEffect, useState, useRef, memo } from "react";
import { Typography, Button } from "antd";
import {
  IconChevronRight,
  IconUsers,
  IconHeart,
  IconShieldCheck,
} from "@tabler/icons-react";
import { IMAGES } from "../../utils/images";
import "./AboutSection.css";

const { Title, Text, Paragraph } = Typography;

// Custom Counter Component using requestAnimationFrame with optimized re-renders
const Counter = memo(
  ({
    target,
    duration = 2000,
    suffix = "",
  }: {
    target: number;
    duration?: number;
    suffix?: string;
  }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let startTime: number | null = null;
      let animationFrameId: number;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);

        // Easing function for smooth slowdown at the end (easeOutQuad)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const nextCount = Math.floor(easeOut * target);

        setCount((prev) => (prev !== nextCount ? nextCount : prev));

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        }
      };

      animationFrameId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrameId);
    }, [target, duration]);

    return (
      <>
        {count}
        {suffix}
      </>
    );
  },
);

Counter.displayName = "Counter";

const AboutSection: React.FC = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (statsRef.current) observer.unobserve(statsRef.current);
        }
      },
      { threshold: 0.3 },
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="about-section">
      <div className="about-container">
        {/* Left Image Card */}
        <div className="about-image-wrapper">
          <img
            src={IMAGES.DIMPLE_ROSEI_ABOUT_US_IMG}
            alt="Indian woman cooking traditional home food at Dimple's Rasoi"
            className="about-img"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.onerror = null;
            }}
          />
        </div>

        {/* Right Content Column */}
        <div className="about-content">
          {/* HEADER SECTION WRAPPER FOR RESPONSIVE CENTERING */}
          <div className="about-header">
            <Title level={2} className="title-card">
              ABOUT US
            </Title>

            {/* BRAND DIVIDER BELOW ABOUT US */}
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
          </div>

          <Title level={2} className="about-heading">
            More Than Just Food,
            <br />
            It's An <span className="about-script">Emotion.</span>{" "}
            <span className="about-heart">♡</span>
          </Title>

          <Paragraph className="about-desc">
            At Dimple's Rasoi, we believe the best meals are made with love,
            care, and the finest ingredients. Our mission is to deliver homely,
            hygienic, and delicious food that fills your heart and satisfies
            your soul.
          </Paragraph>

          {/* Stat Cards with Native Animated Counter */}
          <div className="about-stats" ref={statsRef}>
            <div className={`stat-card ${isVisible ? "animate-in" : ""}`}>
              <IconUsers className="stat-icon" size={20} stroke={1.5} />
              <div className="stat-info">
                <Text className="stat-number">
                  {isVisible ? <Counter target={10} suffix="K+" /> : "0K+"}
                </Text>
                <Text className="stat-label">Happy Customers</Text>
              </div>
            </div>

            <div className={`stat-card ${isVisible ? "animate-in" : ""}`}>
              <IconHeart className="stat-icon" size={20} stroke={1.5} />
              <div className="stat-info">
                <Text className="stat-number">
                  {isVisible ? <Counter target={50} suffix="+" /> : "0+"}
                </Text>
                <Text className="stat-label">Signature Dishes</Text>
              </div>
            </div>

            <div className={`stat-card ${isVisible ? "animate-in" : ""}`}>
              <IconShieldCheck className="stat-icon" size={20} stroke={1.5} />
              <div className="stat-info">
                <Text className="stat-number">
                  {isVisible ? <Counter target={100} suffix="%" /> : "0%"}
                </Text>
                <Text className="stat-label">Hygienic Kitchen</Text>
              </div>
            </div>
          </div>

          {/* CTA Button with Curly Arrow */}
          <div className="about-cta-wrapper">
            <Button
              type="primary"
              size="large"
              className="btn-primary"
              href="#clients"
            >
              Amazing Clients <IconChevronRight size={16} stroke={2} />
            </Button>

            <img
              src={IMAGES.DIMPLE_ROSEI_LEFT_ARROW_MARKS}
              alt="Decorative curly sketch arrow pointing to the button"
              className="cta-sketch-arrow-img"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
});

AboutSection.displayName = "AboutSection";

export default AboutSection;
