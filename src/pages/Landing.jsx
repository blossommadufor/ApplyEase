import LandingHero from "../components/LandingHero";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import LiveEvaluation from "../components/LiveEvaluation";
import TopInstitutions from "../components/TopInstitutions";
import Testimonials from "../components/Testimonials";
import PartnerWithUs from "../components/PartnerWithUs";
import CallToAction from "../components/CallToAction";
import FAQ from "../components/FAQ";

export default function Landing() {
  return (
    <div>
      <LandingHero />
      <HowItWorks />
      <Features />
      <LiveEvaluation />
      <TopInstitutions />
      <Testimonials />
      <PartnerWithUs />
      <CallToAction />
      <FAQ />
    </div>
  );
}
