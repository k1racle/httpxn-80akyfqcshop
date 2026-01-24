import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Star, Loader2, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SellerReview {
  id: string;
  seller_id: string;
  reviewer_id: string;
  rating: number;
  comment: string | null;
  deal_completed: boolean;
  created_at: string;
}

interface SellerRatingProps {
  sellerId: string;
  submissionId?: string;
  orderId?: string;
  showAddReview?: boolean;
}

const StarRating = ({
  rating,
  onRatingChange,
  readonly = false,
  size = "md",
}: {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onRatingChange?.(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          className={`transition-colors ${readonly ? "cursor-default" : "cursor-pointer"}`}
        >
          <Star
            className={`${sizeClasses[size]} ${
              star <= (hoverRating || rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

const SellerRating = ({
  sellerId,
  submissionId,
  orderId,
  showAddReview = false,
}: SellerRatingProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<SellerReview[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [dealCompleted, setDealCompleted] = useState(true);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("seller_reviews")
        .select("*")
        .eq("seller_id", sellerId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const reviewsData = (data as unknown as SellerReview[]) || [];
      setReviews(reviewsData);

      if (reviewsData.length > 0) {
        const avg =
          reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewsData.length;
        setAverageRating(Math.round(avg * 10) / 10);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [sellerId]);

  const handleSubmitReview = async () => {
    if (!user || !newRating) {
      toast({
        title: "Ошибка",
        description: "Выберите оценку",
        variant: "destructive",
      });
      return;
    }

    if (user.id === sellerId) {
      toast({
        title: "Ошибка",
        description: "Нельзя оставить отзыв о себе",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.from("seller_reviews").insert({
        seller_id: sellerId,
        reviewer_id: user.id,
        submission_id: submissionId || null,
        order_id: orderId || null,
        rating: newRating,
        comment: newComment.trim() || null,
        deal_completed: dealCompleted,
      });

      if (error) throw error;

      toast({
        title: "Отзыв добавлен",
        description: "Спасибо за вашу оценку!",
      });

      setNewRating(0);
      setNewComment("");
      setIsDialogOpen(false);
      fetchReviews();
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description:
          error.message?.includes("duplicate")
            ? "Вы уже оставляли отзыв по этой заявке"
            : error.message || "Не удалось добавить отзыв",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const canReview = user && user.id !== sellerId;

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Загрузка...</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Average Rating Display */}
      <div className="flex items-center gap-2">
        <StarRating rating={Math.round(averageRating)} readonly size="sm" />
        <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
        <span className="text-sm text-muted-foreground">
          ({reviews.length} {reviews.length === 1 ? "отзыв" : "отзывов"})
        </span>
      </div>

      {/* Add Review Button */}
      {showAddReview && canReview && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-1" />
              Оставить отзыв
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Оставить отзыв о продавце</DialogTitle>
              <DialogDescription>
                Поделитесь своим опытом взаимодействия с продавцом
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Оценка *</Label>
                <StarRating
                  rating={newRating}
                  onRatingChange={setNewRating}
                  size="lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="review-comment">Комментарий</Label>
                <Textarea
                  id="review-comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Опишите ваш опыт..."
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="deal-completed"
                  checked={dealCompleted}
                  onChange={(e) => setDealCompleted(e.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                <Label htmlFor="deal-completed" className="text-sm font-normal">
                  Сделка состоялась
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={submitting}
              >
                Отмена
              </Button>
              <Button onClick={handleSubmitReview} disabled={submitting || !newRating}>
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : null}
                Отправить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="space-y-2 mt-4">
          <h4 className="text-sm font-medium">Последние отзывы</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {reviews.slice(0, 5).map((review) => (
              <div
                key={review.id}
                className="p-3 bg-muted/50 rounded-lg text-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <StarRating rating={review.rating} readonly size="sm" />
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString("ru-RU")}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-muted-foreground">{review.comment}</p>
                )}
                {!review.deal_completed && (
                  <span className="text-xs text-amber-600">
                    Сделка не состоялась
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export { SellerRating, StarRating };
export default SellerRating;
