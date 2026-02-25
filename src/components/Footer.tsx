import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full border-2 border-primary flex items-center justify-center">
                <span className="text-primary font-bold text-xs">E</span>
              </div>
              <span className="text-foreground font-semibold">Excellion</span>
            </div>
            <p className="text-muted-foreground text-sm">AI Course Builder for Fitness Influencers</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/auth" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Create Course</Link></li>
              <li><Link to="/" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Browse Courses</Link></li>
              <li><a href="#pricing" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-muted-foreground text-sm hover:text-foreground transition-colors">About</Link></li>
              <li><Link to="/" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 text-center">
          <p className="text-muted-foreground text-xs">© {new Date().getFullYear()} Excellion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
