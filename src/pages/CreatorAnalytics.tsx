import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BarChart3, Users, DollarSign, Eye, TrendingUp, BookOpen, ArrowLeft } from "lucide-react";

interface CourseStats {
  id: string;
  title: string;
  total_students: number;
  views: number;
  revenue: number;
}

const CreatorAnalytics = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("courses")
        .select("id, title, total_students")
        .eq("user_id", user.id)
        .is("deleted_at", null);

      setCourses(
        (data || []).map((c) => ({
          id: c.id,
          title: c.title,
          total_students: c.total_students || 0,
          views: 0,
          revenue: 0,
        }))
      );
      setLoading(false);
    };
    load();
  }, [user]);

  const totalStudents = courses.reduce((s, c) => s + c.total_students, 0);
  const totalCourses = courses.length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-24 pb-16 px-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/secret-builder-hub")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Creator Analytics</h1>
            <p className="text-sm text-muted-foreground">Track your course performance and revenue.</p>
          </div>
        </div>
        <Separator className="mb-6" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Courses", value: totalCourses, icon: BookOpen, color: "text-primary" },
            { label: "Total Students", value: totalStudents, icon: Users, color: "text-emerald-500" },
            { label: "Total Views", value: 0, icon: Eye, color: "text-blue-500" },
            { label: "Revenue", value: "$0.00", icon: DollarSign, color: "text-amber-500" },
          ].map((stat) => (
            <Card key={stat.label} className="border-border bg-card">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Course Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <TrendingUp className="h-8 w-8 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">No courses yet. Create your first course to see analytics.</p>
                <Button variant="outline" size="sm" onClick={() => navigate("/secret-builder-hub")}>
                  Go to Course Studio
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => navigate(`/dashboard/analytics/${course.id}`)}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/30 cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium">{course.title}</p>
                      <p className="text-xs text-muted-foreground">{course.total_students} students</p>
                    </div>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default CreatorAnalytics;
