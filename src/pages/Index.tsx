import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import HowItWorks from "@/components/home/HowItWorks";
import FeaturedListings from "@/components/home/FeaturedListings";
import WhyUs from "@/components/home/WhyUs";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <Categories />
      <FeaturedListings />
      <HowItWorks />
      <WhyUs />
      <CTASection />
    </Layout>
  );
};

export default Index;
