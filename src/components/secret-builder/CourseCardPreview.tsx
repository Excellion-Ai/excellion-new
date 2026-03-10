import { BookOpen, Play, Clock, BarChart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CourseCardPreviewProps {
  title: string;
  modules: Array<{
    title: string;
    lessons: Array<{ title: string; type: string }>;
  }>;
  difficulty?: string | null;
  durationWeeks?: number | null;
}

const CourseCardPreview = ({
  title,
  modules,
  difficulty,
  durationWeeks,
}: CourseCardPreviewProps) => {
  const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0);

  return (
    <Card className="border-border/40 bg-gradient-to-br from-muted/60 to-muted/30 overflow-hidden">
      <CardContent className="p-3 space-y-2.5">
        <h3 className="text-sm font-semibold text-foreground truncate">{title}</h3>

        <ul className="space-y-1">
          {modules.slice(0, 3).map((mod, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <span className="shrink-0 mt-0.5">•</span>
              <span className="truncate">{mod.title}</span>
              <span className="ml-auto shrink-0 text-muted-foreground/60">
                {mod.lessons.length}L
              </span>
            </li>
          ))}
          {modules.length > 3 && (
            <li className="text-xs text-muted-foreground/50 pl-3">
              +{modules.length - 3} more
            </li>
          )}
        </ul>

        <div className="flex items-center gap-3 pt-1 border-t border-border/30 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" /> {modules.length}
          </span>
          <span className="flex items-center gap-1">
            <Play className="h-3 w-3" /> {totalLessons}
          </span>
          {durationWeeks && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {durationWeeks}w
            </span>
          )}
          {difficulty && (
            <Badge variant="outline" className="ml-auto text-[10px] px-1.5 py-0">
              {difficulty}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCardPreview;
