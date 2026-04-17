import { useRef } from "react";
import { useLocation, useParams, Navigate } from "react-router-dom";
import BuilderShell from "@/components/secret-builder/BuilderShell";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";

const FOUNDER_EMAIL = "excellionai@gmail.com";

const SecretBuilder = () => {
  const location = useLocation();
  const { projectId: paramProjectId } = useParams<{ projectId: string }>();
  const { user, ready, role } = useAuth();
  const { subscribed, loading: subLoading } = useSubscription();

  // Once the builder has rendered, never unmount it due to transient
  // loading flickers (e.g. auth token refresh, subscription re-check
  // on tab focus). Unmounting destroys the entire editor state.
  const hasRenderedRef = useRef(false);

  const stillLoading = !ready || (!!user && subLoading);
  if (!hasRenderedRef.current && stillLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  if (role === "student") return <Navigate to="/dashboard/student" replace />;
  if (!subscribed && user.email !== FOUNDER_EMAIL) {
    return <Navigate to="/paywall" replace />;
  }

  hasRenderedRef.current = true;

  // Extract navigation state passed from SecretBuilderHub
  const state = (location.state as {
    initialIdea?: string;
    projectId?: string;
    templateSpec?: any;
    courseMode?: string;
    courseId?: string;
    pdfBase64?: string;
    pdfName?: string;
  }) || {};

  const resolvedProjectId = paramProjectId || state.projectId || null;

  // PDF data: router state is primary, sessionStorage is fallback
  const pdfBase64 = state.pdfBase64 || sessionStorage.getItem("builder-pdf-base64") || undefined;
  const pdfName = state.pdfName || sessionStorage.getItem("builder-pdf-name") || undefined;
  // Clean up sessionStorage after reading (one-time use)
  if (pdfBase64) {
    sessionStorage.removeItem("builder-pdf-base64");
    sessionStorage.removeItem("builder-pdf-name");
  }

  return (
    <div className="min-h-screen">
      <BuilderShell
        key={resolvedProjectId || state.courseId || "new"}
        initialIdea={state.initialIdea}
        initialProjectId={resolvedProjectId}
        initialCourseId={state.courseId}
        templateSpec={state.templateSpec}
        courseMode={state.courseMode}
        initialPdfBase64={pdfBase64}
        initialPdfName={pdfName}
      />
    </div>
  );
};

export default SecretBuilder;
