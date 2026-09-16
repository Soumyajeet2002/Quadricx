import { memo } from "react";
import {
  Button,
  Col,
  Divider,
  Flex,
  Image,
  Row,
  Space,
  Typography,
} from "antd";
import {
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandWhatsapp,
  IconPhone,
  IconMail,
  IconMapPin,
  IconArrowUp,
} from "@tabler/icons-react";
import { IMAGES } from "../../utils/images";
import {
  CONTACT_EMAIL_ADDRESS,
  CONTACT_LOCATION,
  CONTACT_MOBILE_NUMBER_2,
  CONTACT_MOBILE_NUMBER_3,
  QUICK_LINKS,
  SOCIAL_MEDIA_LINKS,
} from "../../utils/constants";
import { useEffect, useRef, useState } from "react";

import "./Footer.css";

const { Text, Link } = Typography;

const Footer = memo(() => {
  const socialLinks = [
    {
      label: "Instagram",
      href: SOCIAL_MEDIA_LINKS.instagram,
      icon: <IconBrandInstagram size={20} stroke={1.5} />,
    },
    {
      label: "Facebook",
      href: SOCIAL_MEDIA_LINKS.facebook,
      icon: <IconBrandFacebook size={20} stroke={1.5} />,
    },
    {
      label: "WhatsApp",
      href: SOCIAL_MEDIA_LINKS.whatsapp,
      icon: <IconBrandWhatsapp size={20} stroke={1.5} />,
    },
    // {
    //   label: "YouTube",
    //   href: SOCIAL_MEDIA_LINKS.youtube,
    //   icon: <IconBrandYoutube size={20} stroke={1.5} />,
    // },
  ];

  // Back to top logic
  const [showBackToTop, setShowBackToTop] = useState(false);
  const progressCircleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;

      // Show button only after scrolling 200px
      setShowBackToTop(scrollTop > 200);

      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress = documentHeight > 0 ? scrollTop / documentHeight : 0;

      const circumference = 2 * Math.PI * 19;

      if (progressCircleRef.current) {
        progressCircleRef.current.style.strokeDashoffset = String(
          circumference * (1 - progress),
        );
      }
    };

    window.addEventListener("scroll", updateScrollProgress, {
      passive: true,
    });

    updateScrollProgress();

    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
    };
  }, []);

  return (
    <>
      <footer className="footer" id="footer">
        {/* Background Overlay to soften texture */}
        {/* <div className="footer-overlay" /> */}

        <div className="footer-container">
          <Row gutter={[40, 32]} align="top">
            {/* Column 1: Brand Info */}
            <Col xs={24} sm={12} lg={8}>
              <Flex vertical className="footer-brand">
                <Image
                  preview={false}
                  src={IMAGES.BRAND_LOGO}
                  alt="Dimple's Rasoi"
                  className="footer-logo"
                />

                <Text className="footer-tagline">
                  Thank you for choosing Dimple&apos;s Rasoi. We take pride in
                  serving you the flavors of home in every bite. Made with and
                  lots of love.
                </Text>
              </Flex>
            </Col>

            {/* Column 2: Quick Links */}
            <Col xs={24} sm={12} lg={6}>
              <Flex vertical className="footer-col-section">
                <Text className="footer-title">Quick Links</Text>
                <div className="footer-links-grid">
                  {QUICK_LINKS.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="footer-link"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </Flex>
            </Col>

            {/* Column 3: Contact Info & Socials Integrated */}
            <Col xs={24} sm={24} lg={10}>
              <Flex vertical className="footer-col-section">
                <Text className="footer-title">Contact Info</Text>

                <Space
                  orientation="vertical"
                  size={12}
                  className="footer-contact"
                >
                  <Flex gap={12} align="center" className="footer-contact-item">
                    <div className="contact-icon-badge">
                      <IconPhone size={18} stroke={1.8} />
                    </div>
                    <Text className="footer-contact-text">
                      {CONTACT_MOBILE_NUMBER_2}
                      <Divider
                        orientation="vertical"
                        className="footer-phone-divider"
                      />
                      {CONTACT_MOBILE_NUMBER_3}
                    </Text>
                  </Flex>

                  <Flex gap={12} align="center" className="footer-contact-item">
                    <div className="contact-icon-badge">
                      <IconMail size={18} stroke={1.8} />
                    </div>
                    <Text className="footer-contact-text">
                      {CONTACT_EMAIL_ADDRESS}
                    </Text>
                  </Flex>

                  <Flex
                    gap={12}
                    align="flex-start"
                    className="footer-contact-item"
                  >
                    <div className="contact-icon-badge">
                      <IconMapPin size={18} stroke={1.8} />
                    </div>
                    <Text className="footer-contact-text">
                      {CONTACT_LOCATION}
                    </Text>
                  </Flex>
                </Space>

                {/* Follow Us Embedded below Contact */}
                <div className="footer-social-wrapper">
                  <Text className="footer-sub-title">Follow Us</Text>
                  <Space size={12} wrap>
                    {socialLinks.map((social, index) => (
                      <Button
                        key={index}
                        type="text"
                        shape="circle"
                        aria-label={social.label}
                        href={social.href}
                        target="_blank"
                        icon={social.icon}
                        className="footer-social"
                      />
                    ))}
                  </Space>
                </div>
              </Flex>
            </Col>
          </Row>
        </div>

        {/* Bottom Footer */}
        <div className="footer-bottom-wrapper">
          <Divider className="footer-divider" />

          <Flex
            className="footer-bottom"
            justify="space-between"
            align="center"
          >
            <Text className="footer-copyright">
              © {new Date().getFullYear()} Dimple&apos;s Rasoi. All Rights
              Reserved.
            </Text>

            <Text className="footer-made">
              Developed and Supported by{" "}
              <Link
                href="https://quadricx.in"
                target="_blank"
                rel="noopener noreferrer"
              >
                Quadricx
              </Link>
            </Text>
          </Flex>
        </div>
      </footer>

      {/* Back To Top Floating Outside Footer */}
      <div className={`back-to-top-wrapper ${showBackToTop ? "show" : ""}`}>
        <svg className="back-to-top-progress" viewBox="0 0 44 44">
          <circle className="back-to-top-progress-bg" cx="22" cy="22" r="19" />
          <circle
            ref={progressCircleRef}
            className="back-to-top-progress-circle"
            cx="22"
            cy="22"
            r="19"
          />
        </svg>

        <Button
          type="default"
          shape="circle"
          icon={<IconArrowUp size={20} stroke={2.5} />}
          className="footer-back-top"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
        />
      </div>
    </>
  );
});

Footer.displayName = "Footer";

export default Footer;
