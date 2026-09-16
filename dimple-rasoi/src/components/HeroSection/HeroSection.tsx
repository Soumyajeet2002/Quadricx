import React, { useState, memo } from "react";

import { Button } from "antd";

import {
  IconChevronRight,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandWhatsapp,
} from "@tabler/icons-react";

import "./HeroSection.css";

import { IMAGES } from "../../utils/images";
import { SOCIAL_MEDIA_LINKS } from "../../utils/constants";

const HeroSection: React.FC = memo(() => {
  const [socialOpen, setSocialOpen] = useState(false);

  return (
    <>
      {/* =================================================
          FLOATING SOCIAL MEDIA
          ================================================= */}

      <div className={`social-floating ${socialOpen ? "open" : ""}`}>
        {/* Arrow Toggle */}
        <button
          type="button"
          className="social-toggle"
          onClick={() => setSocialOpen((prev) => !prev)}
          aria-label={
            socialOpen ? "Hide social media links" : "Show social media links"
          }
          aria-expanded={socialOpen}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Social Links */}
        <div className="hero-social-sidebar">
          <a
            href={SOCIAL_MEDIA_LINKS.facebook}
            className="social-icon-btn"
            aria-label="Facebook"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconBrandFacebook size={20} stroke={1.5} />
          </a>

          <a
            href={SOCIAL_MEDIA_LINKS.instagram}
            className="social-icon-btn"
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconBrandInstagram size={20} stroke={1.5} />
          </a>

          <a
            href={SOCIAL_MEDIA_LINKS.whatsapp}
            className="social-icon-btn"
            aria-label="WhatsApp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconBrandWhatsapp size={20} stroke={1.5} />
          </a>

          {/* <a
            href={SOCIAL_MEDIA_LINKS.youtube}
            className="social-icon-btn"
            aria-label="YouTube"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconBrandYoutube size={20} stroke={1.5} />
          </a> */}
        </div>
      </div>

      {/* =================================================
          HERO SECTION
          ================================================= */}

      <section id="home" className="hero-section">
        <div className="hero-container">
          {/* Left Content Column */}
          <div className="hero-content">
            <p className="hero-script">Good Food,</p>

            <h1 className="hero-title">
              <span className="title-welcome">Welcome To</span>
              <span className="title-brand">
                Dimple's Rasoi <span className="title-heart">♡</span>
              </span>
            </h1>

            <div className="title-line"></div>

            <p className="hero-desc">
              Known as #DilKiRasoi, Dimple’s Rasoi brings people together with
              delicious food, heartfelt service, and genuine care. From intimate
              gatherings to grand celebrations, we serve memorable flavours with
              custom menus, multi-cuisine delights, and punctual service.
            </p>

            <div className="hero-buttons">
              <Button
                type="primary"
                size="large"
                className="btn-primary"
                href="#contact"
              >
                ENQUIRE NOW
                <IconChevronRight size={16} stroke={2} />
              </Button>
            </div>
          </div>

          {/* Center Hero Image (Above Fold - High LCP Priority) */}
          <div className="hero-image-wrapper">
            <img
              src={IMAGES.DIMPLE_ROSEI_HERO_IMG}
              alt="Dimple's Rasoi Cooking Pot"
              className="hero-food-img"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>

        {/* =================================================
            Moving Food Truck → Zomato → Swiggy
            ================================================= */}

        <div className="truck-track-container">
          <div className="road-line"></div>

          <div className="moving-truck-wrapper">
            <img
              src={IMAGES.DIMPLE_ROSEI_FOOD_TRUCK}
              alt="Dimple's Rasoi Food Truck"
              className="moving-truck-img"
              loading="lazy"
              decoding="async"
            />

            <img
              src={IMAGES.ZOMATO_DELIVERY_BOY}
              alt="Zomato Delivery Boy"
              className="moving-vehicle-img zomato-vehicle"
              loading="lazy"
              decoding="async"
            />

            <img
              src={IMAGES.SWIGGY_DELIVERY_BOY}
              alt="Swiggy Delivery Boy"
              className="moving-vehicle-img swiggy-vehicle"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>
    </>
  );
});

HeroSection.displayName = "HeroSection";

export default HeroSection;
