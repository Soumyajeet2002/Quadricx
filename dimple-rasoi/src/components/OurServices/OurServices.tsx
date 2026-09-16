import React, { memo } from "react";
import { Typography } from "antd";
import {
  IconHeartHandshake,
  IconCake,
  IconHome,
  IconBriefcase,
  IconCalendarEvent,
  IconBox,
  IconCookie,
  IconFlame,
} from "@tabler/icons-react";
import { IMAGES } from "../../utils/images";
import "./OurServices.css";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const SERVICES_DATA: ServiceItem[] = [
  {
    id: "1",
    title: "Weddings & Reception",
    description: "Customized menus tailored for 10 to 3,000 guests.",
    icon: <IconHeartHandshake size={38} stroke={1.5} />,
  },
  {
    id: "2",
    title: "Birthday Parties",
    description: "Custom menu planning to celebrate your special day.",
    icon: <IconCake size={38} stroke={1.5} />,
  },
  {
    id: "3",
    title: "House Parties",
    description: "Elevated grazing tables and fine dining experiences.",
    icon: <IconHome size={38} stroke={1.5} />,
  },
  {
    id: "4",
    title: "Corporate Catering",
    description: "Professional buffet setups and packed meal services.",
    icon: <IconBriefcase size={38} stroke={1.5} />,
  },
  {
    id: "5",
    title: "Special Events Catering",
    description: "Memorial services, thread ceremonies, and product launches.",
    icon: <IconCalendarEvent size={38} stroke={1.5} />,
  },
  {
    id: "6",
    title: "Packed Meals",
    description: "Freshly packed thalis and hotcase food delivery.",
    icon: <IconBox size={38} stroke={1.5} />,
  },
  {
    id: "7",
    title: "Snack Boxes",
    description: "Customized snack packs for 10 to 2,000 guests.",
    icon: <IconCookie size={38} stroke={1.5} />,
  },
  {
    id: "8",
    title: "No Onion No Garlic",
    description: "Traditional pure veg meals for house warmings and pujas.",
    icon: <IconFlame size={38} stroke={1.5} />,
  },
];

const ServicesSection: React.FC = memo(() => {
  return (
    <section id="services" className="services-section">
      <div className="services-bg-overlay" />

      <div className="services-card-container">
        {/* Header */}
        <div className="services-header">
          <Typography.Title level={2} className="title-card">
            OUR SERVICES
          </Typography.Title>
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
          <p className="section-subtitle">We offer the following services</p>
        </div>

        {/* Modern Card Grid */}
        <div className="modern-services-grid">
          {SERVICES_DATA.map((service) => (
            <div className="modern-service-card" key={service.id}>
              <div className="card-glow" />
              <div className="card-icon-container">{service.icon}</div>
              <div className="card-body">
                <h3 className="card-title">{service.title}</h3>
                <p className="card-subtitle">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

ServicesSection.displayName = "ServicesSection";

export default ServicesSection;
