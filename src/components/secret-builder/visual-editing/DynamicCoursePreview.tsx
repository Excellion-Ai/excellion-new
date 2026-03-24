import { useMemo } from "react";
import { ExtendedCourse } from "@/types/course-pages";
import CourseLandingPreview from "@/components/secret-builder/CourseLandingPreview";

interface DynamicCoursePreviewProps {
  course: ExtendedCourse;
  onUpdate?: (course: ExtendedCourse) => void;
  onEnrollClick?: () => void;
}

/**
 * Convert a hex color string to "H S% L%" format for Tailwind CSS variables.
 */
function hexToHSL(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "0 0% 50%";

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

/**
 * Derive a lighter variant of an HSL string by boosting lightness.
 */
function lightenHSL(hsl: string, amount: number): string {
  const parts = hsl.match(/([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/);
  if (!parts) return hsl;
  const h = parseFloat(parts[1]);
  const s = parseFloat(parts[2]);
  const l = Math.min(100, parseFloat(parts[3]) + amount);
  return `${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%`;
}

/**
 * Derive a darker variant of an HSL string by reducing lightness.
 */
function darkenHSL(hsl: string, amount: number): string {
  const parts = hsl.match(/([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/);
  if (!parts) return hsl;
  const h = parseFloat(parts[1]);
  const s = parseFloat(parts[2]);
  const l = Math.max(0, parseFloat(parts[3]) - amount);
  return `${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%`;
}

/**
 * Wraps CourseLandingPreview with live CSS custom property injection
 * from the course's design_config. Overrides Tailwind's theme variables
 * so the entire component tree reflects the custom design.
 */
const DynamicCoursePreview = ({
  course,
  onUpdate,
  onEnrollClick,
}: DynamicCoursePreviewProps) => {
  const cssVars = useMemo(() => {
    const dc = course.design_config;
    if (!dc?.colors) return {};

    const vars: Record<string, string> = {};
    const colors = dc.colors;

    // Convert hex colors to HSL and override Tailwind theme variables
    if (colors.primary) {
      const primaryHSL = hexToHSL(colors.primary);
      vars["--primary"] = primaryHSL;
      vars["--accent"] = primaryHSL;
      vars["--ring"] = primaryHSL;
      // Gold variants for gradient-gold, text-gradient-gold, shadow-glow
      vars["--gold"] = primaryHSL;
      vars["--gold-light"] = lightenHSL(primaryHSL, 12);
      vars["--gold-dark"] = darkenHSL(primaryHSL, 12);
      // Glow shadows using the primary color
      vars["--shadow-glow"] = `0 0 60px hsl(${primaryHSL} / 0.12)`;
      vars["--shadow-glow-sm"] = `0 0 20px hsl(${primaryHSL} / 0.08)`;
      vars["--shadow-glow-lg"] = `0 0 100px hsl(${primaryHSL} / 0.1)`;
    }

    if (colors.background) {
      const bgHSL = hexToHSL(colors.background);
      vars["--background"] = bgHSL;
    }

    if (colors.cardBackground) {
      const cardHSL = hexToHSL(colors.cardBackground);
      vars["--card"] = cardHSL;
      vars["--card-foreground"] = colors.text ? hexToHSL(colors.text) : "0 0% 95%";
      vars["--card-elevated"] = lightenHSL(cardHSL, 3);
    }

    if (colors.text) {
      const textHSL = hexToHSL(colors.text);
      vars["--foreground"] = textHSL;
      vars["--primary-foreground"] = hexToHSL(colors.background || "#0a0a0a");
      vars["--accent-foreground"] = hexToHSL(colors.background || "#0a0a0a");
    }

    if (colors.textMuted) {
      vars["--muted-foreground"] = hexToHSL(colors.textMuted);
    }

    if (colors.secondary) {
      const secHSL = hexToHSL(colors.secondary);
      vars["--secondary"] = secHSL;
      vars["--muted"] = secHSL;
    }

    // Border color — slightly lighter than card background
    if (colors.cardBackground) {
      vars["--border"] = lightenHSL(hexToHSL(colors.cardBackground), 8);
      vars["--input"] = lightenHSL(hexToHSL(colors.cardBackground), 5);
    }

    // Spacing
    const spacingMap: Record<string, string> = { compact: "0.75rem", normal: "1rem", spacious: "1.5rem" };
    if (dc.spacing) vars["--course-spacing"] = spacingMap[dc.spacing] || "1rem";

    // Border radius
    const radiusMap: Record<string, string> = { none: "0", small: "0.25rem", medium: "0.5rem", large: "1rem" };
    if (dc.borderRadius) {
      vars["--course-radius"] = radiusMap[dc.borderRadius] || "0.5rem";
      vars["--radius"] = radiusMap[dc.borderRadius] || "0.75rem";
    }

    return vars;
  }, [course.design_config]);

  // Load Google Fonts dynamically
  useMemo(() => {
    const fonts = course.design_config?.fonts;
    if (!fonts) return;

    const families = [fonts.heading, fonts.body].filter(Boolean);
    if (families.length === 0) return;

    const id = "dynamic-course-fonts";
    let link = document.getElementById(id) as HTMLLinkElement | null;
    const href = `https://fonts.googleapis.com/css2?${families
      .map((f) => `family=${encodeURIComponent(f!)}:wght@400;500;600;700;800;900`)
      .join("&")}&display=swap`;

    if (!link) {
      link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    link.href = href;
  }, [course.design_config?.fonts]);

  // Build font CSS variables
  const fontVars: Record<string, string> = {};
  if (course.design_config?.fonts?.heading) {
    fontVars["--font-heading"] = `'${course.design_config.fonts.heading}', serif`;
  }
  if (course.design_config?.fonts?.body) {
    fontVars["--font-body"] = `'${course.design_config.fonts.body}', sans-serif`;
  }

  return (
    <div
      style={{ ...cssVars, ...fontVars } as React.CSSProperties}
      className="min-h-full"
    >
      <CourseLandingPreview
        course={course}
        onUpdate={onUpdate}
        onEnrollClick={onEnrollClick}
      />
    </div>
  );
};

export default DynamicCoursePreview;
