import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { ClipboardList, Send } from "lucide-react";
import  StatusBadge  from "@/shared/components/StatusBadge";
import { ChatMessage } from "./ChatMessage";
import { useReviewDetail } from "../hooks/useReviewDetail";

export function ReviewDetailModal({ reviewId, open, onClose }) {
  const {
    review,
    messages,
    reviewLoading,
    messagesLoading,
    replyText,
    setReplyText,
    sendMessage,
    chatEndRef,
    handleSendReply,
    handleKeyDown,
  } = useReviewDetail(reviewId, open);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Review Detail
          </DialogTitle>
        </DialogHeader>

        {reviewLoading ? (
          <div className="py-8 text-center text-muted-foreground">Loading...</div>
        ) : review ? (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            <div className="border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
                <span className="font-semibold text-sm">Review Detail</span>
                <StatusBadge status={review.status} />
              </div>
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-semibold">Intern: </span>
                    <span data-testid="text-review-intern">{review.internName}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Lesson: </span>
                    <span data-testid="text-review-lesson">{review.lessonTitle}</span>
                  </div>
                </div>
                {review.note && (
                  <div>
                    <div className="font-semibold">Lời nhắn:</div>
                    <p className="text-muted-foreground mt-1 text-sm" data-testid="text-review-note">
                      {review.note}
                    </p>
                  </div>
                )}
                {review.score != null && (
                  <div>
                    <span className="font-semibold">Score: </span>
                    <span className="text-primary font-bold" data-testid="text-review-score">
                      {review.score}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="px-4 py-2 bg-gray-50 border-b">
                <span className="text-sm font-semibold text-muted-foreground">Chat with Mentor</span>
              </div>
              <div
                className="p-4 space-y-3 max-h-64 overflow-y-auto"
                data-testid="chat-messages"
              >
                {messagesLoading ? (
                  <div className="text-center text-muted-foreground text-sm">Loading messages...</div>
                ) : messages?.length === 0 ? (
                  <div className="text-center text-muted-foreground text-sm py-4">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages?.map((msg) => <ChatMessage key={msg.id} message={msg} />)
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="px-4 pb-4 space-y-2 border-t pt-3">
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Write a message to your mentor..."
                  rows={3}
                  className="resize-none"
                  data-testid="textarea-chat-reply"
                />
                <Button
                  onClick={handleSendReply}
                  disabled={!replyText.trim() || sendMessage.isPending}
                  className="flex items-center gap-2"
                  data-testid="button-send-reply"
                >
                  <Send className="h-4 w-4" />
                  {sendMessage.isPending ? "Sending..." : "Send Reply"}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">Review not found.</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
