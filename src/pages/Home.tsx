import Features from "../components/Features/Features";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import Partner from "../components/Partner/Partner";
import Pricing from "../components/Pricing/Pricing";
import Team from "../components/Team/Team";
import Testimonials from "../components/Testimonials/Testimonials";

const Home = () => {
  return (
    <>
      <Header />
      <Partner />
      <Features />
      <Pricing />
      <Testimonials />
      <Team />
      <Footer />
    </>
  );
};

export default Home;
