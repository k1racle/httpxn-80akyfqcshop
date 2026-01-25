import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Info, Archive } from "lucide-react";
import { ListingStatusCode, LISTING_STATUSES } from "@/types/listingStatus";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  statusCode: ListingStatusCode;
  className?: string;
  showDescription?: boolean;
}

const StatusBadge = ({ statusCode, className, showDescription = false }: StatusBadgeProps) => {
  const status = LISTING_STATUSES[statusCode];

  const getIcon = () => {
    switch (statusCode) {
      case 'S2':
        return <CheckCircle className="h-3 w-3 mr-1" />;
      case 'S1':
        return <Clock className="h-3 w-3 mr-1" />;
      case 'S0':
        return <Info className="h-3 w-3 mr-1" />;
      case 'S3':
        return <Archive className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  const getVariantClasses = () => {
    switch (statusCode) {
      case 'S2':
        // Доступен — зеленый акцент
        return "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100";
      case 'S1':
        // На проверке — желтый/оранжевый
        return "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100";
      case 'S0':
        // Ознакомительный — нейтральный серый
        return "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100";
      case 'S3':
        // Архив — приглушенный
        return "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-100";
      default:
        return "";
    }
  };

  return (
    <div className={cn("inline-flex flex-col items-start gap-0.5", className)}>
      <Badge 
        variant="outline" 
        className={cn("border font-medium", getVariantClasses())}
      >
        {getIcon()}
        {status.labelShort}
      </Badge>
      {showDescription && (
        <span className="text-xs text-muted-foreground ml-1">
          {status.description}
        </span>
      )}
    </div>
  );
};

export default StatusBadge;
