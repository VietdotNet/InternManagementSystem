import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { ClipboardList } from "lucide-react";

export function RequestReviewModal({ lesson, open, onClose, onSubmit, isPending }) {
  const [note, setNote] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ note, scheduledAt: scheduledAt || undefined });
    setNote("");
    setScheduledAt("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Request Review
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Lesson: <span className="font-medium text-foreground">{lesson?.title}</span>
            </p>
          </div>
          <div className="space-y-1">
            <Label htmlFor="scheduledAt">Preferred Review Date/Time</Label>
            <Input
              id="scheduledAt"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              data-testid="input-review-scheduled-at"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any note for the mentor..."
              rows={3}
              className="resize-none"
              data-testid="textarea-review-note"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} data-testid="button-submit-review-request">
              {isPending ? "Submitting..." : "Submit Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
