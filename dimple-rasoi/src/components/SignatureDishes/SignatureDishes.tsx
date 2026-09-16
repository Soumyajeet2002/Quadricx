import React, { useRef, useCallback, memo } from "react";
import { Button, Card, Rate, Typography } from "antd";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { IMAGES } from "../../utils/images";
import "./SignatureDishes.css";

interface Dish {
  id: number;
  name: string;
  desc: string;
  img: string;
  fallback: string;
  src?: string;
  stars: number;
  tagIcon: string;
}

const dishes: Dish[] = [
  {
    id: 1,
    name: "North Indian Cuisine",
    desc: "Rich and aromatic North Indian flavors featuring creamy curries, tandoori specialties, fragrant spices, fresh breads, paneer delicacies, and traditional comfort food.",
    img: IMAGES.NORTH_INDIAN_CUISINE,
    fallback: IMAGES.NO_IMAGE,
    stars: 5,
    tagIcon: "🪔 ",
  },

  {
    id: 2,
    name: "South Indian Cuisine",
    desc: "Authentic South Indian flavors featuring crispy dosas, soft idlis, flavorful sambar, aromatic spices, coconut chutneys, and delicious traditional regional specialties.",
    img: IMAGES.SOUTH_INDIAN_CUISINE,
    fallback: IMAGES.NO_IMAGE,
    stars: 5,
    tagIcon: "🌴 ",
  },

  {
    id: 3,
    name: "Italian Cuisine",
    desc: "A taste of Italy with fresh herbs, savory sauces, and irresistible aromas in every bite.",
    img: IMAGES.ITALIAN_CUISINE,
    fallback: IMAGES.NO_IMAGE,
    stars: 5,
    tagIcon: "🍝",
  },

  {
    id: 4,
    name: "Continental",
    desc: "A delightful fusion of Indian flavors and Continental culinary styles, featuring rich spices, grilled specialties, creamy sauces, fresh vegetables, and elegant international presentations.",
    img: IMAGES.CONTINENTAL_CUISINE,
    fallback: IMAGES.NO_IMAGE,
    stars: 5,
    tagIcon: "🍽️ ",
  },
  {
    id: 5,
    name: "Chinese Cuisine",
    desc: "Authentic Chinese-inspired flavors featuring wok-tossed noodles, fried rice, dumplings, stir-fried specialties, aromatic sauces, fresh vegetables, and deliciously balanced spices.",
    img: IMAGES.CHINESE_CUISINE,
    fallback: IMAGES.NO_IMAGE,
    stars: 5,
    tagIcon: "🥢 ",
  },
];

const SignatureDishes: React.FC = memo(() => {
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = useCallback((direction: "left" | "right"): void => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  }, []);

  const handleImageError = useCallback(
    (
      e: React.SyntheticEvent<HTMLImageElement, Event>,
      fallbackUrl: string,
    ): void => {
      const target = e.currentTarget;
      if (target.getAttribute("data-error") === "true") {
        target.style.display = "none";
        return;
      }
      target.setAttribute("data-error", "true");
      target.src = fallbackUrl;
    },
    [],
  );

  return (
    <section id="dishes" className="dishes-section">
      <div className="dishes-bg-overlay"></div>

      {/* Centered Section Header */}
      <div className="dishes-header-centered">
        <Typography.Title level={2} className="title-card dishes-title">
          OUR CUISINES
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
      </div>

      {/* Carousel Container */}
      <div className="dishes-carousel-wrapper">
        <Button
          type="primary"
          shape="circle"
          icon={<IconChevronLeft size={18} stroke={2} />}
          className="carousel-nav-btn prev"
          onClick={() => handleScroll("left")}
          aria-label="Previous Dishes"
        />

        <div className="dishes-carousel" ref={carouselRef}>
          {dishes.map((dish) => (
            <Card
              key={dish.id}
              hoverable
              className="dish-card-item"
              cover={
                <div className="dish-img-wrapper">
                  <img
                    alt={dish.name}
                    src={dish.img}
                    className="dish-img"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => handleImageError(e, dish.fallback)}
                  />
                </div>
              }
            >
              <div className="dish-title-wrapper">
                <span className="dish-icon-tag">{dish.tagIcon}</span>
                <h3 className="dish-name">{dish.name}</h3>
                <span className="dish-icon-tag">{dish.tagIcon}</span>
              </div>

              <p className="dish-desc">{dish.desc}</p>

              <div className="dish-rating">
                <Rate
                  disabled
                  defaultValue={dish.stars}
                  className="ant-rate-custom"
                />
              </div>
            </Card>
          ))}
        </div>

        <Button
          type="primary"
          shape="circle"
          icon={<IconChevronRight size={18} stroke={2} />}
          className="carousel-nav-btn next"
          onClick={() => handleScroll("right")}
          aria-label="Next Dishes"
        />
      </div>
    </section>
  );
});

SignatureDishes.displayName = "SignatureDishes";

export default SignatureDishes;
