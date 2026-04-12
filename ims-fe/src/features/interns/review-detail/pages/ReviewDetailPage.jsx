import { useParams, useLocation } from "wouter";
import { ReviewDetailModal } from "../components/ReviewDetailModal";

export function ReviewDetailPage() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const reviewId = params.id ? parseInt(params.id) : null;

  return (
    <ReviewDetailModal
      reviewId={reviewId}
      open={true}
      onClose={() => setLocation("/reviews")}
    />
  );
}
