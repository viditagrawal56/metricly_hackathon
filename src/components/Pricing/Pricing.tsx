import { motion } from "framer-motion";
import "./Pricing.css";

const Pricing = () => {
  const plans = [
    {
      name: "Basic",
      price: "Free",
      features: [
        "Basic Analytics Dashboard",
        "5 Projects",
        "2 Team Members",
        "Basic Support",
        "1GB Storage"
      ],
      popular: false
    },
    {
      name: "Standard",
      price: "$19",
      features: [
        "Advanced Analytics",
        "15 Projects",
        "10 Team Members",
        "Priority Support",
        "10GB Storage"
      ],
      popular: true
    },
    {
      name: "Advanced",
      price: "$49",
      features: [
        "Custom Analytics",
        "Unlimited Projects",
        "Unlimited Team Members",
        "24/7 Support",
        "100GB Storage"
      ],
      popular: false
    }
  ];

  return (
    <div className="pricing" id="pricing">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="pricing-title"
      >
        <h1>Choose Your Perfect Plan</h1>
        <p>Select the best plan that fits your needs</p>
      </motion.div>
      
      <div className="pricing-cards">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className={`pricing-card ${plan.popular ? 'popular' : ''}`}
          >
            {plan.popular && <div className="popular-badge">Most Popular</div>}
            <h2>{plan.name}</h2>
            <div className="price">
              <span className="amount">{plan.price}</span>
              {plan.price !== "Free" && <span className="period">/month</span>}
            </div>
            <ul>
              {plan.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
            <button className="select-plan">Get Started</button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;