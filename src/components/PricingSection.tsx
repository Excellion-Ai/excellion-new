import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  "Up to 3 active courses",
  "Unlimited page views",
  "Custom domain",
  "Intake & check-ins",
  "Student portal",
  "Built-in analytics",
];

const PricingSection = () => {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="py-24 bg-card">
      <div className="max-w-lg mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Pricing</h2>
          <p className="text-muted-foreground text-lg">One plan for fitness course creators.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Toggle */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <button
              onClick={() => setYearly(false)}
              className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${!yearly ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${yearly ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              Yearly
            </button>
            {yearly && <span className="text-xs text-primary font-medium">Save $158</span>}
          </div>

          {/* Card */}
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="mb-6">
              <span className="text-4xl font-bold text-foreground">$19</span>
              <span className="text-muted-foreground text-sm ml-2">first month</span>
            </div>
            <p className="text-muted-foreground text-sm mb-8">
              then {yearly ? "$790/year" : "$79/month"} · {yearly && "save $158 · "}Everything included. Cancel anytime.
            </p>

            <ul className="space-y-3 mb-8 text-left">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              to="/auth"
              className="w-full px-6 py-3 rounded-lg gradient-gold text-primary-foreground font-medium text-sm flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              Start for $19
            </Link>

            <p className="text-xs text-muted-foreground mt-4">No hidden fees. Just build and sell your course.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
