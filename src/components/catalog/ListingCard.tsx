import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Eye, Heart, ShoppingCart, Info } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";

interface ListingCardProps {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  registrationNumber: string;
  price: number;
  priceFormatted: string;
  status: "verified" | "pending" | "demo";
  views: number;
  description: string;
  isDemo?: boolean;
  demoLabel?: string;
}

const ListingCard = ({
  id,
  title,
  categoryLabel,
  registrationNumber,
  priceFormatted,
  status,
  views,
  description,
  isDemo = false,
  demoLabel,
}: ListingCardProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCart, toggleCart } = useCart();

  const isFav = isFavorite(id);
  const inCart = isInCart(id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDemo) return; // Disable for demo items
    toggleFavorite(id);
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDemo) return; // Disable for demo items
    toggleCart(id);
  };

  return (
    <div className={cn(
      "group card-elevated p-6 flex flex-col relative",
      isDemo && "opacity-75"
    )}>
      {/* Action buttons - hidden for demo */}
      {!isDemo && (
        <div className="absolute top-4 right-4 flex gap-1 z-10">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background",
              isFav && "text-red-500 hover:text-red-600"
            )}
            onClick={handleFavoriteClick}
          >
            <Heart className={cn("h-4 w-4", isFav && "fill-current")} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background",
              inCart && "text-primary"
            )}
            onClick={handleCartClick}
          >
            <ShoppingCart className={cn("h-4 w-4", inCart && "fill-current")} />
          </Button>
        </div>
      )}

      <Link to={`/catalog/${id}`} className="flex flex-col flex-1">
        <div className="flex items-start justify-between mb-4 pr-16">
          <Badge variant="secondary" className="badge-category">
            {categoryLabel}
          </Badge>
          {isDemo ? (
            <Badge className="bg-muted text-muted-foreground border-0 text-xs">
              <Info className="h-3 w-3 mr-1" />
              Ознакомительный
            </Badge>
          ) : status === "verified" ? (
            <Badge className="badge-verified">
              <CheckCircle className="h-3 w-3 mr-1" />
              Проверен
            </Badge>
          ) : (
            <Badge className="badge-pending">На проверке</Badge>
          )}
        </div>

        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
          {description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Рег. номер</p>
            <p className="text-sm font-medium">{registrationNumber}</p>
          </div>
          <div className="text-right">
            {isDemo ? (
              <>
                <p className="text-xs text-muted-foreground mb-1">Статус</p>
                <p className="text-sm font-medium text-muted-foreground">Пример карточки</p>
              </>
            ) : (
              <>
                <p className="text-xs text-muted-foreground mb-1">Цена</p>
                <p className="text-lg font-bold text-primary">{priceFormatted}</p>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 mt-4 text-xs text-muted-foreground">
          <Eye className="h-3 w-3" />
          {views} просмотров
        </div>
        
        {isDemo && demoLabel && (
          <div className="mt-3 p-2 rounded bg-muted/50 text-xs text-muted-foreground text-center">
            {demoLabel}
          </div>
        )}
      </Link>
    </div>
  );
};

export default ListingCard;
