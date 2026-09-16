import React, { useEffect, useState } from "react";
import "./Launcher.css";
import { IMAGES } from "../../utils/images";
import { APP_SLOGAN } from "../../utils/constants";

interface LauncherProps {
  /** Duration in seconds before fade out triggers. Defaults to 10s */
  sequenceSeconds?: number;
}

const Launcher: React.FC<LauncherProps> = ({ sequenceSeconds = 10 }) => {
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [isUnmounted, setIsUnmounted] = useState<boolean>(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const revealTimer = setTimeout(() => {
      setIsRevealed(true);
    }, sequenceSeconds * 1000);

    const unmountTimer = setTimeout(
      () => {
        setIsUnmounted(true);
        document.body.style.overflow = "";
      },
      (sequenceSeconds + 0.8) * 1000,
    );

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(unmountTimer);
      document.body.style.overflow = "";
    };
  }, [sequenceSeconds]);

  if (isUnmounted) return null;

  return (
    <div className={`launcher-stage ${isRevealed ? "reveal" : ""}`}>
      {/* Non-repeating background image layer */}
      <div
        className="launcher-bg-image"
        style={{ backgroundImage: `url(${IMAGES.LUNCHER_SCREEN_BG})` }}
      ></div>

      {/* Ambient background lighting orbs */}
      <div className="launcher-ambient-orb primary-orb"></div>
      <div className="launcher-ambient-orb gold-orb"></div>
      <div className="launcher-ambient-orb corner-orb-top"></div>
      <div className="launcher-ambient-orb corner-orb-bottom"></div>

      {/* Glassmorphic luxury centerpiece card */}
      <div className="launcher-card">
        <div className="logo-wrapper">
          <img
            src={IMAGES.BRAND_LOGO}
            alt="Dimple's Rasoi Logo"
            className="logo-img"
            loading="eager"
          />
        </div>

        <div className="brand-divider">
          <span className="divider-line"></span>
          <span className="divider-gem">❖</span>
          <span className="divider-line"></span>
        </div>

        <div className="brand-header">
          <p className="brand-subtitle">{APP_SLOGAN}</p>
        </div>

        <div className="loading-container">
          <div className="loading-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Launcher;
