import { motion } from "framer-motion";
import { Users, Wand2, Globe } from "lucide-react";

const steps = [
  {
    icon: Users,
    step: "Step 1",
    title: "Describe your audience + outcome",
    description: "For example: busy dads, beginners, runners, powerlifters, or people focused on fat loss.",
  },
  {
    icon: Wand2,
    step: "Step 2",
    title: "Excellion generates your course + sales page",
    description: "Get a ready-to-edit course with your outline, lesson structure, sales page copy, and student portal.",
  },
  {
    icon: Globe,
    step: "Step 3",
    title: "Customize, connect your domain, and publish",
    description: "Edit anything, connect your domain, and go live when you're ready.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">How Excellion Works</h2>
          <p className="text-muted-foreground text-lg">3 steps to launch your course this weekend</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card rounded-2xl p-8 text-center"
            >
              <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xs uppercase tracking-wider text-primary font-semibold">{item.step}</span>
              <h3 className="text-lg font-semibold text-foreground mt-2 mb-3">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
