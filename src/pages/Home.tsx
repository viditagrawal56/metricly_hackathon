import Features from "../components/Features/Features";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import Partner from "../components/Partner/Partner";
import Pricing from "../components/Pricing/Pricing";
import Team from "../components/Team/Team";

const Home = () => {
  return (
    <>
      <Header />
      <Partner />
      <Features />
      <Pricing />
      <Team />
      <Footer />
    </>
  );
};

export default Home;
