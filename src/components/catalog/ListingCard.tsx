import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Heart, ShoppingCart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import { ListingStatusCode, mapDbStatusToCode, LISTING_STATUSES } from "@/types/listingStatus";

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
  dbStatus?: string; // Реальный статус из БД
}

const ListingCard = ({
  id,
  title,
  categoryLabel,
  registrationNumber,
  priceFormatted,
  views,
  description,
  isDemo = false,
  dbStatus = "active",
}: ListingCardProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCart, toggleCart } = useCart();

  const isFav = isFavorite(id);
  const inCart = isInCart(id);

  // Определяем статус по жизненному циклу
  const statusCode: ListingStatusCode = mapDbStatusToCode(dbStatus, isDemo);
  const listingStatus = LISTING_STATUSES[statusCode];
  
  // Для S0 (Ознакомительный) — нельзя совершать действия
  const actionsDisabled = !listingStatus.canTransact;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDemo) return;
    toggleFavorite(id);
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDemo) return;
    toggleCart(id);
  };

  return (
    <div className="group card-elevated p-6 flex flex-col relative">
      {/* Action buttons */}
      <div className="absolute top-4 right-4 flex gap-1 z-10">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background",
            isFav && "text-red-500 hover:text-red-600",
            isDemo && "opacity-50 cursor-not-allowed"
          )}
          onClick={handleFavoriteClick}
          disabled={isDemo}
        >
          <Heart className={cn("h-4 w-4", isFav && "fill-current")} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background",
            inCart && "text-primary",
            isDemo && "opacity-50 cursor-not-allowed"
          )}
          onClick={handleCartClick}
          disabled={isDemo}
        >
          <ShoppingCart className={cn("h-4 w-4", inCart && "fill-current")} />
        </Button>
      </div>

      <Link to={`/catalog/${id}`} className="flex flex-col flex-1">
        <div className="flex items-start gap-2 mb-4 pr-16">
          <Badge variant="secondary" className="badge-category">
            {categoryLabel}
          </Badge>
          <StatusBadge statusCode={statusCode} />
        </div>

        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
          {description}
        </p>

        {/* Для S0 показываем предупреждение вместо цены */}
        {statusCode === 'S0' && (
          <p className="text-xs text-muted-foreground mb-2 italic">
            Не участвует в сделках
          </p>
        )}

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
          {/* Цена показывается только для S1, S2 */}
          {listingStatus.showPrice ? (
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">Цена</p>
              <p className="text-lg font-bold text-primary">{priceFormatted}</p>
            </div>
          ) : (
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">Статус</p>
              <p className="text-sm font-medium text-muted-foreground">Демо</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 mt-4 text-xs text-muted-foreground">
          <Eye className="h-3 w-3" />
          {views} просмотров
        </div>
      </Link>
    </div>
  );
};

export default ListingCard;
