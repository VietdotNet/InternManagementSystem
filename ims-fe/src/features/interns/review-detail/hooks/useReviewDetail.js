import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useReviewDetailQuery, useMessagesQuery, useSendMessageMutation, getListMessagesQueryKey, getGetReviewQueryKey } from 
"../services/reviewDetailService";
import { useToast } from "@/shared/utils/useToast";

export function useReviewDetail(reviewId, open) {
  const [replyText, setReplyText] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const chatEndRef = useRef(null);

  const { data: review, isLoading: reviewLoading } = useReviewDetailQuery(reviewId, open);
  const { data: messages, isLoading: messagesLoading } = useMessagesQuery(reviewId, open);
  const sendMessage = useSendMessageMutation();

  useEffect(() => {
    if (!reviewId || !open) return;
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey(reviewId) });
    }, 3000);
    return () => clearInterval(interval);
  }, [reviewId, open, queryClient]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendReply = () => {
    if (!replyText.trim() || !reviewId) return;

    sendMessage.mutate(
      { id: reviewId, data: { content: replyText.trim(), sender: "intern" } },
      {
        onSuccess: () => {
          setReplyText("");
          queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey(reviewId) });
          queryClient.invalidateQueries({ queryKey: getGetReviewQueryKey(reviewId) });
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to send message.", variant: "destructive" });
        },
      }
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  return {
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
  };
}
