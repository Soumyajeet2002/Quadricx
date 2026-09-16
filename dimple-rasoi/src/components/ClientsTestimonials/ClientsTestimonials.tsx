import { memo, useState, useEffect } from "react";
import "./ClientsTestimonials.css";
import { Typography, Rate } from "antd";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { IMAGES } from "../../utils/images";

const { Title, Paragraph, Text } = Typography;

const clients = [
  { name: "KIIT", logo: IMAGES.KIIT_LOGO },
  { name: "SAI International School", logo: IMAGES.SAI_BRAND_LOGO },
  { name: "All India Institute of Medical Sciences", logo: IMAGES.AIIMS_LOGO },
  { name: "Income Tax Office", logo: IMAGES.INCOME_TAX_DEPARTMENT_LOGO },
  { name: "Food Corporation of India", logo: IMAGES.FCI_LOGO },
  { name: "Tanishq", logo: IMAGES.TANISHQ_LOGO },
  { name: "HDFC Bank", logo: IMAGES.HDFC_LOGO },
  { name: "Jagannath Hospital", logo: IMAGES.JAGGANATH_HOSPITAL_LOGO },
  { name: "Lalchand Jewellers", logo: IMAGES.LALCHAND_LOGO },
  { name: "SIDBI Bank", logo: IMAGES.SIDBI_LOGO },
  { name: "DN Wisdom School", logo: IMAGES.DN_WISDOM_TREE_LOGO },
  { name: "Motwani Constructions", logo: IMAGES.MOTWANI_LOGO },
  { name: "Indian Oil", logo: IMAGES.INDIAN_OIL_LOGO },
  { name: "DN Homes", logo: IMAGES.DN_Homes_LOGO },
  { name: "Evos", logo: IMAGES.EVOS_LOGO },
  { name: "Happy Hours", logo: IMAGES.HAPPY_HOURS_LOGO },
  { name: "Group G Golden", logo: IMAGES.GROUP_G_GOLDEN_LOGO },
  { name: "Gugnani", logo: IMAGES.GUGNANI_LOGO },
  { name: "K2K", logo: IMAGES.K2K_YAMAHA_LOGO },
];

const testimonials = [
  {
    id: 1,
    name: "Sumit Kumar Agrawal",
    rating: 5,
    comment:
      "Best for Outdoor Catering and services and also for small get together, function and party. Place is peaceful, clean and green. Food quality is awesome. They accept bulk party orders and deliver food as per your specific need.",
  },
  {
    id: 2,
    name: "Neha Pashine",
    rating: 5,
    comment:
      "Beautiful open space, near a river bed and in farms. Gives you a Punjab farm house feeling. There's a banquet and party hall plus lawn attached to the Dimple's Rasoi, that makes it a great spot for huge parties and gatherings. Food from Rasoi is authentic Punjabi food and a blend of Oriya like Chicken kosa and Manso Kosa etc. Must go place if you are looking for calmness and great food. Perfect combination!",
  },
  {
    id: 3,
    name: "Aditya B M",
    rating: 4.5,
    comment:
      "We heard about Dimple's Rasoi from our friends, when we were on a road trip to Odisha. The ambience is simply awesome, ideal for quiet lunch or dinner and great for private parties and small gatherings. Food is simply delicious, we tasted probably the best North Indian food there. The owner, Dimple is extremely courteous and takes great care to serve delicious food to the customers. You have got to book your table in advance here. though. Don't miss pineapple sizzler and dal Makhani!",
  },
  {
    id: 4,
    name: "Jaya Yadava",
    rating: 5,
    comment:
      "This was one of the most amazing food I have ever had in my life very fresh very homely and amazingly delicious. I had chola bhature, noodles and amazing chaat and everything excellent.The staff, chef, and aethetic was extraordinary l. My best experience in Odisha.",
  },
  {
    id: 5,
    name: "Pratyasha Maharana",
    rating: 5,
    comment:
      "I have happened to taste their food multiple times and honestly they are the best caterers in the town. They take their job very seriously and never failed in making an impression. It is not only their delicious food but all the other aspects such as great staff, service, presentation, ambience, hospitality, hygiene, etc. that make them stand out. I would definitely recommend this for those who are looking for a perfect place with great food to hang out and also who would love to have the best catering service for their big occasions.",
  },
];

const ClientsTestimonials = memo(() => {
  const [activeFeedback, setActiveFeedback] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const marqueeLogos = [...clients, ...clients, ...clients];

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveFeedback((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handleNext = () => {
    setActiveFeedback((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveFeedback(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  return (
    <section id="clients" className="clients-section">
      <div className="clients-container">
        <div className="clients-layout">
          <div className="clients-left">
            <div className="clients-header">
              <Title level={2} className="title-card">
                Loved by Our Amazing Clients
              </Title>

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

            <div
              className="clients-marquee-group"
              aria-label="Our corporate clients and reviews"
            >
              {/* HORIZONTAL LOGO MARQUEE */}
              <div className="clients-marquee logo-marquee">
                <div className="clients-marquee-track track-left">
                  {marqueeLogos.map((client, index) => (
                    <div
                      key={`client-${client.name}-${index}`}
                      className="clients-logo-card"
                    >
                      <img
                        src={client.logo}
                        alt={`${client.name} logo`}
                        className="clients-logo"
                        draggable={false}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* SINGLE TESTIMONIAL CARD */}
              <div
                className="single-testimonial-container"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div className="testimonial-stage">
                  {testimonials.map((item, index) => (
                    <div
                      key={`single-feedback-${item.id}`}
                      className={`single-testimonial-card ${
                        index === activeFeedback ? "active" : ""
                      }`}
                    >
                      <span className="quote-backdrop" aria-hidden="true">
                        “
                      </span>
                      <div className="testimonial-header">
                        <div className="author-details">
                          <Text className="testimonial-author">
                            {item.name}
                          </Text>
                        </div>
                        <Rate
                          disabled
                          allowHalf
                          defaultValue={item.rating}
                          className="testimonial-stars"
                        />
                      </div>
                      <Paragraph className="testimonial-comment">
                        "{item.comment}"
                      </Paragraph>
                    </div>
                  ))}
                </div>

                {/* SLIDER NAVIGATION CONTROLS (BUTTONS ONLY) */}
                <div className="testimonial-footer-controls">
                  <div className="nav-buttons">
                    <button
                      className="nav-btn"
                      onClick={handlePrev}
                      aria-label="Previous review"
                    >
                      <IconChevronLeft size={16} stroke={2} />
                    </button>
                    <button
                      className="nav-btn"
                      onClick={handleNext}
                      aria-label="Next review"
                    >
                      <IconChevronRight size={16} stroke={2} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: DELIVERY ILLUSTRATION */}
          <div className="delivery-section">
            <img
              src={IMAGES.DELIVERY_ILLUSTRATION}
              alt="Dimple's Rasoi delivery service"
              className="delivery-illustration"
              draggable={false}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  );
});

ClientsTestimonials.displayName = "ClientsTestimonials";

export default ClientsTestimonials;
