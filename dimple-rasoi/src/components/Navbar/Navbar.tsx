import React, { useState, useEffect, useCallback, useMemo, useRef, memo } from "react";
import { Drawer, Button, Menu } from "antd";
import { IconMenu2, IconX, IconArrowUpRight } from "@tabler/icons-react";
import { IMAGES } from "../../utils/images";
import { QUICK_LINKS } from "../../utils/constants";
import "./Navbar.css";

const Navbar: React.FC = memo(() => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("home");

  const isClickingRef = useRef<boolean>(false);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll spy & scrolled navbar state
  useEffect(() => {
    let ticking = false;

    const updateActiveOnScroll = () => {
      setScrolled(window.scrollY > 20);

      // Skip observer/scroll updates while user is smooth scrolling from nav click
      if (isClickingRef.current) return;

      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // 1. Top of page -> Home
      if (scrollPosition < 100) {
        setActiveSection("home");
        return;
      }

      // 2. Bottom of page -> Contact
      if (scrollPosition + windowHeight >= documentHeight - 50) {
        setActiveSection("contact");
        return;
      }

      // 3. Find section currently active under the header offset line (~140px)
      const sections = document.querySelectorAll<HTMLElement>("section[id]");
      const activationOffset = 140;

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const rect = section.getBoundingClientRect();

        if (rect.top <= activationOffset && rect.bottom > activationOffset) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    // Initial hash or scroll position check
    if (window.location.hash) {
      const initialSection = window.location.hash.replace("#", "");
      if (initialSection) {
        setActiveSection(initialSection);
      }
    } else {
      updateActiveOnScroll();
    }

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveOnScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    };
  }, []);

  const handleNavClick = useCallback((href: string) => {
    const sectionId = href.replace("#", "");
    setActiveSection(sectionId);
    setMenuOpen(false);

    isClickingRef.current = true;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => {
      isClickingRef.current = false;
    }, 800);
  }, []);

  const menuItems = useMemo(
    () =>
      QUICK_LINKS.map((link) => ({
        key: link.href.replace("#", ""),
        label: (
          <a href={link.href} onClick={() => handleNavClick(link.href)}>
            {link.label}
          </a>
        ),
      })),
    [handleNavClick],
  );

  return (
    <nav
      className={`navbar${scrolled ? " scrolled" : ""}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="navbar-container">
        {/* Brand Logo */}
        <a
          href="#home"
          className="navbar-logo"
          aria-label="Dimple's Rasoi Home"
          onClick={() => handleNavClick("#home")}
        >
          <img
            src={IMAGES.BRAND_LOGO}
            alt="Dimple's Rasoi"
            className="navbar-logo-image"
            loading="lazy"
            decoding="async"
          />
        </a>

        {/* Desktop Navigation Links */}
        <div className="navbar-links-desktop">
          {QUICK_LINKS.map((link) => {
            const sectionId = link.href.replace("#", "");
            const isActive = activeSection === sectionId;

            return (
              <a
                key={link.label}
                href={link.href}
                className={`nav-link${isActive ? " active" : ""}`}
                onClick={() => handleNavClick(link.href)}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="navbar-right">
          <Button
            type="primary"
            shape="round"
            className="btn-primary-antd"
            href="#contact"
            icon={<IconArrowUpRight size={16} />}
            iconPlacement="end"
            onClick={() => handleNavClick("#contact")}
          >
            Enquire Now
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <Button
          className="hamburger-btn"
          type="text"
          icon={<IconMenu2 size={22} />}
          onClick={() => setMenuOpen(true)}
          aria-label="Open navigation menu"
        />

        {/* Full Screen Cover Drawer */}
        <Drawer
          placement="right"
          onClose={() => setMenuOpen(false)}
          open={menuOpen}
          closeIcon={<IconX size={22} />}
          styles={{
            wrapper: { width: "100%" }, // Forces Ant Design Drawer wrapper to 100% viewport width
            header: { padding: "12px 20px" },
            body: { padding: "12px 16px" },
          }}
          title={
            <div className="drawer-header-content">
              <img
                src={IMAGES.BRAND_LOGO}
                alt="Dimple's Rasoi"
                className="navbar-drawer-logo"
                loading="lazy"
                decoding="async"
              />
            </div>
          }
          className="navbar-full-drawer"
        >
          <Menu
            mode="inline"
            selectedKeys={[activeSection]}
            items={menuItems}
            className="navbar-drawer-menu"
          />
        </Drawer>
      </div>
    </nav>
  );
});

Navbar.displayName = "Navbar";

export default Navbar;
