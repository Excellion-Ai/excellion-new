import { motion } from "framer-motion";
import { Play, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const QuickstartSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Excellion Quickstart Course (Preview)</h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            One voice call creates your prompt. One click generates a complete draft — course, scripts, downloads, and sales page. Then refine any section with a typed command.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {[
              "Generate a full draft from a single AI prompt",
              "Refine any section by typing a command",
              "Publish and share a live link on your schedule",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-foreground text-sm">{item}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="text-sm font-semibold text-primary mb-4">Course Outline</h3>
            <ul className="space-y-3">
              {[
                "Module 1: Prompt Call (Start Here)",
                "Module 2: Generate + Review Your Draft",
                "Module 3: Regenerate Anything",
                "Module 4: Publish + Go Live",
              ].map((mod, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Play className="w-4 h-4 text-primary shrink-0" />
                  {mod}
                </li>
              ))}
            </ul>

            <Link
              to="/auth"
              className="mt-6 w-full px-6 py-3 rounded-lg gradient-gold text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              Access the Quickstart Course
            </Link>

            <p className="text-xs text-muted-foreground text-center mt-3">Most coaches finish setup in 1 weekend.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default QuickstartSection;
