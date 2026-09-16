import { useState, useEffect, lazy, Suspense } from "react";
import axios from "axios";
import { Navbar, HeroSection, Launcher } from "./components";
import { API_PATH } from "./utils/apipath";
import "./index.css";

// Lazy load below-the-fold sections for performance optimization
const AboutSection = lazy(() => import("./components/AboutSection/AboutSection"));
const OurJourney = lazy(() => import("./components/OurJourney/OurJourney"));
const FoundersSection = lazy(() => import("./components/FoundersSection/FoundersSection"));
const SignatureDishes = lazy(() => import("./components/SignatureDishes/SignatureDishes"));
const OurServices = lazy(() => import("./components/OurServices/OurServices"));
const ClientsTestimonials = lazy(
  () => import("./components/ClientsTestimonials/ClientsTestimonials")
);
const ContactSection = lazy(() => import("./components/ContactSection/ContactSection"));
const Footer = lazy(() => import("./components/Footer/Footer"));

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get(API_PATH.HEALTH_CHECK).catch(console.error);

    const minLoadTime = new Promise((resolve) => setTimeout(resolve, 10000));
    const windowLoad = new Promise((resolve) => {
      if (document.readyState === "complete") {
        resolve(true);
      } else {
        const handleLoad = () => resolve(true);
        window.addEventListener("load", handleLoad, { once: true });
      }
    });

    Promise.all([minLoadTime, windowLoad]).then(() => {
      setTimeout(() => setIsLoading(false), 800);
    });
  }, []);

  return (
    <>
      {isLoading && <Launcher sequenceSeconds={10} />}
      <Navbar />
      <main>
        <HeroSection />
        <Suspense fallback={null}>
          <AboutSection />
          <OurJourney />
          <FoundersSection />
          <SignatureDishes />
          <OurServices />
          <ClientsTestimonials />
          <ContactSection />
          <Footer />
        </Suspense>
      </main>
    </>
  );
}

export default App;
