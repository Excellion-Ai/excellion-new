import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PartyPopper, Copy, Check, ExternalLink } from "lucide-react";

interface CoursePublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseUrl: string;
  courseTitle: string;
}

const CoursePublishDialog = ({
  open,
  onOpenChange,
  courseUrl,
  courseTitle,
}: CoursePublishDialogProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(courseUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md text-center border-border sm:rounded-lg"
        style={{
          backgroundColor: '#09090b',
          color: '#fafafa',
          zIndex: 100,
        }}
      >
        <DialogDescription className="sr-only">
          Your course has been published successfully.
        </DialogDescription>
        <div className="flex flex-col items-center gap-4 py-4">
          <PartyPopper className="h-12 w-12 text-primary" />
          <DialogHeader>
            <DialogTitle className="text-2xl" style={{ color: '#fafafa' }}>
              Your course is live!
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm" style={{ color: '#a1a1aa' }}>{courseTitle}</p>

          <div className="w-full flex items-center gap-2 rounded-md px-3 py-2" style={{ border: '1px solid #27272a', backgroundColor: 'rgba(39,39,42,0.3)' }}>
            <span className="flex-1 text-sm truncate text-left" style={{ color: '#fafafa' }}>
              {courseUrl}
            </span>
            <Button size="icon" variant="ghost" className="shrink-0" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <div className="flex gap-3 w-full">
            <Button
              className="flex-1"
              onClick={() => window.open(courseUrl, "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-1" /> View Live Page
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoursePublishDialog;
