import { useState, useCallback, useEffect } from 'react';
import {
  getReviewRequestsByProgram,
  updateReviewRequest,
  addMessage,
  addLesson,
  updateLesson,
  deleteLesson,
} from '../../../../shared/store/mockData.js';

import { getDetailProgram } from "../services/programService";

export function useProgramDetail(id) {

  const [reviews, setReviews] = useState(() => getReviewRequestsByProgram(id));
  const [, forceUpdate] = useState(0);

  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(false);

    useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        setLoading(true);
        const data = await getDetailProgram(id);
        setProgram(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const refreshReviews = useCallback(() => {
    setReviews(getReviewRequestsByProgram(id));
  }, [id]);

  const handleUpdateReview = useCallback((reviewId, updates) => {
    updateReviewRequest(reviewId, updates);
    refreshReviews();
  }, [refreshReviews]);

  const handleAddMessage = useCallback((reviewId, text, senderRole, senderName, senderId) => {
    addMessage(reviewId, text, senderRole, senderName, senderId);
    refreshReviews();
  }, [refreshReviews]);

  const handleAddLesson = useCallback((trackId, name, order) => {
    addLesson(trackId, id, name, order);
    forceUpdate((n) => n + 1);
  }, [id]);

  const handleUpdateLesson = useCallback((trackId, lessonId, name, order) => {
    updateLesson(trackId, id, lessonId, name, order);
    forceUpdate((n) => n + 1);
  }, [id]);

  const handleDeleteLesson = useCallback((trackId, lessonId) => {
    deleteLesson(trackId, id, lessonId);
    forceUpdate((n) => n + 1);
  }, [id]);

  return {
    program,
    loading, 
    reviews,
    refreshReviews,
    handleUpdateReview,
    handleAddMessage,
    handleAddLesson,
    handleUpdateLesson,
    handleDeleteLesson,
  };
}
